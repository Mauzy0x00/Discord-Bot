const { Events, EmbedBuilder } = require('discord.js');
const db = require('../database.js'); 

module.exports = {
    name: Events.MessageDelete,
    once: false,
    async execute(message) {
        // Ignore messages from bots
        if (message.author?.bot) return;
        
        // Get the log channel ID from database
        const logSettings = db.getMessageLogChannel(message.guild.id);
        
        // If no log channel is set, do nothing
        if (!logSettings) return;
        
        const logChannelId = logSettings.channel_id;
        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;
        
        // Create embed for the deleted message
        const embed = new EmbedBuilder()
            .setTitle('Message Deleted')
            .setColor('#FF0000')
            .setAuthor({
                name: message.author?.tag || 'Unknown User',
                iconURL: message.author?.displayAvatarURL() || null
            })
            .addFields(
                { name: 'Channel', value: `<#${message.channel.id}>`, inline: true },
                { name: 'User ID', value: message.author?.id || 'Unknown', inline: true },
                { name: 'Created At', value: message.createdAt.toLocaleString(), inline: true }
            )
            .setTimestamp();
        
        // Add message content if it exists
        if (message.content) {
            embed.addFields({ name: 'Content', value: message.content.substring(0, 1024) });
            
            // If message is longer than 1024 characters, add continuation fields
            if (message.content.length > 1024) {
                const chunks = Math.ceil(message.content.length / 1024);
                for (let i = 1; i < chunks; i++) {
                    embed.addFields({ 
                        name: `Content (continued ${i})`, 
                        value: message.content.substring(i * 1024, (i + 1) * 1024) 
                    });
                }
            }
        } else {
            embed.addFields({ name: 'Content', value: '*(No text content)*' });
        }
        
        // Handle attachments (images, files, etc.)
        if (message.attachments.size > 0) {
            const attachments = Array.from(message.attachments.values());
            
            // Add the first attachment as the embed image if it's an image
            const firstAttachment = attachments[0];
            if (firstAttachment.contentType?.startsWith('image/')) {
                embed.setImage(firstAttachment.proxyURL);
            }
            
            // Add fields for all attachments
            const attachmentsList = attachments.map(a => 
                `[${a.name}](${a.url}) (${(a.size / 1024).toFixed(2)} KB)`
            ).join('\n');
            
            embed.addFields({ name: 'Attachments', value: attachmentsList });
        }
        
        // Send the log embed
        await logChannel.send({ embeds: [embed] });
    },
};