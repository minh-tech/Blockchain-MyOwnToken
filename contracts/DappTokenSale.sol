pragma solidity ^0.5.16;

import "./DappToken.sol";

/**
 * The DappTokenSale contract does this and that...
 */
contract DappTokenSale {

	address admin;
	DappToken public tokenContract;
	uint256 public tokenPrice;

  constructor(DappToken _tokenContract, uint256 _tokenPrice) public {

  	admin = msg.sender;
  	tokenContract = _tokenContract;
  	tokenPrice = _tokenPrice;

  }
}
