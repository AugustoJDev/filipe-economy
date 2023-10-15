const Discord = require('discord.js')
module.exports = {
    name: "setbg",
    aliases: [],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        if (!message.member.permissions.has("ADMINISTRATOR") || message.guild != infos.economyGuild) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem permissão.')] })
        
        message.delete()

        await database.ref(`Global/${message.author.id}/Perfil/background`).set(2)

        message.channel.send("bg setado")
    }
}