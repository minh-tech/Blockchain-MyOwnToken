App = {
	contracts: {},
	account: '0x0',
	tokenPrice: 1,
	tokensSold: 1,
	tokensAvailable: 1,
	currentBalance: 1,

	init: async () => {

		return App.initWeb3();
	},

	initWeb3: async () => {

		// Modern dapp browsers...
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			// Request account access if needed
			await window.ethereum.enable();
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		}
		// Non-dapp browsers...
		else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
		}

		return App.initContract();
	},

	initContract: async () => {

		const jsonTokenSale = await $.getJSON("DappTokenSale.json");
		const jsonToken = await $.getJSON("DappToken.json");

		const networkId = await web3.eth.net.getId();
		const dataTokenSale = jsonTokenSale.networks[networkId];
		const dataToken = jsonToken.networks[networkId];

		// Check the contract is self-destructed
		var code = await web3.eth.getCode(dataTokenSale.address)
		if (code == '0x') {
			$('#notification').html('This Sale was ended. Please come back later.');
		} else {
		
			App.contracts.DappTokenSale = new web3.eth.Contract(jsonTokenSale.abi, dataTokenSale.address);
			App.contracts.DappToken = new web3.eth.Contract(jsonToken.abi, dataToken.address);

			// Listen for events emitted from the contract
			App.contracts.DappToken.events.Transfer({}, {
				toBlock: 'latest'
			}, (error, event) => {
				console.log('Transfer Event');
				App.render();
			});

			return App.render();
		}
	},

	render: async () => {

		// Get and show the account
		App.account = (await web3.eth.getAccounts())[0];

		// Get DappTokenSale and DappToken contracts
		var dappTokenSale = App.contracts.DappTokenSale;
		var dappToken = App.contracts.DappToken;

		App.currentBalance = await dappToken.methods.balanceOf(App.account).call();
		$('.dapp-balance').html(App.currentBalance);

		var isAdmin = await dappTokenSale.methods.isAdmin(App.account).call();
		if (isAdmin) {

			$('#adminAddress').html("Admin: " + App.account);

			$("#loader").hide();
			$("#content").hide();
			$("#admin").show();
		} else {
			$('#accountAddress').html("Your Account: " + App.account);

			// Get Token price from contract
			App.tokenPrice = await dappTokenSale.methods.tokenPrice().call();
			$('.token-price').html(web3.utils.fromWei(App.tokenPrice, 'Ether'));

			// Get tokens sold from contract
			App.tokensSold = await dappTokenSale.methods.tokensSold().call();
			$('.tokens-sold').html(App.tokensSold);

			App.tokensAvailable = await dappToken.methods.balanceOf(dappTokenSale._address).call();
			$('.tokens-available').html(App.tokensAvailable);

			// Handle progress bar
			var progressPercent = Math.ceil(App.tokensSold * 100 / App.tokensAvailable);
			$('#progress').css('width', progressPercent + '%');

			$("#loader").hide();
			$("#content").show();
		}
	},

	buyTokens: async () => {

		$("#loader").show();
		$("#content").hide();

		var numberOfTokens = $('#numberOfTokens').val();
		var dappTokenSale = App.contracts.DappTokenSale;
		await dappTokenSale.methods.buyTokens(numberOfTokens).send({
			from: App.account, 
			value: numberOfTokens*App.tokenPrice,
			gas: 500000
		});
		$('form').trigger('reset')
	},

	transferTokens: async () => {

		$("#loader").show();
		$("#admin").hide();

		App.tokensAvailable = $('#tokensAvailable').val();
		var dappTokenSale = App.contracts.DappTokenSale;
		var dappToken = App.contracts.DappToken;
		await dappToken.methods.transfer(dappTokenSale._address, App.tokensAvailable).send({
			from: App.account,
			gas: 500000
		});
		$('form').trigger('reset');
	},

	endSale: async () => {

		$("#loader").show();
		$("#admin").hide();

		var dappTokenSale = App.contracts.DappTokenSale;
		await dappTokenSale.methods.endSale().send({
			from: App.account,
			gas: 500000
		});
		
		$('#notification').html('This Sale was ended. Please come back later.');
	}
}

$(() => {
	$(window).load(() => {
		App.init();
	});
});