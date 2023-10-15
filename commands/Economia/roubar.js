const Discord = require('discord.js')
const ms = require('parse-ms')
module.exports = {
    name: "roubar",
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
        if (!usuario) return message.reply({ embeds: [errorEmbed.setDescription('Você não mencionou ninguém para roubar.')] })
        let roubadoDB = await database.ref(`Global/${usuario.user.id}`).once('value')
        let cooldown = 14400000

        if (usuario.user.id == message.author.id) return message.reply({ embeds: [errorEmbed.setDescription('Você não pode roubar você mesmo.')] })
        if (roubadoDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Este membro não joga no Billy.')] })
        if (roubadoDB.val().ouro <= 0 || roubadoDB.val().ouro == null) return message.reply({ embeds: [errorEmbed.setDescription('Este membro não possui ouro no bolso para ser roubado.')] })
        if (roubadoDB.val().Vigilante.temVigilante == "true") return message.reply({ embeds: [errorEmbed.setDescription('Este membro possui vigilante, logo, não é possível roubá-lo por enquanto.')] })
        if (memberDB.val().itemRoubo1 != "true" && memberDB.val().itemRoubo2 != "true") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui item para roubo.')] })

        if (memberDB.val().Cooldown !== null && cooldown - (Date.now() - memberDB.val().Cooldown.roubar) > 0) {
            let time = ms(cooldown - (Date.now() - memberDB.val().Cooldown.roubar))
            let hours = time.hours > 0 ? `${time.hours} horas,` : ""
            let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
            let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
            return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá usar esse comando novamente em ${hours} ${minutes} ${seconds}.`)] })
        } else {
            database.ref(`Global/${message.author.id}/Cooldown`).update({ roubar: Date.now() })

            let vlrRoubado = Math.floor(Math.random() * (roubadoDB.val().ouro - 1)) + 1;
            let addXP = Math.floor(Math.random() * (30 - 5 + 1)) + 5

            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(vlrRoubado))
            database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
            database.ref(`Global/${usuario.user.id}/ouro`).transaction(n => n - Number(vlrRoubado))

            if (memberDB.val().itemRoubo1 == "true") {
                database.ref(`Global/${message.author.id}/itemRoubo1`).set("false")
                return message.reply({ embeds: [sucEmbed.setTitle('💸 | Roubo').setDescription(`Eita! Você roubou **${new Intl.NumberFormat('de-DE').format(vlrRoubado)}** ${emoji.moeda} de \`${usuario.user.tag}\` e recebeu **${addXP}** XP!`)] })
            }

            if (memberDB.val().itemRoubo2 == "true") {
                database.ref(`Global/${message.author.id}/itemRoubo2`).set("false")
                return message.reply({ embeds: [sucEmbed.setTitle('💸 | Roubo').setDescription(`Eita! Você roubou **${new Intl.NumberFormat('de-DE').format(vlrRoubado)}** ${emoji.moeda} de \`${usuario.user.tag}\` e recebeu **${addXP}** XP!`)] })
            }

        }

    }
}