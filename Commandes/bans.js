const Discord = require('discord.js');
const { bansEmbed } = require('../Fonctions/embed.js')

const fs = require('fs');
const path = require('node:path');

const jsonDbPath = __dirname + '/../data/mute.json';

const BANS = [
    {
      user_id: "id",
      user: "user",
      server_id: "server",
      reason: "reason",
      date: "date"
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

module.exports = {
    name: "bans",
    description: "Affiche la liste des bans du serveur",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Modération",

    async run(bot, message, args) {
        try {
            
            let server = message.guild;
            
            const bans = parse(jsonDbPath, BANS);
            const serverBans = bans.filter((ban) => ban.server_id === server.id);
            const length = bans.filter((ban) => ban.server_id === server.id);
            
            if (serverBans.length === 0) return message.reply("Il n'y a aucun ban sur ce serveur.");

            if (serverBans.length > 5) serverBans.length = 5;
            
            const embed = bansEmbed(serverBans, length.length);

            return message.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            return message.reply("Une erreur est survenue lors de l'exécution de la commande.");
        }
    }
}