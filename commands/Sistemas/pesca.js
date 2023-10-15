const Discord = require('discord.js')
const ms = require('parse-ms')
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js")

module.exports = {
    name: "pesca",
    aliases: ["fish", "pescar"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let fishDB = await database.ref(`Global/${message.author.id}/Pesca`).once('value')

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('fish')
					.setPlaceholder('Selecione uma categoria')
					.addOptions(
						{
							label: 'Enviar',
							description: 'Envie seu barco para pescar',
							value: 'send',
						},
						{
							label: 'Vender',
							description: 'Venda seus peixes pescados',
							value: 'sell',
						},
						{
							label: 'Info',
							description: 'Mostra suas informações de pescas',
							value: 'info',
						}
					),
			);

            let msgFish = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('🐟 | Pesca - Menu')
                        .setDescription('`Enviar` - Envia seu barco para um oceano;\n`Vender` - Venda seus peixes;\n`info` - Veja as informações das suas pescas.')
                        .setColor('#6495ED')],
                components: [row]
            })

        const filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
        };
        
        msgFish.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
            .then(async cmd => {

        cmd = cmd.values[0].toUpperCase()

        if (cmd == "SEND") {
            
            const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('fish')
					.setPlaceholder('Selecione uma categoria')
					.addOptions(
						{
							label: 'Oceano 1',
							description: 'Envie seu barco para pescar',
							value: '1',
						},
						{
							label: 'Oceano 2',
							description: 'Envie seu barco para pescar',
							value: '2',
						},
						{
							label: 'Oceano 3',
							description: 'Envie seu barco para pescar',
							value: '3',
						}
					),
			);

            let msgFishSend = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('🐟 | Pesca - Enviar')
                        .setDescription('Escolha o oceano para enviar seu barco')
                        .setColor('#6495ED')],
                components: [row]
            })

            const filter = i => {
                i.deferUpdate();
                return i.user.id === message.author.id;
            };
        
            msgFishSend.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
                .then(async idSend => {

            idSend = Number(idSend.values[0])

            let cooldown;
            if (fishDB.val().id == 1) cooldown = 3600000
            if (fishDB.val().id == 2) cooldown = 7200000
            if (fishDB.val().id == 3) cooldown = 10800000

            let randomSalmao = Math.floor(Math.random() * (30 - 5)) + 5;
            let randomAtum = Math.floor(Math.random() * (25 - 5)) + 5;
            let randomTilapia = Math.floor(Math.random() * (20 - 5)) + 5;
            let randomBacalhau = Math.floor(Math.random() * (15 - 5)) + 5;
            let randomSardinha = Math.floor(Math.random() * (10 - 5)) + 5;

            if (fishDB.val().cooldown !== null && cooldown - (Date.now() - fishDB.val().cooldown) > 0) {
                let time = ms(cooldown - (Date.now() - fishDB.val().cooldown))
                let hours = time.hours > 0 ? `${time.hours} horas,` : ""
                let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá usar esse comando novamente em ${hours} ${minutes} ${seconds}.`)] })
            } else {
                database.ref(`Global/${message.author.id}/Pesca`).update({ cooldown: Date.now() })
            }

            if (idSend == 1) {

                if (fishDB.val().agua < 10) return message.reply({ embeds: [errorEmbed.setDescription('Sua tripulação está com sede.')] })
                if (fishDB.val().comida < 10) return message.reply({ embeds: [errorEmbed.setDescription('Sua tripulação está com fome.')] })
                if (fishDB.val().gasolina < 10) return message.reply({ embeds: [errorEmbed.setDescription('Seu barco está sem gasolina.')] })
                if (fishDB.val().saude < 10) return message.reply({ embeds: [errorEmbed.setDescription('Sua tripulação está doente.')] })

                database.ref(`Global/${message.author.id}/Pesca`).update({ agua: Number(fishDB.val().agua) - Number(10), comida: Number(fishDB.val().comida) - Number(10), gasolina: Number(fishDB.val().gasolina) - Number(10), saude: Number(fishDB.val().saude) - Number(10) })
                database.ref(`Global/${message.author.id}/Pesca/id`).set(1)
                database.ref(`Global/${message.author.id}/Pesca/salmao`).transaction(n => n + Number(randomSalmao))
                database.ref(`Global/${message.author.id}/Pesca/atum`).transaction(n => n + Number(randomAtum))
                message.reply({ embeds: [sucEmbed.setTitle('🐟 | Pesca Concluída').setDescription(`Sua tripulação pescou **${randomSalmao}** salmões e **${randomAtum}** atuns com sucesso!`)] })
            }

            if (idSend == 2) {
                if (fishDB.val().agua < 20) return message.reply({ embeds: [errorEmbed.setDescription('Sua tripulação está com sede.')] })
                if (fishDB.val().comida < 20) return message.reply({ embeds: [errorEmbed.setDescription('Sua tripulação está com fome.')] })
                if (fishDB.val().gasolina < 20) return message.reply({ embeds: [errorEmbed.setDescription('Seu barco está sem gasolina.')] })
                if (fishDB.val().saude < 20) return message.reply({ embeds: [errorEmbed.setDescription('Sua tripulação está doente.')] })

                database.ref(`Global/${message.author.id}/Pesca`).update({ agua: Number(fishDB.val().agua) - Number(20), comida: Number(fishDB.val().comida) - Number(20), gasolina: Number(fishDB.val().gasolina) - Number(20), saude: Number(fishDB.val().saude) - Number(20) })
                database.ref(`Global/${message.author.id}/Pesca/id`).set(2)
                database.ref(`Global/${message.author.id}/Pesca/tilapia`).transaction(n => n + Number(randomTilapia))
                database.ref(`Global/${message.author.id}/Pesca/bacalhau`).transaction(n => n + Number(randomBacalhau))
                message.reply({ embeds: [sucEmbed.setTitle('🐟 | Pesca Concluída').setDescription(`Sua tripulação pescou **${randomTilapia}** tilápias e **${randomBacalhau}** bacalhaus com sucesso!`)] })
            }

            if (idSend == 3) {
                if (fishDB.val().agua < 30) return message.reply({ embeds: [errorEmbed.setDescription('Sua tripulação está com sede.')] })
                if (fishDB.val().comida < 30) return message.reply({ embeds: [errorEmbed.setDescription('Sua tripulação está com fome.')] })
                if (fishDB.val().gasolina < 30) return message.reply({ embeds: [errorEmbed.setDescription('Seu barco está sem gasolina.')] })
                if (fishDB.val().saude < 30) return message.reply({ embeds: [errorEmbed.setDescription('Sua tripulação está doente.')] })

                database.ref(`Global/${message.author.id}/Pesca`).update({ agua: Number(fishDB.val().agua) - Number(30), comida: Number(fishDB.val().comida) - Number(30), gasolina: Number(fishDB.val().gasolina) - Number(30), saude: Number(fishDB.val().saude) - Number(30) })
                database.ref(`Global/${message.author.id}/Pesca/id`).set(2)
                database.ref(`Global/${message.author.id}/Pesca/sardinha`).transaction(n => n + Number(randomSardinha))
                database.ref(`Global/${message.author.id}/Pesca/salmao`).transaction(n => n + Number(randomSalmao))
                message.reply({ embeds: [sucEmbed.setTitle('🐟 | Pesca Concluída').setDescription(`Sua tripulação pescou **${randomSalmao}** salmões e **${randomSardinha}** sardinhas com sucesso!`)] })
                }
            })
        }

        if (cmd == "SELL") {

            let vlrSalmao = fishDB.val().salmao * 20
            let vlrAtum = fishDB.val().atum * 35
            let vlrTilapia = fishDB.val().tilapia * 50
            let vlrBacalhau = fishDB.val().bacalhau * 75
            let vlrSardinha = fishDB.val().sardinha * 100
            let totalPxs = fishDB.val().salmao + fishDB.val().atum + fishDB.val().tilapia + fishDB.val().bacalhau + fishDB.val().sardinha
            let totalVlr = vlrSalmao + vlrAtum + vlrTilapia + vlrBacalhau + vlrSardinha

            if (fishDB.val().salmao < 0 && fishDB.val().atum < 0 && fishDB.val().tilapia < 0 && fishDB.val().bacalhau < 0 && fishDB.val().sardinha < 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nenhum peixe.')] })

            let sellFEmbed = new Discord.EmbedBuilder()
                .setTitle('🪣 | Balde de Peixes')
                .setDescription(`🐟 | Você vendeu ${new Intl.NumberFormat('de-DE').format(fishDB.val().salmao)} salmões por ${new Intl.NumberFormat('de-DE').format(vlrSalmao)}\n🐟 | Você vendeu ${new Intl.NumberFormat('de-DE').format(fishDB.val().atum)} atuns por ${new Intl.NumberFormat('de-DE').format(vlrAtum)}\n🐟 | Você vendeu ${new Intl.NumberFormat('de-DE').format(fishDB.val().tilapia)} tilapias por ${new Intl.NumberFormat('de-DE').format(vlrTilapia)}\n🐟 | Você vendeu ${new Intl.NumberFormat('de-DE').format(fishDB.val().bacalhau)} bacalhaus por ${new Intl.NumberFormat('de-DE').format(vlrBacalhau)}\n🐟 | Você vendeu ${new Intl.NumberFormat('de-DE').format(fishDB.val().sardinha)} sardinhas por ${new Intl.NumberFormat('de-DE').format(vlrSardinha)}\n🐠 | Total: **${new Intl.NumberFormat('de-DE').format(totalPxs)}** peixes por **${new Intl.NumberFormat('de-DE').format(totalVlr)}** ouros`)
                .setColor('#8EE5EE')

            message.reply({ embeds: [sellFEmbed] })
            database.ref(`Global/${message.author.id}/Pesca/salmao`).set(0)
            database.ref(`Global/${message.author.id}/Pesca/atum`).set(0)
            database.ref(`Global/${message.author.id}/Pesca/tilapia`).set(0)
            database.ref(`Global/${message.author.id}/Pesca/bacalhau`).set(0)
            database.ref(`Global/${message.author.id}/Pesca/sardinha`).set(0)
            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(totalVlr))
        }

        if (cmd == "INFO") {
            let cooldown;
            if (fishDB.val().id == 1) cooldown = 3600000
            if (fishDB.val().id == 2) cooldown = 7200000
            if (fishDB.val().id == 3) cooldown = 10800000

            let time = ms(cooldown - (Date.now() - fishDB.val().cooldown))
            let timed = time.hours < 0 && time.minutes < 0 && time.seconds < 0 ? "Já pode ser usado" : `${time.hours} hora, ${time.minutes} minutos e ${time.seconds} segundos`
            if (fishDB.val().cooldown <= 0) timed = "Já pode ser usado"

            let infoEmbed = new Discord.EmbedBuilder()
                .setTitle('🎣 | Inventário - Pescaria')
                .setDescription(`⛵ **| Última Viagem:**\nㅤㅤ**ID:** ${fishDB.val().id}\nㅤㅤ**Cooldown:** ${timed}\n\n🪣 | Balde de Peixes:\nㅤㅤ**Salmões:** ${new Intl.NumberFormat('de-DE').format(fishDB.val().salmao)}\nㅤㅤ**Atuns:** ${new Intl.NumberFormat('de-DE').format(fishDB.val().atum)}\nㅤㅤ**Tilápias:** ${new Intl.NumberFormat('de-DE').format(fishDB.val().tilapia)}\nㅤㅤ**Bacalhaus:** ${new Intl.NumberFormat('de-DE').format(fishDB.val().bacalhau)}\nㅤㅤ**Sardinhas:** ${new Intl.NumberFormat('de-DE').format(fishDB.val().sardinha)}`)
                .setColor('#7EC0EE')
            message.reply({ embeds: [infoEmbed] })
            }
        })
    }
}