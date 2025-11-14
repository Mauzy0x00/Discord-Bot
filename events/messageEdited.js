const { Events, EmbedBuilder } = require('discord.js');
const db = require('../database.js'); 

module.exports = {
    name: Events.MessageUpdate,
    once: false,
    async execute(oldMessage, newMessage) {
        try {
            // Debug log
            console.log('MessageUpdate event triggered');
            
            // Check if messages are partials and fetch them if needed
            if (oldMessage.partial) {
                try {
                    console.log('Fetching partial old message');
                    await oldMessage.fetch();
                } catch (error) {
                    console.error('Error fetching old message:', error);
                    return;
                }
            }
            
            if (newMessage.partial) {
                try {
                    console.log('Fetching partial new message');
                    await newMessage.fetch();
                } catch (error) {
                    console.error('Error fetching new message:', error);
                    return;
                }
            }
            
            // Verify we have a guild (server) context
            if (!newMessage.guild) {
                console.log('Message edit occurred outside of a guild, ignoring');
                return;
            }
            
            // Ignore messages from bots
            if (newMessage.author?.bot) {
                console.log('Message edit from a bot, ignoring');
                return;
            }
            
            // Ignore if content is the same
            if (oldMessage.content === newMessage.content) {
                console.log('Message content unchanged, ignoring');
                return;
            }
            
            // Get the log channel ID from database
            const guildId = newMessage.guild.id;
            console.log(`Checking log settings for guild: ${guildId}`);
            const logSettings = db.getMessageLogChannel(guildId);
            
            // If no log channel is set, do nothing
            if (!logSettings) {
                console.log('No log channel configured for this guild');
                return;
            }
            
            const logChannelId = logSettings.channel_id;
            console.log(`Log channel ID: ${logChannelId}`);
            
            const logChannel = newMessage.guild.channels.cache.get(logChannelId);
            if (!logChannel) {
                console.log('Configured log channel not found in guild');
                return;
            }
            
            console.log('Creating log embed');
            
            // Create embed for the edited message
            const embed = new EmbedBuilder()
                .setTitle('Message Edited')
                .setColor('#FFA500') // Orange color for edits
                .setAuthor({
                    name: newMessage.author?.tag || 'Unknown User',
                    iconURL: newMessage.author?.displayAvatarURL() || null
                })
                .addFields(
                    { name: 'Channel', value: `<#${newMessage.channel.id}>`, inline: true },
                    { name: 'User ID', value: newMessage.author?.id || 'Unknown', inline: true },
                    { name: 'Jump to Message', value: `[Click Here](${newMessage.url})`, inline: true },
                    { name: 'Edited At', value: new Date().toLocaleString(), inline: true }
                )
                .setTimestamp();
            
            // Add old message content if it exists
            if (oldMessage.content) {
                embed.addFields({ name: 'Before', value: oldMessage.content.substring(0, 1024) });
                
                // If message is longer than 1024 characters, add continuation fields
                if (oldMessage.content.length > 1024) {
                    const chunks = Math.ceil(oldMessage.content.length / 1024);
                    for (let i = 1; i < chunks; i++) {
                        embed.addFields({ 
                            name: `Before (continued ${i})`, 
                            value: oldMessage.content.substring(i * 1024, (i + 1) * 1024) 
                        });
                    }
                }
            } else {
                embed.addFields({ name: 'Before', value: '*(No text content)*' });
            }
            
            // Add new message content if it exists
            if (newMessage.content) {
                embed.addFields({ name: 'After', value: newMessage.content.substring(0, 1024) });
                
                // If message is longer than 1024 characters, add continuation fields
                if (newMessage.content.length > 1024) {
                    const chunks = Math.ceil(newMessage.content.length / 1024);
                    for (let i = 1; i < chunks; i++) {
                        embed.addFields({ 
                            name: `After (continued ${i})`, 
                            value: newMessage.content.substring(i * 1024, (i + 1) * 1024) 
                        });
                    }
                }
            } else {
                embed.addFields({ name: 'After', value: '*(No text content)*' });
            }
            
            console.log('Sending log embed to channel');


        try {
            // Send the log embed
            await logChannel.send({ embeds: [embed] });
            console.log('Message edit log sent successfully');

        } catch (error) {
            // Handle missing permissions
            if (error.code === 50013) { // Missing Permissions
                console.error(`Missing permissions to send messages in log channel ID ${logChannelId} of guild ${message.guild.name}`);
                
            } else if (error.code === 50001) { // Missing Access
                console.error(`Missing access to log channel ID ${logChannelId} of guild ${message.guild.name}`);

            } else {
                console.error(`Error sending deleted message log: ${error.message}`);
            }
        }
        } catch (error) {
            console.error('Error in MessageUpdate event handler:', error);
        }
    },
};