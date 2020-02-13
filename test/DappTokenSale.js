const DappTokenSale = artifacts.require("DappTokenSale");

contract("DappTokenSale", (accounts) => {
	var dappTokenSale;
	var tokenPrice = 1000000000000000; // in wei


	before(async () => {
		dappTokenSale = await DappTokenSale.deployed();
	});

	it('initializes the contract with the correct value', async () => {
		assert.notEqual(dappTokenSale.address, 0x0, 'has contract address');

		let _tokenContract = await dappTokenSale.tokenContract();
		assert.notEqual(_tokenContract, 0x0, 'has token contract address');

		let _tokenPrice = await dappTokenSale.tokenPrice();
		assert.equal(_tokenPrice, tokenPrice, 'token price is correct');
	});
});