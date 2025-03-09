const Database = require('better-sqlite3');

const db = new Database('./reaction_roles.db');

// Create table with guild_id
db.prepare(`
    CREATE TABLE IF NOT EXISTS reaction_roles (
        message_id TEXT,
        guild_id TEXT,
        emoji TEXT NOT NULL,
        role_id TEXT NOT NULL,
        PRIMARY KEY (message_id, guild_id)
    )
`).run();

module.exports = {
	// Save reaction role with guild ID
	addReactionRole: (messageId, guildId, emoji, roleId) => {
		db.prepare('INSERT OR REPLACE INTO reaction_roles (message_id, guild_id, emoji, role_id) VALUES (?, ?, ?, ?)')
			.run(messageId, guildId, emoji, roleId);
	},

	// Get reaction role by message & guild ID
	getReactionRole: (messageId, guildId) => {
		return db.prepare('SELECT * FROM reaction_roles WHERE message_id = ? AND guild_id = ?').get(messageId, guildId);
	},

	// Remove reaction role
	removeReactionRole: (messageId, guildId) => {
		db.prepare('DELETE FROM reaction_roles WHERE message_id = ? AND guild_id = ?').run(messageId, guildId);
	},

	// Get all reaction roles for all servers
	getAllReactionRoles: () => {
		return db.prepare('SELECT * FROM reaction_roles').all();
	},

	// Get all reaction roles for a specific server
	getReactionRolesByGuild: (guildId) => {
		return db.prepare('SELECT * FROM reaction_roles WHERE guild_id = ?').all(guildId);
	},
};
