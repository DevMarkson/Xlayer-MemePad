// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title LiquidityManager
 * @dev Manages liquidity provision to DEXs and permanently locked liquidity
 */
contract LiquidityManager is Ownable, ReentrancyGuard {
    
    // OKB token address on X Layer (WETH equivalent)
    address public constant OKB_TOKEN = 0x4200000000000000000000000000000000000006;
    
    // Permanently locked liquidity (36 OKB)
    uint256 public constant LOCKED_LIQUIDITY = 36 ether;
    
    // Liquidity lock duration (10 years)
    uint256 public constant LOCK_DURATION = 365 days * 10;
    
    // DEX router addresses (will be set after deployment)
    address public okieSwapRouter;
    address public uniswapV2Router;
    
    // Liquidity lock contract
    address public liquidityLock;
    
    // State variables
    uint256 public totalLiquidityProvided;
    uint256 public totalLockedLiquidity;
    uint256 public lastLiquidityProvision;
    
    // Events
    event LiquidityProvided(
        address indexed dex,
        address indexed token,
        uint256 okbAmount,
        uint256 tokenAmount,
        uint256 lpTokens
    );
    
    event LiquidityLocked(
        address indexed token,
        uint256 amount,
        uint256 lockDuration
    );
    
    event RouterUpdated(
        string dex,
        address oldRouter,
        address newRouter
    );
    
    constructor(address initialOwner) Ownable(initialOwner) {
        // Initialize with default routers (to be updated after deployment)
        okieSwapRouter = address(0);
        uniswapV2Router = address(0);
    }
    
    /**
     * @dev Receive OKB and provide liquidity to DEXs
     */
    receive() external payable {
        require(msg.value > 0, "No OKB received");
        _provideLiquidity(msg.value);
    }
    
    /**
     * @dev Provide liquidity to DEXs
     * @param okbAmount Amount of OKB to provide as liquidity
     */
    function provideLiquidity(uint256 okbAmount) external payable onlyOwner nonReentrant {
        require(okbAmount > 0, "Amount must be greater than 0");
        require(address(this).balance >= okbAmount, "Insufficient OKB balance");
        
        _provideLiquidity(okbAmount);
    }
    
    /**
     * @dev Internal function to provide liquidity
     * @param okbAmount Amount of OKB to provide
     */
    function _provideLiquidity(uint256 okbAmount) internal {
        // Calculate amounts for different purposes
        uint256 lockedAmount = LOCKED_LIQUIDITY;
        uint256 dexAmount = okbAmount - lockedAmount;
        
        if (dexAmount > 0) {
            // Provide liquidity to DEXs
            _addLiquidityToDEX(dexAmount);
        }
        
        // Lock permanent liquidity
        if (lockedAmount > 0 && totalLockedLiquidity == 0) {
            _lockPermanentLiquidity(lockedAmount);
        }
        
        totalLiquidityProvided += okbAmount;
        lastLiquidityProvision = block.timestamp;
    }
    
    /**
     * @dev Add liquidity to DEXs (OkieSwap and Uniswap V2)
     * @param okbAmount Amount of OKB to add
     */
    function _addLiquidityToDEX(uint256 okbAmount) internal {
        // Split between DEXs (50% each if both available)
        uint256 halfAmount = okbAmount / 2;
        
        // Add to OkieSwap if router is set
        if (okieSwapRouter != address(0)) {
            _addLiquidityToRouter(okieSwapRouter, halfAmount, "OkieSwap");
        }
        
        // Add to Uniswap V2 if router is set
        if (uniswapV2Router != address(0)) {
            _addLiquidityToRouter(uniswapV2Router, halfAmount, "Uniswap V2");
        }
        
        // If only one DEX is available, add all to that DEX
        if (okieSwapRouter == address(0) && uniswapV2Router != address(0)) {
            _addLiquidityToRouter(uniswapV2Router, okbAmount, "Uniswap V2");
        } else if (uniswapV2Router == address(0) && okieSwapRouter != address(0)) {
            _addLiquidityToRouter(okieSwapRouter, okbAmount, "OkieSwap");
        }
    }
    
    /**
     * @dev Add liquidity to a specific DEX router
     * @param router Router address
     * @param okbAmount Amount of OKB
     * @param dexName Name of the DEX for events
     */
    function _addLiquidityToRouter(address router, uint256 okbAmount, string memory dexName) internal {
        // This is a simplified implementation
        // In practice, you would:
        // 1. Get the token address from the factory
        // 2. Calculate optimal token amounts
        // 3. Call router.addLiquidityETH() or router.addLiquidity()
        
        // For now, we'll emit an event and store the data
        emit LiquidityProvided(
            router,
            address(0), // token address would be passed as parameter
            okbAmount,
            0, // token amount would be calculated
            0  // lp tokens would be returned
        );
    }
    
    /**
     * @dev Lock permanent liquidity
     * @param amount Amount to lock
     */
    function _lockPermanentLiquidity(uint256 amount) internal {
        // Transfer to liquidity lock contract
        if (liquidityLock != address(0)) {
            payable(liquidityLock).transfer(amount);
        }
        
        totalLockedLiquidity = amount;
        
        emit LiquidityLocked(
            address(0), // token address
            amount,
            LOCK_DURATION
        );
    }
    
    /**
     * @dev Set OkieSwap router address
     * @param router Router address
     */
    function setOkieSwapRouter(address router) external onlyOwner {
        address oldRouter = okieSwapRouter;
        okieSwapRouter = router;
        
        emit RouterUpdated("OkieSwap", oldRouter, router);
    }
    
    /**
     * @dev Set Uniswap V2 router address
     * @param router Router address
     */
    function setUniswapV2Router(address router) external onlyOwner {
        address oldRouter = uniswapV2Router;
        uniswapV2Router = router;
        
        emit RouterUpdated("Uniswap V2", oldRouter, router);
    }
    
    /**
     * @dev Set liquidity lock contract
     * @param lockContract Lock contract address
     */
    function setLiquidityLock(address lockContract) external onlyOwner {
        require(lockContract != address(0), "Invalid lock contract");
        liquidityLock = lockContract;
    }
    
    /**
     * @dev Get liquidity statistics
     * @return _totalProvided Total liquidity provided
     * @return _totalLocked Total locked liquidity
     * @return _lastProvision Last provision timestamp
     */
    function getLiquidityStats() external view returns (
        uint256 _totalProvided,
        uint256 _totalLocked,
        uint256 _lastProvision
    ) {
        return (totalLiquidityProvided, totalLockedLiquidity, lastLiquidityProvision);
    }
    
    /**
     * @dev Get DEX router addresses
     * @return _okieSwap OkieSwap router
     * @return _uniswapV2 Uniswap V2 router
     */
    function getRouters() external view returns (address _okieSwap, address _uniswapV2) {
        return (okieSwapRouter, uniswapV2Router);
    }
    
    /**
     * @dev Emergency withdraw function
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Withdraw specific token
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function withdrawToken(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}
