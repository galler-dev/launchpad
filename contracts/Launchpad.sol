//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ILaunchpadNFT.sol";

contract Launchpad is Ownable {

    event Mint(address indexed contractAddress, address payeeAddress, uint256 size, uint256 price);

    struct Campaign {
        address contractAddress;
        address payeeAddress;
        uint256 price; // wei
        uint256 maxSupply;
        uint256 listingTime;
        uint256 expirationTime;
        uint256 maxBatch;
    }

    mapping(address => Campaign) public campaigns;

    function mint(address contractAddress, uint256 batchSize) payable external {
        // basic check
        require(contractAddress != address(0), "contract address can not be empty");
        require(batchSize > 0, "batchSize must greater than 0");
        require(campaigns[contractAddress].contractAddress != address(0), "contract not register");

        // activity check
        Campaign memory campaign = campaigns[contractAddress];
        require(batchSize <= campaign.maxBatch, "reach max batch size");
        require(block.timestamp >= campaign.listingTime, "activity not start");
        require(block.timestamp < campaign.expirationTime, "activity ended");
        // NFT contract must impl ERC721Enumerable to have this totalSupply method
        uint256 currentSupply = ILaunchpadNFT(contractAddress).getLaunchpadSupply();
        require(currentSupply + batchSize <= campaign.maxSupply, "reach campaign max supply");
        uint256 totalPrice = campaign.price * batchSize;
        require(msg.value >= totalPrice, "value not enough");

        // transfer token and mint
        payable(campaign.payeeAddress).transfer(totalPrice);
        ILaunchpadNFT(contractAddress).mintTo(msg.sender, batchSize);

        emit Mint(campaign.contractAddress, campaign.payeeAddress, batchSize, campaign.price);
        // return
        payable(_msgSender()).transfer(msg.value - totalPrice);
    }

    function addCampaign(address contractAddress_, address payeeAddress_, uint256 price_, uint256 maxSupply_, uint256 listingTime_, uint256 expirationTime_, uint256 maxBatch_) external onlyOwner {
        require(contractAddress_ != address(0), "contract address can not be empty");
        require(payeeAddress_ != address(0), "payee address can not be empty");
        require(maxSupply_ > 0, "max supply can not be 0");
        require(maxBatch_ > 0, "max batch invalid");
        campaigns[contractAddress_] = Campaign(contractAddress_, payeeAddress_, price_, maxSupply_, listingTime_, expirationTime_, maxBatch_);
    }

    function getCampaign(address contractAddress) view external returns (address, address, uint256, uint256, uint256, uint256, uint256) {
        Campaign memory a = campaigns[contractAddress];
        return (a.contractAddress, a.payeeAddress, a.price, a.maxSupply, a.listingTime, a.expirationTime, a.maxBatch);
    }
}
