const Discord = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder} = require('discord.js')


module.exports = {

  name: "help",
  description: "Permet de voir les commandes du bot",
  permission: "Aucune",
  dm: false,
  category: "Administration",

  async run(bot, message, args) {
    try {
      //embed help
      const embed = new EmbedBuilder({
          color: 0xff7300,
          title: "Liste des commandes",
          description: "Te voici dans le panel d'aide aux commandes",
          category: "Informations",
          timestamp: new Date(),
          fields: [
              {
                "name": `Les commandes sont reparties en \`5\` catégories :`,
                "value": `ℹ️ | **Informations**\n 👑 | **Administration**\n 🛠 | **Modération**\n 🎉 | **Fun**\n`
              },
          ],
          thumbnail: {
              "url": `https://cdn.discordapp.com/attachments/925311173723815998/1051116152908165150/Capture_decran_2022-12-10_a_13.39.46.png`,
              "height": 0,
              "width": 0
          },
          footer: {
              "text": `IweZix.xyz`
          },
      })

      //embed info
      const embedInfo = new EmbedBuilder({
        color: 0xff7300,
        title: "Liste des commandes - Informations",
        description: `Le bot possède \`5\` commandes d'information :`,
        category: "Informations",
        timestamp: new Date(),
        fields: [
            {
              "name": `Afficher les menu d'aide`,
              "value": `\`/help\``,
            },
            {
              "name": `Afficher la latence du bot`,
              "value": `\`/ping\``,
            },
            {
              "name": `Afficher les informations d'un utilisateur`,
              "value": `\`/userinfo [utilisateur]\``,
            },
            {
              "name": `Afficher les informations du bot`,
              "value": `\`/botinfo\``,
            },
            {
              "name": `Afficher les informations du serveur`,
              "value": `\`/serverinfo\``,
            },
        ],
        thumbnail: {
            "url": `https://cdn.discordapp.com/attachments/925311173723815998/1051116152908165150/Capture_decran_2022-12-10_a_13.39.46.png`,
            "height": 0,
            "width": 0
        },
        footer: {
            "text": `IweZix.xyz`
        },
      })

      //embed admin
      const embedAdmin = new EmbedBuilder({
        color: 0xff7300,
        title: "Liste des commandes - Administration",
        description: `Le bot possède \`4\` commandes d'administration :`,
        category: "Informations",
        timestamp: new Date(),
        fields: [
            {
              "name": `Afficher les membres ayant le rôle Administrateur`,
              "value": `\`/alladmin\``,
            },
            {
              "name": `Permet de supprimer un nombre de messages entre 1 et 99`,
              "value": `\`/clear\``,
            },
            {
              "name": `Permet d'envoyer l'embed de création d'un ticket`,
              "value": `\`/ticket\``,
            },
            {
              "name": `Permet d'envoyer l'embed de fermture d'un ticket`,
              "value": `\`/close\``,
            },
            
        ],
        thumbnail: {
            "url": `https://cdn.discordapp.com/attachments/925311173723815998/1051116152908165150/Capture_decran_2022-12-10_a_13.39.46.png`,
            "height": 0,
            "width": 0
        },
        footer: {
            "text": `IweZix.xyz`
        },
      })

      //embed mod
      const embedMod = new EmbedBuilder({
        color: 0xff7300,
        title: "Liste des commandes - Modération",
        description: `Le bot possède \`9\` commandes de modération :`,
        category: "Informations",
        timestamp: new Date(),
        fields: [
            {
              "name": `Permet de bannir un utilisateur`,
              "value": `\`/ban [utilisateur] [rainson]\``,
            },
            {
              "name": `Permet de unban un utilisateur`,
              "value": `\`/unban [utilisateur] [rainson]\``,
            },
            {
              "name": `Permet de kick un utilisateur`,
              "value": `\`/kick [utilisateur] [rainson]\``,
            },
            {
              "name": `Permet de mute un utilisateur`,
              "value": `\`/mute [utilisateur] [temps] [rainson]\``,
            },
            {
              "name": `Permet d'unmute un utilisateur`,
              "value": `\`/mute [utilisateur] [rainson]\``,
            },
            {
              "name": `Permet de lock un salon`,
              "value": `\`/lock [salon]\``,
            },
            {
              "name": `Permet d'unlock un salon`,
              "value": `\`/unlock [salon]\``,
            },
            
        ],
        thumbnail: {
            "url": `https://cdn.discordapp.com/attachments/925311173723815998/1051116152908165150/Capture_decran_2022-12-10_a_13.39.46.png`,
            "height": 0,
            "width": 0
        },
        footer: {
            "text": `IweZix.xyz`
        },
      })

      //embed fun
      const embedFun = new EmbedBuilder({
        color: 0xff7300,
        title: "Liste des commandes - Fun",
        description: `Le bot possède \`2\` commandes fun :`,
        category: "Informations",
        timestamp: new Date(),
        fields: [
          {
            "name": `Permet de faire une calculatrice`,
            "value": `\`/calc [nombre] [opérateur] [nombre]\``,
          },
          {
            "name": `Permet de hacker un utilisateur`,
            "value": `\`/hack [utilisateur]\``,
          },
        ],
        
        thumbnail: {
            "url": `https://cdn.discordapp.com/attachments/925311173723815998/1051116152908165150/Capture_decran_2022-12-10_a_13.39.46.png`,
            "height": 0,
            "width": 0
        },
        footer: {
            "text": `IweZix.xyz`
        },
      })

      //embed channel
      const embedChannel = new EmbedBuilder({
        color: 0xff7300,
        title: "Liste des commandes - Channel",
        description: `Le bot possède \`3\` commandes pour gèrer les channels :`,
        category: "Informations",
        timestamp: new Date(),
        fields: [
          {
            "name": `Permet de'envoyer l'embed de création d'un salon pilote`,
            "value": `\`/setup\``,
          },
          {
            "name": `Permet d'ajouter un utilisateur à un salon textuel créer à l'aide d'un salon pilote`,
            "value": `\`/adduser [utilisateur]\``,
          },
          {
            "name": `Permet de retirer un utilisateur à un salon textuel créer à l'aide d'un salon pilote`,
            "value": `\`/removeuser [utilisateur]\``,
          },
        ],
        
        thumbnail: {
            "url": `https://cdn.discordapp.com/attachments/925311173723815998/1051116152908165150/Capture_decran_2022-12-10_a_13.39.46.png`,
            "height": 0,
            "width": 0
        },
        footer: {
            "text": `IweZix.xyz`
        },
      })


      // button
      const button = new ActionRowBuilder ().addComponents(
              new ButtonBuilder()
                  .setStyle('5')
                  .setLabel('Site Web')
                  .setURL('https://iwezix.xyz')
                  .setEmoji('🌐'),
              new ButtonBuilder()
                  .setStyle('5')
                  .setLabel('Support')
                  .setURL('https://discord.gg/68sTKh3UYV')
                  .setEmoji('🛠'),
              new ButtonBuilder()
                  .setStyle('5')
                  .setLabel('Inviter')
                  .setURL('https://discord.com/oauth2/authorize?client_id=1049396684075053077&permissions=8&scope=bot%20applications.commands')
                  .setEmoji('➕'),
      )
      
      // select menu catégorie
      let selectMenuOptions = [
        {
          label: 'Informations',
          value: 'Informations',
          emoji: 'ℹ️',
        },
        {
          label: 'Administration',
          value: 'Administration',
          emoji: '👑',
        },
        {
          label: 'Modération',
          value: 'Modération',
          emoji: '🛠',
        },
        {
          label: 'Fun',
          value: 'Fun',
          emoji: '🎉',
        },
        {
          label: 'Channel',
          value: 'Channel',
          emoji: '📁',
        },
      ]

      // select menu
      const selectMenu = new ActionRowBuilder().addComponents(
              new Discord.StringSelectMenuBuilder()
                  .setCustomId('selectMenu')
                  .setPlaceholder('Sélectionner une catégorie')
                  .addOptions(selectMenuOptions)
      )


      const msg = await message.reply({ embeds: [embed], components: [button, selectMenu], fetchReply: true })

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
        if (cld.values[0] === 'Informations') {
          cld.update({ embeds: [embedInfo], components: [button, selectMenu]})
        } else if (cld.values[0] === 'Administration') {
          cld.update({ embeds: [embedAdmin], components: [button, selectMenu]})
        } else if (cld.values[0] === 'Modération') {
          cld.update({ embeds: [embedMod], components: [button, selectMenu]})
        } else if (cld.values[0] === 'Fun') {
          cld.update({ embeds: [embedFun], components: [button, selectMenu]})
        } else if (cld.values[0] === 'Channel') {
          cld.update({ embeds: [embedChannel], components: [button, selectMenu]})
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
}