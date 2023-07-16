const Discord = require("discord.js")
//const loadDatabase = require("../Loaders/loadDatabase")
const loadSlashCommands = require("../Loaders/loadSlashCommands")
const { ActivityType } = require('discord.js');


module.exports = async bot => {

    /*bot.db = await loadDatabase()
    bot.db.connect(function (err) {

        if (err) {
            console.log("❌ | Erreur lors de la connexion à la base de données !")
            return console.log(err)
        }
        console.log("✔️ | Base de données connectée avec succès !")
    })*/

    await loadSlashCommands(bot)
    
    bot.user.setPresence({
        activities: [
            { 
                name: `/help | ${bot.guilds.cache.size} serveurs`, 
                type: ActivityType.Playing, 
                url: "https://www.twitch.tv/iweziix"
            }
        ],
        status: 'online',
      });

    console.log(`✔️ | ${bot.user.tag} est en ligne !`)


}