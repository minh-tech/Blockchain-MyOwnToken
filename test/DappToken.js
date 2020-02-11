const DappToken = artifacts.require("DappToken");

contract("DappToken", (accounts) => {
	let dappToken;

	before(async () => {
		dappToken = await DappToken.deployed();
	});

	it('initializes the contract with the correct value', async () => {
		var name = await dappToken.name();
		assert.equal(name, 'Minh Token', 'has the correct name');

		var symbol = await dappToken.symbol();
		assert.equal(symbol, 'MiT', 'has the correct symbol');

		var standard = await dappToken.standard();
		assert.equal(standard, 'Minh Token v1.0', 'has the correct standard');
	});

	it('sets the total supply upon deployment', async () => {
		var totalSupply = await dappToken.totalSupply();
		assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');

		var adminBalance = await dappToken.balanceOf(accounts[0]);
		assert.equal(adminBalance.toNumber(), 1000000, 'allocates the initial supply to the admin account');
	});

	it('transfer token ownership', async () => {
		var total = 1000000;
		var amount = 250000;
		try {
        	await dappToken.transfer(accounts[1], 999999999);
        	assert.fail();
      	} catch(error) {
        	assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      	}

      	var success;
      	try {
      		success = await dappToken.transfer.call(accounts[1], amount, { from: accounts[0] });
      	} catch(error) {
      		success = false;
      	} finally {
      		assert.equal(success, true, 'should return true');
      	}
      	

      	var result = await dappToken.transfer(accounts[1], amount, { from: accounts[0] });

      	assert.equal(result.logs.length, 1, 'triggers one event');
      	assert.equal(result.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      	assert.equal(result.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
      	assert.equal(result.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
      	assert.equal(result.logs[0].args._value, amount, 'logs the transfer amount');

      	var balance = await dappToken.balanceOf(accounts[1]);
      	assert.equal(balance.toNumber(), amount, 'adds the amount to the receiving account');
      	balance = await dappToken.balanceOf(accounts[0]);
      	assert.equal(balance.toNumber(), total - amount, 'deduct the amount from the sending account');

	})
});