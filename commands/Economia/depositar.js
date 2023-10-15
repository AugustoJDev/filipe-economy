const Discord = require('discord.js')
module.exports = {
    name: "depositar",
    aliases: ["dep"],
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

        if (memberDB.val().ouroCofre == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui cofre. Compre em `t.loja`')] })
        if (!args[0]) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu o valor.\n`t.depositar <quantia/all>`')] })
        let vlr = args[0].toUpperCase()

        if (!["ALL", "TUDO"].includes(vlr) && isNaN(vlr)) return message.reply({ embeds: [errorEmbed.setDescription('Epa! Isso não é um valor...')] })
        let deposited = memberDB.val().ouro

        if (vlr == "ALL" || vlr == "TUDO") {
            if (deposited <= 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro para depositar.')] })
            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(deposited))
            database.ref(`Global/${message.author.id}/ouroCofre`).transaction(n => n + Number(deposited))
            return message.reply({ embeds: [sucEmbed.setTitle('🏦 | Cofre').setDescription(`Você depositou **${new Intl.NumberFormat('de-DE').format(deposited)}** ${emoji.moeda} em seu cofre com sucesso!`)] })
        }

        if (vlr > memberDB.val().ouro) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui toda essa quantia para depositar.')] })
        if (deposited <= 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro para depositar.')] })
        database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(vlr))
        database.ref(`Global/${message.author.id}/ouroCofre`).transaction(n => n + Number(vlr))
        return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.cofre} | Cofre`).setDescription(`Você depositou **${new Intl.NumberFormat('de-DE').format(vlr)}** ${emoji.moeda} em seu cofre com sucesso!`)] })
    }
}