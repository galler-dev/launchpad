const Launchpad = artifacts.require("Launchpad");
const LaunchpadNFT = artifacts.require("LaunchpadNFT");

const truffleAssert = require("truffle-assertions");

contract("Launchpad", (accounts) => {
    it("add campaign", async () => {
        // console.log("test start")
        let launchpad = await Launchpad.new();
        let nft = await LaunchpadNFT.new("LaunchpadNFT", "LNFT", "https://metadata.com/nft/", launchpad.address, 10);
        // addActivity(address contractAddress_, uint256 price_, uint256 totalSupply_, uint256 listingTime_, uint256 expirationTime_, uint256 maxBatch_)
        truffleAssert.passes(launchpad.addCampaign(nft.address, accounts[1], web3.utils.toWei("0.001", "ether"), 10, 1644390809, 1744390809, 1));
    });

    it("mint", async () => {
        // console.log("test start")
        let launchpad = await Launchpad.new();
        console.log(launchpad.address);
        let nft = await LaunchpadNFT.new("LaunchpadNFT", "LNFT", "https://metadata.com/nft/", launchpad.address, 10);
        // addCampaign(address contractAddress_, uint256 price_, uint256 totalSupply_, uint256 listingTime_, uint256 expirationTime_, uint256 maxBatch_)
        await truffleAssert.reverts(launchpad.mint(nft.address, 1), "contract not register");
        await truffleAssert.passes(launchpad.addCampaign(nft.address, accounts[1], web3.utils.toWei("0.001", "ether"), 10, 1644390809, 1744390809, 1));

        // let res = await launchpad.getActivity(nft.address);
        //
        // console.log(res);
        await truffleAssert.passes(launchpad.mint(nft.address, 1, {value : web3.utils.toWei("0.001", "ether")}));

    });

    it("batch limit", async () => {
        // console.log("test start")
        let launchpad = await Launchpad.new();
        let nft = await LaunchpadNFT.new("LaunchpadNFT", "LNFT", "https://metadata.com/nft/", launchpad.address, 10);
        // addActivity(address contractAddress_, uint256 price_, uint256 totalSupply_, uint256 listingTime_, uint256 expirationTime_, uint256 maxBatch_)
        await truffleAssert.passes(launchpad.addCampaign(nft.address, accounts[1], web3.utils.toWei("0.001", "ether"), 10, 1644390809, 1744390809, 1));
        await truffleAssert.reverts(launchpad.mint(nft.address, 2, {value : web3.utils.toWei("0.002", "ether")}), "reach max batch size");
    });

    it("supply limit", async () => {
        // console.log("test start")
        let launchpad = await Launchpad.new();
        let nft = await LaunchpadNFT.new("LaunchpadNFT", "LNFT", "https://metadata.com/nft/", launchpad.address, 10);
        // addActivity(address contractAddress_, uint256 price_, uint256 totalSupply_, uint256 listingTime_, uint256 expirationTime_, uint256 maxBatch_)
        await truffleAssert.passes(launchpad.addCampaign(nft.address, accounts[1], web3.utils.toWei("0.001", "ether"), 10, 1644390809, 1744390809, 10));
        await truffleAssert.passes(launchpad.mint(nft.address, 10, {value : web3.utils.toWei("0.01", "ether")}));
        await truffleAssert.reverts(launchpad.mint(nft.address, 10, {value : web3.utils.toWei("0.01", "ether")}), "reach campaign max supply");
    });

    it("payee", async () => {
        // console.log("test start")
        let launchpad = await Launchpad.new();
        let nft = await LaunchpadNFT.new("LaunchpadNFT", "LNFT", "https://metadata.com/nft/", launchpad.address, 10);
        // addActivity(address contractAddress_, uint256 price_, uint256 totalSupply_, uint256 listingTime_, uint256 expirationTime_, uint256 maxBatch_)
        const account1BalanceBefore = await web3.eth.getBalance(accounts[1]);

        await truffleAssert.passes(launchpad.addCampaign(nft.address, accounts[1], web3.utils.toWei("0.001", "ether"), 10, 1644390809, 1744390809, 10));
        await truffleAssert.passes(launchpad.mint(nft.address, 10, {value : web3.utils.toWei("0.01", "ether")}));

        const account1BalanceAfter = await web3.eth.getBalance(accounts[1]);

        assert.equal(account1BalanceAfter - account1BalanceBefore, web3.utils.toWei("0.01", "ether"));
    });

    it("time limit", async () => {
        // console.log("test start")
        let launchpad = await Launchpad.new();
        let nft = await LaunchpadNFT.new("LaunchpadNFT", "LNFT", "https://metadata.com/nft/", launchpad.address, 10);
        // addActivity(address contractAddress_, uint256 price_, uint256 totalSupply_, uint256 listingTime_, uint256 expirationTime_, uint256 maxBatch_)
        await truffleAssert.passes(launchpad.addCampaign(nft.address, accounts[1], web3.utils.toWei("0.001", "ether"), 10, 1744390809, 1744390809, 10));
        await truffleAssert.reverts(launchpad.mint(nft.address, 10, {value : web3.utils.toWei("0.01", "ether")}), "activity not start");
        await truffleAssert.passes(launchpad.addCampaign(nft.address, accounts[1], web3.utils.toWei("0.001", "ether"), 10, 1644390809, 1644390809, 10));
        await truffleAssert.reverts(launchpad.mint(nft.address, 10, {value : web3.utils.toWei("0.01", "ether")}), "activity ended");
    });
})
