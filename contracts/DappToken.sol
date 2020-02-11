pragma solidity ^0.5.16;

/**
 * The DappToken contract does this and that...
 * Following the standard at
 * https://eips.ethereum.org/EIPS/eip-20
 */
contract DappToken {

	string public name = 'Minh Token';
	string public symbol = 'MiT';
	string public standard = 'Minh Token v1.0';
	uint256 public totalSupply;

	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
		);

	mapping (address => uint256) public balanceOf;
	

	// Constructor
  	constructor(uint256 _initialSupply) public {

  		balanceOf[msg.sender] = _initialSupply;
    	totalSupply = _initialSupply;
  	}

  	// Transfer
  	function transfer(address _to, uint256 _value) public returns(bool success) {
  		// Check the account have enough token
  		require(balanceOf[msg.sender] >= _value);

  		balanceOf[msg.sender] -= _value;
  		balanceOf[_to] = _value;

  		// Trigger the event
  		emit Transfer(msg.sender, _to, _value);

  		return true;
  		
  	}
  	

}
