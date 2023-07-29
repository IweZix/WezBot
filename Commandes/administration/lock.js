const Discord = require("discord.js")

module.exports = {
    name: "lock",
    description: "Permet de fermer un channel",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    category: "Modération",
    dm: true,
    options: [
        {
            type: "channel",
            name: "salon",
            description: "le salon a fermer",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {
        try {
            let channel = args.getChannel("salon")
            let c = message.guild.channels.cache.get(channel.id)
            if(!channel) return message.reply(`**Le salon n'a pas été trouvé**`)
            if(!c) return message.reply(`**Le salon n'a pas été trouvé**`)

            await c.permissionOverwrites.create(message.guild.roles.everyone, {
                SendMessages: false
            })
            await message.reply({ content: `**Le channnel ${channel} a été lock avec Succes !**`, ephemeral: true })
            await c.send(`**Ce channel a été lock par \`${message.user.username}\``)
        } catch (error) {
            console.log(error)
            return message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true})
        }
    }
}