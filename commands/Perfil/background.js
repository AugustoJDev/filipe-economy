const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
module.exports = {
    name: "background",
    aliases: ["bg"],
    async execute(client, message, args, database) {
        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let invBDB = await database.ref(`Global/${message.author.id}/Perfil`).once('value')

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        if(!args[0]) return 
            message.reply({
                embeds: [errorEmbed.setTitle("Erro ao setar background").setDescription("Forneça um link de background válido! ( https://... )")]
            })

        await database.ref(`Global/${message.author.id}/Perfil`).update({
            background: args[0]
        })
            
        message.reply({
            embeds: [sucEmbed.setTitle("Embed setado com sucesso").setImage(args[0])]
        })
    }
}