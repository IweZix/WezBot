const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const config = require('../config.js')

module.exports = {
    name: "setup",
    description: "Permet d'initiliaiser un salon vocal",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Channel",

    async run(bot, message, args, db) {
        try {
            // embed de base
            const embed = new EmbedBuilder()
                .setTitle(`Création d'un salon pilote`)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                .setColor("#FF7300")
                .setDescription(`
                    Choissisez le type de salon pilote : 
**🔊 | Salon vocaux**
> Pour créer des salons temporaires vocaux.
**❌ | Annuler**
> Pour fermer ce menu.        
                `)
                .setFooter({ text: `© ${bot.user.username} | ${config.version}` })
                .setTimestamp()

            // bouton de base
            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle('2')
                        .setLabel('Salon vocaux')
                        .setCustomId('vocal')
                        .setEmoji('🔊'),
                    new ButtonBuilder()
                        .setStyle('4')
                        .setLabel('Annuler')
                        .setCustomId('cancel')
                        .setEmoji('✖️'),
                )
            message.reply({ embeds: [embed], components: [button] })
        } catch (error) {
            console.log(error)
            return message.reply({ content: `Une erreure est survenue lors de la commande`, ephemeral: true });
        }
    }
}