const { SlashCommandBuilder, MessageFlags, EmbedBuilder} = require('discord.js');
const db = require('../utils/database.js'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('movies')
        .setDescription('Manage your movie list')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a movie to the list')
                .addStringOption(option =>
                    option
                        .setName('movie')
                        .setDescription('The name of the movie to add.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a movie from the list')
                .addIntegerOption(option =>
                    option
                        .setName('number')
                        .setDescription('The list number of the movie to remove.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all saved movies.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('random_movie')
                .setDescription('Randomly choose a movie from the list.')
        ),



    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const movie = interaction.options.getString('movie');
        const movie_index = interaction.options.getString('number');
        const role = interaction.options.getRole('role');
        const guild = interaction;
        
        try {

        /// Add subcommand
        if (subcommand === 'add') {
            // Add movie to database
            db.addMovie(guild.id, interaction.user.id, movie);
            
            return interaction.reply({
                content: `✅ Movie, **${movie}**, added to the list.`,
                flags: MessageFlags.Ephemeral
            });

        /// Remove subcommand
        } else if (subcommand === 'remove') {
            // Remove movie from database
            const result = db.removeMovie(movie_index, guild.id);
            if (!result) {
                return interaction.reply({
                    content: '❌ Invalid movie number. Please check the list and try again.',
                    flags: MessageFlags.Ephemeral
                });
            } else {
                return interaction.reply({
                    content: `✅ Movie number **${movie_index}** removed from the list.`,
                    flags: MessageFlags.Ephemeral
                });
            }
        
        /// List subcommand
        } else if (subcommand === 'list') {
            // List movies from database

            await showMovieList(interaction, guild.id);
        }

        /// Random Movie subcommand
        else if (subcommand === 'random_movie') {
            // Select a random movie from the database
            const movies = db.getMovies(guild.id);  // Returns and array of movie objects

            if (movies.length === 0) {
                return interaction.reply({
                    content: 'No movies found in the list.',
                    flags: MessageFlags.Ephemeral
                });
            }
            const randomIndex = Math.floor(Math.random() * movies.length);
            const randomMovie = movies[randomIndex];
            return interaction.reply({
                content: `🎬 Your randomly selected movie is: **${randomMovie.movie}**`,
                flags: MessageFlags.Ephemeral
            });
        }


        await interaction.reply({
            content: `✅ Reaction role set in **${guild.name}**! React with ${emoji} to get **${role.name}** role.`,
            flags: MessageFlags.Ephemeral
        });


        } catch (error) {
            console.error('Movie operation error', error);
            await interaction.reply({
                content: '❌ Failed movie',
                flags: MessageFlags.Ephemeral
            });
        }
    },
};


async function showMovieList(interaction, guildId) {
    const movies = db.getMovies(guildId, interaction.user.id);  // Returns and array of movie objects

    // Make sure there are movies in the list
    if(movies.length === 0){
        return interaction.reply({
            content: `❌ Your movie list is empty. Use /movies add to add a movie.`,
            flags: MessageFlags.Ephemeral
        });
    }

    // Build the embeded movie list message
    const moviesPerPage = 10;
    const totalPages = Math.ceil(movies.length / moviesPerPage);
    let currentPage = 0;

    const generateEmbed = (page) => {
        const start = page * moviesPerPage;
        const end = start + moviesPerPage;
        const movieSlice = movies.slice(start, end);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎬 Movie List')
            .setDescription(movieSlice.map(m => 
                `**${m.id}.** ${m.movie}\n*Added by <@${m.user_id}>*`
            ).join('\n\n'))
            .setFooter({ text: `Page ${page + 1} of ${totalPages} • ${movies.length} total movies` })

            return embed;
    };

    // Generate embeded buttons 
    const generateButtons = (page) => {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('◀ Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next ▶')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === totalPages - 1)
            );
    };

    // Send the initial message
    const message = await interaction.reply({
        embeds: [generateEmbed(currentPage)],
        components: totalPages > 1 ? [generateButtons(currentPage)] : [],
        fetchReply: true,
        ephemeral: true
    });

    if (totalPages > 1) {
        const collector = message.createMessageComponentCollector({ time: 300000 }); // 5 minutes
        
        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'These buttons are not for you!', ephemeral: true });
            }
            
            if (i.customId === 'prev') {
                currentPage--;
            } else if (i.customId === 'next') {
                currentPage++;
            }
            
            await i.update({
                embeds: [generateEmbed(currentPage)],
                components: [generateButtons(currentPage)]
            });
        });
        
        collector.on('end', () => {
            message.edit({ components: [] }).catch(() => {});
        });
    }
}