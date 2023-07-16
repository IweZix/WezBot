const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const config = require("../config.js")

/**
 * Permet de créer un salon vocal ou textuel en rejoignant un salon pilote
 * @param {Discord} bot le bot discord
 * @param {Channel} oldState le dernier dans lequel était l'utilisateur
 * @param {Channel} newState le salon dans lequel l'utilisateur est
 * @returns si l'utilisateur rejoint un salon pilote, créer un salon vocal ou textuel
 *          si l'utilisateur quitte un salon vocal vérifie si le salon commence par ___
 */
module.exports = async (bot, oldState, newState) => {

    let oldChannel = oldState.channel  
    let newChannel = newState.channel
    let user = newState.member.user

    // si l'utilisateur quitte un salon vocal
    if (!newChannel) {
        // vérifie si le salon commence par ___
        if (oldChannel.name.startsWith("🔊 | ")) {
            // vérifie si le salon est vide
            if (oldChannel.members.size === 0) return oldChannel.delete()
        }
        return
    }

    // vérifie si l'utilisateur s'est muter ou démuter
    if (oldChannel?.id === newChannel?.id) return

    // si le salon vocal commence par ___
    if (newChannel.name.startsWith("↪ | Rejoint pour créer") || newChannel.name.startsWith("↪ | Créer ton channel") || newChannel.name.startsWith("↪ | Créer ta vocal")) {
        if (oldChannel && oldChannel.name.startsWith("🔊 | ")){
            // vérifie si le salon est vide
            if (oldChannel.members.size === 0) oldChannel.delete()
        }
        // créer un salon vocal
        let channel = await newChannel.guild.channels.create({
            name: `🔊 | ${user.username}`,
            type: Discord.ChannelType.GuildVoice,
            parent: newChannel.parentId,
        })
        // déplace l'utilisateur dans le salon vocal créer
        newChannel.guild.members.cache.get(user.id).voice.setChannel(channel.id)
    }

    // si le salon textuel commence par ___
    if (newChannel.name.startsWith("💬 | Créer ton salon") || newChannel.name.startsWith("💬 | Rejoint pour créer")){
        if (oldChannel && oldChannel.name.startsWith("🔊 | ")){
            // vérifie si le salon est vide
            if (oldChannel.members.size === 0) oldChannel.delete()
        }
        // créer un salon textuel
        let channel = await newChannel.guild.channels.create({
            name: `💬 | ${user.username}`,
            type: Discord.ChannelType.GuildText,
            parent: newChannel.parentId,
        })
        // retirer l'utilisateur du salon vocal
        newChannel.guild.members.cache.get(user.id).voice.setChannel(null)

        // ajouter les permissions
        // pour le créateur
        channel.permissionOverwrites.create(newChannel.guild.members.cache.get(user.id), {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            AttachFiles: true,
            EmbedLinks: true,
        }),
        // pour @everyone
        channel.permissionOverwrites.create(newChannel.guild.roles.everyone, {
            ViewChannel: false,
            SendMessages: false,
            ReadMessageHistory: false,
            AttachFiles: false,
        })

        let embed = new EmbedBuilder()
        .setColor(0xff7300)
        .setTitle("Fermer le salon")
        .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
        .setDescription(`
        Voici votre salon textuel, vous maintenant discutez avec vos amis.
        Si vous désirez fermer se salon, vous pouvez cliquer sur le bouton **Fermer le salon**.
        `)
        .setFooter({text: `© ${bot.user.username} | ${config.version}`})
        .setTimestamp()

        const button = new ActionRowBuilder ()
        .addComponents(
            new ButtonBuilder()
                .setStyle('4')
                .setLabel('Fermer le salon')
                .setCustomId('closeText'),
        )

        channel.send({embeds: [embed], components: [button]})
    }
} 