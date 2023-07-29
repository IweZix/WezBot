const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const config = require("../config.js")
const fs = require('fs');
const ms = require('ms');
const path = require('node:path');

const { closeTicketButton, deleteTicketButton } = require('../Fonctions/button.js')
const { closeTicketEmbed } = require('../Fonctions/embed.js')

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
 * Create the last directory of a file path if it does not exist
 * @param {String} filePath - path to the .json file
 */
function createPotentialLastDirectory(filePath) {
    const pathToLastDirectory = filePath.substring(0, filePath.lastIndexOf(path.sep));
    if (fs.existsSync(pathToLastDirectory)) return;
    fs.mkdirSync(pathToLastDirectory);
}

/**
 * Delete a message when timeInMilliseconds was past
 * @param {String} message 
 * @param {Integer} timeInMilliseconds 
 */
async function waitAndDeleteMessage(message, timeInMilliseconds) {
    await new Promise(resolve => setTimeout(resolve, timeInMilliseconds));
    message.delete();
}

module.exports = async (bot, interaction, message) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        // base
        // let command = require(`../Commandes/${interaction.commandName}`}`);
        const command = bot.commands.get(interaction.commandName);
        command.run(bot, interaction, interaction.options, bot.db)
    }


    if (interaction.isButton()) {

        // button to cancel a embed
        if (interaction.customId === "cancel") {
            interaction.message.delete()
        }

        // ****************
        // * PILOTE VOCAL *
        // ****************

        // button to get pilote vocal embed
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

        // button to get create pilote vocal embed
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
                    const replyMsg = await interaction.channel.send({ content: `Le salon ${channel} a été créé !`, ephemeral: true })

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
                    const replyMsg = await interaction.channel.send({ content: `Le salon ${channel} a été créé !`, ephemeral: true })

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
                    const replyMsg = await interaction.channel.send({ content: `Le salon ${channel} a été créé !`, ephemeral: true })

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
                    const replyMsg = await interaction.channel.send({ content: `Le salon ${channel} a été créé !`, ephemeral: true })

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
                    const replyMsg = await interaction.channel.send({ content: `Le salon ${channel} a été créé !`, ephemeral: true })

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

        // **********
        // * TICKET *
        // **********

        // button to create a ticket
        if (interaction.customId === "ticket") {
            try {
                const channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.tag}`,
                    type: Discord.ChannelType.GuildText,
                })
    
                if (interaction?.channel?.parent?.id)
                    await channel.setParent(interaction.channel.parent.id)
    
                await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                    ViewChannel: false
                }),
    
                await channel.permissionOverwrites.create(interaction.user, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true,
                    AttachFiles: true,
                    EmbedLinks: true,
                }),
    
                await channel.setTopic(interaction.user.id);
    
                await channel.send({ embeds: [closeTicketEmbed()], components: [closeTicketButton()] })
    
                const msg = await interaction.channel.send({ content: `Votre ticket a été créé : ${channel}`, ephemeral: true });

                waitAndDeleteMessage(msg, 3000);
            } catch (error) {
                console.log(error);
                return message.reply({ content: `Une erreure est survenue lors de la commande`, ephemeral: true })
            }
        }


        // button to close a ticket
        if (interaction.customId === "close") {
            let user = bot.users.cache.get(interaction.channel.topic)
            try {
                interaction.channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                    ViewChannel: false,
                    SendMessages: false,
                    ReadMessageHistory: false,
                    AttachFiles: false,
                    EmbedLinks: false,
                }),
                user.send({ content: "Votre ticket a été fermé !" })
                await interaction.deferUpdate();
                interaction.channel.send({ content: `Ce ticket à été fermé par ${user}`, components: [deleteTicketButton()] })
            } catch (error) {
                console.log(error);
                return message.reply({ content: `Une erreure est survenue lors de la commande`, ephemeral: true })
            }
        }

        // button to delete a ticket
        if (interaction.customId === "delete") {
            try {
                await interaction.channel.delete()
            } catch (error) {
                console.log(error);
                return message.reply({ content: `Une erreure est survenue lors de la commande`, ephemeral: true })
            }

        }

    }
}