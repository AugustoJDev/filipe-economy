const Discord = require('discord.js')
const ms = require('parse-ms')
module.exports = {
    name: "daily",
    aliases: ["diario"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        const cooldownDB = await database.ref(`Global/${message.author.id}/Cooldown`).once('value')
        const moneyMDB = await database.ref(`Global/${message.author.id}`).once('value')
        const cooldown = 86400000

        if (cooldownDB.val() !== null && cooldown - (Date.now() - cooldownDB.val().daily) > 0) {
            let time = ms(cooldown - (Date.now() - cooldownDB.val().daily))
            let hours = time.hours > 0 ? `${time.hours} horas,` : ""
            let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
            let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
            return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá usar esse comando novamente em ${hours} ${minutes} ${seconds}.`)] })
        } else {
            database.ref(`Global/${message.author.id}/Cooldown`).update({ daily: Date.now() })

            const addOuro = Math.floor(Math.random() * (4000 - 1500 + 1)) + 1500; // valor aleatório do daily, sendo Math.random() * (VALOR MÁXIMO - VALOR MÍNIMO + 1)) + VALOR MÍNIMO
            const addXP = Math.floor(Math.random() * (100 - 20 + 1)) + 20

            database.ref(`Global/${message.author.id}/ouro`).transaction(n => (n || 0) + Number(addOuro))
            database.ref(`Global/${message.author.id}/xp`).transaction(n => (n || 0) + Number(addXP))
            return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.moeda} | Daily`).setDescription(`Você recebeu **${new Intl.NumberFormat('de-DE').format(addOuro)}** ${emoji.moeda} e **${addXP}** XP no seu prêmio diário!`)] })
        }

    }
}