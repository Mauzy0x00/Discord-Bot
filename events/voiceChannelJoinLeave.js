const { Events, EmbedBuilder } = require('discord.js');
const db = require('../database.js');

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,
    async execute(oldState, newState) {
        const guildId = newState.guild.id;

        // Get the log channel ID from database
        const logSettings = db.getMessageLogChannel(guildId);

        // If no log channel is set, do nothing
        if (!logSettings) return;

        const logChannelId = logSettings.channel_id;
        const logChannel = newState.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        // Create embed for the voice channel status change
        const user = newState.member.user;
        let embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL()
            })
            .setTimestamp();

        if (!oldState.channel && newState.channel) {
            // User joined a voice channel
            embed.setTitle('User Joined Voice Channel')
                .addFields(
                    { name: 'User', value: `<@${user.id}>`, inline: true },
                    { name: 'Channel', value: `<#${newState.channel.id}>`, inline: true }
                )
                .setColor('#00FF00');
        } else if (oldState.channel && !newState.channel) {
            // User left a voice channel
            embed.setTitle('User Left Voice Channel')
                .addFields(
                    { name: 'User', value: `<@${user.id}>`, inline: true },
                    { name: 'Channel', value: `<#${oldState.channel.id}>`, inline: true }
                )
                .setColor('#FF0000');
        } else if (oldState.channel.id !== newState.channel.id) {
            // User switched voice channels
            embed.setTitle('User Switched Voice Channels')
                .addFields(
                    { name: 'User', value: `<@${user.id}>`, inline: true },
                    { name: 'From', value: `<#${oldState.channel.id}>`, inline: true },
                    { name: 'To', value: `<#${newState.channel.id}>`, inline: true }
                )
                .setColor('#FFA500');
        } else {
            return; // Ignore other updates (mute, deaf, etc.)
        }

        await logChannel.send({ embeds: [embed] });
    },
};
