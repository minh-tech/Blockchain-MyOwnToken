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
	uint256 totalTokenSupply;

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

	mapping (address => uint256) balanceMapping;
	mapping (address => mapping (address => uint256)) allowanceMapping;
	
	// Constructor
  	constructor(uint256 _initialSupply) public {

  		balanceMapping[msg.sender] = _initialSupply;
    	totalTokenSupply = _initialSupply;
  	}

  	// Returns the total token supply.
  	function totalSupply() public view returns(uint256 tokens) {
  		return totalTokenSupply;
  	}

  	// Returns the account balance of another account with address _owner
  	function balanceOf(address _owner) public view returns(uint256 balance) {
  		return balanceMapping[_owner];
  	}
  	
  	// Transfers _value amount of tokens to address _to, and MUST fire the Transfer event.
  	function transfer(address _to, uint256 _value) public returns(bool success) {
  		// Check the account have enough token
  		require(balanceMapping[msg.sender] >= _value);

  		// Update the balance
  		balanceMapping[msg.sender] -= _value;
  		balanceMapping[_to] += _value;

  		// Trigger the event
  		emit Transfer(msg.sender, _to, _value);

  		return true;
  	}

	// Transfers _value amount of tokens from address _from to address _to, and MUST fire the Transfer event.
  	function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {

  		// Check the balance and the allowance
  		require (balanceMapping[_from] >= _value);
  		require (allowanceMapping[_from][msg.sender] >= _value);

  		// Update the balance
  		balanceMapping[_from] -= _value;
  		balanceMapping[_to] += _value;

  		// // Update the allowance
  		allowanceMapping[_from][msg.sender] -= _value;
  		
  		// Trigger the event
  		emit Transfer(_from, _to, _value);

  		return true;
  	}

  	// Allows _spender to withdraw from your account multiple times, up to the _value amount.
  	function approve(address _spender, uint256 _value) public returns(bool success) {
  		
  		// If this function is called again it overwrites the current allowance with _value.
  		allowanceMapping[msg.sender][_spender] = _value;

  		// Trigger the event
  		emit Approval(msg.sender, _spender, _value);

  		return true;
  	}

  	// Returns the amount which _spender is still allowed to withdraw from _owner.
  	function allowance(address _owner, address _spender) public view returns(uint256 remaining) {

  		return allowanceMapping[_owner][_spender];
  	}
  	
}
