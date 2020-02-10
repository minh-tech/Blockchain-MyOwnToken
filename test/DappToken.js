const DappToken = artifacts.require("DappToken");

contract("DappToken", (accounts) => {
	let dappToken;

	before(async () => {
		dappToken = await DappToken.deployed();
	});

	it('sets the total supply upon deployment', async () => {
		var totalSupply = await dappToken.totalSupply();
		assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
	});
});