const Discord = require("discord.js")
const loadSlashCommands = require("../Loaders/loadSlashCommands")
const { ActivityType } = require('discord.js');


module.exports = async bot => {

    await loadSlashCommands(bot)

    bot.user.setPresence({
        activities: [
            {
                name: `${bot.guilds.cache.size} serveurs`,
                type: ActivityType.Watching,
            }/*,
            {
                name: `${bot.guilds.cache.size} serveurs`,
                type: ActivityType.Streaming,
                url: "https://www.twitch.tv/iweziix"
            }*/
        ],
        status: 'online',
    });

    console.log(`✔️ | ${bot.user.tag} est en ligne !`)
}