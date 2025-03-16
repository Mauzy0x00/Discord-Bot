const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, MessageFlags } = require('discord.js');
const db = require('../../database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setjoinchannel')
        .setDescription('Set a channel for user join notifications')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to send join notifications')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Custom welcome message (use {user} to mention the new member)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const customMessage = interaction.options.getString('message') || 'Welcome {user} to the server!';
        const guildId = interaction.guild.id;
        
        // Validate that the selected channel is a text channel
        if (!channel.isTextBased()) {
            return interaction.reply({ 
                content: 'Please select a text channel for join notifications.', 
                flags: MessageFlags.Ephemeral
            });
        }
        
        try {
            // Save to database
            db.setJoinNotificationChannel(guildId, channel.id, customMessage);
            
            await interaction.reply({
                content: `Join notifications enabled! New members will be welcomed in ${channel} with your custom message.`,
                flags: MessageFlags.Ephemeral
            });
        } catch (error) {
            console.error('Error saving join notification settings:', error);
            await interaction.reply({
                content: 'There was an error saving your join notification settings. Yell at mauzy or something',
                flags: MessageFlags.Ephemeral
            });
        }
    },
};