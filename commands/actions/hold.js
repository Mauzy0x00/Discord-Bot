const axios = require('axios');     // axios package to make a GET request to the Tenor API and retrieve a gif
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { tenorAPI } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hold')
    .setDescription('hold someone')
    .addUserOption(option => option.setName('cuteuser').setDescription('Person to hold').setRequired(true)),

    async execute(interaction) {
        const query = 'cute hold';
        const limit = 25;
        const mediaFilter = 'minimal';
        const hold = interaction.options.getUser('cuteuser');

        const { data } = await axios.get(`https://api.tenor.com/v2/search?q=${query}&key=${tenorAPI}&limit=${limit}&media_filter=${mediaFilter}`);

        // Choose a random gif 
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const gifUrl = data.results[randomIndex].media_formats.gif.url;

        
        // filter out gifs that do not match intended search
        while (gifUrl == `https://images-ext-2.discordapp.net/external/ZGDv8X7EQ4Idhm5FyR4GNfnbUcTS4oyg_0AKvGIjhGU/https/media.tenor.com/MtLleHERk0cAAAAC/younger-tv-younger.gif`) {

            const { data } = await axios.get(`https://api.tenor.com/v2/search?q=${query}&key=${tenorAPI}&limit=${limit}&media_filter=${mediaFilter}`);

            // Choose a random gif 
            randomIndex = Math.floor(Math.random() * data.results.length);
            gifUrl = data.results[randomIndex].media_formats.gif.url;
        }
        
        const gifEmbed = new EmbedBuilder()
        .setDescription(`${interaction.user.username} is holding ${hold} 💖`)
        .setImage(gifUrl);

        await interaction.reply({ embeds: [gifEmbed] });
    },
};