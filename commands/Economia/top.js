const Discord = require('discord.js')
module.exports = {
    name: "top",
    aliases: ["rank", "ranking", "leaderboard"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')
            .setTimestamp()
            .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')
            .setTimestamp()
            .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })

        let globalDB = await database.ref(`Global`).once('value')
        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')

        if (!args[0]) return message.reply({ embeds: [errorEmbed.setDescription(`\`t.top ouro\` - Veja o ranking de BillyCoin ${emoji.moeda};\n\`t.top diamante\` - Veja o ranking de BillyGems ${emoji.gema}.`)] })

        if (args[0].toUpperCase() == "OURO" || args[0].toUpperCase() == `${emoji.moeda}`) {
            const values = Object.entries(globalDB.val()).map(([userID, value]) => ({ userID, ...value }))
            const ordered = values.sort((a, b) => b.ouro - a.ouro).slice(0, 9)
            return message.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle('🪙 | Rank de BillyCoins')
                    .setDescription(ordered.map((d, i) => `**${i + 1} - <@${d.userID}>:** ${new Intl.NumberFormat('de-DE').format(d.ouro)} ${emoji.moeda}`).join('\n'))
                    .setColor('#FFC125')
                    .setTimestamp()
                    .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })]
            })
        }

        if (args[0].toUpperCase() == "DIAMANTE" || args[0].toUpperCase() == "DIAMANTES") {
            const values = Object.entries(globalDB.val()).map(([userID, value]) => ({ userID, ...value }))
            const ordered = values.sort((a, b) => b.diamante - a.diamante).slice(0, 9)
            return message.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle(`${emoji.gema} | Rank de BillyGems`)
                    .setDescription(ordered.map((d, i) => `**${i + 1} - <@${d.userID}>:** ${new Intl.NumberFormat('de-DE').format(d.diamante)} ${emoji.gema}`).join('\n'))
                    .setColor('#87CEEB')
                    .setTimestamp()
                    .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })]
            })
        }

    }
}