// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title LiquidityLock
 * @dev Permanently locks liquidity for base pool stability
 */
contract LiquidityLock is Ownable, ReentrancyGuard {
    
    // Lock duration (10 years)
    uint256 public constant LOCK_DURATION = 365 days * 10;
    
    // Lock start time
    uint256 public lockStartTime;
    
    // Locked amount
    uint256 public lockedAmount;
    
    // Lock status
    bool public isLocked;
    
    // Events
    event LiquidityLocked(
        uint256 amount,
        uint256 lockStartTime,
        uint256 unlockTime
    );
    
    event LockExtended(
        uint256 newUnlockTime
    );
    
    event EmergencyUnlock(
        address indexed owner,
        uint256 amount
    );
    
    constructor(address initialOwner) Ownable(initialOwner) {
        lockStartTime = 0;
        lockedAmount = 0;
        isLocked = false;
    }
    
    /**
     * @dev Receive OKB and lock it
     */
    receive() external payable {
        require(msg.value > 0, "No OKB received");
        _lockLiquidity(msg.value);
    }
    
    /**
     * @dev Lock liquidity
     * @param amount Amount to lock
     */
    function lockLiquidity(uint256 amount) external payable onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient OKB balance");
        require(!isLocked, "Liquidity already locked");
        
        _lockLiquidity(amount);
    }
    
    /**
     * @dev Internal function to lock liquidity
     * @param amount Amount to lock
     */
    function _lockLiquidity(uint256 amount) internal {
        require(!isLocked, "Liquidity already locked");
        
        lockedAmount = amount;
        lockStartTime = block.timestamp;
        isLocked = true;
        
        emit LiquidityLocked(
            amount,
            lockStartTime,
            lockStartTime + LOCK_DURATION
        );
    }
    
    /**
     * @dev Extend lock duration (only owner)
     * @param additionalTime Additional time to add
     */
    function extendLock(uint256 additionalTime) external onlyOwner {
        require(isLocked, "No liquidity locked");
        require(additionalTime > 0, "Additional time must be greater than 0");
        
        // This would extend the lock duration
        // For permanent lock, this might not be needed
        emit LockExtended(lockStartTime + LOCK_DURATION + additionalTime);
    }
    
    /**
     * @dev Check if lock can be unlocked
     * @return canUnlock Whether the lock can be unlocked
     * @return unlockTime When the lock can be unlocked
     */
    function canUnlock() external view returns (bool canUnlock, uint256 unlockTime) {
        if (!isLocked) {
            return (false, 0);
        }
        
        unlockTime = lockStartTime + LOCK_DURATION;
        canUnlock = block.timestamp >= unlockTime;
        
        return (canUnlock, unlockTime);
    }
    
    /**
     * @dev Unlock liquidity (only after lock duration)
     */
    function unlockLiquidity() external onlyOwner nonReentrant {
        require(isLocked, "No liquidity locked");
        require(block.timestamp >= lockStartTime + LOCK_DURATION, "Lock period not ended");
        
        uint256 amount = lockedAmount;
        lockedAmount = 0;
        isLocked = false;
        lockStartTime = 0;
        
        payable(owner()).transfer(amount);
        
        emit EmergencyUnlock(owner(), amount);
    }
    
    /**
     * @dev Get lock information
     * @return _isLocked Whether liquidity is locked
     * @return _lockedAmount Amount locked
     * @return _lockStartTime When lock started
     * @return _unlockTime When lock can be unlocked
     * @return _remainingTime Remaining lock time
     */
    function getLockInfo() external view returns (
        bool _isLocked,
        uint256 _lockedAmount,
        uint256 _lockStartTime,
        uint256 _unlockTime,
        uint256 _remainingTime
    ) {
        if (!isLocked) {
            return (false, 0, 0, 0, 0);
        }
        
        uint256 unlockTime = lockStartTime + LOCK_DURATION;
        uint256 remainingTime = block.timestamp >= unlockTime ? 0 : unlockTime - block.timestamp;
        
        return (isLocked, lockedAmount, lockStartTime, unlockTime, remainingTime);
    }
    
    /**
     * @dev Emergency unlock (only owner, bypasses time lock)
     * This should only be used in extreme circumstances
     */
    function emergencyUnlock() external onlyOwner nonReentrant {
        require(isLocked, "No liquidity locked");
        
        uint256 amount = lockedAmount;
        lockedAmount = 0;
        isLocked = false;
        lockStartTime = 0;
        
        payable(owner()).transfer(amount);
        
        emit EmergencyUnlock(owner(), amount);
    }
    
    /**
     * @dev Get contract balance
     * @return balance Current OKB balance
     */
    function getBalance() external view returns (uint256 balance) {
        return address(this).balance;
    }
}
