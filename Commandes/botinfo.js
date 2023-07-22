const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js')
const config = require('../config.js')

module.exports = {
    name: "botinfo",
    description: "Permet de voir mes informations",
    permission: "Aucune",
    dm: false,
    category: "Informations",

    async run(bot, message, args, db) {
        try {

            const button = new ActionRowBuilder ()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle('5')
                        .setLabel('Site Web')
                        .setURL('https://iwezix.xyz')
                        .setEmoji('🌐'),
                    new ButtonBuilder()
                        .setStyle('5')
                        .setLabel('Support')
                        .setURL('https://discord.gg/rtk3gurBm2')
                        .setEmoji('🛠'),
                    new ButtonBuilder()
                        .setStyle('5')
                        .setLabel('Inviter')
                        .setURL('https://discord.com/oauth2/authorize?client_id=1049396684075053077&permissions=8&scope=bot%20applications.commands')
                        .setEmoji('➕'),
                );

                const embed = new EmbedBuilder()
                .setTitle(`Informations du bot`)
                .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
                .setColor("FF7300")
                .setDescription(`
                __**Information Bot**__
                > **Developpeur :** <@${config.ownerID}>
                > **Nom :** ${bot.user.username}
                > **Tag :** ${bot.user.discriminator}
                > **ID :** ${bot.user.id}
                > **Discord.js :** v${Discord.version}
                > **Node.js :** ${process.version}
                > ** version :** v${config.version}      
                > **UpTime :** ${Math.round(bot.uptime / (1000 * 60 * 60)) + "h " + (Math.round(bot.uptime / (1000 * 60)) % 60) + "m " + (Math.round(bot.uptime / 1000) % 60) + "s "}

                __**Information Compte**__
                > **Création du compte :** ${bot.user.createdAt}
                > **Date d'arrivée sur le serveur :** ${bot.user.joinedAt}
                `)
                .setFooter({text: `© ${bot.user.username} | ${config.version}`})
                .setTimestamp()
                
                message.reply({embeds: [embed], components: [button]})
        } catch (error) {
            console.log(error)
        }
    }
}
