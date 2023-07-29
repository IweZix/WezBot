const Discord = require("discord.js")
const {
    EmbedBuilder, ActionRowBuilder } = require('discord.js')
const {
    supportWebInviteButton } = require('../../Fonctions/button.js');
const {
    helpEmbed,
    administrationEmbed,
    channelEmbed,
    economyEmbed,
    informationEmbed,
    moderationEmbed } = require('../../Fonctions/embed.js')

module.exports = {
    name: "help",
    description: "Permet de consulter le menu d'aide",
    permission: "Aucune",
    dm: false,
    category: "Informations",

    async run(bot, message, args) {
        try {

            let selectMenuOptions = [
                {
                    label: 'Administration',
                    value: 'administration',
                    emoji: '👑',
                },
                {
                    label: 'Channel',
                    value: 'channel',
                    emoji: '📁',
                },
                {
                    label: 'Économie',
                    value: 'economy',
                    emoji: '💰',
                },
                {
                    label: 'Information',
                    value: 'information',
                    emoji: 'ℹ️',
                },
                {
                    label: 'Modération',
                    value: 'moderation',
                    emoji: '🛠',
                },
            ];

            const selectMenu = new ActionRowBuilder().addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('selectMenu')
                    .setPlaceholder('Sélectionner un modèle')
                    .addOptions(selectMenuOptions)
            );

            const msg = await message.reply({ embeds: [helpEmbed(bot)], components: [supportWebInviteButton(), selectMenu], fetchReply: true });

            const collector = msg.createMessageComponentCollector({ 
                filter: (u) => {
                  if (u.user.id === message.user.id) {
                    return true
                  } else {
                    return false
                  }
                },
                errors: ['TIME']
              })
        
              collector.on('collect', (cld) => {
                if (cld.values[0] === 'administration') {
                  cld.update({ embeds: [administrationEmbed()], components: [supportWebInviteButton(), selectMenu]})
                } else if (cld.values[0] === 'channel') {
                  cld.update({ embeds: [channelEmbed()], components: [supportWebInviteButton(), selectMenu]})
                } else if (cld.values[0] === 'economy') {
                  cld.update({ embeds: [economyEmbed()], components: [supportWebInviteButton(), selectMenu]})
                } else if (cld.values[0] === 'information') {
                  cld.update({ embeds: [informationEmbed()], components: [supportWebInviteButton(), selectMenu]})
                } else if (cld.values[0] === 'moderation') {
                  cld.update({ embeds: [moderationEmbed()], components: [supportWebInviteButton(), selectMenu]})
                }
              })

        } catch (error) {
            console.log(error)
            return message.reply({ content: `Une erreure est survenue lors de la commande`, ephemeral: true });
        }
    }
}