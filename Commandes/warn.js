const Discord = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js')
const { warnEmbed } = require('../Fonctions/embed.js')

const fs = require('fs');
const path = require('node:path');

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

  name: "warn",
  description: "Permet de warn un membre",
  permission: Discord.PermissionFlagsBits.ModerateMembers,
  dm: false,
  category: "Modération",
  options: [
    {
      type: 'user',
      name: 'membre',
      description: "L'utilisateur à warn",
      required: true
    }, {
      type: 'string',
      name: 'raison',
      description: 'La raison du warn',
      required: true
    }
  ],

  async run(bot, message, args) {

    try {

        // verif user
        let user = await bot.users.fetch(args._hoistedOptions[0].value)
        if (!user) return message.reply("Tu n'as pas entré de membre à warn !")
        let member = message.guild.members.cache.get(user.id)

        // verif reaspn
        let reason = args.get("raison").value
        if (!reason) reason = "Pas de raison fournie.";

        // condition
        if (message.user.id === user.id) return message.reply("Tu ne peux pas te warn toi-même !");
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas warn le propriétaire du serveur !");
        if (member && !member.bannable) return message.reply("Je ne peux pas warn ce membre !");
        if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas warn cette personne !");

        // try to send a message to user
        try {
            await user.send(`Tu as été warn du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)
        } catch (err) {}

        // json
        const warns = parse(jsonDbPath, WARNS);
        const newWarn = {
            id: user.id,
            server: message.guild.id,
            user: user.username,
            reason: reason
        }
        warns.push(newWarn);
        serialize(jsonDbPath, warns);

        // créer un embed avec la fonction warnEmbed dans Fonctions/embed.js
        const embed = warnEmbed(user, reason);

        // return
        return message.reply({embeds: [embed]});

    } catch (err) {
        console.log(err)
        return message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true});
    }
  }
}