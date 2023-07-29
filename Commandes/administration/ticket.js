const Discord = require('discord.js')

const { createTicketEmbed } = require('../../Fonctions/embed.js')
const { createTicketButton } = require('../../Fonctions/button.js')


module.exports = {

    name: "ticket",
    description: "Permet de créer un ticket",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "administration",
    options: [
        {
            type: 'channel',
            name: 'salon',
            description: "Le salon qui va recevoir l'embed",
            required: true
        }
    ],

    async run(bot, message, args) {

        try {
            const channel = args.getChannel("salon");
            await channel.send({embeds: [createTicketEmbed()], components: [createTicketButton()] })
            await message.reply({ content: `L'embed à été envoyer dans ${channel}`, ephemeral: true })
        } catch (err) {
            console.log(err);
            return message.reply({ content: `Une erreure est survenue lors de la commande`, ephemeral: true })
        }
    }
}