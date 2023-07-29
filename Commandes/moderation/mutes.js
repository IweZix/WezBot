const Discord = require('discord.js');
const { mutesEmbed } = require('../../Fonctions/embed.js')

const fs = require('fs');
const path = require('node:path');

const jsonDbPath = __dirname + '/../../data/mute.json';

const MUTES = [
    {
        id: "user_id",
        server: "server",
        user: "user",
        reason: "reason",
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

module.exports = {
    name: "mutes",
    description: "Affiche la liste des mutes d'un utilisateur",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: 'user',
            name: 'membre',
            description: 'Membre dont vous voulez voir les mutes',
            required: true,
        }
    ],

    async run(bot, message, args) {
        try {

            let user = await bot.users.fetch(args._hoistedOptions[0].value)
            if (!user) return message.reply("Tu n'as pas entré le membre dont tu veux voir les mutes !")
            
            const mutes = parse(jsonDbPath, MUTES);
            const userMutes = mutes.filter(mute => mute.id === user.id);
            const serverMutes = userMutes.filter(mute => mute.server === message.guild.id);
            serverMutes.reverse();

            if (serverMutes.length === 0) return message.reply("Ce membre n'a pas de mutes !");

            if (serverMutes.length > 5) serverMutes.length = 5;
            let onlyMutes = [];
            serverMutes.forEach(mute => { 
                onlyMutes.push(mute.reason) 
            });

            const embed = mutesEmbed(user, onlyMutes);

            // return
            return message.reply({ embeds: [embed] }); 

        } catch (err) {
            console.error(err);
            return message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true});
        }
    }
}
