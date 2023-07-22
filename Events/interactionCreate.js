const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const config = require("../config.js")
const fs = require('fs');
const ms = require('ms');
const path = require('node:path');

const jsonDbPath = __dirname + '/../data/voicestateupdate.json';

const CHANNELS = [
    {
        id: "id",
        server: "server",
        name: "name",
        type: "type",
        value: "value"
    }
]

/**
 * Parse items given in a .json file
 * @param {String} filePath - path to the .json file
 * If the file does not exist or it's content cannot be parsed as JSON data,
 * use the default data.
 * @param {Array} defaultArray - Content to be used when the .json file does not exists
 * @returns {Array} : the array that was parsed from the file (or defaultArray)
 */
function parse(filePath, defaultArray = []) {
    if (!fs.existsSync(filePath)) return defaultArray;
    const fileData = fs.readFileSync(filePath);
    try {
        return JSON.parse(fileData);
    } catch (err) {
        return defaultArray;
    }
}

/**
 * Serialize the content of an Object within a file
 * @param {String} filePath - path to the .json file
 * @param {Array} object - Object to be written within the .json file.
 * Even if the file exists, its whole content is reset by the given object.
 */
function serialize(filePath, object) {
    const objectSerialized = JSON.stringify(object);
    createPotentialLastDirectory(filePath);
    fs.writeFileSync(filePath, objectSerialized);
}

/**
 *
 * @param {String} filePath - path to the .json file
 */
function createPotentialLastDirectory(filePath) {
    const pathToLastDirectory = filePath.substring(0, filePath.lastIndexOf(path.sep));

    if (fs.existsSync(pathToLastDirectory)) return;

    fs.mkdirSync(pathToLastDirectory);
}

async function waitAndDeleteMessage(message, timeInMilliseconds) {
    // Attendre le délai spécifié avant de supprimer le message
    await new Promise(resolve => setTimeout(resolve, timeInMilliseconds));
    message.delete();
}

module.exports = async (bot, interaction, message) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {

        let command = require(`../Commandes/${interaction.commandName}`)
        command.run(bot, interaction, interaction.options, bot.db)
    }


    if (interaction.isButton()) {

        // annulation
        if (interaction.customId === "cancel") {
            interaction.message.delete()
        }

        if (interaction.customId === "vocal") {
            interaction.message.delete()
            // embed de base
            const embed = new EmbedBuilder()
                .setTitle(`Choisir le salon pilote`)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                .setColor("#FF7300")
                .setDescription(`
                    Le salon pilote c'est celui qui permettra de créer d'autres salons vocaux temporaires.
                    **📥 | Le créer pour moi**
                `)
                .setFooter({ text: `© ${bot.user.username} | ${config.version}` })
                .setTimestamp()

            // bouton de base
            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle('2')
                        .setLabel('Le créer pour moi')
                        .setCustomId('create')
                        .setEmoji('📥'),
                    new ButtonBuilder()
                        .setStyle('4')
                        .setLabel('Annuler')
                        .setCustomId('cancel')
                        .setEmoji('✖️'),
                );

            interaction.channel.send({ embeds: [embed], components: [button] });
        }

        if (interaction.customId === "create") {
            const channels = parse(jsonDbPath, CHANNELS);
            interaction.message.delete();
            // embed de base
            const embed = new EmbedBuilder()
                .setTitle(`Choisir le salon pilote`)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                .setColor("#FF7300")
                .setDescription(`
                    Choisissez le moèle de salon pilote :
                `)
                .setFooter({ text: `© ${bot.user.username} | ${config.version}` })
                .setTimestamp()

            // bouton de base
            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle('4')
                        .setLabel('Annuler')
                        .setCustomId('cancel')
                        .setEmoji('✖️'),
                );

            let selectMenuOptions = [
                {
                    label: 'Vocal {depseudo}',
                    value: '1',
                },
                {
                    label: 'Salon {depseudo}',
                    value: '2',
                },
                {
                    label: 'Salon temporaire {depseudo}',
                    value: '3',
                },
                {
                    label: '🎮 {depseudo}',
                    value: '4',
                },
                {
                    label: '🔉 {depseudo}',
                    value: '5',
                },
            ];

            const selectMenu = new ActionRowBuilder().addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('selectMenu')
                    .setPlaceholder('Sélectionner un modèle')
                    .addOptions(selectMenuOptions)
            );

            const msg = await interaction.channel.send({ embeds: [embed], components: [button, selectMenu] });

            const collector = msg.createMessageComponentCollector({
                filter: (u) => {
                    if (u.user.id === interaction.user.id) {
                        return true
                    } else {
                        return false
                    }
                },
                errors: ['TIME']
            })

            collector.on('collect', async (cld) => {
                if (cld.values[0] === '1') {
                    const messageToDelete = await interaction.channel.messages.fetch(msg.id);
                    let channel = await interaction.guild.channels.create({
                        name: `↪ | Créer ton channel`,
                        type: Discord.ChannelType.GuildVoice,
                    })
                    const replyMsg = await interaction.channel.send({content: `Le salon ${channel} a été créé !`, ephemeral: true})

                    // json
                    channel = {
                        id: channel.id,
                        server: channel.guild.id,
                        name: channel.name,
                        type: 'pilote',
                        value: '1'
                    }
                    channels.push(channel);
                    serialize(jsonDbPath, channels);

                    if (messageToDelete) {
                        messageToDelete.delete();
                    }
                    await waitAndDeleteMessage(replyMsg, 3000);
                } else if (cld.values[0] === '2') {
                    const messageToDelete = await interaction.channel.messages.fetch(msg.id);
                    let channel = await interaction.guild.channels.create({
                        name: `↪ | Créer ton channel`,
                        type: Discord.ChannelType.GuildVoice,
                    })
                    const replyMsg = await interaction.channel.send({content: `Le salon ${channel} a été créé !`, ephemeral: true})

                    // json
                    channel = {
                        id: channel.id,
                        server: channel.guild.id,
                        name: channel.name,
                        type: 'pilote',
                        value: '2'
                    }
                    channels.push(channel);
                    serialize(jsonDbPath, channels);

                    if (messageToDelete) {
                        messageToDelete.delete();
                    }
                    await waitAndDeleteMessage(replyMsg, 3000);

                } else if (cld.values[0] === '3') {
                    const messageToDelete = await interaction.channel.messages.fetch(msg.id);
                    let channel = await interaction.guild.channels.create({
                        name: `↪ | Créer ton channel`,
                        type: Discord.ChannelType.GuildVoice,
                    })
                    const replyMsg = await interaction.channel.send({content: `Le salon ${channel} a été créé !`, ephemeral: true})

                    // json
                    channel = {
                        id: channel.id,
                        server: channel.guild.id,
                        name: channel.name,
                        type: 'pilote',
                        value: '3'
                    }
                    channels.push(channel);
                    serialize(jsonDbPath, channels);

                    if (messageToDelete) {
                        messageToDelete.delete();
                    }
                    await waitAndDeleteMessage(replyMsg, 3000);

                } else if (cld.values[0] === '4') {
                    const messageToDelete = await interaction.channel.messages.fetch(msg.id);
                    let channel = await interaction.guild.channels.create({
                        name: `↪ | Créer ton channel`,
                        type: Discord.ChannelType.GuildVoice,
                    })
                    const replyMsg = await interaction.channel.send({content: `Le salon ${channel} a été créé !`, ephemeral: true})
                    
                    // json
                    channel = {
                        id: channel.id,
                        server: channel.guild.id,
                        name: channel.name,
                        type: 'pilote',
                        value: '4'
                    }
                    channels.push(channel);
                    serialize(jsonDbPath, channels);

                    if (messageToDelete) {
                        messageToDelete.delete();
                    }
                    await waitAndDeleteMessage(replyMsg, 3000);

                } else if (cld.values[0] === '5') {
                    const messageToDelete = await interaction.channel.messages.fetch(msg.id);
                    let channel = await interaction.guild.channels.create({
                        name: `↪ | Créer ton channel`,
                        type: Discord.ChannelType.GuildVoice,
                    })
                    const replyMsg = await interaction.channel.send({content: `Le salon ${channel} a été créé !`, ephemeral: true})
                    
                    // json
                    channel = {
                        id: channel.id,
                        server: channel.guild.id,
                        name: channel.name,
                        type: 'pilote',
                        value: '5'
                    }
                    channels.push(channel);
                    serialize(jsonDbPath, channels);

                    if (messageToDelete) {
                        messageToDelete.delete();
                    }
                    await waitAndDeleteMessage(replyMsg, 3000);
                }
            })
        }


    }
}
