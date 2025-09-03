const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying Meme Token Launchpad to X Layer Testnet...");
    
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    console.log("💰 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
    
    // Deploy TokenFactory
    console.log("\n📦 Deploying TokenFactory...");
    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    const tokenFactory = await TokenFactory.deploy(deployer.address);
    await tokenFactory.waitForDeployment();
    
    const tokenFactoryAddress = await tokenFactory.getAddress();
    console.log("✅ TokenFactory deployed to:", tokenFactoryAddress);
    
    // Deploy a sample MemeToken for testing
    console.log("\n🪙 Deploying sample MemeToken...");
    const MemeToken = await ethers.getContractFactory("MemeToken");
    const sampleToken = await MemeToken.deploy("SampleToken", "SAMPLE", deployer.address);
    await sampleToken.waitForDeployment();
    
    const sampleTokenAddress = await sampleToken.getAddress();
    console.log("✅ Sample MemeToken deployed to:", sampleTokenAddress);
    
    // Deploy a sample BondingCurve for testing
    console.log("\n📈 Deploying sample BondingCurve...");
    const BondingCurve = await ethers.getContractFactory("BondingCurve");
    const sampleBondingCurve = await BondingCurve.deploy(deployer.address);
    await sampleBondingCurve.waitForDeployment();
    
    const sampleBondingCurveAddress = await sampleBondingCurve.getAddress();
    console.log("✅ Sample BondingCurve deployed to:", sampleBondingCurveAddress);
    
    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    
    // Check TokenFactory state
    const totalTokensCreated = await tokenFactory.totalTokensCreated();
    const totalFeesCollected = await tokenFactory.totalFeesCollected();
    const pendingLiquidity = await tokenFactory.pendingLiquidity();
    
    console.log("📊 TokenFactory State:");
    console.log("   - Total tokens created:", totalTokensCreated.toString());
    console.log("   - Total fees collected:", ethers.formatEther(totalFeesCollected), "OKB");
    console.log("   - Pending liquidity:", ethers.formatEther(pendingLiquidity), "OKB");
    
    // Check sample token state
    const tokenName = await sampleToken.name();
    const tokenSymbol = await sampleToken.symbol();
    const tokenSupply = await sampleToken.totalSupply();
    
    console.log("\n🪙 Sample Token State:");
    console.log("   - Name:", tokenName);
    console.log("   - Symbol:", tokenSymbol);
    console.log("   - Total Supply:", ethers.formatEther(tokenSupply));
    
    // Check bonding curve state
    const initialPrice = await sampleBondingCurve.INITIAL_PRICE();
    const priceIncrement = await sampleBondingCurve.PRICE_INCREMENT();
    const maxSupply = await sampleBondingCurve.MAX_SUPPLY();
    
    console.log("\n📈 Sample Bonding Curve State:");
    console.log("   - Initial Price:", ethers.formatEther(initialPrice), "OKB");
    console.log("   - Price Increment:", ethers.formatEther(priceIncrement), "OKB");
    console.log("   - Max Supply:", maxSupply.toString());
    
    console.log("\n🎉 Deployment completed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log("   TokenFactory:", tokenFactoryAddress);
    console.log("   Sample MemeToken:", sampleTokenAddress);
    console.log("   Sample BondingCurve:", sampleBondingCurveAddress);
    
    console.log("\n🔗 Next steps:");
    console.log("   1. Test token creation with 0.1 OKB fee");
    console.log("   2. Test bonding curve mechanics");
    console.log("   3. Test fee distribution");
    console.log("   4. Deploy frontend and integrate");
    
    // Save deployment info to a file
    const deploymentInfo = {
        network: "X Layer Testnet",
        chainId: 195,
        deployer: deployer.address,
        contracts: {
            tokenFactory: tokenFactoryAddress,
            sampleMemeToken: sampleTokenAddress,
            sampleBondingCurve: sampleBondingCurveAddress
        },
        deploymentTime: new Date().toISOString()
    };
    
    const fs = require('fs');
    fs.writeFileSync(
        'deployment-testnet.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("\n💾 Deployment info saved to deployment-testnet.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
