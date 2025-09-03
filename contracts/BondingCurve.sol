// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BondingCurve
 * @dev Implements a linear bonding curve for automatic token pricing
 * Price increases linearly with each token sold
 */
contract BondingCurve is Ownable {
    using SafeMath for uint256;
    
    // Bonding curve parameters
    uint256 public constant INITIAL_PRICE = 0.0001 ether; // 0.0001 ETH/OKB per token
    uint256 public constant PRICE_INCREMENT = 0.00001 ether; // Price increases by this amount per token sold
    uint256 public constant MAX_SUPPLY = 1_000_000_000; // 1 billion tokens max
    
    // Token state
    uint256 public totalSold;
    uint256 public currentPrice;
    
    // Events
    event TokensPurchased(address buyer, uint256 amount, uint256 totalCost);
    event TokensSold(address seller, uint256 amount, uint256 totalReceived);
    
    constructor(address initialOwner) Ownable(initialOwner) {
        currentPrice = INITIAL_PRICE;
    }
    
    /**
     * @dev Calculate the current price based on total tokens sold
     * @return Current price per token
     */
    function getCurrentPrice() public view returns (uint256) {
        return INITIAL_PRICE.add(totalSold.mul(PRICE_INCREMENT));
    }
    
    /**
     * @dev Calculate the cost to buy a specific amount of tokens
     * @param amount Number of tokens to buy
     * @return Total cost in wei
     */
    function getBuyPrice(uint256 amount) public view returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(totalSold.add(amount) <= MAX_SUPPLY, "Exceeds max supply");
        
        uint256 totalCost = 0;
        uint256 tempTotalSold = totalSold;
        
        for (uint256 i = 0; i < amount; i++) {
            uint256 price = INITIAL_PRICE.add(tempTotalSold.mul(PRICE_INCREMENT));
            totalCost = totalCost.add(price);
            tempTotalSold = tempTotalSold.add(1);
        }
        
        return totalCost;
    }
    
    /**
     * @dev Calculate the amount received for selling a specific amount of tokens
     * @param amount Number of tokens to sell
     * @return Total amount received in wei
     */
    function getSellPrice(uint256 amount) public view returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= totalSold, "Cannot sell more than total sold");
        
        uint256 totalReceived = 0;
        uint256 tempTotalSold = totalSold;
        
        for (uint256 i = 0; i < amount; i++) {
            tempTotalSold = tempTotalSold.sub(1);
            uint256 price = INITIAL_PRICE.add(tempTotalSold.mul(PRICE_INCREMENT));
            totalReceived = totalReceived.add(price);
        }
        
        return totalReceived;
    }
    
    /**
     * @dev Buy tokens (this function will be called by the factory)
     * @param buyer Address buying the tokens
     * @param amount Number of tokens to buy
     * @return Total cost in wei
     */
    function buyTokens(address buyer, uint256 amount) external onlyOwner returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(totalSold.add(amount) <= MAX_SUPPLY, "Exceeds max supply");
        
        uint256 totalCost = getBuyPrice(amount);
        
        // Update state
        totalSold = totalSold.add(amount);
        currentPrice = getCurrentPrice();
        
        emit TokensPurchased(buyer, amount, totalCost);
        
        return totalCost;
    }
    
    /**
     * @dev Sell tokens (this function will be called by the factory)
     * @param seller Address selling the tokens
     * @param amount Number of tokens to sell
     * @return Total amount received in wei
     */
    function sellTokens(address seller, uint256 amount) external onlyOwner returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= totalSold, "Cannot sell more than total sold");
        
        uint256 totalReceived = getSellPrice(amount);
        
        // Update state
        totalSold = totalSold.sub(amount);
        currentPrice = getCurrentPrice();
        
        emit TokensSold(seller, amount, totalReceived);
        
        return totalReceived;
    }
    
    /**
     * @dev Get bonding curve statistics
     * @return _totalSold Total tokens sold
     * @return _currentPrice Current price per token
     * @return _maxSupply Maximum supply
     */
    function getBondingCurveStats() external view returns (
        uint256 _totalSold,
        uint256 _currentPrice,
        uint256 _maxSupply
    ) {
        return (totalSold, currentPrice, MAX_SUPPLY);
    }
}
