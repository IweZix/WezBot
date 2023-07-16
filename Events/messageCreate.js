const Discord = require("discord.js");

const fs = require('fs');
const path = require('node:path');

const jsonDbPath = __dirname + '/../data/message.json';

const MESSAGES = [
    {
        id: "message_id",
        server: "server",
        channel: "channel",
        user: "user",
        user_id: "user_id",
        content: "content",
        date: "date",
        time: "time"
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

module.exports = async (bot, message) => {

    // si le message est envoyé par un bot ou dans un dm
    if (message.author.bot || message.channel.type === Discord.ChannelType.AnnouncementThread.DM) return

    // add message to json data/message.json
    const messages = parse(jsonDbPath, MESSAGES);
    messages.push({
        id: message.id,
        server: message.guild.id,
        channel: message.channel.id,
        user: message.author.tag,
        user_id: message.author.id,
        content: message.content,
        date: message.createdAt.toLocaleDateString(),
        time: message.createdAt.toLocaleTimeString()
    })
    serialize(jsonDbPath, messages);

    // empèche les liens
    if (message.content.includes("http://") || message.content.includes("https://" || message.content.includes("discord.gg"))) {
        
        // if (message.member.cache.hasPermission("ID_du_role")) return;
        
        await message.delete()
        try {
            await message.member.send(`Le lien **${message.content}** est interdit sur le serveur **${message.guild.name}**.`)
        } catch (e) {}
        await message.channel.send("Tu ne peux pas envoyer de lien ici !")
    }
}