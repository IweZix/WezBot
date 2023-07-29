const Discord = require('discord.js')

const { dailyEmbed } = require('../../Fonctions/embed.js')

const fs = require('fs');
const path = require('node:path');

const jsonDbPath = __dirname + '/../../data/money.json';

const BANKS = [
  {
    user_id: "id",
    user: "user",
    server_id: "server",
    money: "money",
    date_time: "date"
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

  name: "sendmoney",
  description: "Permet de faire un virement",
  permission: "Aucune",
  dm: false,
  category: "Économie",
  options: [
    {
      type: 'user',
      name: 'membre',
      description: "L'utilisateur receveur",
      required: true
    }, {
      type: 'integer',
      name: 'coins',
      description: "Montant",
      required: true
    }
  ],

  async run(bot, message, args) {

    try {

        // receveur
        let user = args.getUser("membre")
        if (!user) return message.reply("L'utilisateur n'existe pas !")

        // montant
        let coins = args.getInteger("coins")
        if (!coins) return message.reply("Le montant n'est pas valide !")

        // donateur
        let donor = message.user;
        if (!donor) return message.reply({content: `Le donneur n'existe pas`, ephemeral: true})

        // données
        const bank = parse(jsonDbPath, BANKS);

        // serveur
        const server = message.guild;

        const diff = coins

        // receveur
        const bankUser = bank.find((bank) => bank.user_id === user.id && bank.server_id === message.guild.id);
        const index = bank.indexOf(bankUser);

        // donateur
        const bankDonor = bank.find((bank) => bank.user_id === donor.id && bank.server_id === message.guild.id);
        const indexDonor = bank.indexOf(bankDonor);

        // condition
        if (index === indexDonor) return message.reply({content: `Le donneur est le même que le receveur`, ephemeral: true});
        if (!index || !indexDonor) return message.reply({content: `Le donneur ou le receveur n'as pas de compte en banque`, ephemeral: true});
        if (coins > bank[indexDonor].money) return message.reply({content: `Le montant de votre compte n'est pas suffisant`, ephemeral: true});

        // receveur
        bank[index].money += diff;
        bank[index].date_time = Date.now();

        // donateur
        bank[indexDonor].money -= diff;
        bank[indexDonor].date_time = Date.now();

        // sauvegarde

        serialize(jsonDbPath, bank);

        return message.reply({content: `${donor} à donner ${diff} à ${user}`})

    } catch (err) {
        console.log(err);
        return await message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true})
    }
  }
}