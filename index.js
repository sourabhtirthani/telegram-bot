const {
  Web3
} = require('web3');
const fs = require('fs');
const HDWalletProvider = require("truffle-hdwallet-provider");
const axios=require('axios')
const abiBuyBack = require('./ABI/buyBack.json'); // Replace with your contract ABI and Bytecode
const abiTest = require('./ABI/MOF.json');
const apiKey='SGG8YKMAKI88MCS1HAXXAC6JXD4ASD6AU4';
const compilerVersion='^0.8.9';
const optimization =0; // 1 for enabled, 0 for disabled
let provider;

const bytecodePathTest = './byteCode/MOF.txt'; // Update the path accordingly
const bytecodeTest = fs.readFileSync(bytecodePathTest, 'utf8').trim();


const bytecodePathBuyBack = './byteCode/buyBack.txt'; // Update the path accordingly
const bytecodeBuyBack = fs.readFileSync(bytecodePathBuyBack, 'utf8').trim();

const contractByteCode='./sourcecode/test.sol'
const bytecodeTestcontract = fs.readFileSync(contractByteCode, 'utf8').trim();

const deployeStandardToken = async (name, symbol,totalSupply,charityAddress,marketAddress,sellStructure,walletAdd,walletKey) => {
  console.log(`\x1b[32m\nDeploying DecentraMind... `);

  provider= new HDWalletProvider(walletKey, `wss://goerli.infura.io/ws/v3/114591cebd3b4ba2a0e4bb9eee913b7e`);
  const web3 = new Web3(provider);

  const contract = new web3.eth.Contract(abiTest);
  const decimals=18
  // Prepare the deploy transaction
  const deployTransaction = contract.deploy({
      data: '0x' + bytecodeTest,
      arguments: [name, symbol, totalSupply.toString(),decimals,marketAddress,charityAddress,sellStructure] // Your constructor arguments if any
  });
  // Estimate gas cost
  const nonce = await web3.eth.getTransactionCount(walletAdd);
  const gasPrice = await web3.eth.getGasPrice();

  // Build the raw transaction
  const rawTransaction = {
      from: walletAdd,
      nonce: nonce,
      //maxFeePerGas: web3.utils.toHex(web3.utils.toWei(`${1.5}`, 'gwei')), // Max fee per gas (gasPrice)
      gas: 7500000,
      gasPrice: gasPrice,
      // maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei(`${1.5}`, 'gwei')),
      // gasPrice: web3.utils.toHex(web3.utils.toWei(`${gasPrice}`, 'gwei')), // Use the same value for gasPrice
      data: deployTransaction.encodeABI(),
      // maxPriorityFeePerGas:web3.utils.toHex(web3.utils.toWei(`35`, 'gwei')),
      // maxFeePerGas:web3.utils.toHex(web3.utils.toWei(`100`, 'gwei'))
  };


  // Sign the transaction
  const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction,walletKey);
  //console.log("signedTransaction",signedTransaction);
  // Deploy the contract
  let contractAddress = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
  //await verifyContract(contractAddress.contractAddress,abiTest,name, symbol, decimals, totalSupply,bytecodeTest)
  return contractAddress.contractAddress;
}

const deployeBuyBackToken = async (name, symbol,totalSupply,tokenBuyBackAdd,tokenBuyBackWalletAddress,walletAdd,walletKey) => {
 try{
   provider= new HDWalletProvider(walletKey, `https://goerli.infura.io/v3/114591cebd3b4ba2a0e4bb9eee913b7e`);
   const web3 = new Web3(provider);
   const contract = new web3.eth.Contract(abiBuyBack);
   // Prepare the deploy transaction
   const deployTransaction = contract.deploy({
     data: '0x' + bytecodeBuyBack,
     arguments: [name, symbol, totalSupply.toString(),tokenBuyBackAdd,tokenBuyBackWalletAddress] // Your constructor arguments if any
    });
    // Estimate gas cost
    const nonce = await web3.eth.getTransactionCount(walletAdd);
    console.log(`\x1b[32m\nDeploying Buy Back hello... `);
  const baseFee = await web3.eth.getFeeHistory('0x1', 'latest', [])

  const maxFeePerGas = Number(baseFee.baseFeePerGas[0]); // Adjust multiplier as needed
  let gasLimit =await web3.eth.estimateGas({
    to: walletAdd, 
    data:  deployTransaction.encodeABI()
 });  
const gasPrice = await web3.eth.getGasPrice();

  // Build the raw transaction
  const rawTransaction = {
      from: walletAdd,
      nonce: nonce,
      //maxFeePerGas: maxFeePerGas.toString(), // Max fee per gas (gasPrice)
      gas: web3.utils.toHex(7500000),
      gasPrice: gasPrice,
     // maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei(`${maxFeePerGas}`, 'gwei')),
      // gasPrice: web3.utils.toHex(web3.utils.toWei(`${gasPrice}`, 'gwei')), // Use the same value for gasPrice
      data: deployTransaction.encodeABI(),
      // maxPriorityFeePerGas:web3.utils.toHex(web3.utils.toWei(`35`, 'gwei')),
      // maxFeePerGas:web3.utils.toHex(web3.utils.toWei(`100`, 'gwei'))
  };


  // Sign the transaction
  const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction,walletKey);
  //console.log("signedTransaction",signedTransaction);
  // Deploy the contract
  let contractAddress = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
  //await verifyContract(contractAddress.contractAddress,abiTest,name, symbol, decimals, totalSupply,bytecodeTest)
  return contractAddress.contractAddress;
}catch(error){
  console.error(error)
}
}

async function verifyContract(contractAddress,contractAbi,name, symbol, decimals, totalSupply,bytecodeTest) {
  try {
      const web3 = new Web3();
      const response = await axios.post('https://api-goerli.etherscan.io/api', null, {
        params: {
          module: 'contract',
          action: 'verifysourcecode',
          apikey: apiKey,
      },
      data: {
              sourceCode: bytecodeTestcontract,
              contractaddress: contractAddress,
              // sourceCode: contractAbi, // Submitting ABI as source code for verification
              contractname: 'Certs',
              compilerversion: compilerVersion,
              constructorArguements: [name, symbol, decimals, totalSupply], // If your contract has constructor arguments, specify them here
          },
      });

      console.log(response.data);
  } catch (error) {
      console.error('Error:', error);
  }
}

async function getFeeDataWithDynamicMaxPriorityFeePerGas() {
  let maxFeePerGas = null
  let maxPriorityFeePerGas = null
  let gasPrice= null

  const [block, eth_maxPriorityFeePerGas] = await Promise.all([
    await Web3.getBlock("latest"),
    await Web3.send("eth_maxPriorityFeePerGas", []),
  ])

  if (block && block.baseFeePerGas) {
    maxPriorityFeePerGas = BigNumber.from(eth_maxPriorityFeePerGas);
    if (maxPriorityFeePerGas) {
      maxFeePerGas = block.baseFeePerGas.mul(2).add(maxPriorityFeePerGas);
    }
  }

  return { maxFeePerGas, maxPriorityFeePerGas, gasPrice }
}
// deployeBuyBackToken("abcd","abc",5000,"0xD153539F893d549B4Bb6D746F609f6e46EEB8dE8","0xD153539F893d549B4Bb6D746F609f6e46EEB8dE8","0x9d0893114A813f8418Cf9EfEf5D8E9DdAB78AA9e","ceedca0398e87e713c72fcd5fb1feb8b132bfbb1beebb60ae06d0ba1a0ef780f");
module.exports = {
  deployeStandardToken,
  deployeBuyBackToken
}