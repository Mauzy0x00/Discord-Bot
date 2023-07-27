const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll_create')
    .setDescription('create a poll (max 10 choices)')
    .addStringOption(option => option.setName('message').setDescription('Message').setRequired(true))
    .addStringOption(option => option.setName('choiceone').setDescription('Choice 1').setRequired(true))
    .addStringOption(option => option.setName('choicetwo').setDescription('Choice 2').setRequired(true))
    .addStringOption(option => option.setName('choicethree').setDescription('Choice 3'))
    .addStringOption(option => option.setName('choicefour').setDescription('Choice 4'))
    .addStringOption(option => option.setName('choicefive').setDescription('Choice 5'))
    .addStringOption(option => option.setName('choicesix').setDescription('Choice 6'))
    .addStringOption(option => option.setName('choiceseven').setDescription('Choice 7'))
    .addStringOption(option => option.setName('choiceeight').setDescription('Choice 8'))
    .addStringOption(option => option.setName('choicenine').setDescription('Choice 9'))
    .addStringOption(option => option.setName('choiceten').setDescription('Choice 10')),

    async execute(interaction) {
        const message = interaction.options.getString('message');
        const choice1 = interaction.options.getString('choiceone');
        const choice2 = interaction.options.getString('choicetwo');
        const choice3 = interaction.options.getString('choicethree');
        const choice4 = interaction.options.getString('choicefour');
        const choice5 = interaction.options.getString('choicefive');
        const choice6 = interaction.options.getString('choicesix');
        const choice7 = interaction.options.getString('choiceseven');
        const choice8 = interaction.options.getString('choiceeight');
        const choice9 = interaction.options.getString('choicenine');
        const choice10 = interaction.options.getString('choiceten');

        // Create arrays with the reaction emojis and choice variables
        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        
        const choices = [ choice1, choice2, choice3, choice4, choice5, choice6, choice7, choice8, choice9, choice10 ]
        
        // Determine how many options are used 
        let numberOptionsUsed = 0;
        for(let i = 0; i <= choices.length; i++) {
            if(choices[i] == null) break;
            numberOptionsUsed++
        }

        const pollEmbed = new EmbedBuilder()
            .setColor(0x00C995)
            .setTitle(message);

        // Add fields for number of options selected
        for(let i = 0; i < numberOptionsUsed; i++) {
            let field = emojis[i] + "  " + choices[i];
            pollEmbed.addFields({ name: ' ', value: field });
        }

        // send embed and assign the message id to pollMessage
        const pollMessage = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });
        

        // Iterate and send reaction emotes for # of options used
        for(let i = 0; i < numberOptionsUsed; i++) {
            pollMessage.react(emojis[i]);
        }
    } // end interaction
}; // end module