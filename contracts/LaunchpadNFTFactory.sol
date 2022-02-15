//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./LaunchpadNFT.sol";

// for test
contract LaunchpadNFTFactory {

    event CreateNFT(address nftAddress, string name, string symbol);

    function createNFT(string memory name, string memory symbol, string memory baseURI, address launchpad, uint256 maxSupply) external {
        LaunchpadNFT nft = new LaunchpadNFT(name, symbol, baseURI, launchpad, maxSupply);
        emit CreateNFT(address(nft), name, symbol);
    }
}
