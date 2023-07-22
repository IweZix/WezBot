const Discord = require('discord.js')

const { banEmbed } = require('../Fonctions/embed.js')

const fs = require('fs');
const path = require('node:path');

const jsonDbPath = __dirname + '/../data/warn.json';

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

  name: "ban",
  description: "Permet de bannir un membre",
  permission: Discord.PermissionFlagsBits.BanMembers,
  dm: false,
  category: "Modération",
  options: [
    {
      type: 'user',
      name: 'membre',
      description: "L'utilisateur à bannir",
      required: true
    }, {
      type: 'string',
      name: 'raison',
      description: 'La raison du banissement',
      required: true
    }
  ],

  async run(bot, message, args) {

    try {

      let user = await bot.users.fetch(args._hoistedOptions[0].value)
      if (!user) return message.reply("Tu n'as pas entré de membre à bannir !")
      let member = message.guild.members.cache.get(user.id)
      console.log(user)
      console.log(member)

      let reason = args.get("raison").value
      if (!reason) reason = "Pas de raison fournie.";

      if (message.user.id === user.id) return message.reply("Tu ne peux pas te bannir toi même !")
      if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas bannir le propriétaire du serveur !")
      if (member && !member?.bannable) return message.reply("Je ne peux pas bannir ce membre !")
      if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas bannir cette personne !")
      if ((await message.guild.bans.fetch()).get(user.id)) return message.reply("Ce membre est déjà ban !")

      try {
        await user.send(`
          Tu as été banni du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\`.\n 
          Si tu souhaites contester ce ban, tu peux contacter ${message.user.tag} pour qu'il te mette en relation avec le propriétaire du serveur.
        `)
      } catch (err) {}

      const bans = parse(jsonDbPath, BANS);
      bans.push({
        user_id: user.id,
        user: user.tag,
        server_id: message.guild.id,
        reason: reason,
        date: Date.now()
      });
      serialize(jsonDbPath, bans);

      const embed = banEmbed(user, reason);

      await message.guild.bans.create(user.id, { reason: reason });

      return message.reply({ embeds: [embed] });

    } catch (err) {
        return message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true})
    }
  }
}