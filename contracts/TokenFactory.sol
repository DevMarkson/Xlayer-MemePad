// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MemeToken.sol";
import "./BondingCurve.sol";
import "./LiquidityManager.sol";

/**
 * @title TokenFactory
 * @dev Factory contract for creating new meme tokens with bonding curve mechanics
 */
contract TokenFactory is Ownable {
    
    // Token creation fee in OKB (0.1 OKB)
    uint256 public constant TOKEN_CREATION_FEE = 0.1 ether;
    
    // Fee distribution percentages (basis points: 10000 = 100%)
    uint256 public constant PLATFORM_FEE_PERCENT = 4000; // 40%
    uint256 public constant CREATOR_FEE_PERCENT = 4000;  // 40%
    uint256 public constant REFERRER_FEE_PERCENT = 2000; // 20%
    
    // OKB threshold for liquidity provision (80 OKB)
    uint256 public constant LIQUIDITY_THRESHOLD = 80 ether;
    
    // Permanently locked liquidity (36 OKB)
    uint256 public constant LOCKED_LIQUIDITY = 36 ether;
    
    // State variables
    uint256 public totalTokensCreated;
    uint256 public totalFeesCollected;
    uint256 public pendingLiquidity;
    
    // Mapping from token address to token info
    mapping(address => TokenInfo) public tokens;
    
    // Array of all created tokens
    address[] public allTokens;
    
    // Fee collection addresses
    address public platformTreasury;
    address public liquidityManager;
    
    // LiquidityManager contract instance
    LiquidityManager public liquidityManagerContract;
    
    // Structs
    struct TokenInfo {
        string name;
        string symbol;
        address creator;
        address bondingCurve;
        uint256 creationTime;
        uint256 totalSupply;
        bool isActive;
    }
    
    // Events
    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        address indexed creator,
        address bondingCurve,
        uint256 creationTime
    );
    
    event FeesCollected(
        address indexed token,
        uint256 platformFee,
        uint256 creatorFee,
        uint256 referrerFee,
        address indexed referrer
    );
    
    event LiquidityThresholdReached(uint256 totalAmount);
    
    constructor(address initialOwner) Ownable(initialOwner) {
        platformTreasury = initialOwner;
        liquidityManager = initialOwner;
    }
    
    /**
     * @dev Set LiquidityManager contract
     * @param managerAddress LiquidityManager contract address
     */
    function setLiquidityManagerContract(address managerAddress) external onlyOwner {
        require(managerAddress != address(0), "Invalid manager address");
        liquidityManagerContract = LiquidityManager(managerAddress);
        liquidityManager = managerAddress;
    }
    
    /**
     * @dev Create a new meme token
     * @param name Token name
     * @param symbol Token symbol
     * @param referrer Referrer address for fee distribution (can be zero)
     */
    function createToken(
        string memory name,
        string memory symbol,
        address referrer
    ) external payable {
        require(msg.value >= TOKEN_CREATION_FEE, "Insufficient creation fee");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        
        // Create the token
        MemeToken newToken = new MemeToken(name, symbol, msg.sender);
        
        // Create bonding curve for this token
        BondingCurve bondingCurve = new BondingCurve(address(this));
        
        // Store token info
        TokenInfo memory tokenInfo = TokenInfo({
            name: name,
            symbol: symbol,
            creator: msg.sender,
            bondingCurve: address(bondingCurve),
            creationTime: block.timestamp,
            totalSupply: newToken.totalSupply(),
            isActive: true
        });
        
        tokens[address(newToken)] = tokenInfo;
        allTokens.push(address(newToken));
        totalTokensCreated = totalTokensCreated + 1;
        
        // Collect and distribute fees
        _collectAndDistributeFees(address(newToken), msg.value, referrer);
        
        emit TokenCreated(
            address(newToken),
            name,
            symbol,
            msg.sender,
            address(bondingCurve),
            block.timestamp
        );
    }
    
    /**
     * @dev Buy tokens through bonding curve
     * @param tokenAddress Address of the token to buy
     * @param amount Amount of tokens to buy
     */
    function buyTokens(address tokenAddress, uint256 amount) external payable {
        require(tokens[tokenAddress].isActive, "Token not active");
        
        BondingCurve bondingCurve = BondingCurve(tokens[tokenAddress].bondingCurve);
        uint256 cost = bondingCurve.getBuyPrice(amount);
        
        require(msg.value >= cost, "Insufficient payment");
        
        // Execute the purchase through bonding curve
        uint256 actualCost = bondingCurve.buyTokens(msg.sender, amount);
        
        // Transfer tokens to buyer
        MemeToken(tokenAddress).transfer(msg.sender, amount);
        
        // Refund excess payment
        if (msg.value > actualCost) {
            payable(msg.sender).transfer(msg.value - actualCost);
        }
        
        // Add to pending liquidity
        pendingLiquidity = pendingLiquidity + actualCost;
        
        // Check if liquidity threshold is reached
        if (pendingLiquidity >= LIQUIDITY_THRESHOLD) {
            _triggerLiquidityProvision();
        }
    }
    
    /**
     * @dev Sell tokens through bonding curve
     * @param tokenAddress Address of the token to sell
     * @param amount Amount of tokens to sell
     */
    function sellTokens(address tokenAddress, uint256 amount) external {
        require(tokens[tokenAddress].isActive, "Token not active");
        require(MemeToken(tokenAddress).balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Transfer tokens from seller
        MemeToken(tokenAddress).transferFrom(msg.sender, address(this), amount);
        
        BondingCurve bondingCurve = BondingCurve(tokens[tokenAddress].bondingCurve);
        uint256 received = bondingCurve.sellTokens(msg.sender, amount);
        
        // Transfer OKB to seller
        payable(msg.sender).transfer(received);
    }
    
    /**
     * @dev Get all created tokens
     * @return Array of token addresses
     */
    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
    
    /**
     * @dev Get token info
     * @param tokenAddress Address of the token
     * @return Token information
     */
    function getTokenInfo(address tokenAddress) external view returns (TokenInfo memory) {
        return tokens[tokenAddress];
    }
    
    /**
     * @dev Update platform treasury address
     * @param newTreasury New treasury address
     */
    function setPlatformTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        platformTreasury = newTreasury;
    }
    
    /**
     * @dev Update liquidity manager address
     * @param newManager New liquidity manager address
     */
    function setLiquidityManager(address newManager) external onlyOwner {
        require(newManager != address(0), "Invalid manager address");
        liquidityManager = newManager;
    }
    
    /**
     * @dev Internal function to collect and distribute fees
     */
    function _collectAndDistributeFees(
        address token,
        uint256 totalFee,
        address referrer
    ) internal {
        totalFeesCollected = totalFeesCollected + totalFee;
        
        uint256 platformFee = (totalFee * PLATFORM_FEE_PERCENT) / 10000;
        uint256 creatorFee = (totalFee * CREATOR_FEE_PERCENT) / 10000;
        uint256 referrerFee = (totalFee * REFERRER_FEE_PERCENT) / 10000;
        
        // Transfer platform fee
        payable(platformTreasury).transfer(platformFee);
        
        // Transfer creator fee
        payable(tokens[token].creator).transfer(creatorFee);
        
        // Transfer referrer fee if exists
        if (referrer != address(0)) {
            payable(referrer).transfer(referrerFee);
        } else {
            // If no referrer, add to platform treasury
            payable(platformTreasury).transfer(referrerFee);
        }
        
        emit FeesCollected(token, platformFee, creatorFee, referrerFee, referrer);
    }
    
    /**
     * @dev Internal function to trigger liquidity provision
     */
    function _triggerLiquidityProvision() internal {
        emit LiquidityThresholdReached(pendingLiquidity);
        
        if (address(liquidityManagerContract) != address(0)) {
            // Use LiquidityManager contract for DEX integration
            liquidityManagerContract.provideLiquidity{value: pendingLiquidity}(pendingLiquidity);
        } else {
            // Fallback: transfer to liquidity manager address
            payable(liquidityManager).transfer(pendingLiquidity);
        }
        
        // Reset pending liquidity
        pendingLiquidity = 0;
    }
    
    /**
     * @dev Emergency withdraw function for owner
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
