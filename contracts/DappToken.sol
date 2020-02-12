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

	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
	);


	mapping (address => uint256) public balanceOf;
	mapping (address => mapping (address => uint256)) public allowance;
	
	

	// Constructor
  	constructor(uint256 _initialSupply) public {

  		balanceOf[msg.sender] = _initialSupply;
    	totalSupply = _initialSupply;
  	}

  	// Transfer the amount of tokens to an account
  	function transfer(address _to, uint256 _value) public returns(bool success) {
  		// Check the account have enough token
  		require(balanceOf[msg.sender] >= _value);

  		balanceOf[msg.sender] -= _value;
  		balanceOf[_to] += _value;

  		// Trigger the event
  		emit Transfer(msg.sender, _to, _value);

  		return true;
  	}
 	
  	// function allowance(address _owner, address _spender) public view returns(uint256 remaining) {

  	// 	return allowanceMapping[_owner][_spender];
  	// }
  	

  	// Approve the transfer
  	function approve(address _spender, uint256 _value) public returns(bool success) {
  		
  		allowance[msg.sender][_spender] = _value;

  		emit Approval(msg.sender, _spender, _value);

  		return true;
  		
  	}
  	
  	// Transfer the amount of tokens from an account to another account
  	function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {

  		// Check the balance and the allowance
  		require (balanceOf[_from] >= _value);
  		require (allowance[_from][msg.sender] >= _value);

  		// Update the balance
  		balanceOf[_from] -= _value;
  		balanceOf[_to] += _value;

  		// // Update the allowance
  		allowance[_from][msg.sender] -= _value;
  		
  		// Trigger the event
  		emit Transfer(_from, _to, _value);

  		return true;
  	}
  	

  	

}
