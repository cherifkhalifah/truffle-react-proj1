// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleContract {
    string public myString;
    
    function setString(string memory _newValue) public {
        myString = _newValue;
    }
    
    // function getString() public view returns (string memory) {
    //     return myString;
    // }
    function getString() public view returns (string memory) {
        return string(abi.encodePacked(myString, " from getString"));
    }
}
