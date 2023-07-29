const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder } = require('discord.js')
const config = require('../config.js')

/**
 * Create 3 buttons, Web Site, Support and Invit
 * @returns {ActionRowBuilder} 3 buttons, Web Site, Support and Invit
 */
const supportWebInviteButton = () => {
    const button = new ActionRowBuilder()
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
        );
    return button;
}

/**
 * Create a cancel button
 * @returns cancel button
 */
const cancelButton = () => {
    const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setStyle('4')
                .setLabel('Annuler')
                .setCustomId('cancel')
                .setEmoji('✖️'),
        );
    return button
}


//*****************
//* TICKET BUTTON *
//*****************

/**
 * 
 * @returns 
 */
const createTicketButton = () => {
    const button = new ActionRowBuilder()
        .addComponents(new ButtonBuilder()
            .setCustomId("ticket")
            .setLabel("Créer un ticket")
            .setStyle(1)
            .setEmoji("📩")
        );
    return button;
}

const closeTicketButton = () => {
    const button = new ActionRowBuilder()
        .addComponents(new ButtonBuilder()
            .setCustomId("close")
            .setLabel("Fermer le ticket")
            .setStyle(4)
            .setEmoji("🔒")
        )
    return button;
}

const deleteTicketButton = () => {
    const button = new ActionRowBuilder()
        .addComponents(new ButtonBuilder()
            .setCustomId("delete")
            .setLabel("Supprimer le ticket")
            .setStyle(4)
            .setEmoji("🗑️")
        )
    return button;
}


module.exports = {
    supportWebInviteButton,

    cancelButton,

    createTicketButton,
    closeTicketButton,
    deleteTicketButton
}