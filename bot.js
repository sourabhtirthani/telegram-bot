const TelegramBot = require('node-telegram-bot-api');
const token = '6973577485:AAGGPrZn4R-khKjWQW776Yv3_MW8KIqRIvg'; // Replace with your own bot token
const bot = new TelegramBot(token, {
    polling: true
});
const {
    deployeDecentraMind
} = require('./index')

bot.onText(/\/start/, (msg) => {
    let chatId = msg.from.id;
    // let name = msg.from.first_name;

    bot.sendMessage(chatId, `Welcome to The Pro Contract Deployer \n\n\tPlease select a token \n\n 1. Test`)
})
let tokenName,tokenSymbol,tokenSupply,tokenDecimals;

bot.onText(/\/Test/, async (msg) => {
    let chatId = msg.from.id;
    // bot.sendMessage(chatId, `Enter Your Token Name,Symbol,Decimals,TotalSupply,MarketWallet,DevWallet  \n\n\t(i.e TokenName-TokenSymbol-TokenDecimals-TokenTotalSupply-marketWallet-devWallet)`)
    bot.sendMessage(chatId, `Enter Your Token Name:`)
    const tokenNameListener = async (responseMsg) => { // this is the first function
        if (responseMsg.chat.id === chatId) {
          tokenName = responseMsg.text;
            bot.removeListener('text', tokenNameListener);
            try {
                bot.sendMessage(chatId, 'Enter Your Token Symbol');
                const tokenSymbolFunction = async (symbol) => {
                    if (symbol.chat.id === chatId) {
                        tokenSymbol = symbol.text;
                        bot.removeListener('text', tokenSymbolFunction); //and then again remove the listner here 
                        try {
                            bot.sendMessage(chatId, 'Enter Your Token Total supply');
                            const tokenSupplyFunction = async (supply) => {
                              if (supply.chat.id === chatId) {
                                tokenSupply = supply.text;
                              bot.removeListener('text', tokenSupplyFunction); //and then again remove the listner here
                              }
                              try{  
                                bot.sendMessage(chatId,'Enter Decimals of token');
                                const tokendecimalsFunction=async(decimals)=>{
                                  if(decimals.chat.id===chatId){
                                    tokenDecimals=decimals.text;
                                    bot.sendMessage(chatId,'Enter /deploy Command to deploy the token');
                                    bot.removeListener('text',tokendecimalsFunction);
                                  }
                                }
                                bot.on('text',tokendecimalsFunction);
                              }catch(error){
                                console.log("error in total supply",error)
                              }
                            }
                            bot.on('text', tokenSupplyFunction);
                        } catch (error) {
                            console.log("error in second fucntion", error);
                        }
                    }
                };
                bot.on('text', tokenSymbolFunction);
            } catch (error) {
                console.log("error in name fucntion", error);
            }
        }
    }
    bot.on('text', tokenNameListener); // Listen for the user's response
});


bot.onText(/\/deploy/, async(msg) => {
  let chatId = msg.from.id;
  // let name = msg.from.first_name;
  bot.sendMessage(chatId, `Deploying Token On ETH with following Deatils\n\nName: ${tokenName}\nSymbol: ${tokenSymbol}\nTotal Supply: ${tokenSupply}\nToken Decimals: ${tokenDecimals}`)
  try {
              let contractaddress=await deployeDecentraMind(tokenName,tokenSymbol,tokenSupply,tokenDecimals);
              bot.sendMessage(chatId, `Contract Deployed Successfully: ${contractaddress}`);
              bot.sendMessage(chatId, `click On this: https://goerli.etherscan.io/address/${contractaddress}`);
             } catch (error) {
                  console.error('Error deploying smart contract:', error);
                  bot.sendMessage(chatId, 'Sorry, there was an error deploying Smart contract.');
          }
})