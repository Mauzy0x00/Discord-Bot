const axios = require('axios');     // axios package to make a GET request to the Tenor API and retrieve a gif
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { tenorAPI } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('blush')
    .setDescription('Who got you blushing? ;)'),

    async execute(interaction) {
        const query = 'furry blush';
        const limit = 25;
        const mediaFilter = 'minimal';

        const { data } = await axios.get(`https://api.tenor.com/v2/search?q=${query}&key=${tenorAPI}&limit=${limit}&media_filter=${mediaFilter}`);

        // Choose a random gif 
        randomIndex = Math.floor(Math.random() * data.results.length);
        gifUrl = data.results[randomIndex].media_formats.gif.url;

        // filter out gifs that do not match intended search
        while (gifUrl == `https://media.tenor.com/XGuDQkV7v3YAAAAC/corgi-furry.gif` 
                || gifUrl == `https://media.tenor.com/8xDEVy0S3nAAAAAC/flaik-fox.gif`) {

            const { data } = await axios.get(`https://tenor.googleapis.com/v2/search?q=${query}&key=${tenorAPI}&limit=${limit}&media_filter=${mediaFilter}`);

            // Choose a random gif 
            randomIndex = Math.floor(Math.random() * data.results.length);
            gifUrl = data.results[randomIndex].media_formats.gif.url;
        }

        const gifEmbed = new EmbedBuilder()
        .setDescription(`${interaction.user.username} is blushing!`)
        .setImage(gifUrl);

        await interaction.reply({ embeds: [gifEmbed] });
    },
};