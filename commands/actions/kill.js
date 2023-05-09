const axios = require('axios');     // axios package to make a GET request to the Tenor API and retrieve a gif
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { tenorAPI } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kill')
    .setDescription('kill someone')
    .addUserOption(option => option.setName('victim').setDescription('Person to kill').setRequired(true)),

    async execute(interaction) {
        query = 'anime kill';
        const limit = 25;
        const mediaFilter = 'minimal';
        const kill = interaction.options.getUser('victim');

        if (interaction.user.username == kill) {

            query = 'never give up';
            const { data } = await axios.get(`https://tenor.googleapis.com/v2/search?q=${query}&key=${tenorAPI}&limit=${limit}&media_filter=${mediaFilter}`);

            // Choose a random gif 
            const randomIndex = Math.floor(Math.random() * data.results.length);
            const gifUrl = data.results[randomIndex].media_formats.gif.url;
            
            const killEmbed = new EmbedBuilder()
            .setDescription(`Love yourself, ${interaction.user.username}. You are amazing!`)
            .setImage(gifUrl);
    
            await interaction.reply({ embeds: [killEmbed] });

        } else {

            const { data } = await axios.get(`https://tenor.googleapis.com/v2/search?q=${query}&key=${tenorAPI}&limit=${limit}&media_filter=${mediaFilter}`);

            // Choose a random gif 
            const randomIndex = Math.floor(Math.random() * data.results.length);
            const gifUrl = data.results[randomIndex].media_formats.gif.url;

            const killEmbed = new EmbedBuilder()
            .setColor(0x8B0000) // blood red
            .setDescription(`${interaction.user.username} killed ${kill} 🔪 >press F to pay respects.`)
            .setImage(gifUrl);

            await interaction.reply({ embeds: [killEmbed] });
        
        }
    },
};