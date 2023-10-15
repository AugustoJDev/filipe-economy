const Discord = require('discord.js')
const ms = require('parse-ms')
module.exports = {
    name: "roubarcofre",
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

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let usuario = message.mentions.members.first()
        if (!usuario) return message.reply({ embeds: [errorEmbed.setDescription('Você não mencionou ninguém.')] })
        let roubadoDB = await database.ref(`Global/${usuario.user.id}`).once('value')
        let cooldown = 86400000 // 1 dia

        if (usuario.user.id == message.author.id) return message.reply({ embeds: [errorEmbed.setDescription('Você não pode roubar você mesmo.')] })
        if (roubadoDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Este membro não joga no Billy.')] })
        if (roubadoDB.val().ouroCofre <= 0 || roubadoDB.val().ouroCofre == null) return message.reply({ embeds: [errorEmbed.setDescription('Este membro não possui ouro no cofre para ser roubado.')] })
        if (memberDB.val().itemRCofre1 != "true" && memberDB.val().itemRCofre2 != "true") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui item para roubo de cofre.')] })

        if (memberDB.val().Cooldown !== null && cooldown - (Date.now() - memberDB.val().Cooldown.roubarCofre) > 0) {
            let time = ms(cooldown - (Date.now() - memberDB.val().Cooldown.roubarCofre))
            let hours = time.hours > 0 ? `${time.hours} horas,` : ""
            let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
            let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
            return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá usar esse comando novamente em ${hours} ${minutes} ${seconds}.`)] })
        } else {
            database.ref(`Global/${message.author.id}/Cooldown`).update({ roubarCofre: Date.now() })

            let vlrRoubado = Math.floor(Math.random() * (roubadoDB.val().ouroCofre / 3 - 1)) + 1;
            let addXP = Math.floor(Math.random() * (30 - 5)) + 5

            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(vlrRoubado))
            database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
            database.ref(`Global/${usuario.user.id}/ouroCofre`).transaction(n => n - Number(vlrRoubado))

            if (memberDB.val().itemRCofre1 == "true") {
                database.ref(`Global/${message.author.id}/itemRCofre1`).set("false")
                return message.reply({ embeds: [sucEmbed.setTitle('💸 | Roubo de Cofre').setDescription(`Eita! Você roubou **${new Intl.NumberFormat('de-DE').format(vlrRoubado)}** ouros do cofre de \`${message.author.tag}\` e recebeu **${addXP}** XP!`)] })
            }

            if (memberDB.val().itemRCofre2 == "true") {
                database.ref(`Global/${message.author.id}/itemRCofre2`).set("false")
                return message.reply({ embeds: [sucEmbed.setTitle('💸 | Roubo de Cofre').setDescription(`Eita! Você roubou **${new Intl.NumberFormat('de-DE').format(vlrRoubado)}** ouros do cofre de \`${message.author.tag}\` e recebeu **${addXP}** XP!`)] })
            }

        }
    }
}