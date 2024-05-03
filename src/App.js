import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SimpleContractABI from './SimpleContract.json'; // Replace 'SimpleContractABI.json' with the actual ABI file

const SimpleContractInteraction = () => {
  const [contract, setContract] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          // Get the contract instance
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = SimpleContractABI.networks[networkId];
          const contractInstance = new web3.eth.Contract(
            SimpleContractABI.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);
          // Get and display the current string value
          await getString();
        } catch (error) {
          console.error('Error initializing contract', error);
        }
      }
    };

    initContract();
  }, []);

  const getString = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const currentValue = await contract.methods.getString().call();
      setCurrentValue(currentValue);
      setLoading(false);
      console.log("Fetched string value:", currentValue); // Logging the fetched string value
    } catch (error) {
      console.error('Error getting string value', error);
      setLoading(false);
    }
  };
  

  const handleSetString = async () => {
    if (!contract) return;
    try {
      await contract.methods.setString(newValue).send({ from: window.ethereum.selectedAddress });
      // Update current value after setting the new value
      await getString();
    } catch (error) {
      console.error('Error setting string value', error);
    }
  };

  const handleChange = (event) => {
    setNewValue(event.target.value);
  };

  return (
    <div>
  <h2>Simple Contract Interaction</h2>
  {loading ? (
    <p>Loading...</p>
  ) : (
    <div>
      <p>Current Value: {currentValue}</p>
      <input type="text" value={newValue} onChange={handleChange} />
      <button onClick={handleSetString}>Set Value</button>
      <p>Get Value: {currentValue}</p> {/* Displaying the current value obtained from the contract */}
    </div>
  )}
</div>

  );
};

export default SimpleContractInteraction;
