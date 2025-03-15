const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Define the database path
const dbPath = path.join(__dirname, './data/reaction_roles.db'); 

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true }); // Create the directory if it doesn't exist
}

// Open the database
const db = new Database(dbPath);

// Create table to hold messages that the bot has reacted to in the past
db.prepare(`
CREATE TABLE IF NOT EXISTS reaction_role_configs (
    message_id TEXT,
    guild_id TEXT,
    emoji TEXT NOT NULL,
    role_id TEXT NOT NULL,
    PRIMARY KEY (message_id, guild_id, emoji)
)
`).run();

// Create table to hold user reactions
db.prepare(`
CREATE TABLE IF NOT EXISTS user_reaction_roles (
    message_id TEXT,
    guild_id TEXT,
    user_id TEXT,
    emoji TEXT NOT NULL,
    role_id TEXT NOT NULL,
    PRIMARY KEY (message_id, guild_id, user_id, emoji)
)
`).run();

module.exports = {
    // Add reaction role configuration
    addReactionRoleConfig: (messageId, guildId, emoji, roleId) => {
        db.prepare('INSERT OR REPLACE INTO reaction_role_configs (message_id, guild_id, emoji, role_id) VALUES (?, ?, ?, ?)')
            .run(messageId, guildId, emoji, roleId);
    },

    // Get reaction role configuration by message ID, guild ID and emoji
    getReactionRoleConfig: (messageId, guildId, emoji) => {
        return db.prepare('SELECT * FROM reaction_role_configs WHERE message_id = ? AND guild_id = ? AND emoji = ?')
            .get(messageId, guildId, emoji);
    },

    // Get all reaction role configurations for a message
    getAllReactionRoleConfigsForMessage: (messageId, guildId) => {
        return db.prepare('SELECT * FROM reaction_role_configs WHERE message_id = ? AND guild_id = ?')
            .all(messageId, guildId);
    },

    // Remove reaction role configuration
    removeReactionRoleConfig: (messageId, guildId, emoji) => {
        db.prepare('DELETE FROM reaction_role_configs WHERE message_id = ? AND guild_id = ? AND emoji = ?')
            .run(messageId, guildId, emoji);
    },

    // Get all reaction role configurations for all servers
    getAllReactionRoleConfigs: () => {
        return db.prepare('SELECT * FROM reaction_role_configs').all();
    },

    // Get all reaction role configurations for a specific server
    getReactionRoleConfigsByGuild: (guildId) => {
        return db.prepare('SELECT * FROM reaction_role_configs WHERE guild_id = ?').all(guildId);
    },

    // Add user reaction role
    addUserReactionRole: (messageId, guildId, userId, emoji, roleId) => {
        db.prepare('INSERT OR REPLACE INTO user_reaction_roles (message_id, guild_id, user_id, emoji, role_id) VALUES (?, ?, ?, ?, ?)')
            .run(messageId, guildId, userId, emoji, roleId);
    },

    // Get user reaction role
    getUserReactionRole: (messageId, guildId, userId, emoji) => {
        return db.prepare('SELECT * FROM user_reaction_roles WHERE message_id = ? AND guild_id = ? AND user_id = ? AND emoji = ?')
            .get(messageId, guildId, userId, emoji);
    },

    // Remove user reaction role
    removeUserReactionRole: (messageId, guildId, userId, emoji) => {
        db.prepare('DELETE FROM user_reaction_roles WHERE message_id = ? AND guild_id = ? AND user_id = ? AND emoji = ?')
            .run(messageId, guildId, userId, emoji);
    },

    // Get all user reaction roles
    getAllUserReactionRoles: () => {
        return db.prepare('SELECT * FROM user_reaction_roles').all();
    },

    // Get all user reaction roles for a specific user
    getUserReactionRoles: (userId) => {
        return db.prepare('SELECT * FROM user_reaction_roles WHERE user_id = ?').all(userId);
    },

    // Get all user reaction roles for a specific guild
    getUserReactionRolesByGuild: (guildId) => {
        return db.prepare('SELECT * FROM user_reaction_roles WHERE guild_id = ?').all(guildId);
    }
};