const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Liquidity Management Contracts...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log("Deployer balance:", ethers.utils.formatEther(balance), "OKB");

  if (balance.lt(ethers.utils.parseEther("0.1"))) {
    throw new Error("Insufficient balance for deployment");
  }

  // Deploy LiquidityLock contract
  console.log("\n📦 Deploying LiquidityLock...");
  const LiquidityLock = await ethers.getContractFactory("LiquidityLock");
  const liquidityLock = await LiquidityLock.deploy(deployer.address);
  await liquidityLock.deployed();
  console.log("✅ LiquidityLock deployed to:", liquidityLock.address);

  // Deploy LiquidityManager contract
  console.log("\n📦 Deploying LiquidityManager...");
  const LiquidityManager = await ethers.getContractFactory("LiquidityManager");
  const liquidityManager = await LiquidityManager.deploy(deployer.address);
  await liquidityManager.deployed();
  console.log("✅ LiquidityManager deployed to:", liquidityManager.address);

  // Set liquidity lock in LiquidityManager
  console.log("\n🔗 Setting up LiquidityManager...");
  const setLockTx = await liquidityManager.setLiquidityLock(
    liquidityLock.address
  );
  await setLockTx.wait();
  console.log("✅ LiquidityLock set in LiquidityManager");

  // Set DEX router addresses (placeholder - update with actual addresses)
  console.log("\n🔧 Setting DEX router addresses...");

  // Note: These are placeholder addresses - update with actual router addresses
  const okieSwapRouter = "0x0000000000000000000000000000000000000000"; // Placeholder
  const uniswapV2Router = "0x0000000000000000000000000000000000000000"; // Placeholder

  if (okieSwapRouter !== "0x0000000000000000000000000000000000000000") {
    const setOkieTx = await liquidityManager.setOkieSwapRouter(okieSwapRouter);
    await setOkieTx.wait();
    console.log("✅ OkieSwap router set");
  }

  if (uniswapV2Router !== "0x0000000000000000000000000000000000000000") {
    const setUniTx = await liquidityManager.setUniswapV2Router(uniswapV2Router);
    await setUniTx.wait();
    console.log("✅ Uniswap V2 router set");
  }

  // Get deployment info
  const lockInfo = await liquidityLock.getLockInfo();
  const managerStats = await liquidityManager.getLiquidityStats();
  const routers = await liquidityManager.getRouters();

  console.log("\n📊 Deployment Summary:");
  console.log("=========================");
  console.log("LiquidityLock Address:", liquidityLock.address);
  console.log("LiquidityManager Address:", liquidityManager.address);
  console.log("Deployer Address:", deployer.address);
  console.log("\nLiquidityLock Status:");
  console.log("- Is Locked:", lockInfo[0]);
  console.log("- Locked Amount:", ethers.utils.formatEther(lockInfo[1]), "OKB");
  console.log("- Lock Start Time:", new Date(lockInfo[2] * 1000).toISOString());
  console.log("- Unlock Time:", new Date(lockInfo[3] * 1000).toISOString());
  console.log("\nLiquidityManager Stats:");
  console.log(
    "- Total Provided:",
    ethers.utils.formatEther(managerStats[0]),
    "OKB"
  );
  console.log(
    "- Total Locked:",
    ethers.utils.formatEther(managerStats[1]),
    "OKB"
  );
  console.log(
    "- Last Provision:",
    new Date(managerStats[2] * 1000).toISOString()
  );
  console.log("\nDEX Routers:");
  console.log("- OkieSwap Router:", routers[0]);
  console.log("- Uniswap V2 Router:", routers[1]);

  console.log("\n🎉 Liquidity Management contracts deployed successfully!");
  console.log("\n📝 Next Steps:");
  console.log("1. Update TokenFactory with LiquidityManager address");
  console.log("2. Set actual DEX router addresses");
  console.log("3. Test liquidity provision mechanism");
  console.log("4. Deploy to mainnet when ready");

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    liquidityLock: liquidityLock.address,
    liquidityManager: liquidityManager.address,
    deploymentTime: new Date().toISOString(),
    lockDuration: "10 years",
    lockedLiquidity: "36 OKB",
    liquidityThreshold: "80 OKB",
  };

  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
