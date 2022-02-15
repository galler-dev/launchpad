const Migrations = artifacts.require("Migrations");
const Launchpad = artifacts.require("Launchpad");
const LaunchpadNFTFactory = artifacts.require("LaunchpadNFTFactory");
const { setConfig } = require('./config.js')

module.exports = async function (deployer, network, accounts) {
  const launchpad = await Launchpad.deployed();
  await deployer.deploy(LaunchpadNFTFactory);

  if (network !== 'development') {
    setConfig('deployed.' + network + '.launchpadNFTFactory', LaunchpadNFTFactory.address);
  }
};
