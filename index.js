const {
  Web3
} = require('web3');
const fs = require('fs');
const axios=require('axios')
const abi = require('./ABI/DecentraMind.json'); // Replace with your contract ABI and Bytecode
const abiTest = require('./ABI/test.json');
const config = require('./config.js')
const web3 = new Web3('https://goerli.infura.io/v3/2c33608bb3eb43b486e39604ad8cbe33');
const apiKey='SGG8YKMAKI88MCS1HAXXAC6JXD4ASD6AU4';
const compilerVersion='^0.8.9';
const optimization =0; // 1 for enabled, 0 for disabled
// Read the contents of config.js and Settings.js
// const configContent = fs.readFileSync(path.join(__dirname, 'config.js'), 'utf8');
// const DecentraMindABIPath = path.resolve(__dirname, abi);

// Read the bytecode from the file
const bytecodePath = './byteCode/decentraMind.txt'; // Update the path accordingly
const bytecode = fs.readFileSync(bytecodePath, 'utf8').trim();

const bytecodePathTest = './byteCode/test.txt'; // Update the path accordingly
const bytecodeTest = fs.readFileSync(bytecodePathTest, 'utf8').trim();

const deployeDecentraMind = async (name, symbol, decimals, totalSupply) => {
  console.log(`\x1b[32m\nDeploying DecentraMind... `);
  // Create a new contract instance
  // console.log("abi",abi);
  const contract = new web3.eth.Contract(abiTest);

  // Prepare the deploy transaction
  const deployTransaction = contract.deploy({
      data: '0x' + bytecodeTest,
      arguments: [name, symbol, decimals, totalSupply] // Your constructor arguments if any
  });
  // Estimate gas cost
  const nonce = await web3.eth.getTransactionCount(config.privateKeys[0].address);

  // Build the raw transaction
  const rawTransaction = {
      from: config.privateKeys[0].address,
      nonce: nonce,
      //maxFeePerGas: web3.utils.toHex(web3.utils.toWei(`${1.5}`, 'gwei')), // Max fee per gas (gasPrice)
      gas: 5500000,
      gasPrice: 30000000,
      // maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei(`${1.5}`, 'gwei')),
      // gasPrice: web3.utils.toHex(web3.utils.toWei(`${gasPrice}`, 'gwei')), // Use the same value for gasPrice
      data: deployTransaction.encodeABI(),
      // maxPriorityFeePerGas:web3.utils.toHex(web3.utils.toWei(`35`, 'gwei')),
      // maxFeePerGas:web3.utils.toHex(web3.utils.toWei(`100`, 'gwei'))
  };


  // Sign the transaction
  const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, config.privateKeys[0].privateKey);
  //console.log("signedTransaction",signedTransaction);
  // Deploy the contract
  let contractAddress = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
  await verifyContract(contractAddress.contractAddress,abiTest,name, symbol, decimals, totalSupply,bytecodeTest)
  return contractAddress.contractAddress;
}
async function verifyContract(contractAddress,contractAbi,name, symbol, decimals, totalSupply,bytecodeTest) {
  try {
      const web3 = new Web3();
      const response = await axios.post('https://api-goerli.etherscan.io/api', null, {
          params: {
              module: 'contract',
              action: 'verifysourcecode',
              apikey: apiKey,
              sourceCode: '0x'+bytecodeTest,
              contractaddress: contractAddress,
              sourceCode: contractAbi, // Submitting ABI as source code for verification
              contractname: 'Certs',
              compilerversion: compilerVersion,
              optimization: optimization,
              constructorArguements: [name, symbol, decimals, totalSupply], // If your contract has constructor arguments, specify them here
          },
      });

      console.log(response.data);
  } catch (error) {
      console.error('Error:', error.message);
  }
}
//deployeDecentraMind();
module.exports = {
  deployeDecentraMind
}