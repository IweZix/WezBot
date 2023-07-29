const Discord = require('discord.js')

const { dailyEmbed } = require('../../Fonctions/embed.js')
const { oneDayPassed } = require('../../Fonctions/function.js')

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

  name: "daily",
  description: "Permet travailler",
  permission: "Aucune",
  dm: false,
  category: "Économie",

  async run(bot, message, args) {

    try {

        const dailys = parse(jsonDbPath, DAILYS);

        const user = message.user;
        const server = message.guild;
        let money = 0;
        const date = new Date();
        const gains = Math.floor(Math.random() * 100) + 1;

        const dailyUser = dailys.find((daily) => daily.user_id === user.id && daily.server_id === message.guild.id);
        const index = dailys.indexOf(dailyUser);

        
        if (dailyUser) {
            dailys.splice(index, 1);
            if (!oneDayPassed(dailyUser.date_time, date.getTime())) {
                return await message.reply("Vous avez déjà fait votre daily aujourd'hui");
            }
            money = dailyUser.money + gains;
            dailys[index].money = money;
            dailys[index].date_time = date.getTime();
            message.reply(`Vous avez gagné ${gains} coins !\nSolde : `);
        } else {
            dailys.push({
                user_id: user.id,
                user: user.tag,
                server_id: server.id,
                money: gains,
                date_time: date.getTime()
            });
            message.reply(`Vous avez gagné ${gains} coins !\nSolde : `);
        }

        serialize(jsonDbPath, dailys);

    } catch (err) {
        console.log(err);
        return message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true});
    }
  }
}