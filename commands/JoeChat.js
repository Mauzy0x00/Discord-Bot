
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const OpenAI = require("openai");
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('joe_chat')
    .setDescription('Talk to Joe Rogan')
    .addStringOption(option => option.setName('prompt').setDescription('Talk with Joe Rogan. This costs me monies, please be nice :)').setRequired(true)),

    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        console.log(prompt);

        try {
          await interaction.deferReply();  // tell discord to wait 15 min 

          // Make request to OpenAI
          const openai = new OpenAI();

          // Retreive language model and create completion
          const completion = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [{role: "user", content: `Respond to the following as if you are the great interviewer Joe Rogan. To the best of your abilities, try to encapsulate this legend in your response: ${prompt}. `}],
            });
          
          response  = completion.choices[0].message.content;;
          response = response.replace(/\n\n/, " ");    // message content from ChatGPT returns with two new lines, replace that with "ChatGPT: "
          console.log(response);

          const sizeCheck = `${interaction.user.username}: ${prompt} \n\n Joe: ${response}`;
          

          // Discord can only send messages that contain less than 200 characters. Check this before sending. 
          if (sizeCheck.length >= 2000){
            // create .txt file. send txt file and delete from server
            // if cannot delete txt from java script, have javascript call a bash file

            // Create the file
            const fileName = 'response.txt';
            const fileContent = `Prompt: \n${prompt} \n\n Response:\n ${response}`; 
            createTextFile(fileName, fileContent);

            // Send the file
            const attachmentPath = path.join(process.cwd(), 'send_files', fileName);
            const attachment = new AttachmentBuilder(attachmentPath);
            
            interaction.editReply({ files: [attachment] });

          } 
          // Embeded fields can only contain 1024 characters
          else if(sizeCheck.length >= 1024) {
            
            await interaction.editReply({ content: `\*\*${interaction.user.username}:\*\* \n ${prompt} \n\n \*\*Joe:\*\* \n ${response}`});
          
          } else { // end size check

            const GPTresponseEmbed = new EmbedBuilder()
              .setColor(0x00C995)
              .setTitle(`${interaction.user.username}:`)
              .setThumbnail('https://www.imore.com/sites/imore.com/files/styles/large/public/field/image/2020/05/joe-rogan.jpg')
              .setDescription(prompt)      
              .setAuthor({ name: 'Joe Rogan', iconURL: 'https://radiotoday.com.au/wp-content/uploads/The-Joe-Rogan-Experience.jpg'})
              .addFields({ name: 'Joe:', value: response })
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