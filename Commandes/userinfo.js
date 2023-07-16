const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js')
const config = require('../config.js')

module.exports = {
    name: "userinfo",
    description: "Permet de voir les informations d'un membre",
    permission: "Aucune",
    dm: false,
    category: "Informations",
    options: [
        {
            type: "user",
            name : "membre",
            description : "Le membre dont vous voulez avoir les informations",
            required : true,
        }
    ],

    async run(bot, message, args, db) {
        try {
            let user = args.getUser("membre")
            if (!user) return message.reply("L'utilisateur n'existe pas !")
            let member = message.guild.members.cache.get(user.id)
            if(!member) return message.reply("L'utilisateur n'existe pas !")

            let checkbot = " "
            if (member.user.bot) checkbot = "✅"
            else checkbot = "❌"

            const embed = new EmbedBuilder()
            .setTitle(`Informations de ${user.tag}`)
            .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
            .setColor("0xff7300")
            .setDescription(`
            __**Information Utilisateur**__
            
            > **Pseudo :** ${user.username}
            > **Tag :** ${user.tag}
            > **ID :** ${user.id}
            > **Rôles :** ${member.roles.cache.map(r => r).join(" | ")}

            __**Information Compte**__
            > **Bot :** ${checkbot}
            > **Création du compte :** ${user.createdAt}
            > **Date d'arrivée sur le serveur :** ${member.joinedAt}
            `)
            .setFooter({text: `© ${bot.user.username} | ${config.version}`})
            .setTimestamp()

            
            message.reply({embeds: [embed]})
        } catch (error) {
            console.log(error)
        }
    }
}