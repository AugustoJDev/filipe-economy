const Discord = require('discord.js')
const ms = require('parse-ms')
module.exports = {
    name: "vigilante",
    aliases: [],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        if (!args[0]) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu um subcomando.\n`t.vigilante <comprar/info>`')] })
        let cmd = args[0].toUpperCase()
        let cooldown = 14400000


        if (cmd == "COMPRAR") {
            if (memberDB.val().Vigilante.turno !== null && cooldown - (Date.now() - memberDB.val().Vigilante.turno) > 0) {
                let time = ms(cooldown - (Date.now() - memberDB.val().Vigilante.turno))
                let hours = time.hours > 0 ? `${time.hours} horas,` : ""
                let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                return message.reply({ embeds: [errorEmbed.setDescription(`O turno do vigilante acabará em ${hours} ${minutes} ${seconds}.`)] })
            } else {
                if (memberDB.val().Vigilante.turno !== null && cooldown - (Date.now() - memberDB.val().Vigilante.turno) > 0) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui um vigilante.')] })
                if (memberDB.val().ouro < 2500) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessário **2.500** ouros.')] })

                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(2500))
                database.ref(`Global/${message.author.id}/Vigilante`).update({ temVigilante: "true", turno: Date.now() })
                message.reply({ embeds: [sucEmbed.setTitle(`${emoji.vigilante} | Vigilante`).setDescription('Você contratou um **Vigilante** durante 4 horas!')] })

                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Vigilante/temVigilante`).set("false")
                    message.author.send({
                        embeds: [new Discord.EmbedBuilder()
                            .setTitle(`${emoji.vigilante} | Vigilante`)
                            .setDescription('Seu vigilante mandou eu te avisar que o turno dele acabou e você está vulnerável a roubos novamente.')
                            .setColor('#43CD80')
                            .setTimestamp()
                            .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })]
                    })
                }, 14400000);
            }
        }

        if (cmd == "INFO") {
            let haveVig = memberDB.val().Vigilante.temVigilante == "true" ? "Sim" : "Não"

            let timeVig = ms(cooldown - (Date.now() - memberDB.val().Vigilante.turno))
            let hours = timeVig.hours <= 0 ? "" : `${timeVig.hours} horas, `
            let minutes = timeVig.minutes <= 0 ? "" : `${timeVig.minutes} minutos, `
            let seconds = timeVig.seconds <= 0 ? "" : `${timeVig.seconds} segundos`

            if (timeVig.hours < 0 && timeVig.minutes < 0 && timeVig.seconds < 0) return message.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle('<:billy_vigilante:887523898734821396> | Vigilante')
                    .setDescription(`**Vigilante Ativo:** Não\n**Turno:** Já pode ser contratado`)
                    .setColor('#4682B4')
                    .setTimestamp()
                    .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })]
            })

            message.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle('<:billy_vigilante:887523898734821396> | Vigilante')
                    .setDescription(`**Vigilante Ativo:** ${haveVig}\n**Turno:** ${hours} ${minutes} ${seconds}`)
                    .setColor('#4682B4')
                    .setTimestamp()
                    .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })]
            })
        }

    }
}