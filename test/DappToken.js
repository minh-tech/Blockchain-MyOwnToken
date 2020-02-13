const DappToken = artifacts.require("DappToken");

contract("DappToken", (accounts) => {
	var dappToken;

	before(async () => {
		dappToken = await DappToken.deployed();
	});

	it('initializes the contract with the correct value', async () => {
		let name = await dappToken.name();
		assert.equal(name, 'Minh Token', 'has the correct name');

		let symbol = await dappToken.symbol();
		assert.equal(symbol, 'MiT', 'has the correct symbol');

		let standard = await dappToken.standard();
		assert.equal(standard, 'Minh Token v1.0', 'has the correct standard');
	});

	it('sets the total supply upon deployment', async () => {
		let totalSupply = await dappToken.totalSupply();
		assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');

		let adminBalance = await dappToken.balanceOf(accounts[0]);
		assert.equal(adminBalance.toNumber(), 1000000, 'allocates the initial supply to the admin account');
	});

	it('transfer token ownership', async () => {
		let total = 1000000;
		let amount = 250000;
		try {
        	await dappToken.transfer(accounts[1], 999999999);
        	assert.fail();
      	} catch(error) {
        	assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      	}

      	let success;
      	try {
      		success = await dappToken.transfer.call(accounts[1], amount, { from: accounts[0] });
      	} catch(error) {
      		success = false;
      	} finally {
      		assert.equal(success, true, 'should return true');
      	}
      	
      	let receipt = await dappToken.transfer(accounts[1], amount, { from: accounts[0] });

      	assert.equal(receipt.logs.length, 1, 'triggers one event');
      	assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      	assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
      	assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
      	assert.equal(receipt.logs[0].args._value, amount, 'logs the transfer amount');

      	let balance = await dappToken.balanceOf(accounts[1]);
      	assert.equal(balance.toNumber(), amount, 'adds the amount to the receiving account');
      	balance = await dappToken.balanceOf(accounts[0]);
      	assert.equal(balance.toNumber(), total - amount, 'deduct the amount from the sending account');

	})

	it('approves tokens for delegated transfer', async () => {
		let amount = 100;
		let success;
      	try {
      		success = await dappToken.approve.call(accounts[1], amount, { from: accounts[0] });
      	} catch(error) {
      		success = false;
      	} finally {
      		assert.equal(success, true, 'should return true');
      	}

      	let receipt = await dappToken.approve(accounts[1], amount, { from: accounts[0] });

      	assert.equal(receipt.logs.length, 1, 'triggers one event');
      	assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
      	assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
      	assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
      	assert.equal(receipt.logs[0].args._value, amount, 'logs the transfer amount');

      	let allowance = await dappToken.allowance(accounts[0], accounts[1]);
      	assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');

	});

	it('handles delegated token transfers', async() => {
		fromAccount = accounts[2];
		toAccount = accounts[3];
		spendingAccount = accounts[4];

		await dappToken.transfer(fromAccount, 100, { from: accounts[0] });
		await dappToken.approve(spendingAccount, 10, { from: fromAccount });

		// Try transferring something larger than the sender balance
		try {
        	await dappToken.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
        	assert.fail();
      	} catch(error) {
        	assert(error.message.indexOf('revert') >= 0, "cannot transfer value larger than balance");
      	}

      	// Try transferring something larger than the approved amount
      	try {
        	await dappToken.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
        	assert.fail();
      	} catch(error) {
        	assert(error.message.indexOf('revert') >= 0, "cannot transfer value larger than allowance");
      	}

      	// Transfer successful
      	let success;
      	try {
      		success = await dappToken.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
      	} catch(error) {
      		success = false;
      	} finally {
      		assert.equal(success, true, 'should return true');
      	}

      	let receipt = await dappToken.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });

      	assert.equal(receipt.logs.length, 1, 'triggers one event');
      	assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      	assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
      	assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
      	assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');

      	let balance = await dappToken.balanceOf(fromAccount);
      	assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');

      	balance = await dappToken.balanceOf(toAccount);
      	assert.equal(balance.toNumber(), 10, 'deducts the amount from the receiving account');

      	let allowance = await dappToken.allowance(fromAccount, spendingAccount);
      	assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');

	});
});