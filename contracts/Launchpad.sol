//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LaunchpadNFT.sol";

contract Launchpad is Ownable {

    struct Campaign {
        address contractAddress;
        uint256 price; // wei
        uint256 totalSupply;
        uint256 listingTime;
        uint256 expirationTime;
        uint256 maxBatch;
    }

    mapping(address => Campaign) public activities;

    function mint(address contractAddress, uint256 batchSize) payable external {
        // basic check
        require(contractAddress != address(0), "contract address can not be empty");
        require(batchSize > 0, "batchSize must greater than 0");
        require(activities[contractAddress].contractAddress != address(0), "contract not register");

        // activity check
        Campaign memory a = activities[contractAddress];
        require(batchSize <= a.maxBatch, "reach max batch size");
        require(block.timestamp >= a.listingTime, "activity not start");
        require(block.timestamp < a.expirationTime, "activity ended");
        // NFT contract must impl ERC721Enumerable to have this totalSupply method
        uint256 currentSupply = LaunchpadNFT(contractAddress).LAUNCH_SUPPLY();
        require(currentSupply + batchSize <= a.totalSupply);
        uint256 totalPrice = a.price * batchSize;
        require(msg.value >= totalPrice, "value not enough");

        // transfer token and mint
        payable(this.owner()).transfer(totalPrice);
        LaunchpadNFT(contractAddress).mintTo(msg.sender, batchSize);

        // return
        payable(_msgSender()).transfer(msg.value - totalPrice);
    }

    function addCampaign(address contractAddress_, uint256 price_, uint256 totalSupply_, uint256 listingTime_, uint256 expirationTime_, uint256 maxBatch_) external onlyOwner {
        require(contractAddress_ != address(0), "contract address can not be empty");
        activities[contractAddress_] = Campaign(contractAddress_, price_, totalSupply_, listingTime_, expirationTime_, maxBatch_);
    }

    function getCampaign(address contractAddress) view external returns (address, uint256, uint256, uint256, uint256, uint256) {
        Campaign memory a = activities[contractAddress];
        return (a.contractAddress, a.price, a.totalSupply, a.listingTime, a.expirationTime, a.maxBatch);
    }
}
