const Discord = require('discord.js')
module.exports = {
    name: "remdiamante",
    aliases: [],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        if (!message.member.permissions.has("ADMINISTRATOR") || message.guild != infos.economyGuild) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem permissão.')] })

        let usuario = message.mentions.members.first();
        let valor = parseInt(args[1])

        if (!usuario) return message.reply({ embeds: [errorEmbed.setDescription('Você não mencionou ninguém. `b.remdiamante <@usuario> <valor>`')] })
        if (!valor) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu o valor. `b.remdiamante <@usuario> <valor>`')] })

        let db = await database.ref(`Global/${usuario.user.id}`).once('value')
        if (db.val() == null) return message.channel.send({ embeds: [errorEmbed.setDescription('Este jogador não joga no Billy.')] })

        message.delete()

        database.ref(`Global/${usuario.user.id}/diamante`).transaction(n => (n || 0) - Number(valor))
        message.channel.send({ embeds: [sucEmbed.setDescription(`\`${usuario.user.tag}\` perdeu **${new Intl.NumberFormat('de-DE').format(valor)}** diamantes.`)] })
    }
}