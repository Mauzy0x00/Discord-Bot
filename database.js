// Most of the information in this database is to ensure that data persists across bot restarts

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Define the database path
const dbPath = path.join(__dirname, './data/guild_configs.db'); 

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true }); // Create the directory if it doesn't exist
}

// Open the database
const db = new Database(dbPath);

// Bot Reaction Roles Table
db.prepare(`
CREATE TABLE IF NOT EXISTS reaction_role_configs (
    message_id TEXT,
    guild_id TEXT,
    emoji TEXT NOT NULL,
    role_id TEXT NOT NULL,
    PRIMARY KEY (message_id, guild_id, emoji)
)
`).run();

// User Reaction Roles Table
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

//  Join Notification Table
db.prepare(`
CREATE TABLE IF NOT EXISTS join_notifications (
    guild_id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT 'Welcome {user} to the server!'
)
`).run();

// Message Logs Table
db.prepare(`
    CREATE TABLE IF NOT EXISTS message_logs (
        guild_id TEXT PRIMARY KEY,
        channel_id TEXT NOT NULL
    )
`).run();

// Autorole Configuration Table
db.prepare(`
    CREATE TABLE IF NOT EXISTS autorole_configs (
        guild_id TEXT PRIMARY KEY,
        role_id TEXT NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT 1
    )
`).run();

// Movies Configuration Table
db.prepare(`
    CREATE TABLE IF NOT EXISTS movies (
        guild_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        movie TEXT NOT NULL
    )
    `).run();

module.exports = {
    // Reaction roles
    addReactionRoleConfig: (messageId, guildId, emoji, roleId) => {
        db.prepare('INSERT OR REPLACE INTO reaction_role_configs (message_id, guild_id, emoji, role_id) VALUES (?, ?, ?, ?)')
            .run(messageId, guildId, emoji, roleId);
    },

    getReactionRoleConfig: (messageId, guildId, emoji) => {
        return db.prepare('SELECT * FROM reaction_role_configs WHERE message_id = ? AND guild_id = ? AND emoji = ?')
            .get(messageId, guildId, emoji);
    },

    getAllReactionRoleConfigsForMessage: (messageId, guildId) => {
        return db.prepare('SELECT * FROM reaction_role_configs WHERE message_id = ? AND guild_id = ?')
            .all(messageId, guildId);
    },

    removeReactionRoleConfig: (messageId, guildId, emoji) => {
        db.prepare('DELETE FROM reaction_role_configs WHERE message_id = ? AND guild_id = ? AND emoji = ?')
            .run(messageId, guildId, emoji);
    },

    getAllReactionRoleConfigs: () => {
        return db.prepare('SELECT * FROM reaction_role_configs').all();
    },

    getReactionRoleConfigsByGuild: (guildId) => {
        return db.prepare('SELECT * FROM reaction_role_configs WHERE guild_id = ?').all(guildId);
    },

    addUserReactionRole: (messageId, guildId, userId, emoji, roleId) => {
        db.prepare('INSERT OR REPLACE INTO user_reaction_roles (message_id, guild_id, user_id, emoji, role_id) VALUES (?, ?, ?, ?, ?)')
            .run(messageId, guildId, userId, emoji, roleId);
    },

    getUserReactionRole: (messageId, guildId, userId, emoji) => {
        return db.prepare('SELECT * FROM user_reaction_roles WHERE message_id = ? AND guild_id = ? AND user_id = ? AND emoji = ?')
            .get(messageId, guildId, userId, emoji);
    },

    removeUserReactionRole: (messageId, guildId, userId, emoji) => {
        db.prepare('DELETE FROM user_reaction_roles WHERE message_id = ? AND guild_id = ? AND user_id = ? AND emoji = ?')
            .run(messageId, guildId, userId, emoji);
    },

    getAllUserReactionRoles: () => {
        return db.prepare('SELECT * FROM user_reaction_roles').all();
    },

    getUserReactionRoles: (userId) => {
        return db.prepare('SELECT * FROM user_reaction_roles WHERE user_id = ?').all(userId);
    },

    getUserReactionRolesByGuild: (guildId) => {
        return db.prepare('SELECT * FROM user_reaction_roles WHERE guild_id = ?').all(guildId);
    },

    // Join notifications
    setJoinNotificationChannel: (guildId, channelId, message = 'Welcome {user} to the server!') => {
        db.prepare('INSERT OR REPLACE INTO join_notifications (guild_id, channel_id, message) VALUES (?, ?, ?)')
            .run(guildId, channelId, message);
    },

    getJoinNotificationSettings: (guildId) => {
        return db.prepare('SELECT * FROM join_notifications WHERE guild_id = ?')
            .get(guildId);
    },

    removeJoinNotificationSettings: (guildId) => {
        db.prepare('DELETE FROM join_notifications WHERE guild_id = ?')
            .run(guildId);
    },

    getAllJoinNotificationSettings: () => {
        return db.prepare('SELECT * FROM join_notifications').all();
    },

    // Message logging
    setMessageLogChannel: (guildId, channelId) => {
        db.prepare('INSERT OR REPLACE INTO message_logs (guild_id, channel_id) VALUES (?, ?)')
            .run(guildId, channelId);
    },

    getMessageLogChannel: (guildId) => {
        return db.prepare('SELECT channel_id FROM message_logs WHERE guild_id = ?')
            .get(guildId);
    },

    removeMessageLogChannel: (guildId) => {
        db.prepare('DELETE FROM message_logs WHERE guild_id = ?')
            .run(guildId);
    },

    getAllMessageLogSettings: () => {
        return db.prepare('SELECT * FROM message_logs').all();
    },

    
    // Autorole functions
    setAutorole: (guildId, roleId) => {
        db.prepare('INSERT OR REPLACE INTO autorole_configs (guild_id, role_id, enabled) VALUES (?, ?, 1)')
            .run(guildId, roleId);
    },
    
    getAutorole: (guildId) => {
        return db.prepare('SELECT * FROM autorole_configs WHERE guild_id = ?')
            .get(guildId);
    },
    
    disableAutorole: (guildId) => {
        db.prepare('UPDATE autorole_configs SET enabled = 0 WHERE guild_id = ?')
            .run(guildId);
    },
    
    enableAutorole: (guildId) => {
        db.prepare('UPDATE autorole_configs SET enabled = 1 WHERE guild_id = ?')
            .run(guildId);
    },
    
    removeAutorole: (guildId) => {
        db.prepare('DELETE FROM autorole_configs WHERE guild_id = ?')
            .run(guildId);
    },
    
    getAllAutoroles: () => {
        return db.prepare('SELECT * FROM autorole_configs').all();
    },


    // Movie functions 
    getMovies: () => {
        return db.prepare('SELECT * FROM movies').all();
    },

    addMovie: (guildId, user_id, movie) => {
        db.prepare('INSERT OR REPLACE INTO movies (guild_id, user_id, movie)  VALUES (?, ?, ?)')
            .run(guildId, user_id, movie);
    }
    
};