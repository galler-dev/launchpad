const Migrations = artifacts.require("Migrations");
const Launchpad = artifacts.require("Launchpad");
const LaunchpadNFT = artifacts.require("LaunchpadNFT");

module.exports = async function (deployer) {
  const launchpad = await Launchpad.deployed();
  await deployer.deploy(LaunchpadNFT, "LaunchpadNFT", "LNFT", "https://metadata.com/LNFT/", launchpad.address, 10);
};
