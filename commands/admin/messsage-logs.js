const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const db = require('../../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message_logging')
        .setDescription('Manage message log channel settings')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set a channel for deleted message logs')
                .addChannelOption(option => 
                    option.setName('channel')
                        .setDescription('The channel to log deleted messages')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove the currently set message log channel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('Show the currently set message log channel'))
        .setDefaultMemberPermissions(PermissionFlagsBits.MANAGE_CHANNELS),
    
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'set') {
            const channel = interaction.options.getChannel('channel');
            
            // Check if the selected channel is a text channel
            if (!channel.isTextBased()) {
                return interaction.reply({ 
                    content: 'Please select a text channel for logging messages.', 
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Save the channel ID to the database
            db.setMessageLogChannel(guildId, channel.id);
            
            await interaction.reply({
                content: `✅ Successfully set ${channel} as the log channel for deleted messages.`,
                flags: MessageFlags.Ephemeral
            });
        } 
        else if (subcommand === 'remove') {
            // Check if there's a log channel set
            const logSettings = db.getMessageLogChannel(guildId);
            
            if (!logSettings) {
                return interaction.reply({
                    content: '❌ There is no message log channel currently set for this server.',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Get the channel name for the response message
            const channelId = logSettings.channel_id;
            const channel = interaction.guild.channels.cache.get(channelId);
            const channelName = channel ? `<#${channelId}>` : 'the previously set channel';
            
            // Remove the log channel from the database
            db.removeMessageLogChannel(guildId);
            
            await interaction.reply({
                content: `✅ Successfully removed ${channelName} as the message log channel. Deleted messages and voice channel activity will no longer be logged.`,
                flags: MessageFlags.Ephemeral
            });
        }
        else if (subcommand === 'show') {
            // Check if there's a log channel set
            const logSettings = db.getMessageLogChannel(guildId);
            
            if (!logSettings) {
                return interaction.reply({
                    content: 'There is no message log channel currently set for this server.',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            const channelId = logSettings.channel_id;
            const channel = interaction.guild.channels.cache.get(channelId);
            
            if (!channel) {
                return interaction.reply({
                    content: `The log channel was set to ID ${channelId}, but this channel no longer exists in the server.`,
                    flags: MessageFlags.Ephemeral
                });
            }
            
            await interaction.reply({
                content: `The current log channel for deleted messages and voice channel activity is set to ${channel}.`,
                flags: MessageFlags.Ephemeral
            });
        }
    },
};