
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const { OpenAIApiKey } = require('../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('dream_chat')
    .setDescription('Talk to Carl G. Jung')
    .addStringOption(option => option.setName('prompt').setDescription('Have Carl G. Jung analyze your dream. This costs me monies, please be nice :)').setRequired(true))
    .addBooleanOption(option => option.setName('private').setDescription('Keep it secret! You will receieve a private message from the Mauzy Bot and not shown here.').setRequired(true)),

    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        const private =interaction.options.getBoolean('private');
        
        if(!private) console.log(prompt);  // Don't log private info you creep. Remain virtuous !
        

        try {
          await interaction.deferReply();  // tell discord to wait 15 min 

          const secretGPTresponseEmbed = privateResponse();

          // Make request to OpenAI
          const configuration = new Configuration({
              apiKey: OpenAIApiKey,
            });
          const openai = new OpenAIApi(configuration);

        // Retreive language model and create completion
          const completion = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: [{role: "user", content: `Respond to the following as if you are the psychologist, Carl G. Yung. As Carl, you are to analyze and bring meaning to a dream; feel free to ask follow up questions for clarity. To the best of your abilities, try to encapsulate Carl Jung in your response: ${prompt}. `}],
            });
          
          response  = completion.data.choices[0].message.content;
          response = response.replace(/\n\n/, " ");    // message content from ChatGPT returns with two new lines, replace that with "ChatGPT: "
          console.log(response);

          const sizeCheck = `${interaction.user.username}: ${prompt} \n\n Jung: ${response}`;
          

        // Discord can only send messages that contain less than 2000 characters. Check this before sending. 
          if (sizeCheck.length > 2000) {
            // create .txt file. send txt file and delete from server
            // if cannot delete txt from java script, have javascript call a bash file

            // Create the file
            const fileName = 'response.txt';
            const fileContent = `Prompt: \n${prompt} \n\n Response:\n ${response}`; 
            createTextFile(fileName, fileContent);

            // Send the file
            const attachmentPath = path.join(process.cwd(), 'send_files', fileName);
            const attachment = new AttachmentBuilder(attachmentPath);
            

            // is the content private?
            if (private) {
              interaction.user.send({ files: [attachment] });

              await interaction.editReply({ embeds: [secretGPTresponseEmbed] })
            }
            else
              interaction.editReply({ files: [attachment] });

          } 
        // Embeded fields can only contain 1024 characters
          else if(sizeCheck.length > 1024) {
            
            // is the content private?
            if (private) {
              interaction.user.send({ content: `\*\*${interaction.user.username}:\*\* \n ${prompt} \n\n \*\*Jung:\*\* \n ${response}` });

              await interaction.editReply({ embeds: [secretGPTresponseEmbed] })
            }
            else
              await interaction.editReply({ content: `\*\*${interaction.user.username}:\*\* \n ${prompt} \n\n \*\*Jung:\*\* \n ${response}`});
          
          } else { // end size check

            const GPTresponseEmbed = new EmbedBuilder()
              .setColor(0x00C995)
              .setTitle(`${interaction.user.username}:`)
              .setThumbnail('https://dialecticspiritualism.com/wp-content/uploads/2017/04/Carl-Gustav-Jung.jpg')
              .setDescription(prompt)
              .setAuthor({ name: 'Carl G. Yung', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-330px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg'})
              .addFields({ name: 'Carl:', value: response })
              .setFooter({ text: 'Response by ChatGPT 3.5 Turbo'});

// is the content private?
            if (private) {
              interaction.user.send({ embeds: [GPTresponseEmbed] });

              await interaction.editReply({ embeds: [secretGPTresponseEmbed] })
            }

            else 
              await interaction.editReply({ embeds: [GPTresponseEmbed] });
          
          } 
            // end of big 'ol if block

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


// Private response 
function privateResponse() {

  // Random image stuff. Not important :3
  let image = '';
  const randPick = Math.ceil(Math.random() * 4);
  if(randPick == 1) { image = 'https://media1.tenor.com/images/9880c11607bd6e1e5730fc0387eff4ac/tenor.gif?itemid=4943949'; }
  else if(randPick == 2) image = 'https://media.giphy.com/media/s4GPaO3Biktkk/giphy.gif';
  else if(randPick == 3) image = 'https://homebusinessmag.com/wp-content/uploads/2020/10/Giphy-relaxing-clip.gif';
  else image = 'http://3.bp.blogspot.com/-tm_63FQ2zCI/UbTxGcAhHxI/AAAAAAAAI4g/H_M8Pgdz9A0/s1600/John+Wayne.jpg';

  // Build the private embed
  const privateGPTresponseEmbed = new EmbedBuilder()
    .setColor(0x000000)
    .setImage(`${image}`)
    .setFooter({ text: 'Did\'t recieve a DM? Check your security permissions.'});

  return privateGPTresponseEmbed;
}
