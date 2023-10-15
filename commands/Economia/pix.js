const Discord = require('discord.js')
module.exports = {
    name: "pix",
    aliases: [],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
        .setColor('#FF4040')
        .setTimestamp()
        .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })

    let sucEmbed = new Discord.EmbedBuilder()
        .setColor('#4CFF40')
        .setTimestamp()
        .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })

        if (!message.member.roles.cache.has(infos.vipRole)) return message.reply({ embeds: [errorEmbed.setDescription('Este comando é exclusivo para VIPs.')] })

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let usuario = message.mentions.members.first()
        if (!usuario) return message.reply({ embeds: [errorEmbed.setDescription('Você não mencionou o membro.\n`t.pix <@membro> <quantia>`')] })
        let receiveDB = await database.ref(`Global/${usuario.user.id}`).once('value')

        if (receiveDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Este membro não joga no Billy.')] })

        let vlr = parseInt(args[1])
        if (!vlr) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu a quantia.\n`t.pix <@membro> <quantia>`')] })

        if (message.author.id == usuario.user.id) return message.reply({ embeds: [errorEmbed.setDescription('Você não pode enviar ouro para você mesmo.')] })
        if (vlr > memberDB.val().ouro) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui todo esse ouro em seu bolso para pagar um membro.')] })
        if (vlr <= 500) return message.reply({ embeds: [errorEmbed.setDescription('Não é possível enviar valores menores que 500.')] })
        if (vlr > 3000) return message.reply({ embeds: [errorEmbed.setDescription('Não é possível enviar valores maiores que 3.000.')] })

        database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(vlr))
        database.ref(`Global/${usuario.user.id}/ouro`).transaction(n => n + Number(vlr))
        message.reply({ embeds: [sucEmbed.setTitle(`${emoji.PIX} | Pix`).setDescription(`Você pagou **${new Intl.NumberFormat('de-DE').format(vlr)}** ${emoji.moeda} para \`${usuario.user.tag}\`.`)] })
    }
}