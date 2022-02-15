const Migrations = artifacts.require("Migrations");
const Launchpad = artifacts.require("Launchpad");
const LaunchpadNFT = artifacts.require("LaunchpadNFT");
const { setConfig } = require('./config.js')

module.exports = async function (deployer, network, accounts) {
  const launchpad = await Launchpad.deployed();
  await deployer.deploy(LaunchpadNFT, "LaunchpadNFT", "LNFT", "https://api.uwucrew.art/api/uwu/", launchpad.address, 20);
  await launchpad.addCampaign(LaunchpadNFT.address, accounts[1], web3.utils.toWei("0.1", "ether"),  100, 1644390809, 1744390809, 5, 5);

  if (network !== 'development') {
    setConfig('deployed.' + network + '.launchpadNFT', LaunchpadNFT.address)
  }
};
