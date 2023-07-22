const Discord = require('discord.js')

module.exports = {

  name: "kick",
  description: "Permet de kick un membre",
  permission: Discord.PermissionFlagsBits.BanMembers,
  dm: false,
  category: "Modération",
  options: [
    {
      type: 'user',
      name: 'membre',
      description: 'Le membre à kick',
      required: true
    }, {
      type: 'string',
      name: 'raison',
      description: 'La raison du kick',
      required: true
    }
  ],

  async run(bot, message, args) {

    try {
      let user = args.getUser('membre')
      if (!user) return message.reply("Tu n'as pas entré de membre à kick !")
      let member = message.guild.members.cache.get(user.id)
      if (!member) return message.reply("Ce membre n'est pas sur le serveur !")
      console.log(user)
      console.log(member)

      let reason = args.getString("raison")
      console.log(reason)
      if (!reason) reason = "Pas de raison fournie.";

      if (message.user.id === user.id) return message.reply("Tu ne peux pas te kick toi même !")
      if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas kick le propriétaire du serveur !")
      if (member && !member?.kickable) return message.reply("Je ne peux pas kick ce membre !")
      if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas kick cette personne !")
      if ((await message.guild.bans.fetch()).get(user.id)) return message.reply("Ce membre est déjà kick !")

      try {
        await user.send(`Tu as été kick du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)
      } catch (err) {}

      await message.reply(`${message.user} a kick ${user.tag} pour la raison : \`${reason}\``)

      await member.kick(reason)
    } catch (error) {
      console.log(error)
      return message.reply({content: `Une erreure est survenue lors de la commande`, ephemeral: true});
    }
  }
}