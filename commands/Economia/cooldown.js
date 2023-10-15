const Discord = require('discord.js')
const ms = require('parse-ms')
module.exports = {
    name: "cooldown",
    aliases: ["cd", "tempo"],
    async execute(client, message, args, database) {

        let cooldownDB = await database.ref(`Global/${message.author.id}/Cooldown`).once('value')
        let fishDB = await database.ref(`Global/${message.author.id}/Pesca`).once('value')
        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let mfactoryDB = await database.ref(`Global/${message.author.id}/Fabrica`).once('value')

        // ASSALTO
        let cooldownAssalto = 7200000
        let timeAssalto = ms(cooldownAssalto - (Date.now() - cooldownDB.val().assalto))
        let hourAssalto = timeAssalto.hours > 0 ? `${timeAssalto.hours} horas,` : ""
        let minutesAssalto = timeAssalto.minutes > 0 ? `${timeAssalto.minutes} minutos e` : ""
        let secondsAssalto = timeAssalto.seconds > 0 ? `${timeAssalto.seconds} segundos` : ""
        if (cooldownDB.val().assalto == null || cooldownDB.val() == null) hourAssalto = `${emoji.confirmar}`
        if (timeAssalto.hours < 0 && timeAssalto.minutes < 0 && timeAssalto.seconds < 0) hourAssalto = `${emoji.confirmar}`

        // BOOSTER
        let cooldownBooster = 86400000
        let timeBooster = ms(cooldownBooster - (Date.now() - cooldownDB.val().booster))
        let hourBooster = timeBooster.hours > 0 ? `${timeBooster.hours} horas,` : ""
        let minutesBooster = timeBooster.minutes > 0 ? `${timeBooster.minutes} minutos e` : ""
        let secondsBooster = timeBooster.seconds > 0 ? `${timeBooster.seconds} segundos` : ""
        if (cooldownDB.val().booster == null || cooldownDB.val() == null) hourBooster = `${emoji.confirmar}`
        if (timeBooster.hours < 0 && timeBooster.minutes < 0 && timeBooster.seconds < 0) hourBooster = `${emoji.confirmar}`

        // DAILY
        let cooldownDaily = 86400000
        let timeDaily = ms(cooldownDaily - (Date.now() - cooldownDB.val().daily))
        let hourDaily = timeDaily.hours > 0 ? `${timeDaily.hours} horas,` : ""
        let minutesDaily = timeDaily.minutes > 0 ? `${timeDaily.minutes} minutos e` : ""
        let secondsDaily = timeDaily.seconds > 0 ? `${timeDaily.seconds} segundos` : ""
        if (cooldownDB.val().daily == null || cooldownDB.val() == null) hourDaily = `${emoji.confirmar}`
        if (timeDaily.hours < 0 && timeDaily.minutes < 0 && timeDaily.seconds < 0) hourDaily = `${emoji.confirmar}`

        // DAILY VIP
        let cooldownDailyVIP = 86400000
        let timeDailyVip = ms(cooldownDailyVIP - (Date.now() - cooldownDB.val().dailyvip))
        let hourDailyVIP = timeDailyVip.hours > 0 ? `${timeDailyVip.hours} horas,` : ""
        let minutesDailyVIP = timeDailyVip.minutes > 0 ? `${timeDailyVip.minutes} minutos e` : ""
        let secondsDailyVIP = timeDailyVip.seconds > 0 ? `${timeDailyVip.seconds} segundos` : ""
        if (cooldownDB.val().dailyvip == null || cooldownDB.val() == null) hourDailyVIP = `${emoji.confirmar}`
        if (timeDailyVip.hours < 0 && timeDailyVip.minutes < 0 && timeDailyVip.seconds < 0) hourDailyVIP = `${emoji.confirmar}`

        // ROUBAR
        let cooldownRoubar = 14400000
        let timeRoubar = ms(cooldownRoubar - (Date.now() - cooldownDB.val().roubar))
        let hourRoubar = timeRoubar.hours > 0 ? `${timeRoubar.hours} horas,` : ""
        let minutesRoubar = timeRoubar.minutes > 0 ? `${timeRoubar.minutes} minutos e` : ""
        let secondsRoubar = timeRoubar.seconds > 0 ? `${timeRoubar.seconds} segundos` : ""
        if (cooldownDB.val().roubar == null || cooldownDB.val() == null) hourRoubar = `${emoji.confirmar}`
        if (timeRoubar.hours < 0 && timeRoubar.minutes < 0 && timeRoubar.seconds < 0) hourRoubar = `${emoji.confirmar}`

        // ROUBAR COFRE
        let cooldownRoubarCofre = 86400000
        let timeRoubarCofre = ms(cooldownRoubarCofre - (Date.now() - cooldownDB.val().roubarCofre))
        let hourRoubarCofre = timeRoubarCofre.hours > 0 ? `${timeRoubarCofre.hours} horas,` : ""
        let minutesRoubarCofre = timeRoubarCofre.minutes > 0 ? `${timeRoubarCofre.minutes} minutos e` : ""
        let secondsRoubarCofre = timeRoubarCofre.seconds > 0 ? `${timeRoubarCofre.seconds} segundos` : ""
        if (cooldownDB.val().roubarCofre == null || cooldownDB.val() == null) hourRoubarCofre = `${emoji.confirmar}`
        if (timeRoubarCofre.hours < 0 && timeRoubarCofre.minutes < 0 && timeRoubarCofre.seconds < 0) hourRoubarCofre = `${emoji.confirmar}`

        // VIGILANTE
        let cooldownVigilante = 14400000
        let timeVig = ms(cooldownVigilante - (Date.now() - memberDB.val().Vigilante.turno))
        let hourVigilante = timeVig.hours > 0 ? `${timeVig.hours} horas,` : ""
        let minutesVigilante = timeVig.minutes > 0 ? `${timeVig.minutes} minutos e` : ""
        let secondsVigilante = timeVig.seconds > 0 ? `${timeVig.seconds} segundos` : ""
        if (memberDB.val().Vigilante.turno == null || memberDB.val().Vigilante == null || memberDB.val() == null) hourVigilante = `${emoji.confirmar}`
        if (timeVig.hours < 0 && timeVig.minutes < 0 && timeVig.seconds < 0) hourVigilante = `${emoji.confirmar}`

        message.channel.send({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(`${emoji.carregando} | Tempo de uso para comandos`)
                .setDescription(`\`Assalto\` - ${hourAssalto} ${minutesAssalto} ${secondsAssalto}\n\`Booster\` - ${hourBooster} ${minutesBooster} ${secondsBooster}\n\`Daily\` - ${hourDaily} ${minutesDaily} ${secondsDaily}\n\`Daily VIP\` - ${hourDailyVIP} ${minutesDailyVIP} ${secondsDailyVIP}\n\`Roubar\` - ${hourRoubar} ${minutesRoubar} ${secondsRoubar}\n\`Roubar Cofre\` - ${hourRoubarCofre} ${minutesRoubarCofre} ${secondsRoubarCofre}\n\`Vigilante\` - ${hourVigilante} ${minutesVigilante} ${secondsVigilante}`)
                .setColor('#EE3B3B')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}`})]
        })
    }
}