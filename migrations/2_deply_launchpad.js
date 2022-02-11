const Launchpad = artifacts.require("Launchpad");
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = function (deployer) {
  deployer.deploy(Launchpad);
};
