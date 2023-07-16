const { MessageActivityType } = require("discord.js")
const Discord = require("discord.js")
const ms = require("ms")

module.exports = {

    name: "clear",
    description: "Permet de supprimer entre 1 et 100 messages d'un salon",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "channel",
            name : "salon",
            description : "Le salon où supprimer les messages",
            required : true
        }, {
            type: "number",
            name: "nombre",
            description: "Le nombre de messages à supprimer",
            required: true
        }
    ],

    async run(bot, message, args) {
        
        try {
            let channel = args.getChannel("salon")
            if(!channel) channel = message.channel
            if(channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) 
                return message.reply("Ce salon n'existe pas !")

            let number = args.getNumber("nombre")
            if (parseInt(number) <= 0 || parseInt(number) > 100) 
                return message.reply("Le nombre de messages à supprimer doit être compris entre 1 et 100 !")
            if(!number) return message.reply("Veuillez indiquer un nombre !")

            try {

                let messages = await channel.bulkDelete(parseInt(number))
                
                await message.reply({content: `J'ai supprimé ${messages.size} messages dans le salon ${channel} !`, ephemeral: true})

            } catch(err) {

                let messages = [...(await channel.messages.fetch()).filter(msg => (Date.now() - msg.createdAt) <= 1209600000).values()]
                if (messages.length <= 0) return message.reply("Il n'y a pas de messages à supprimer de moins de 14 jours !")
                await channel.bulkDelete(messages)

                await message.reply({content: `J'ai supprimé uniquement ${messages.size} messages dans le salon ${channel} car les autres dataient de plus de 14 jours !`, ephemeral: true})

            }
        } catch (error) {
            console.log(error)
        }
    }
}