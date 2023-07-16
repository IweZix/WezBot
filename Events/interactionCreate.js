const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js')
const config = require("../config.js")

module.exports = async (bot, interaction, message) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        
        let command = require(`../Commandes/${interaction.commandName}`)
        command.run(bot, interaction, interaction.options, bot.db)
    }


    if (interaction.isButton()) {

        /********************************/
        /************ TICKET ************/
        /********************************/
        // button création ticket 
        if (interaction.customId === "ticket") {
            
            let channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: Discord.ChannelType.GuildText,
            })

            await channel.setParent(interaction.channel.parent.id)

            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                ViewChannel: false
            }),
            await channel.permissionOverwrites.create(interaction.user, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true,
                EmbedLinks: true,
            }),
            // Plaxis
            await channel.permissionOverwrites.create("1049399710185697311", {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true,
                EmbedLinks: true,
            }),

            await channel.setTopic(interaction.user.id)
            await interaction.reply({content: `Votre ticket a été créé : ${channel}`, ephemeral: true})

            let embed = new EmbedBuilder()
            .setColor(0xff7300)
            .setTitle("Fermeture d'un ticket")
            .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
            .setDescription("Pour fermer le ticket, cliquez sur le bouton ci-dessous \nSi vous avez encore besoin d'aide, poser vos questions avant de fermer le ticket !\n Attention, une fois le ticket fermé, il ne sera plus accessible !")
            .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL({dynamic: true})})
            .setTimestamp()  
                

            const button = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
                .setCustomId("close")
                .setLabel("Fermer le ticket")
                .setStyle(4)
                .setEmoji("🔒")
            )

            await channel.send({embeds: [embed], components: [button]})
        }

        // close channel ticket
        if (interaction.customId === "close") {
        
            let user = bot.users.cache.get(interaction.channel.topic)

            // si pas le rôle "ID_du_role" alors on ne peut pas fermer le ticket
            // if (user.cache.hasPermission("ID_du_role")) return;

            try {
                await user.send({content: "Votre ticket a été fermé !"})
            } catch (error) {}
            await interaction.channel.delete()
        }

        // lock channel ticket
        if (interaction.customId === "lock") {
            
            await interaction.channel.permissionOverwrites.edit(interaction.user, {
                ViewChannel: true,
                SendMessages: false,
                ReadMessageHistory: true,
                AttachFiles: false,
                EmbedLinks: false,
            })

            await interaction.reply({content: "Le ticket a été fermé !", ephemeral: true})
        }

        // unlock channel ticket
        if (interaction.customId === "unlock") {
            await interaction.channel.permissionOverwrites.edit(interaction.user, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
            })
            await interaction.reply({content: "Le ticket a été réouvert !", ephemeral: true})
        }

        // annule la commande
        if (interaction.customId === "cancel"){
            interaction.message.delete()
        }
    }

    
}