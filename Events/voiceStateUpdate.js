const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const config = require("../config.js")
const fs = require("fs")
const path = require("path")

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

/**
 * Allows you to create a voice or text channel by joining a pilot channel
 * @param {Discord} bot the bot
 * @param {Channel} oldState last channel where user was
 * @param {Channel} newState channel where user is
 * @returns if user join pilote channel create a temp channel
 *          if user leave a temp channel delete this channel if member size < 1
 */
module.exports = async (bot, oldState, newState) => {

    const channels = parse(jsonDbPath, CHANNELS);

    let oldChannel = oldState.channel
    let newChannel = newState.channel
    let user = newState.member.user

    let pronom = "";
    let voyelles = ["a", "e", "i", "o", "u", "y"];
    if (voyelles.includes(user.username[0].toLowerCase())) {
        pronom = "d'";
    }

    if (oldChannel !== null && newChannel !== null && oldChannel.id !== newChannel.id) {
        let oldChannelData = channels.find(channel => channel.id === oldChannel.id);
        if (oldChannelData && oldChannelData.type === "temp") {
            if (oldChannel.members.size === 0) {
                oldChannel.delete();
                channels.splice(channels.indexOf(oldChannelData), 1);
                serialize(jsonDbPath, channels);
            }
        }
        let newChannelData = channels.find(channel => channel.id === newChannel.id);
        if (newChannelData && newChannelData.type === "pilote") {
            if (newChannelData.value === '1') {
                let channel = await newChannel.guild.channels.create({
                    name: `Vocal ${pronom}${user.username}`,
                    type: Discord.ChannelType.GuildVoice,
                    parent: newChannel.parentId,
                })
                const jsonChannel = {
                    id: channel.id,
                    server: channel.guild.id,
                    name: channel.name,
                    type: "temp",
                    value: "2"
                };
                channels.push(jsonChannel);
                serialize(jsonDbPath, channels);
                newChannel.guild.members.cache.get(user.id).voice.setChannel(channel.id);
            }
            if (newChannelData.value === '2') {
                let channel = await newChannel.guild.channels.create({
                    name: `Salon ${pronom}${user.username}`,
                    type: Discord.ChannelType.GuildVoice,
                    parent: newChannel.parentId,
                })
                const jsonChannel = {
                    id: channel.id,
                    server: channel.guild.id,
                    name: channel.name,
                    type: "temp",
                    value: "2"
                };
                channels.push(jsonChannel);
                serialize(jsonDbPath, channels);
                newChannel.guild.members.cache.get(user.id).voice.setChannel(channel.id);
            }
            if (newChannelData.value === '3') {
                let channel = await newChannel.guild.channels.create({
                    name: `Salon temporaire ${pronom}${user.username}`,
                    type: Discord.ChannelType.GuildVoice,
                    parent: newChannel.parentId,
                })
                const jsonChannel = {
                    id: channel.id,
                    server: channel.guild.id,
                    name: channel.name,
                    type: "temp",
                    value: "3"
                };
                channels.push(jsonChannel);
                serialize(jsonDbPath, channels);
                newChannel.guild.members.cache.get(user.id).voice.setChannel(channel.id);
            }
            if (newChannelData.value === '4') {
                let channel = await newChannel.guild.channels.create({
                    name: `🎮 ${pronom}${user.username}`,
                    type: Discord.ChannelType.GuildVoice,
                    parent: newChannel.parentId,
                })
                const jsonChannel = {
                    id: channel.id,
                    server: channel.guild.id,
                    name: channel.name,
                    type: "temp",
                    value: "4"
                };
                channels.push(jsonChannel);
                serialize(jsonDbPath, channels);
                newChannel.guild.members.cache.get(user.id).voice.setChannel(channel.id);
            }
            if (newChannelData.value === '5') {
                let channel = await newChannel.guild.channels.create({
                    name: `🔊 ${pronom}${user.username}`,
                    type: Discord.ChannelType.GuildVoice,
                    parent: newChannel.parentId,
                })
                const jsonChannel = {
                    id: channel.id,
                    server: channel.guild.id,
                    name: channel.name,
                    type: "temp",
                    value: "5"
                };
                channels.push(jsonChannel);
                serialize(jsonDbPath, channels);
                newChannel.guild.members.cache.get(user.id).voice.setChannel(channel.id);
            }
        }
    }

    // if user leave a channel but don't join an other
    if (oldChannel !== null && newChannel === null) {
        let channel = channels.find(channel => channel.id === oldChannel.id)
        if (channel) {
            if (channel.type === "temp") {
                if (oldChannel.members.size === 0) {
                    oldChannel.delete();
                    channels.splice(channels.indexOf(channel), 1);
                    serialize(jsonDbPath, channels);
                }
            }
        }
    }

    // if user join a channel but don't leave another
    if (oldChannel === null && newChannel !== null) {
        let channel = channels.find(channel => channel.id === newChannel.id)
        if (channel) {
            if (channel.type === "pilote") {
                if (channel.value === '1') {
                    let channel = await newChannel.guild.channels.create({
                        name: `Vocal ${pronom}${user.username}`,
                        type: Discord.ChannelType.GuildVoice,
                        parent: newChannel.parentId,
                    })
                    const jsonChannel = {
                        id: channel.id,
                        server: channel.guild.id,
                        name: channel.name,
                        type: "temp",
                        value: "1"
                    };
                    channels.push(jsonChannel);
                    serialize(jsonDbPath, channels);
                    newChannel.guild.members.cache.get(user.id).voice.setChannel(channel.id);
                }
                if (channel.value === '2') {
                    let channel = await newChannel.guild.channels.create({
                        name: `Salon ${pronom}${user.username}`,
                        type: Discord.ChannelType.GuildVoice,
                        parent: newChannel.parentId,
                    })
                    const jsonChannel = {
                        id: channel.id,
                        server: channel.guild.id,
                        name: channel.name,
                        type: "temp",
                        value: "2"
                    };
                    channels.push(jsonChannel);
                    serialize(jsonDbPath, channels);
                    newChannel.guild.members.cache.get(user.id).voice.setChannel(channel.id);
                }
                if (channel.value === '3') {
                    let channel = await newChannel.guild.channels.create({
                        name: `Salon temporaire ${pronom}${user.username}`,
                        type: Discord.ChannelType.GuildVoice,
                        parent: newChannel.parentId,
                    })
                    const jsonChannel = {
                        id: channel.id,
                        server: channel.guild.id,
                        name: channel.name,
                        type: "temp",
                        value: "3"
                    };
                    channels.push(jsonChannel);
                    serialize(jsonDbPath, channels);
                    newChannel.guild.members.cache.get(user.id).voice.setChannel(channel.id);
                }
                if (channel.value === '4') {
                    let channel = await newChannel.guild.channels.create({
                        name: `🎮 ${pronom}${user.username}`,
                        type: Discord.ChannelType.GuildVoice,
                        parent: newChannel.parentId,
                    })
                    const jsonChannel = {
                        id: channel.id,
                        server: channel.guild.id,
                        name: channel.name,
                        type: "temp",
                        value: "4"
                    };
                    channels.push(jsonChannel);
                    serialize(jsonDbPath, channels);
                    newChannel.guild.members.cache.get(user.id).voice.setChannel(channel.id);
                }
                if (channel.value === '5') {
                    let channel = await newChannel.guild.channels.create({
                        name: `🔊 ${pronom}${user.username}`,
                        type: Discord.ChannelType.GuildVoice,
                        parent: newChannel.parentId,
                    })
                    const jsonChannel = {
                        id: channel.id,
                        server: channel.guild.id,
                        name: channel.name,
                        type: "temp",
                        value: "5"
                    };
                    channels.push(jsonChannel);
                    serialize(jsonDbPath, channels);
                    newChannel.guild.members.cache.get(user.id).voice.setChannel(channel.id);
                }
            }
        }
    }
}
