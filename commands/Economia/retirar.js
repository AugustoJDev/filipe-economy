const Discord = require('discord.js')
module.exports = {
    name: "retirar",
    aliases: ["ret", "sacar", "saque", "sac"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')
            .setTimestamp()
            .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')
            .setTimestamp()
            .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })

        let memberDB = await database.ref(`Global/${message.author.id}`).once("value")

        if (memberDB.val() == null) database.ref(`Global/${message.author.id}`).update({ ouro: 0, diamante: 0 })
        if (memberDB.val().ouroCofre == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui cofre. Compre em `t.loja`')] })
        if (!args[0]) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu o valor. `t.depositar <quantia/all>`')] })
        let vlr = args[0].toUpperCase()

        if (!["ALL", "TUDO"].includes(vlr) && isNaN(vlr)) return message.reply({ embeds: [errorEmbed.setDescription('Epa! Isso não é um valor...')] })
        let retired = memberDB.val().ouroCofre

        if (vlr == "ALL" || vlr == "TUDO") {
            if (retired <= 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro para retirar.')] })
            database.ref(`Global/${message.author.id}/ouroCofre`).transaction(n => n - Number(retired))
            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(retired))
            return message.reply({ embeds: [sucEmbed.setTitle('🏦 | Cofre').setDescription(`Você sacou **${new Intl.NumberFormat('de-DE').format(retired)}** ${emoji.moeda} do seu cofre com sucesso!`)] })
        }

        if (vlr > memberDB.val().ouroCofre) return message.reply('Você não possui toda essa quantia para retirar.')
        if (retired <= 0) return message.reply('Você não possui ouro para retirar.')
        database.ref(`Global/${message.author.id}/ouroCofre`).transaction(n => n - Number(vlr))
        database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(vlr))
        return message.reply({ embeds: [sucEmbed.setTitle('🏦 | Cofre').setDescription(`Você sacou **${new Intl.NumberFormat('de-DE').format(vlr)}** ${emoji.moeda} do seu cofre com sucesso!`)] })
    }
}