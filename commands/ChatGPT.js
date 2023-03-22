
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const { OpenAIApiKey } = require('../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Use ChatGPT')
    .addStringOption(option => option.setName('prompt').setDescription('Prompt sent to ChatGPT. This costs me monies, please be nice :)').setRequired(true)),

    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        console.log(prompt);

        await interaction.deferReply();  // tell discord to wait 15 min 

        // Make request to OpenAI
        const configuration = new Configuration({
            apiKey: OpenAIApiKey,
          });
        const openai = new OpenAIApi(configuration);

        // Retreive language model and create completion
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: `\`${prompt}\``}],
          });
        
        response  = completion.data.choices[0].message.content;
        response = response.replace(/\n\n/, " ");    // message content from ChatGPT returns with two new lines, replace that with "ChatGPT: "
        console.log(response);

        const sizeCheck = `${interaction.user.username}: ${prompt} \n\n ChatGPT: ${response}`;
        
        // Discord can only send messages that contain less than 200 characters. Check this before sending. 
        if (sizeCheck.length > 2000){
          // create .txt file. send txt file and delete from server
          // if cannot delete txt from java script, have javascript call a bash file

          // Create the file
          const fileName = 'response.txt';
          const fileContent = response; 
          createTextFile(fileName, fileContent);

          // Send the file
          const attachmentPath = path.join(process.cwd(), 'send_files', fileName);
          const attachment = new AttachmentBuilder(attachmentPath);
          
          interaction.editReply({ files: [attachment] });

        } else {
          await interaction.editReply({ content: `${interaction.user.username}: \`${prompt}\` \n\n ChatGPT:\`${response}\``});
        }
    },
}; // end main

// createTextFile Description:
// Take fileName and fileContnent in as arguments. The file name will always be response.txt and the file path will be send_files
// This function will then create a file in the send_files directory and populate the .txt with the resonse from chatGPT if it is greater than 2000 characters. 
function createTextFile(fileName, fileContent) {
  const folderName = 'send_files';
  const folderPath = path.join(process.cwd(), folderName);
  const filePath = path.join(folderPath, fileName);

  // If the folder does not exist create it
  try {
    if (!fs.existsSync(folderPath)){
      fs.mkdirSync(folderPath);
      console.log(`Folder "${folderName}" created.`);
    }

    // Create a txt file in the folderPath direcory with the chatGPT content 
    fs.writeFileSync(filePath, fileContent);
    console.log(`File "${fileName}" created...\n`);

  } catch (err) {
    console.error(`Error creating file "${fileName}`);
  }
} // end createTextFile()