const Discord = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js')
const config = require('../config.js')


/**
 * Create an embed for a warn
 * @param {user} user 
 * @param {String} reason 
 * @returns an embed for a warn
 */
function warnEmbed(user, reason) {
    
    const embed = new EmbedBuilder()
        .setTitle(`${user.tag} à reçu un warn`)
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .setColor("#FF7300")
        .setDescription(`
          ${user.tag} à reçu un warn pour la raison suivante : 
          > ${reason}
        `)
        .setFooter({text: `© WezBot | ${config.version}`})
        .setTimestamp()
    
    return embed;
}

function warnsEmbed(user, warns = []) {
    
    let description = `__**${warns.length} warns récents**__ \n`; 
    for (let i = 0; i < warns.length; i++) {
        description += `> ${i+1} - ${warns[i]} \n`
        
    }   

    const embed = new EmbedBuilder()
        .setTitle(`Warns de ${user.tag}`)
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .setColor("#FF7300")
        .setDescription(`
            ${description}
        `)
        .setFooter({text: `© WezBot | ${config.version}`})
        .setTimestamp()

    return embed;
}

function muteEmbed(user, reason, time) {
    const embed = new EmbedBuilder()
        .setTitle(`${user.tag} à été mute`)
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .setColor("#FF7300")
        .setDescription(`
            ${user.tag} à été mute pour la raison suivante : 
            > ${reason}
            ${time ? `> La durée du mute est de ${time} s` : ''}
        `)
        .setFooter({text: `© WezBot | ${config.version}`})
        .setTimestamp()

    return embed;
}

function unmuteEmbed(user, reason) {
    const embed = new EmbedBuilder()
        .setTitle(`${user.tag} à été unmute`)
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .setColor("#FF7300")
        .setDescription(`
            ${user.tag} à été unmute pour la raison suivante :
            > ${reason}
        `)
        .setFooter({text: `© WezBot | ${config.version}`})
        .setTimestamp()
}

function mutesEmbed(user, mutes = []) {
    let description = `__**${mutes.length} mutes récents**__ \n`;
    for (let i = 0; i < mutes.length; i++) {
        description += `> ${i+1} - ${mutes[i]} \n`
    }

    const embed = new EmbedBuilder()
        .setTitle(`Mutes de ${user.tag}`)
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .setColor("#FF7300")
        .setDescription(`
            ${description}
        `)
        .setFooter({text: `© WezBot | ${config.version}`})
        .setTimestamp()

    return embed;
}

function banEmbed(user, reason) {
    const embed = new EmbedBuilder()
        .setTitle(`${user.tag} à été bannis`)
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .setColor("#FF7300")
        .setDescription(`
            ${user.tag} à été bannis pour la raison suivante :
            > ${reason}
        `)
        .setFooter({text: `© WezBot | ${config.version}`})
        .setTimestamp()

    return embed;
}

function bansEmbed(bans = [], length) {
    let description = `
        __**${bans.length} derniers bans**__ \n
        Ce serveur contient ${length} bans au total \n
    `;
    for (let i = 0; i < bans.length; i++) {
        description += `> ${i+1} - ${bans[i]} \n`
    }

    const embed = new EmbedBuilder()
        .setTitle(`Bans récents`)
        .setColor("##FF7300")
        .setDescription(`
            ${description}
        `)
        .setFooter({text: `© WezBot | ${config.version}`})
        .setTimestamp()

    return embed;
}

function dailyEmbed(user, money, gains, date_times) {
    const embed = new EmbedBuilder()
        .setTitle(`Récompense journalière`)
        .setColor("#FF7300")
        .setDescription(`
            ${user.tag} à reçu ${gains} $\n
            Solde : ${money} $\n
            Vous pouvez récupérer votre récompense dans ${date = new Date().getTime - date.getTime}
        `)
        .setFooter({text: `© WezBot | ${config.version}`})
        .setTimestamp()

    return embed;
}

function addMoney(user, money, gain) {
    const embed = new EmbedBuilder()
        .setTitle(`Ajoute d'argent`)
        .setColor("#FF7300")
        .setDescription(`
            ${user.tag} à reçu ${gain} $\n
            Solde : ${money} $\n
        `)
        .setFooter({text: `© WezBot | ${config.version}`})
        .setTimestamp()

    return embed;
}



module.exports = {
    warnEmbed,
    warnsEmbed,
    muteEmbed,
    unmuteEmbed,
    mutesEmbed,
    banEmbed,
    bansEmbed,
    dailyEmbed,
    addMoney
}
