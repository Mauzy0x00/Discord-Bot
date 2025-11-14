const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageFlags, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disablejoin')
        .setDescription('Disable user join notifications')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    
    async execute(interaction) {
        const guildId = interaction.guild.id;
        
        try {
            // Remove from database
            db.removeJoinNotificationSettings(guildId);
            
            await interaction.reply({
                content: 'Join notifications have been disabled.',
                flags: MessageFlags.Ephemeral
            });
        } catch (error) {
            console.error('Error disabling join notifications:', error);
            await interaction.reply({
                content: 'There was an error disabling join notifications. Please try again later.',
                flags: MessageFlags.Ephemeral
            });
        }
    },
};