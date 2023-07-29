const Discord = require('discord.js')

const { addMoney } = require('../../Fonctions/embed.js')

const fs = require('fs');
const path = require('node:path');

const jsonDbPath = __dirname + '/../../data/money.json';

const DAILYS = [
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

  name: "addmoney",
  description: "Permet d'ajouter de l'argent à un utilisateur",
  permission: Discord.PermissionFlagsBits.ModerateMembers,
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

        let user = args.getUser("membre")
        if (!user) return message.reply("L'utilisateur n'existe pas !")

        let coins = args.getInteger("coins")
        if (!coins) return message.reply("Le montant n'est pas valide !")

        const dailys = parse(jsonDbPath, DAILYS);

        const server = message.guild;
        let money = 0;
        const gains = coins

        const dailyUser = dailys.find((daily) => daily.user_id === user.id && daily.server_id === message.guild.id);
        const index = dailys.indexOf(dailyUser);

        const date = new Date();

        
        if (dailyUser) {
            dailys.splice(index, 1);
            money = dailyUser.money + gains;
            dailys.push({
              user_id: user.id,
              user: user.tag,
              server_id: server.id,
              money: money,
              date_time: dailyUser.date_time
          });
          const embed = addMoney(user, money, gains)
            message.reply({embeds: [embed]});
        } else {
            dailys.push({
                user_id: user.id,
                user: user.tag,
                server_id: server.id,
                money: gains,
                date_time: date.getTime()
            });
            const embed = addMoney(user, gains, gains)
            message.reply({embeds: [embed]});
        }

        serialize(jsonDbPath, dailys);

    } catch (err) {
        console.log(err);
        return await message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true})
    }
  }
}