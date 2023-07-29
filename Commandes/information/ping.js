const Discord = require("discord.js")

module.exports = {
    name: "ping",
    description: "Affiche la latence du bot",
    permission: "Aucune",
    dm: true,
    category: "Informations",

    async run(bot, message, args) {
        try {
            await message.reply(`Ping : \`${bot.ws.ping}ms\``)
        } catch (error) {
            console.log(error)
            return message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true});
        }
    }
}