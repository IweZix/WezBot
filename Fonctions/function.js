const Discord = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js')
const config = require('../config.js')

/**
 * verify if on day is passed
 * @param {*} oldTime 
 * @param {*} newTime 
 * @returns true if one day is passed, else false
 */
function oneDayPassed(oldTime, newTime) {
    let difference = Math.abs(newTime - oldTime);
    var joursEcoules = Math.floor(difference / (1000 * 60 * 60 * 24));
    if (joursEcoules >= 1) {
        return true;
    } else {
        return false;
    }
}

/**
 * Delete a message when timeInMilliseconds was past
 * @param {String} message 
 * @param {Integer} timeInMilliseconds 
 */
async function waitAndDeleteMessage(message, timeInMilliseconds) {
    await new Promise(resolve => setTimeout(resolve, timeInMilliseconds));
    message.delete();
}

function isBot(user) {

}

function isAdmin(user) {

}

module.exports = {
    oneDayPassed,
    waitAndDeleteMessage
}