const Discord = require("discord.js")
const { unmuteEmbed } = require('../../Fonctions/embed.js')

const ms = require("ms")

module.exports = {

    name: "unmute",
    description:"Unmute un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre a unmute",
            required: true,
            autocomplete: false,
        }, {
            type: "string",
            name: "raison",
            description: "La raison du unmute",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {
        try {
            let user = args.getUser("membre");
            if(!user) return message.reply("Pas de membre !")
            let member = message.guild.members.cache.get(user.id)
            if(!member) return message.reply("Pas de membre !")

            let reason = args.getString("raison")
            if(!reason) reason = "Pas de raison fournie .";

            if(!member.moderatable) return message.reply("Je ne peux pas unmute ce membre !")
            if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Vous ne pouvez pas unmute ce membre")
            if(!member.isCommunicationDisabled()) return message.reply("Ce membre n'est pas mute")

            try {
                await user.send(`Vous avez été unmute par ${message.user.tag} pour la raison : \`${reason}\``)
            } catch (err) {
                console.log(err)
            }

            const embed = unmuteEmbed(user, reason)

            await message.reply(`${message.user} a unmute ${user.tag} pour la raison : \`${reason}\``)

            await member.timeout(null, reason)
        } catch (error) {
            console.log(error)
            return message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true});
        }
    }
}