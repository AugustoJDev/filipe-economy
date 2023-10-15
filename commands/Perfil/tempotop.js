const Discord = require('discord.js')
const ms = require('pretty-ms')
module.exports = {
    name: "tempotop",
    aliases: [],
    async execute(client, message, args, database) {

        let globalDB = await database.ref(`Global`).once('value')

        const values = Object.entries(globalDB.val()).map(([userID, value]) => ({ userID, ...value }))
        const ordered = values.sort((a, b) => b.callTime - a.callTime).slice(0, 9)
        return message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`${emoji.call} | TOP Tempo em Call`)
                .setDescription(ordered.map((d, i) => `**${i + 1} - <@${d.userID}>:** ${ms(d.Perfil.callTime, { verbose: true, secondsDecimalDigits: 0 }).replace("years", "anos,").replace("days", "dias,").replace("hours", "horas,").replace("minutes", "minutos e").replace("seconds", "segundos").replace("0 millisegundos", "Não possui tempo em call.")}`).join('\n'))
                .setColor('#FF3030')]
        })
    }
}