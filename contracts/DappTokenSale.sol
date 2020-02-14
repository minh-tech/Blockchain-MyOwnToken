pragma solidity ^0.5.16;

import "./DappToken.sol";

/**
 * The DappTokenSale contract does this and that...
 */
contract DappTokenSale {

	address payable admin;
	DappToken public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokensSold;

	event Sell(
		address _buyer,
		uint256 _amount
	);

	constructor(DappToken _tokenContract, uint256 _tokenPrice) public {

	  	admin = msg.sender;
	  	tokenContract = _tokenContract;
	  	tokenPrice = _tokenPrice;
  	}

  	// Return x * y or an exception in case of uint overflow.
  	function multiply(uint x, uint y) internal pure returns(uint z) {
  		require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
  	}
  	
  	// Buy the number of tokens from this contract
  	function buyTokens(uint256 _numberOfTokens) public payable {

  		require (msg.value == multiply(_numberOfTokens, tokenPrice));
  		require (tokenContract.balanceOf(address(this)) >= _numberOfTokens);

  		// Transfer _numberOfTokens to sender, return true
  		require (tokenContract.transfer(msg.sender, _numberOfTokens));
  				
  		tokensSold += _numberOfTokens;

  		emit Sell(msg.sender, _numberOfTokens);
  	}

  	// Only admin can end this contract
  	function endSale() public {
  		
  		// Admin can end sale
  		require (msg.sender == admin);
  		// Transfer all remain tokens to admin
  		require (tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));

  		// End the contract and transfer ethers to admin
  		selfdestruct(admin);
  	}
}
