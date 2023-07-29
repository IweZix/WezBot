const Discord = require("discord.js")
const ms = require("ms")
const { muteEmbed } = require('../../Fonctions/embed.js')

const fs = require('fs');
const path = require('node:path');

const jsonDbPath = __dirname + '/../../data/mute.json';

const MUTES = [
    {
        id: "user_id",
        server: "server",
        user: "user",
        reason: "reason",
        time: "time"
    }
]


/**
 * Parse items given in a .json file
 * @param {String} filePath - path to the .json file
 * If the file does not exist or it's content cannot be parsed as JSON data,
 * use the default data.
 * @param {Array} defaultArray - Content to be used when the .json file does not exists
 * @returns {Array} : the array that was parsed from the file (or defaultArray)
 */
function parse(filePath, defaultArray = []) {
    if (!fs.existsSync(filePath)) return defaultArray;
    const fileData = fs.readFileSync(filePath);
    try {
      return JSON.parse(fileData);
    } catch (err) {
      return defaultArray;
    }
}
  
/**
   * Serialize the content of an Object within a file
   * @param {String} filePath - path to the .json file
   * @param {Array} object - Object to be written within the .json file.
   * Even if the file exists, its whole content is reset by the given object.
   */
function serialize(filePath, object) {
    const objectSerialized = JSON.stringify(object);
    createPotentialLastDirectory(filePath);
    fs.writeFileSync(filePath, objectSerialized);
}
  
/**
   *
   * @param {String} filePath - path to the .json file
   */
function createPotentialLastDirectory(filePath) {
    const pathToLastDirectory = filePath.substring(0, filePath.lastIndexOf(path.sep));
  
    if (fs.existsSync(pathToLastDirectory)) return;
  
    fs.mkdirSync(pathToLastDirectory);
}

module.exports = {

    name: "mute",
    description: "Permet de mute un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à mute",
            required: true
        }, {
            type: "string",
            name: "temps",
            description: "Le temps du mute (en minutes)",
            required: true
        }, {
            type: "string",
            name: "raison",
            description: "La raison du mute",
            required: false
        }

    ],

    async run(bot, message, args) {
        try {
            
            // verif user
            let user = args.getUser("membre")
            if(!user) return message.reply("Veuillez mentionner un membre !")
            let member = message.guild.members.cache.get(user.id)
            if(!member) return message.reply("Pas de membre !")

            // verif time
            let time = args.getString("temps")
            if(!time) return message.reply("Veuillez indiquer un temps !")
            if(isNaN(ms(time))) return message.reply("Veuillez indiquer un temps valide !")
            if(ms(time) > 86400000) return message.reply("Le mute ne peut pas durer plus de 28 jours !")

            // verif reason
            let reason = args.getString("raison")
            if(!reason) reason = "Pas de raison fournie.";

            // Récupérer le rôle de mute
            const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
            if (!muteRole) return message.reply('Le rôle de mute n\'a pas été trouvé.');

            // automute
            if(message.user.id === user.id) return message.reply("N'essaye pas de te mute tout seul !")
            // mute owner
            if((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas mute le propriétaire !")
            // mute bot
            if(!member.moderatable) return message.reply("Je ne peux pas mute ce membre !")
            // mute higher role
            if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas mute ce membre !")
            // isMuted
            if (member.roles.cache.has(muteRole.id)) return message.reply('Cet utilisateur est déjà mute.');

            // Ajouter le rôle de mute au membre
            member.roles.add(muteRole)
                .then(() => {
                    console.log(`${user.tag} a été mute.`);
                
                    // Durée du mute (en millisecondes)
                    const muteDuration = 60000*time; // 5 minute
                
                    // Démute automatique après la durée spécifiée
                    setTimeout(() => {
                    // Vérifier si l'utilisateur est toujours présent sur le serveur
                    if (message.guild.members.cache.has(user.id)) {
                        // Supprimer le rôle de mute de l'utilisateur
                        member.roles.remove(muteRole)
                        .then(() => {
                            console.log(`${user.tag} a été démute.`);
                        })
                        .catch(error => {
                            console.error("Erreur lors du démute :", error);
                            return message.reply("Une erreur est survenue lors du démute.");
                        });
                    }
                    }, muteDuration);
                })

            // send message to user
            try {
                await user.send(`Tu as été mute du serveur ${message.guild.name} par ${message.user.tag} pendant ${time} pour la raison : \`${reason}\``)
            } catch(err) {}

            // json
            const mutes = parse(jsonDbPath, MUTES);
            mutes.push({
                id: user.id,
                server: message.guild.id,
                user: user.username,
                reason: reason,
                time: time
            });
            serialize(jsonDbPath, mutes);

            // embed
            const embed = muteEmbed(user, reason, time);

            await message.reply({ embeds: [embed] })
        } catch (error) {
            console.log(error)
            return message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true});
        }
    }
}