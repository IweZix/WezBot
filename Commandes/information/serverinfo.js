const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType} = require('discord.js')
const config = require('../../config.js')

module.exports = {
    name: "serverinfo",
    description: "Permet de voir les informations du serveur",
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
            )


                const embed = new EmbedBuilder()
                .setTitle(`Informations du serveur`)
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setColor("#FF7300")
                .setDescription(`
                __**Information Serveur**__
                > **Nom :** ${message.guild.name}
                > **ID :** ${message.guild.id}
                > **Propriétaire :** <@${message.guild.ownerId}>
                > **Boost :** ${message.guild.premiumSubscriptionCount}
                > **Niveau de boost :** ${message.guild.premiumTier}
                > **Création le :** ${message.guild.createdAt}
                > **Verification :** ${message.guild.verificationLevel}/5
__**Information Membres**__
                > **Membres :** ${message.guild.memberCount}
                > **Bot(s) :** ${message.guild.members.cache.filter(member => member.user.bot).size}
                > **Utilisateur(s) :** ${message.guild.members.cache.filter(member => !member.user.bot).size}
                
__**Information Channels**__
                > **Catégorie(s) :** ${message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size}
                > **Salon(s) Textuel(s) :** ${message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size}
                > **Salon(s) Vocal(s) :** ${message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size}
                > **Forum(s) :** ${message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildNews).size}
                > **Rôle(s) :** ${message.guild.roles.cache.size}
                > **Emote(s) :** ${message.guild.emojis.cache.size}
                
                `)
                
                message.reply({embeds: [embed], components: [button]})
        } catch (error) {
            console.log(error)
            return message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true});
        }
    }
}