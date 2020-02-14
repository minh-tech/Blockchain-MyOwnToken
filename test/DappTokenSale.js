const DappTokenSale = artifacts.require("DappTokenSale");
const DappToken = artifacts.require("DappToken");

contract("DappTokenSale", (accounts) => {
	var dappTokenSale;
	var tokenPrice = 1000000000000000; // in wei
	var admin = accounts[0];
	var buyer = accounts[1];
	var totalTokens = 1000000;
	var tokensAvailable = totalTokens * 0.75;
	var numbersOfTokens  = 10;


	before(async () => {
		dappTokenSale = await DappTokenSale.deployed();
		dappToken = await DappToken.deployed();

	});

	it('initializes the contract with the correct value', async () => {
		assert.notEqual(dappTokenSale.address, 0x0, 'has contract address');

		let _tokenContract = await dappTokenSale.tokenContract();
		assert.notEqual(_tokenContract, 0x0, 'has token contract address');

		let _tokenPrice = await dappTokenSale.tokenPrice();
		assert.equal(_tokenPrice, tokenPrice, 'token price is correct');
	});

	it('facilitates token buying', async () => {

		
		let _value = numbersOfTokens * tokenPrice;

		// Provision 100 tokens to the token sale
		await dappToken.transfer(dappTokenSale.address, 100, { from: admin });

      	// Try to buy more tokens than available
      	try {
      		await dappTokenSale.buyTokens(1000, { from: buyer, value: 1000 * tokenPrice });
        	assert.fail();
      	} catch(error) {
        	assert(error.message.indexOf('revert') >= 0, "cannot purchase more tokens than available");
      	}

      	// Try to buy tokens with low price
      	try {
        	await dappTokenSale.buyTokens(numbersOfTokens, { from: buyer, value: 1 });
        	assert.fail();
      	} catch(error) {
        	assert(error.message.indexOf('revert') >= 0, "value must equal the number of tokens in wei");
      	}

      	// SUCCESS
      	// Provision 75% of all tokens to the token sale
		await dappToken.transfer(dappTokenSale.address, tokensAvailable - 100, { from: admin });

		let receipt = await dappTokenSale.buyTokens(numbersOfTokens, { from: buyer, value: _value });

		assert.equal(receipt.logs.length, 1, 'triggers one event');
      	assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      	assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      	assert.equal(receipt.logs[0].args._amount, numbersOfTokens, 'logs the number of tokens purchased');

		let amount = await dappTokenSale.tokensSold();
		assert.equal(amount.toNumber(), numbersOfTokens, 'increments the number of tokens sold');

		let balance = await dappToken.balanceOf(dappTokenSale.address);
		assert.equal(balance.toNumber(), tokensAvailable - numbersOfTokens, 'tokens remain on Token Sale after purchased');

		balance = await dappToken.balanceOf(buyer);
		assert.equal(balance.toNumber(), numbersOfTokens, 'increments tokens of the buyer');

	});

	it('ends token sale', async () => {
		// Try to end sale from account other than the admin
      	try {
        	await dappTokenSale.endSale({ from: buyer });
        	assert.fail();
      	} catch(error) {
        	assert(error.message.indexOf('revert') >= 0, "must be admin to end sale");
      	}

      	let receipt = await dappTokenSale.endSale({ from: admin});

      	let balance = await dappToken.balanceOf(admin);
      	assert.equal(balance.toNumber(), totalTokens - numbersOfTokens, 'returns all unsold dapp tokens to admin');

      	// Check the contract has no balance
      	balance = await web3.eth.getBalance(dappTokenSale.address);
      	assert.equal(balance, 0, 'Balance of the contract is 0');

	});
});