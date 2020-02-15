const DappToken = artifacts.require("DappToken");
const DappTokenSale = artifacts.require("DappTokenSale");

module.exports = (deployer) => {

	// The total token supply.
	var totalSupply = 1000000;
	// Token price is 0.001 Ether
	var tokenPrice = 1000000000000000;

  	deployer.deploy(DappToken, totalSupply).then(() => {
  		return deployer.deploy(DappTokenSale, DappToken.address, tokenPrice);
  	});
};
