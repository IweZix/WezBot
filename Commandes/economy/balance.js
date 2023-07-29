const Discord = require('discord.js')

const { parse, serialize } = require('../../Fonctions/json.js')

const fs = require('fs');
const path = require('node:path');

const jsonDbPath = __dirname + '/../../data/money.json';

const BANKS = [
  {
    user_id: "id",
    user: "user",
    server_id: "server",
    money: "money",
    date_time: "date"
  }
]

module.exports = {

  name: "balance",
  description: "Permet de voir son solde",
  permission: "Aucune",
  dm: false,
  category: "Économie",

  async run(bot, message, args) {

    try {

        // user
        let user = message.user;
        if (!user) return message.reply("L'utilisateur n'existe pas !")

        // données
        const banks = parse(jsonDbPath, BANKS);

        // serveur
        const server = message.guild;

        // user bank
        const bank = banks.find((bank) => bank.user_id === user.id && bank.server_id === server.id);
        const index = banks.indexOf(bank);

        // condition
        if (!index) return message.reply({content: `Vous ne possedez pas de compte en banque`, ephemeral: true});

        return message.reply({content: `Vous soldes est de ${banks[index].money} $`})

    } catch (err) {
        console.log(err);
        return await message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true})
    }
  }
}