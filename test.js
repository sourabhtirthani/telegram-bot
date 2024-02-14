try{
    console.log("Hello");
    bot.sendMessage(chatId,'Enter Total Sell Tax of token');
    const tokenTotalFees=async(totalFees)=>{
      if(totalFees.chat.id===chatId){
        feesStructure.push(totalFees.text)
        bot.removeListener('text',tokenTotalFees);
        try{
          bot.sendMessage(chatId,'Enter For Market Address');
          const tokenMarketFees=async(marketFees)=>{
            if(marketFees.chat.id===chatId){
              feesStructure.push(marketFees.text);
              bot.removeListener('text',tokenMarketFees);
              try{
                bot.sendMessage(chatId,'Enter For Charity Address');
                const tokenCharityFees=async(charityFees)=>{
                  if(charityFees.chat.id===chatId){
                    feesStructure.push(charityFees.text);
                  }
                  bot.removeListener('text',tokenCharityFees);
                  try{
                    bot.sendMessage(chatId,'Enter For Lp Address');
                    const tokenLPFees=async(lpFees)=>{
                      if(lpFees.chat.id===chatId){
                        feesStructure.push(lpFees.text)
                          const keyboard = {
                            inline_keyboard: [
                                [{ text: 'Genrate Wallet', callback_data: 'genrate_button_pressed' }],
                                [{ text: 'Add Wallet', callback_data: 'Add_button_pressed' }],
                            ],
                        };
                          bot.sendMessage(chatId,'Please choose one of the following options:',{ reply_markup: keyboard }); 
                      }
                      bot.removeListener('text',tokenLPFees);
                    }
                    bot.on('text',tokenLPFees);
                  }catch(error){
                    console.log("error in lp fees",error);
                  }
                }
                bot.on('text',tokenCharityFees);
              }catch(error){
                console.log("error in charity Fees",error);
              }
            }
          }
          bot.removeListener('text',tokenMarketFees);
        }catch(error){
          console.log("error in marketFees",error);
        }
      }
    }
    bot.on('text',tokenTotalFees);
  }catch(error){
    console.log("error in Fees",error)
  }



  bot.on('callback_query',async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    if (data === 'Add_button_pressed') {
        bot.sendMessage(chatId, 'Please Enter Your Private Key With Enough Funds Which is used to deploy the contract');
    }else{
        bot.sendMessage(chatId, 'TheProBot generating wallet…');
        let addresses=await genrateWalletAddress();
        walletAddress=addresses[0];
        walletPrivateKey=addresses[1];
        bot.sendMessage(chatId,`Wallet Generated Successfully.\n\nAddress: ${addresses[0]}\n\nPrivateKey: 0x${addresses}\nPlease send 0.0476 BNB to the above address to deploy your token.\nAfterwards please type /deploy to deploy your token.
        `)
    }
  });