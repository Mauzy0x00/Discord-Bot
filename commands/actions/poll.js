const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll create')
    .setDescription('create a poll')
    .addStringOption(option => option.setName('message').setDescription('Message').setRequired(true))
    .addStringOption(option => option.setName('Choice1').setDescription('Choice 1').setRequired(true))
    .addStringOption(option => option.setName('Choice2').setDescription('Choice 2').setRequired(false))
    .addStringOption(option => option.setName('Choice3').setDescription('Choice 3').setRequired(false))
    .addStringOption(option => option.setName('Choice4').setDescription('Choice 4').setRequired(false))
    .addStringOption(option => option.setName('Choice5').setDescription('Choice 5').setRequired(false))
    .addStringOption(option => option.setName('Choice6').setDescription('Choice 6').setRequired(false))
    .addStringOption(option => option.setName('Choice7').setDescription('Choice 7').setRequired(false))
    .addStringOption(option => option.setName('Choice8').setDescription('Choice 8').setRequired(false))
    .addStringOption(option => option.setName('Choice9').setDescription('Choice 9').setRequired(false))
    .addStringOption(option => option.setName('Choice10').setDescription('Choice 10').setRequired(false)),

    async execute(interaction) {
        const message = interaction.options.getString('message');
        const choice1 = interaction.options.getString('Choice1');
        const choice2 = interaction.options.getString('Choice2');
        const choice3 = interaction.options.getString('Choice3');
        const choice4 = interaction.options.getString('Choice4');
        const choice5 = interaction.options.getString('Choice5');
        const choice6 = interaction.options.getString('Choice6');
        const choice7 = interaction.options.getString('Choice7');
        const choice8 = interaction.options.getString('Choice8');
        const choice9 = interaction.options.getString('Choice9');
        const choice10 = interaction.options.getString('Choice10');


        // Create arrays with the reaction emojis and choice variables
        const emojis = ['1️⃣', '2️⃣', '3️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        
        const choices = [ choice1, choice2, choice3, choice4, choice5, choice6, choice7, choice8, choice9, choice10 ]


        // Need to some how only show fields that are necessary 
        const pollEmbed = new EmbedBuilder()
            .setColor(0x00C995)
            .setTitle(message);

        // Add fields for number of options selected
        for(let i = 0; i <= num_options; i++) {
            pollEmbed.addFields(`${emojis[i]} ${choices[i]}`);
        }

        // send embed and assign the message id to pollMessage
        const pollMessage = interaction.reply({ embeds: [pollEmbed], fetchReply: true });
        

        // Iterate and send reaction emotes for # of options used
        for(let i = 0; i <= num_options; i++) {
            pollMessage.react(emojis[i]);
        }
    } // end interaction
}; // end module