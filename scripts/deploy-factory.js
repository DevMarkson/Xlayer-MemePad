const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying TokenFactory with:", deployer.address);

  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
  const factory = await TokenFactory.deploy(deployer.address);
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
