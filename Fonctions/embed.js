const Discord = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const config = require('../config.js')


//********************
//* MODERATION EMBED *
//********************

/**
 * Create an embed for a warn
 * @param {user} user 
 * @param {String} reason 
 * @returns an embed for a warn
 */
function warnEmbed(user, reason) {

    const embed = new EmbedBuilder()
        .setTitle(`${user.tag} à reçu un warn`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setColor("#FF7300")
        .setDescription(`
          ${user.tag} à reçu un warn pour la raison suivante : 
          > ${reason}
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

/**
 * Create an embed to see user's warns
 * @param {user} user user whose warns we want to know
 * @param {Array} warns array of user's warns
 * @returns embed with 5 last warns
 */
function warnsEmbed(user, warns = []) {

    let description = `__**${warns.length} warns récents**__ \n`;
    for (let i = 0; i < warns.length; i++) {
        description += `> ${i + 1} - ${warns[i]} \n`

    }

    const embed = new EmbedBuilder()
        .setTitle(`Warns de ${user.tag}`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setColor("#FF7300")
        .setDescription(`
            ${description}
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

/**
 * Create an embed for a mute
 * @param {user} user muted user
 * @param {String} reason reason of the mute
 * @param {Integer} time time of the mute
 * @returns embed explain the mute
 */
function muteEmbed(user, reason, time) {
    const embed = new EmbedBuilder()
        .setTitle(`${user.tag} à été mute`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setColor("#FF7300")
        .setDescription(`
            ${user.tag} à été mute pour la raison suivante : 
            > ${reason}
            ${time ? `> La durée du mute est de ${time} s` : ''}
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

/**
 * Create an embed for an unmute
 * @param {user} user unmuted user
 * @param {String} reason reason of the unmute
 * @returns embed explain the unmute
 */
function unmuteEmbed(user, reason) {
    const embed = new EmbedBuilder()
        .setTitle(`${user.tag} à été unmute`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setColor("#FF7300")
        .setDescription(`
            ${user.tag} à été unmute pour la raison suivante :
            > ${reason}
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()
    return embed;
}

/**
 * Create an embed to see user's mutes
 * @param {user} user user whose mutes we want to know
 * @param {Array} mutes array of user's mutes
 * @returns embed with 5 last mutes
 */
function mutesEmbed(user, mutes = []) {
    let description = `__**${mutes.length} mutes récents**__ \n`;
    for (let i = 0; i < mutes.length; i++) {
        description += `> ${i + 1} - ${mutes[i]} \n`
    }

    const embed = new EmbedBuilder()
        .setTitle(`Mutes de ${user.tag}`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setColor("#FF7300")
        .setDescription(`
            ${description}
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

/**
 * Create an embed for a ban
 * @param {*} user banned user
 * @param {*} reason ban's reason
 * @returns embed explain the ban reason
 */
function banEmbed(user, reason) {
    const embed = new EmbedBuilder()
        .setTitle(`${user.tag} à été bannis`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setColor("#FF7300")
        .setDescription(`
            ${user.tag} à été bannis pour la raison suivante :
            > ${reason}
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

/**
 * Create an embed to see user's bans
 * @param {Array} bans array of server's bans
 * @param {Integer} length number of total ban in the server
 * @returns embed with 5 last bans
 */
function bansEmbed(bans = [], length) {
    let description = `
        __**${bans.length} derniers bans**__ \n
        Ce serveur contient ${length} bans au total \n
    `;
    for (let i = 0; i < bans.length; i++) {
        description += `> ${i + 1} - ${bans[i]} \n`
    }

    const embed = new EmbedBuilder()
        .setTitle(`Bans récents`)
        .setColor("##FF7300")
        .setDescription(`
            ${description}
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

//*****************
//* ECONOMY EMBED *
//*****************

/**
 * Create an embed for daily reward
 * @param {user} user user who get the reward
 * @param {Integer} money user's balance
 * @param {Integer} gains user's gains
 * @param {Integer} date_times time before the next reward
 * @returns embed explain the reward
 */
function dailyEmbed(user, money, gains, date_times) {
    const embed = new EmbedBuilder()
        .setTitle(`Récompense journalière`)
        .setColor("#FF7300")
        .setDescription(`
            ${user.tag} à reçu ${gains} $\n
            Solde : ${money} $\n
            Vous pouvez récupérer votre récompense dans ${date = new Date().getTime - date.getTime}
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

/**
 * Create an embed for add money
 * @param {user} user user who get the money
 * @param {Integer} money user's balance
 * @param {Integer} gain user's gains
 * @returns embed explain the add money
 */
function addMoney(user, money, gain) {
    const embed = new EmbedBuilder()
        .setTitle(`Ajoute d'argent`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setColor("#FF7300")
        .setDescription(`
            ${user.tag} à reçu ${gain} $\n
            Solde : ${money} $\n
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}


//**************
//* HELP EMBED *
//**************

/**
 * Create an embed to see all types of command
 * @returns help embed
 */
function helpEmbed(bot) {
    const embed = new EmbedBuilder()
        .setTitle(`Menu d'aide aux commandes`)
        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        .setColor(`${config.color}`)
        .setDescription(`
        WezBot possède 5 types de commandes : 
        > Administration (5)
        > Channel (1)
        > Economie (5)
        > Information (5)
        > Modération (9)

        Les commandes avec 🛠️ sont réservées aux administrateurs
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

/**
 * create an embed to see all administration command
 * @returns administration help embed
 */
function administrationEmbed(bot) {
    const embed = new EmbedBuilder()
        .setTitle(`Commandes d'administrations`)
        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        .setColor(`${config.color}`)
        .setDescription(`
        WezBot possède 5 commandes d'administrations : 
        > /clear [salon] [nombreDeMessage]
        🛠️ Permet d'effacer un nombre de message entre 1 et 99
        > /giveaway [durée] [nombreDeGagant] [prix]
        🛠️ Permet de créer un concours
        > /ticket [salon]
        🛠️ Permet d'envoyer l'embed de création de ticket
        > /lock [salon]
        🛠️ Permet de vérouiller un salon
        > /unlock [salon]
        🛠️ Permet de dévérouiller un salon
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

/**
 * Create an embed to see all channel commands
 * @returns channel embed
 */
function channelEmbed(bot) {
    const embed = new EmbedBuilder()
        .setTitle(`Commandes de channel`)
        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        .setColor(`${config.color}`)
        .setDescription(`
        WezBot possède 1 commande de channel : 
        > /setup
        🛠️ Permet d'envoyer l'embed de création de channel pilote'
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

/**
 * Create an embed to see all economy commands
 * @returns economy embed
 */
function economyEmbed(bot) {
    const embed = new EmbedBuilder()
        .setTitle(`Commandes d'économies`)
        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        .setColor(`${config.color}`)
        .setDescription(`
        WezBot possède 5 commandes d'administrations : 
        > /addmoney [membre] [montant]
        🛠️ Permet d'ajouter de l'argent à un membre
        > /balance
        Permet de voir votre solde
        > /daily
        Permet de travailler toutes les 24h
        > /removemoney [membre] [montant]
        🛠️ Permet de retirer de l'argent à un utilisateur
        > /sendmoney [membre] [montant]
        Permet d'envoyerde l'argent à un autre membre
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

/**
 * Create an embed to see all informations commands
 * @returns information embed
 */
function informationEmbed(bot) {
    const embed = new EmbedBuilder()
        .setTitle(`Commandes d'information`)
        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        .setColor(`${config.color}`)
        .setDescription(`
        WezBot possède 5 commandes d'administrations : 
        > /botinfo
        Permet d'avoir les informations du bot
        > /help
        Permet d'afficher le menu d'aide au commandes
        > /ping
        Permet d'afficher la latence du bot
        > /serverinfo
        Permet d'avoir les informations du serveur
        > /userinfo [membre]
        Permet d'avoir les informations d'un utilisateur
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

/**
 * Create an embed to see all moderations commands
 * @returns moderation embed
 */
function moderationEmbed(bot) {
    const embed = new EmbedBuilder()
        .setTitle(`Commandes de modérations`)
        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        .setColor(`${config.color}`)
        .setDescription(`
        WezBot possède 5 commandes d'administrations : 
        > /ban [membre] [raison]
        🛠️ Permet de bannir un membre
        > /bans
        🛠️ Affiche les 5 derniers bannissements du serveur
        > /kick [membre] [raison]
        🛠️ Permet de kick un utilisateur
        > /mute [membre] [temps] [raison]
        🛠️ Permet de mute un utilisateur
        > /unban [membre] [raison]
        🛠️ Permet de débannir un membre
        > /unmute [membre] [raison]
        🛠️ Permet d'unmute un membre
        > /warn [membre] [raison]
        🛠️ Permet d'avertir un utilisateur
        > /warns [membre]
        🛠️ Afficher les 5 dernires warns d'un membre
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}


//****************
//* TICKET EMBED *
//****************

/**
 * 
 * @returns 
 */
function createTicketEmbed() {
    const embed = new EmbedBuilder()
        .setTitle(`Création d'un ticket`)
        .setColor("#FF7300")
        .setDescription(`
        Pour créer un ticket, cliquez sur le bouton ci-dessous !
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
        .setTimestamp()

    return embed;
}

/**
 * 
 * @returns 
 */
function closeTicketEmbed() {
    const embed = new EmbedBuilder()
        .setTitle(`Fermeture du ticket`)
        .setColor("#FF7300")
        .setDescription(`
        Pour fermer le ticket, cliquez sur le bouton ci-dessous
Si vous avez encore besoin d'aide, poser vos questions avant de fermer le ticket !
Attention, une fois le ticket fermé, il ne sera plus accessible !
        `)
        .setFooter({ text: `© WezBot | ${config.version}` })
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
    addMoney,

    helpEmbed,
    administrationEmbed,
    channelEmbed,
    economyEmbed,
    informationEmbed,
    moderationEmbed,

    createTicketEmbed,
    closeTicketEmbed

}