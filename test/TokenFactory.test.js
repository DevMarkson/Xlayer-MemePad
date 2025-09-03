const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Meme Token Launchpad", function () {
    let TokenFactory, MemeToken, BondingCurve;
    let tokenFactory, memeToken, bondingCurve;
    let owner, user1, user2, referrer;
    let addr1, addr2, addr3, addr4;
    
    const TOKEN_CREATION_FEE = ethers.parseEther("0.1");
    const INITIAL_PRICE = ethers.parseEther("0.0001");
    const PRICE_INCREMENT = ethers.parseEther("0.00001");
    
    beforeEach(async function () {
        [owner, user1, user2, referrer, addr1, addr2, addr3, addr4] = await ethers.getSigners();
        
        // Deploy TokenFactory
        TokenFactory = await ethers.getContractFactory("TokenFactory");
        tokenFactory = await TokenFactory.deploy(owner.address);
        
        // Deploy MemeToken for testing
        MemeToken = await ethers.getContractFactory("MemeToken");
        memeToken = await MemeToken.deploy("TestToken", "TEST", owner.address);
        
        // Deploy BondingCurve for testing
        BondingCurve = await ethers.getContractFactory("BondingCurve");
        bondingCurve = await BondingCurve.deploy(owner.address);
    });
    
    describe("TokenFactory", function () {
        it("Should deploy with correct initial state", async function () {
            expect(await tokenFactory.owner()).to.equal(owner.address);
            expect(await tokenFactory.totalTokensCreated()).to.equal(0);
            expect(await tokenFactory.totalFeesCollected()).to.equal(0);
            expect(await tokenFactory.pendingLiquidity()).to.equal(0);
        });
        
        it("Should create a new token with correct fee", async function () {
            const tokenName = "DogeMoon";
            const tokenSymbol = "DOGE";
            
            await expect(
                tokenFactory.connect(user1).createToken(tokenName, tokenSymbol, ethers.ZeroAddress, {
                    value: TOKEN_CREATION_FEE
                })
            ).to.emit(tokenFactory, "TokenCreated");
            
            expect(await tokenFactory.totalTokensCreated()).to.equal(1);
            expect(await tokenFactory.totalFeesCollected()).to.equal(TOKEN_CREATION_FEE);
        });
        
        it("Should fail to create token with insufficient fee", async function () {
            const tokenName = "DogeMoon";
            const tokenSymbol = "DOGE";
            
            await expect(
                tokenFactory.connect(user1).createToken(tokenName, tokenSymbol, ethers.ZeroAddress, {
                    value: ethers.parseEther("0.05")
                })
            ).to.be.revertedWith("Insufficient creation fee");
        });
        
        it("Should fail to create token with empty name", async function () {
            await expect(
                tokenFactory.connect(user1).createToken("", "DOGE", ethers.ZeroAddress, {
                    value: TOKEN_CREATION_FEE
                })
            ).to.be.revertedWith("Name cannot be empty");
        });
        
        it("Should fail to create token with empty symbol", async function () {
            await expect(
                tokenFactory.connect(user1).createToken("DogeMoon", "", ethers.ZeroAddress, {
                    value: TOKEN_CREATION_FEE
                })
            ).to.be.revertedWith("Symbol cannot be empty");
        });
        
        it("Should distribute fees correctly", async function () {
            const initialBalance = await ethers.provider.getBalance(owner.address);
            
            await tokenFactory.connect(user1).createToken("DogeMoon", "DOGE", referrer.address, {
                value: TOKEN_CREATION_FEE
            });
            
            // Check that fees were distributed
            const finalBalance = await ethers.provider.getBalance(owner.address);
            expect(finalBalance).to.be.gt(initialBalance);
        });
    });
    
    describe("BondingCurve", function () {
        it("Should initialize with correct parameters", async function () {
            expect(await bondingCurve.INITIAL_PRICE()).to.equal(INITIAL_PRICE);
            expect(await bondingCurve.PRICE_INCREMENT()).to.equal(PRICE_INCREMENT);
            expect(await bondingCurve.MAX_SUPPLY()).to.equal(1_000_000_000);
            expect(await bondingCurve.currentPrice()).to.equal(INITIAL_PRICE);
        });
        
        it("Should calculate correct buy price for single token", async function () {
            const price = await bondingCurve.getBuyPrice(1);
            expect(price).to.equal(INITIAL_PRICE);
        });
        
        it("Should calculate correct buy price for multiple tokens", async function () {
            const amount = 100;
            const expectedPrice = INITIAL_PRICE.mul(amount).add(
                PRICE_INCREMENT.mul(amount).mul(amount - 1).div(2)
            );
            
            const price = await bondingCurve.getBuyPrice(amount);
            expect(price).to.equal(expectedPrice);
        });
        
        it("Should fail to buy more than max supply", async function () {
            const maxSupply = await bondingCurve.MAX_SUPPLY();
            await expect(
                bondingCurve.getBuyPrice(maxSupply + 1)
            ).to.be.revertedWith("Exceeds max supply");
        });
        
        it("Should update state after buying tokens", async function () {
            const amount = 100;
            const initialTotalSold = await bondingCurve.totalSold();
            
            await bondingCurve.buyTokens(user1.address, amount);
            
            expect(await bondingCurve.totalSold()).to.equal(initialTotalSold.add(amount));
            expect(await bondingCurve.currentPrice()).to.be.gt(INITIAL_PRICE);
        });
        
        it("Should calculate correct sell price", async function () {
            // First buy some tokens
            const buyAmount = 100;
            await bondingCurve.buyTokens(user1.address, buyAmount);
            
            // Then calculate sell price
            const sellAmount = 50;
            const sellPrice = await bondingCurve.getSellPrice(sellAmount);
            expect(sellPrice).to.be.gt(0);
        });
        
        it("Should fail to sell more than total sold", async function () {
            const buyAmount = 100;
            await bondingCurve.buyTokens(user1.address, buyAmount);
            
            await expect(
                bondingCurve.getSellPrice(buyAmount + 1)
            ).to.be.revertedWith("Cannot sell more than total sold");
        });
    });
    
    describe("MemeToken", function () {
        it("Should mint correct initial supply", async function () {
            const expectedSupply = ethers.parseEther("1000000000"); // 1 billion
            expect(await memeToken.totalSupply()).to.equal(expectedSupply);
            expect(await memeToken.balanceOf(owner.address)).to.equal(expectedSupply);
        });
        
        it("Should allow owner to mint additional tokens", async function () {
            const mintAmount = ethers.parseEther("1000000");
            const initialBalance = await memeToken.balanceOf(user1.address);
            
            await memeToken.mint(user1.address, mintAmount);
            
            expect(await memeToken.balanceOf(user1.address)).to.equal(initialBalance.add(mintAmount));
        });
        
        it("Should allow owner to burn tokens", async function () {
            const burnAmount = ethers.parseEther("1000000");
            const initialBalance = await memeToken.balanceOf(owner.address);
            
            await memeToken.burn(burnAmount);
            
            expect(await memeToken.balanceOf(owner.address)).to.equal(initialBalance.sub(burnAmount));
        });
        
        it("Should fail when non-owner tries to mint", async function () {
            await expect(
                memeToken.connect(user1).mint(user2.address, ethers.parseEther("1000000"))
            ).to.be.revertedWithCustomError(memeToken, "OwnableUnauthorizedAccount");
        });
        
        it("Should fail when non-owner tries to burn", async function () {
            await expect(
                memeToken.connect(user1).burn(ethers.parseEther("1000000"))
            ).to.be.revertedWithCustomError(memeToken, "OwnableUnauthorizedAccount");
        });
    });
    
    describe("Integration Tests", function () {
        it("Should create token and allow trading through bonding curve", async function () {
            // Create a token
            await tokenFactory.connect(user1).createToken("TestToken", "TEST", ethers.ZeroAddress, {
                value: TOKEN_CREATION_FEE
            });
            
            const allTokens = await tokenFactory.getAllTokens();
            const tokenAddress = allTokens[0];
            const tokenInfo = await tokenFactory.getTokenInfo(tokenAddress);
            
            expect(tokenInfo.name).to.equal("TestToken");
            expect(tokenInfo.symbol).to.equal("TEST");
            expect(tokenInfo.creator).to.equal(user1.address);
            expect(tokenInfo.isActive).to.be.true;
            
            // Get the bonding curve address
            const bondingCurveAddress = tokenInfo.bondingCurve;
            const bondingCurve = BondingCurve.attach(bondingCurveAddress);
            
            // Buy some tokens
            const buyAmount = 100;
            const buyPrice = await bondingCurve.getBuyPrice(buyAmount);
            
            await tokenFactory.connect(user2).buyTokens(tokenAddress, buyAmount, {
                value: buyPrice
            });
            
            // Check that user2 received the tokens
            const MemeTokenContract = MemeToken.attach(tokenAddress);
            expect(await MemeTokenContract.balanceOf(user2.address)).to.equal(buyAmount);
        });
    });
});
