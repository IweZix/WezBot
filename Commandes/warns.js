const Discord = require('discord.js')
const config = require('../config.js')
const { warnsEmbed } = require('../Fonctions/embed.js')

const fs = require('fs');
const path = require('node:path');
const { log } = require('console');

const jsonDbPath = __dirname + '/../data/warn.json';

const WARNS = [
    {
        id: "id",
        server: "server",
        user: "user",
        reason: "reason"
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

  name: "warns",
  description: "Permet de voir les warns d'un membre",
  permission: Discord.PermissionFlagsBits.ModerateMembers,
  dm: false,
  category: "Modération",
  options: [
    {
      type: 'user',
      name: 'membre',
      description: "L'utilisateur dont on veut connaitre les warns",
      required: true
    }
  ],

  async run(bot, message, args) {

    try {

        // verif user
        let user = await bot.users.fetch(args._hoistedOptions[0].value)
        if (!user) return message.reply("Tu n'as pas entré le membre dont tu veux voir les warn !")
        let member = message.guild.members.cache.get(user.id)

        const warns = parse(jsonDbPath, WARNS);
        const userWarns = warns.filter(warn => warn.id === user.id);
        const serverWarns = userWarns.filter(warn => warn.server === message.guild.id);
        serverWarns.reverse();

        if (serverWarns.length === 0) return message.reply("Ce membre n'a aucun warn !");

        if (serverWarns.length > 5) serverWarns.length = 5;
        let onlyWarns = [];
        serverWarns.forEach(warn => { 
            onlyWarns.push(warn.reason) 
        });

        const embed = warnsEmbed(user, onlyWarns);

        // return
        return message.reply({embeds: [embed]});

    } catch (err) {
        console.log(err)
        return message.reply("Une erreur est survenue lors de l'exécution de la commande !");
    }
  }
}