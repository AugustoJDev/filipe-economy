const Discord = require('discord.js')
const ms = require('parse-ms')
module.exports = {
    name: "assalto",
    aliases: [],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let cooldown = 7200000

        let cooldownDB = await database.ref(`Global/${message.author.id}/Cooldown`).once('value')
        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        if (!args[0]) {

            if (memberDB.val().preso == "true") return message.reply({ embeds: [errorEmbed.setDescription('Você não pode executar este comando pois está preso.')] })
            if (memberDB.val().arma == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem uma arma para assaltar.').setFooter({ text: 'Compre uma em t.loja armas' })] })
            if (memberDB.val().municoes == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem munição.')] })

            if (cooldownDB.val() !== null && cooldown - (Date.now() - cooldownDB.val().assalto) > 0) {
                let time = ms(cooldown - (Date.now() - cooldownDB.val().assalto))
                let hours = time.hours > 0 ? `${time.hours} horas,` : ""
                let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá usar esse comando novamente em ${hours} ${minutes} ${seconds}.`)] })
            } else {
                database.ref(`Global/${message.author.id}/Cooldown/assalto`).set(Date.now())
            }

            /* PORCENTAGENS DE SUCESSO DAS ARMAS*/

            let glockPorc = Math.floor(Math.random() * (105 - 0 + 1)) + 0;
            let espinPorc = Math.floor(Math.random() * (110 - 0 + 1)) + 0;
            let ak47Porc = Math.floor(Math.random() * (120 - 0 + 1)) + 0;
            let snipePorc = Math.floor(Math.random() * (130 - 0 + 1)) + 0;
            let valorRoubado = Math.floor(Math.random() * (2500 - 100 + 1)) + 100;
            let addXP = Math.floor(Math.random() * (30 - 5 + 1)) + 5

            if (memberDB.val().arma == "glock") {
                database.ref(`Global/${message.author.id}/municoes`).transaction(n => n - Number(1))
                if (glockPorc > 50) {
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(valorRoubado))
                    database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                    return message.reply({ embeds: [sucEmbed.setTitle('💰 | Assalto').setDescription(`Seu assalto foi um sucesso! Você lucrou **${new Intl.NumberFormat('de-DE').format(valorRoubado)}** ${emoji.moeda} e ${addXP} XP.`)] })
                } else {
                    database.ref(`Global/${message.author.id}/preso`).set("true")
                    return message.reply({ embeds: [errorEmbed.setDescription('Seu assalto foi um fracasso! Você foi preso.\n`Use o comando t.fianca`')] })
                }
            }

            if (memberDB.val().arma == "espingarda") {
                database.ref(`Global/${message.author.id}/municoes`).transaction(n => n - Number(1))
                if (espinPorc > 50) {
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(valorRoubado))
                    database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                    return message.reply({ embeds: [sucEmbed.setTitle('💰 | Assalto').setDescription(`Seu assalto foi um sucesso! Você lucrou **${valorRoubado}** ${emoji.moeda} e ${addXP} XP.`)] })
                } else {
                    database.ref(`Global/${message.author.id}/preso`).set("true")
                    return message.reply({ embeds: [errorEmbed.setDescription('Seu assalto foi um fracasso! Você foi preso. `Use o comando t.fianca`')] })
                }
            }

            if (memberDB.val().arma == "ak47") {
                database.ref(`Global/${message.author.id}/municoes`).transaction(n => n - Number(1))
                if (ak47Porc > 50) {
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(valorRoubado))
                    database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                    return message.reply({ embeds: [sucEmbed.setTitle('💰 | Assalto').setDescription(`Seu assalto foi um sucesso! Você lucrou **${valorRoubado}** ${emoji.moeda} e ${addXP} XP.`)] })
                } else {
                    database.ref(`Global/${message.author.id}/preso`).set("true")
                    return message.reply({ embeds: [errorEmbed.setDescription('Seu assalto foi um fracasso! Você foi preso. `Use o comando t.fianca`')] })
                }
            }

            if (memberDB.val().arma == "sniper") {
                database.ref(`Global/${message.author.id}/municoes`).transaction(n => n - Number(1))
                if (snipePorc > 50) {
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(valorRoubado))
                    database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                    return message.reply({ embeds: [sucEmbed.setTitle('💰 | Assalto').setDescription(`Seu assalto foi um sucesso! Você lucrou **${valorRoubado}** ${emoji.moeda} e ${addXP} XP.`)] })
                } else {
                    database.ref(`Global/${message.author.id}/preso`).set("true")
                    return message.reply({ embeds: [errorEmbed.setDescription('Seu assalto foi um fracasso! Você foi preso. `Use o comando t.fianca`')] })
                }
            }
        }

    }
}