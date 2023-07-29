const Discord = require('discord.js')

module.exports = {

  name: "unban",
  description: "Permet de débannir un membre",
  permission: Discord.PermissionFlagsBits.BanMembers,
  dm: false,
  category: "Modération",
  options: [
    {
      type: 'user',
      name: 'utilisateur',
      description: "Le'utilisateur à débannir",
      required: true
    }, {
      type: 'string',
      name: 'raison',
      description: 'La raison du débanissement',
      required: false
    }
  ],

  async run(bot, message, args) {

    try {
        
        let user = args.getUser("utilisateur")
        if (!user) return message.reply("Tu n'as pas entré de membre à débannir !")

        let reason = args.getString("raison")
        if (!reason) reason = "Pas de raison fournie."

        if (!(await message.guild.bans.fetch()).get(user.id)) return message.reply("Cet utilisateur n'est pas banni !")
        
        try{
            await user.send(`Tu as été débanni du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)
        } catch (err) {}

        await message.reply(`${message.user} a débanni ${user.tag} pour la raison : \`${reason}\``)

        await message.guild.members.unban(user, reason)
      

    } catch (err) {
        return message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true});
    }
  }
}