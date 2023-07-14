
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const { OpenAIApiKey } = require('../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('orc_chat')
    .setDescription('Chat with Grak')
    .addStringOption(option => option.setName('prompt').setDescription('Speak with Grak the Orc. This costs me monies, please be nice :)').setRequired(true)),

    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        console.log(prompt);

        try {
          await interaction.deferReply();  // tell discord to wait 15 min 

          // Make request to OpenAI
          const configuration = new Configuration({
              apiKey: OpenAIApiKey,
            });
          const openai = new OpenAIApi(configuration);

          // Retreive language model and create completion
          const completion = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: [{role: "user", content: `Respond to the following as if you are an impatient Orc named Grak: ${prompt}. `}],
            });
          
          response  = completion.data.choices[0].message.content;
          response = response.replace(/\n\n/, " ");    // message content from ChatGPT returns with two new lines, replace that with "ChatGPT: "
          console.log(response);

          const sizeCheck = `${interaction.user.username}: ${prompt} \n\n Grak: ${response}`;
          

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

          } 
          // Embeded fields can only contain 1024 characters
          else if(sizeCheck.length > 1024) {
            
            await interaction.editReply({ content: `\*\*${interaction.user.username}:\*\* \n ${prompt} \n\n \*\*Grak:\*\* \n ${response}`});
          
          } else { // end size check

            const GPTresponseEmbed = new EmbedBuilder()
              .setColor(0x00C995)
              .setTitle(`${interaction.user.username}:`)
              .setDescription(prompt)
              .setAuthor({ name: 'Grak Chat', iconURL: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/88e39bc8-2533-40fc-bccd-5fe75d3e2b24/dabpjs1-9519b278-20e7-4866-9ca0-59ecbd6a1660.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi84OGUzOWJjOC0yNTMzLTQwZmMtYmNjZC01ZmU3NWQzZTJiMjQvZGFicGpzMS05NTE5YjI3OC0yMGU3LTQ4NjYtOWNhMC01OWVjYmQ2YTE2NjAuanBnIn1dXX0.EY0NRW_z-5mcP5XUZxEeIahQ11po6SkRWAOE4mzYkeg'})
              .addFields({ name: 'Grak:', value: response })
              .setFooter({ text: 'Response by ChatGPT 3.5 Turbo'});

            await interaction.editReply({ embeds: [GPTresponseEmbed]});
          
          }
        } catch(Error) {
          console.error(Error);
        }
    },
}; // end module


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