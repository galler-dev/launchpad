const Launchpad = artifacts.require("Launchpad");
const { setConfig } = require('./config.js')
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer, network) {
  await deployer.deploy(Launchpad);
  if (network !== 'development') {
    setConfig('deployed.' + network + '.launchpad', Launchpad.address)
  }
};
