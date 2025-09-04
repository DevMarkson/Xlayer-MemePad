const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying TokenFactory with:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "OKB");

  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");

  // Estimate gas for deployment
  const feeData = await deployer.provider.getFeeData();
  const gasPrice = feeData.gasPrice ?? hre.ethers.parseUnits("0.1", "gwei");
  const unsignedTx = TokenFactory.getDeployTransaction(deployer.address);
  const gasEstimate = await deployer.estimateGas(unsignedTx);
  const estimatedCost = gasEstimate * (gasPrice ?? 0n);
  console.log("Estimated gas:", gasEstimate.toString());
  console.log(
    "Gas price:",
    gasPrice ? hre.ethers.formatUnits(gasPrice, "gwei") + " gwei" : "n/a"
  );
  console.log(
    "Estimated deploy cost:",
    hre.ethers.formatEther(estimatedCost),
    "OKB"
  );

  if (estimatedCost > balance) {
    console.error(
      "Insufficient funds. Need at least:",
      hre.ethers.formatEther(estimatedCost),
      "OKB"
    );
    console.error("Top up the deployer on X Layer Testnet and retry.");
    process.exit(1);
  }

  // Deploy with explicit gas settings (conservative)
  const factory = await TokenFactory.deploy(deployer.address, {
    gasPrice,
    gasLimit: gasEstimate + 200000n, // headroom
  });
  await factory.waitForDeployment();

  const addr = await factory.getAddress();
  console.log("TokenFactory deployed to:", addr);

  const out = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    TokenFactory: addr,
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync("deployment-factory.json", JSON.stringify(out, null, 2));
  console.log("Saved -> deployment-factory.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
