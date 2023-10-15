const Discord = require('discord.js')
const ms = require('parse-ms')
module.exports = {
    name: "dailyvip",
    aliases: ["vipdaily"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        if (!message.member.roles.cache.has(infos.vipRole)) return message.reply({ embeds: [errorEmbed.setDescription('Você não é um VIP.')] })

        const cooldownDB = await database.ref(`Global/${message.author.id}/Cooldown`).once('value')
        const moneyMDB = await database.ref(`Global/${message.author.id}`).once('value')
        const cooldown = 86400000

        if (cooldownDB.val() !== null && cooldown - (Date.now() - cooldownDB.val().dailyvip) > 0) {
            let time = ms(cooldown - (Date.now() - cooldownDB.val().dailyvip))
            let hours = time.hours > 0 ? `${time.hours} horas, ` : ""
            let minutes = time.minutes > 0 ? `${time.minutes} minutos e ` : ""
            let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
            return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá usar esse comando novamente em ${hours} ${minutes} ${seconds}.`)] })
        } else {
            database.ref(`Global/${message.author.id}/Cooldown`).update({ dailyvip: Date.now() })

            const addOuro = Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000;
            const addDima = Math.floor(Math.random() * (50 - 10 + 1)) + 10

            database.ref(`Global/${message.author.id}/ouro`).transaction(n => (n || 0) + Number(addOuro))
            database.ref(`Global/${message.author.id}/diamante`).transaction(n => (n || 0) + Number(addDima))
            return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.emblemaVIP} | Daily VIP`).setDescription(`Você recebeu **${new Intl.NumberFormat('de-DE').format(addOuro)}** ${emoji.moeda} e **${addDima}** ${emoji.gema} no seu prêmio diário VIP!`)] })
        }
    }
}