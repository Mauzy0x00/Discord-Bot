const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Give someone a hug :)')
    .addIntegerOption(option => option.setName('hugee').setDescription('Person to hug')),
    async execute(interaction) {
        // Your code goes here
    },
};