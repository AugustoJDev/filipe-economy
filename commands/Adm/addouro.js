const Discord = require('discord.js')
module.exports = {
    name: "addouro",
    aliases: ["addouros", "adicionarouro", "addouro", "ouroadd", "adcouros", "adcouro"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        if (!message.member.permissions.has("ADMINISTRATOR") || message.guild != infos.economyGuild) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem permissão.')] })

        let usuario = message.mentions.members.first();
        if (!usuario) return message.reply({ embeds: [errorEmbed.setDescription('Você não mencionou ninguém. `b.addouro <@usuario> <valor>`')] })
        let valor = parseInt(args[1])
        if (!valor) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu o valor. `b.addouro <@usuario> <valor>`')] })

        let db = await database.ref(`Global/${usuario.user.id}`).once('value')
        if (db.val() == null) return message.reply({ embeds: [errorEmbed.setDescription(`\`${usuario.user.tag}\` não joga Billy.`)] })

        message.delete()

        database.ref(`Global/${usuario.user.id}/ouro`).transaction(n => (n || 0) + Number(valor))
        message.channel.send({ embeds: [sucEmbed.setDescription(`\`${usuario.user.tag}\` recebeu **${new Intl.NumberFormat('de-DE').format(valor)}** ouros.`)] })
    }
}