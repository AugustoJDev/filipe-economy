const Discord = require("discord.js")
const ms = require("parse-ms")
module.exports = {
    name: "tempo",
    aliases: ["call", "contador"],
    async execute(client, message, args, database) {

        let memberDB = await database.ref(`Global/${message.author.id}/Perfil`).once('value')

        let time = ms(memberDB.val().callTime)
        let diaa = time.days > 0 ? `${time.days} dias,` : ""
        let horaa = time.hours > 0 ? `${time.hours} horas,` : ""
        let minutoo = time.minutes > 0 ? `${time.minutes} minutos e ` : ""
        let segundoo = time.seconds > 0 ? `${time.seconds} segundos` : ""
        let itsNull = memberDB.val().callTime < 999 ? "nenhum segundo" : ""

        return message.reply({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(`${emoji.call} | Contador de Call`)
                .setDescription(`Você já ficou em call por ${itsNull} ${diaa} ${horaa} ${minutoo} ${segundoo} e recebeu um total de **${new Intl.NumberFormat('de-DE').format(memberDB.val().gemasCall)}** ${emoji.gema} por isso.`)
                .setColor('#43CD80')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })]
        })
    }
}