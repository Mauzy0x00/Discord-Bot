
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const OpenAI = require("openai");
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('doc_chat')
    .setDescription('Talk to Dr.Disrespect')
    .addStringOption(option => option.setName('prompt').setDescription('Talk to the 2x. This costs me monies, please be nice :)').setRequired(true)),

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
              messages: [{role: "user", content: `Respond to the following as if you are the 2x back to back 1995 1996 video game champ Dr. Disrespect. Try to encapsulate this legend and his vulgarities in your response: : ${prompt} `}],
            });
          
          response  = completion.choices[0].message.content;
          response = response.replace(/\n\n/, " ");    // message content from ChatGPT returns with two new lines, replace that with "ChatGPT: "
          console.log(response);

          const sizeCheck = `${interaction.user.username}: ${prompt} \n\n Doc: ${response}`;
          

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
            
            await interaction.editReply({ content: `\*\*${interaction.user.username}:\*\* \n ${prompt} \n\n \*\*Doc:\*\* \n ${response}`});
          
          } else { // end size check

            const GPTresponseEmbed = new EmbedBuilder()
              .setColor(0x00C995)
              .setTitle(`${interaction.user.username}:`)
              .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.ccn.com%2Fwp-content%2Fuploads%2F2020%2F07%2FDr-Disrespect-Twitch-e1594888751704.jpg&f=1&nofb=1&ipt=ffd77e6330f7f140bac9662c59075fb6b4beea0069896c19fefa72974d9beef0&ipo=images')
              .setDescription(prompt)      
              .setAuthor({ name: 'Dr. Disrespect', iconURL: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fres.cloudinary.com%2Fteepublic%2Fimage%2Fprivate%2Fs--9ngB6RlE--%2Ft_Preview%2Fb_rgb%3A191919%2Cc_limit%2Cf_auto%2Ch_630%2Cq_90%2Cw_630%2Fv1597762212%2Fproduction%2Fdesigns%2F13183552_0.jpg&f=1&nofb=1&ipt=fa2c10ce0b62fa4131c8712cff933a717fce33c02953a1204fadcaa192eeef94&ipo=images'})
              .addFields({ name: 'Doc:', value: response })
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