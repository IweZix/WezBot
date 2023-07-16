const Discord = require("discord.js")
const intents = new Discord.IntentsBitField(3276799)
const bot = new Discord.Client({intents})
const loadCommands = require("./Loaders/loadCommands")
const loadEvents = require("./Loaders/loadEvents")
const config = require("./config")

bot.commands = new Discord.Collection()
bot.fonction = {
    createId: require("./Fonctions/createId"),
    calculXP: require("./Fonctions/calculXP")
}
bot.color = "0xff7300"

bot.login(config.token)

process.on('unhandledRejection', error => {
    if (error.name === "DiscordAPIError[10062]") return;
    else console.error('Unhandled promise rejection:', error);
});

loadCommands(bot)
loadEvents(bot)