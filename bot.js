const TelegramBot = require('node-telegram-bot-api');
const token = '6973577485:AAGGPrZn4R-khKjWQW776Yv3_MW8KIqRIvg'; // Replace with your own bot token
var ethers = require('ethers');
var crypto = require('crypto');
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
let tokenName, tokenSymbol, tokenSupply, tokenDecimals, tokenMarketAddress, tokenCharityAddress, sellStructure = [],walletAdd,walletPrivateKey;

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
                                        try {
                                            bot.sendMessage(chatId, 'Enter Market Wallet Address');
                                            const tokenMarketWalletAddress = async (marketAddress) => {
                                                if (marketAddress.chat.id === chatId) {
                                                  tokenMarketAddress = marketAddress.text;
                                                    bot.removeListener('text', tokenMarketWalletAddress);
                                                    try {
                                                        bot.sendMessage(chatId, 'Enter Market Charity Address');
                                                        const tokenCharityAddressFunction = async (charityAddress) => {
                                                            if (charityAddress.chat.id === chatId) {
                                                                tokenCharityAddress = charityAddress.text;
                                                                bot.removeListener('text', tokenCharityAddressFunction);
                                                                try {
                                                                    bot.sendMessage(chatId, 'Enter Total Sell Tax');
                                                                    const tokenSellFunction = async (totalSell) => {
                                                                        if (totalSell.chat.id === chatId) {
                                                                            sellStructure.push(Number(totalSell.text)/10);
                                                                            bot.removeListener('text', tokenSellFunction);
                                                                            try {
                                                                                bot.sendMessage(chatId, 'Enter sell tax for Marketing');
                                                                                const tokenSellTaxForMarkting = async (marketTax) => {
                                                                                    if (marketTax.chat.id === chatId) {
                                                                                        sellStructure.push(Number(marketTax.text)/10);
                                                                                        bot.removeListener('text', tokenSellTaxForMarkting);
                                                                                        try {
                                                                                            bot.sendMessage(chatId, 'Enter sell tax for charity');
                                                                                            const tokenSellTaxForCharity = async (charityTax) => {
                                                                                                if (charityTax.chat.id === chatId) {
                                                                                                    sellStructure.push(Number(charityTax.text)/10);
                                                                                                    bot.removeListener('text', tokenSellTaxForCharity);
                                                                                                    try {
                                                                                                        bot.sendMessage(chatId, 'Enter sell tax for LP');
                                                                                                        const tokenSellTaxForLP = async (LPTax) => {
                                                                                                            if (LPTax.chat.id === chatId) {
                                                                                                                sellStructure.push(Number(LPTax.text)/10);
                                                                                                                bot.removeListener('text', tokenSellTaxForLP);
                                                                                                                try {
                                                                                                                    const keyboard = {
                                                                                                                        inline_keyboard: [
                                                                                                                            [{
                                                                                                                                text: 'Genrate Wallet',
                                                                                                                                callback_data: 'genrate_button_pressed'
                                                                                                                            }],
                                                                                                                            [{
                                                                                                                                text: 'Add Wallet',
                                                                                                                                callback_data: 'Add_button_pressed'
                                                                                                                            }],
                                                                                                                        ],
                                                                                                                    };
                                                                                                                    bot.sendMessage(chatId, 'Please choose one of the following options:', {
                                                                                                                        reply_markup: keyboard
                                                                                                                    });
                                                                                                                    
                                                                                                                } catch (error) {
                                                                                                                    console.log("error in rme", error)
                                                                                                                }
                                                                                                            }

                                                                                                        }
                                                                                                        bot.on('text', tokenSellTaxForLP);
                                                                                                        bot.on('callback_query', async (callbackQuery) => {
                                                                                                            const chatId = callbackQuery.message.chat.id;
                                                                                                            const data = callbackQuery.data;
                                                                                                    
                                                                                                            if (data === 'Add_button_pressed') {
                                                                                                                bot.sendMessage(chatId, 'Please Enter Your Private Key With Enough Funds Which is used to deploy the contract');
                                                                                                                const getPrivateKey = async (wKey) => {
                                                                                                                    if (wKey.chat.id === chatId) {
                                                                                                                        walletPrivateKey=wKey.text;
                                                                                                                        let wallet = new ethers.Wallet(walletPrivateKey);
                                                                                                                        walletAdd=wallet.address
                                                                                                                    }
                                                                                                                    bot.removeListener('text', getPrivateKey);
                                                                                                                    bot.sendMessage(chatId, `Afterwards please type /deploy to deploy your token.`)
                                                                                                                }
                                                                                                                bot.on('text', getPrivateKey);
                                                                                                            } else {
                                                                                                                bot.sendMessage(chatId, 'TheProBot generating wallet…');
                                                                                                                let addresses = await genrateWalletAddress();
                                                                                                                walletAdd = addresses[0];
                                                                                                                walletPrivateKey = addresses[1];
                                                                                                                bot.sendMessage(chatId, `Wallet Generated Successfully.\n\nAddress: ${walletAdd}\n\nPrivateKey: 0x${walletPrivateKey}\nPlease send 0.0476 BNB to the above address to deploy your token.\nAfterwards please type /deploy to deploy your token.`)
                                                                                                            }
                                                                                                        });
                                                                                                    } catch (error) {
                                                                                                        console.log("Error", error);
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                            bot.on('text', tokenSellTaxForCharity);
                                                                                        } catch (error) {
                                                                                            console.log("eeeee", error);
                                                                                        }
                                                                                    }
                                                                                }
                                                                                bot.on('text', tokenSellTaxForMarkting);
                                                                            } catch (error) {
                                                                                console.log("error", error)
                                                                            }
                                                                        }
                                                                    }
                                                                    bot.on('text', tokenSellFunction);
                                                                } catch (error) {
                                                                    console.log("error in total sell", error)
                                                                }
                                                            }
                                                        }
                                                        bot.on('text', tokenCharityAddressFunction)
                                                    } catch (error) {
                                                        console.log("Error in charity Address", error);
                                                    }
                                                }
                                            }
                                            bot.on('text', tokenMarketWalletAddress)
                                        } catch (error) {
                                            console.log("Error in Market Address", error)
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


bot.onText(/\/deploy/, async (msg) => {
    let chatId = msg.from.id;
    bot.sendMessage(chatId, `Deploying Token On ETH with following Deatils\n\nName: ${tokenName}\nSymbol: ${tokenSymbol}\nTotal Supply: ${tokenSupply}\nToken Decimals: 18`)
    try {
        let contractaddress = await deployeDecentraMind(tokenName, tokenSymbol, tokenSupply,tokenCharityAddress,tokenMarketAddress,sellStructure,walletAdd,walletPrivateKey);
        bot.sendMessage(chatId, `Contract Deployed Successfully: ${contractaddress}`);
        bot.sendMessage(chatId, `click On this: https://goerli.etherscan.io/address/${contractaddress}`);
    } catch (error) {
        console.error('Error deploying smart contract:', error);
        bot.sendMessage(chatId, 'Sorry, there was an error deploying Smart contract.');
    }
})


const genrateWalletAddress = async () => {
    var id = crypto.randomBytes(32).toString('hex');
    var privateKey = "0x" + id;
    let addreses = [];

    var wallet = new ethers.Wallet(privateKey);
    return addreses = [wallet.address, privateKey]
}