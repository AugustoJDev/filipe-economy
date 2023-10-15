const Discord = require('discord.js')
const ms = require('parse-ms')
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js")

module.exports = {
    name: "ranqueada",
    aliases: ["ranqueado", "ranked"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let neutEmbed = new Discord.EmbedBuilder()
            .setColor('#40C0FF')

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let rankedDB = await database.ref(`Ranqueada/${message.author.id}`).once('value')
        let cooldownDB = await database.ref(`Global/${message.author.id}/Cooldown`).once('value')

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('produzir')
					.setPlaceholder('Selecione uma categoria')
					.addOptions(
						{
							label: 'Start',
							description: 'Inicie uma ranqueada',
							value: 'produzir',
						},
						{
							label: 'Loja',
							description: 'Veja a loja ranqueada',
							value: 'loja',
						},
						{
							label: 'Info',
							description: 'Mostra as informações da ranqueada',
							value: 'info',
						},
						{
							label: 'Top',
							description: 'Veja os top ranking do sistema',
							value: 'top',
						}
					),
			);

            let msgMS = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(`⭐ | Ranqueada - Ajuda`)
                        .setDescription('Selecione uma das categorias de ranqueado abaixo.')
                        .setColor('#B4EEB4')],
                components: [row]
            })
        
            const filter = i => {
                i.deferUpdate();
                return i.user.id === message.author.id;
            };
                
            msgMS.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
                .then(async cmd => {

        cmd = cmd.values[0].toUpperCase()
       
        // PATENTES:
        let patente = "Ferro I"
        if (rankedDB.val().patente == 2) patente = "Ferro II"
        if (rankedDB.val().patente == 3) patente = "Ferro III"
        if (rankedDB.val().patente == 4) patente = "Ferro IV"
        if (rankedDB.val().patente == 5) patente = "Ferro V"
        if (rankedDB.val().patente == 6) patente = "Ferro VI"
        if (rankedDB.val().patente == 7) patente = "Ferro VII"
        if (rankedDB.val().patente == 8) patente = "Ferro VIII"
        if (rankedDB.val().patente == 9) patente = "Ferro IX"
        if (rankedDB.val().patente == 10) patente = "Ferro X"
        if (rankedDB.val().patente == 11) patente = "Bronze I"
        if (rankedDB.val().patente == 12) patente = "Bronze II"
        if (rankedDB.val().patente == 13) patente = "Bronze III"
        if (rankedDB.val().patente == 14) patente = "Bronze IV"
        if (rankedDB.val().patente == 15) patente = "Bronze V"
        if (rankedDB.val().patente == 16) patente = "Bronze VI"
        if (rankedDB.val().patente == 17) patente = "Bronze VII"
        if (rankedDB.val().patente == 18) patente = "Bronze VIII"
        if (rankedDB.val().patente == 19) patente = "Bronze IX"
        if (rankedDB.val().patente == 20) patente = "Bronze X"
        if (rankedDB.val().patente == 21) patente = "Prata I"
        if (rankedDB.val().patente == 22) patente = "Prata II"
        if (rankedDB.val().patente == 23) patente = "Prata III"
        if (rankedDB.val().patente == 24) patente = "Prata IV"
        if (rankedDB.val().patente == 25) patente = "Prata V"
        if (rankedDB.val().patente == 26) patente = "Prata VI"
        if (rankedDB.val().patente == 27) patente = "Prata VII"
        if (rankedDB.val().patente == 28) patente = "Prata VIII"
        if (rankedDB.val().patente == 29) patente = "Prata IX"
        if (rankedDB.val().patente == 30) patente = "Prata X"
        if (rankedDB.val().patente == 31) patente = "Ouro I"
        if (rankedDB.val().patente == 32) patente = "Ouro II"
        if (rankedDB.val().patente == 33) patente = "Ouro III"
        if (rankedDB.val().patente == 34) patente = "Ouro IV"
        if (rankedDB.val().patente == 35) patente = "Ouro V"
        if (rankedDB.val().patente == 36) patente = "Ouro VI"
        if (rankedDB.val().patente == 37) patente = "Ouro VII"
        if (rankedDB.val().patente == 38) patente = "Ouro VIII"
        if (rankedDB.val().patente == 39) patente = "Ouro IX"
        if (rankedDB.val().patente == 40) patente = "Ouro X"
        if (rankedDB.val().patente == 41) patente = "Diamante I"
        if (rankedDB.val().patente == 42) patente = "Diamante II"
        if (rankedDB.val().patente == 43) patente = "Diamante III"
        if (rankedDB.val().patente == 44) patente = "Diamante IV"
        if (rankedDB.val().patente == 45) patente = "Diamante V"
        if (rankedDB.val().patente == 46) patente = "Diamante VI"
        if (rankedDB.val().patente == 47) patente = "Diamante VII"
        if (rankedDB.val().patente == 48) patente = "Diamante VIII"
        if (rankedDB.val().patente == 49) patente = "Diamante IX"
        if (rankedDB.val().patente == 50) patente = "Diamante X"
        if (rankedDB.val().patente == 51) patente = "Platina I"
        if (rankedDB.val().patente == 52) patente = "Platina II"
        if (rankedDB.val().patente == 53) patente = "Platina III"
        if (rankedDB.val().patente == 54) patente = "Platina IV"
        if (rankedDB.val().patente == 55) patente = "Platina V"
        if (rankedDB.val().patente == 56) patente = "Platina VI"
        if (rankedDB.val().patente == 57) patente = "Platina VII"
        if (rankedDB.val().patente == 58) patente = "Platina VIII"
        if (rankedDB.val().patente == 59) patente = "Platina IX"
        if (rankedDB.val().patente == 60) patente = "Platina X"
        if (rankedDB.val().patente == 61) patente = "Mestre I"
        if (rankedDB.val().patente == 62) patente = "Mestre II"
        if (rankedDB.val().patente == 63) patente = "Mestre III"
        if (rankedDB.val().patente == 64) patente = "Mestre IV"
        if (rankedDB.val().patente == 65) patente = "Mestre V"
        if (rankedDB.val().patente == 66) patente = "Mestre VI"
        if (rankedDB.val().patente == 67) patente = "Mestre VII"
        if (rankedDB.val().patente == 68) patente = "Mestre VIII"
        if (rankedDB.val().patente == 69) patente = "Mestre IX"
        if (rankedDB.val().patente == 70) patente = "Mestre X"
        if (rankedDB.val().patente == 71) patente = "Mestre-Ancião I"
        if (rankedDB.val().patente == 72) patente = "Mestre-Ancião II"
        if (rankedDB.val().patente == 73) patente = "Mestre-Ancião III"
        if (rankedDB.val().patente == 74) patente = "Mestre-Ancião IV"
        if (rankedDB.val().patente == 75) patente = "Mestre-Ancião V"
        if (rankedDB.val().patente == 76) patente = "Mestre-Ancião VI"
        if (rankedDB.val().patente == 77) patente = "Mestre-Ancião VII"
        if (rankedDB.val().patente == 78) patente = "Mestre-Ancião VIII"
        if (rankedDB.val().patente == 79) patente = "Mestre-Ancião IX"
        if (rankedDB.val().patente == 80) patente = "Mestre-Ancião X"
        if (rankedDB.val().patente == 81) patente = "Desafiante I"
        if (rankedDB.val().patente == 82) patente = "Desafiante II"
        if (rankedDB.val().patente == 83) patente = "Desafiante III"
        if (rankedDB.val().patente == 84) patente = "Desafiante IV"
        if (rankedDB.val().patente == 85) patente = "Desafiante V"
        if (rankedDB.val().patente == 86) patente = "Desafiante VI"
        if (rankedDB.val().patente == 87) patente = "Desafiante VII"
        if (rankedDB.val().patente == 88) patente = "Desafiante VIII"
        if (rankedDB.val().patente == 89) patente = "Desafiante IX"
        if (rankedDB.val().patente == 90) patente = "Desafiante X"
        // PATENTES^

        if (cmd == "START" || cmd == "INICIAR") {
            let cooldown = 3600000
            let addXP = Math.floor(Math.random() * (15 - 5 + 1)) + 5
            let isWin = Math.floor(Math.random() * (100 - 0 + 1)) + 0
            if (rankedDB.val().item == 1) isWin = Math.floor(Math.random() * (105 - 0 + 1)) + 0
            if (rankedDB.val().item == 2) isWin = Math.floor(Math.random() * (115 - 0 + 1)) + 0
            let valorAposta = 1000
            let valorApostaGanho = 2000 // deixe aqui o dobro do valorAposta

            if (cooldownDB.val() !== null && cooldown - (Date.now() - cooldownDB.val().ranqueada) > 0) {
                let time = ms(cooldown - (Date.now() - cooldownDB.val().ranqueada))
                let hours = time.hours > 0 ? `${time.hours} horas,` : ""
                let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá usar esse comando novamente em ${hours} ${minutes} ${seconds}.`)] })
            } else {
                database.ref(`Global/${message.author.id}/Cooldown/ranqueada`).set(Date.now())
            }

            let haveOuro = memberDB.val() == null ? message.reply({ embeds: [errorEmbed.setDescription(`Você não possui ouro suficiente. São necessários **${valorAposta}**`)] }) : memberDB.val().ouro

            if (memberDB.val().ouro < valorAposta) return message.reply({ embeds: [errorEmbed.setDescription(`Você não tem **${new Intl.NumberFormat('de-DE').format(valorAposta)}** ouros para apostar.`)] })

            message.reply(neutEmbed.setDescription(`Você tem certeza que deseja apostar **${new Intl.NumberFormat('de-DE').format(valorAposta)}** ouros?`)).then(m => {
                m.react(emojis.ranqueadaApostar)

                const filtro = (reaction, user) => user.id === message.author.id;
                const collector = m.createReactionCollector(filtro, { time: 60000 });

                collector.on('collect', (reaction, user) => {
                    if (reaction.emoji.id === emojis.ranqueadaApostar) {
                        m.delete()

                        database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(valorAposta))
                        message.reply(`**Estamos batalhando! Aguarde...**`).then(msg => {
                            setTimeout(() => {
                                if (isWin >= 50) {
                                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(valorApostaGanho))
                                    database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                                    database.ref(`Ranqueada/${message.author.id}/wins`).transaction(n => n + Number(1))
                                    database.ref(`Ranqueada/${message.author.id}/patente`).set(++rankedDB.val().patente)
                                    msg.edit({ embeds: [sucEmbed.setDescription(`Deu tudo certo! Você ganhou **${new Intl.NumberFormat('de-DE').format(valorApostaGanho)}** ouros, **${addXP}** XP e evoluiu do patente **${patente}** para o próximo.`)] })
                                } else {
                                    msg.edit({ embeds: [errorEmbed.setDescription(`Ops! Você perdeu **${new Intl.NumberFormat('de-DE').format(valorAposta)}** ouros e perdeu seu antigo patente: **${patente}**.`)] })
                                    database.ref(`Ranqueada/${message.author.id}/loses`).transaction(n => n + Number(1))
                                    if (rankedDB.val().patente == 0) return
                                    database.ref(`Ranqueada/${message.author.id}/patente`).set(Number(rankedDB.val().patente) - Number(1))
                                }
                            }, 3000);
                        })
                    }
                })
            })
        }

        if (cmd == "LOJA") {

        let lojaEmbed = new Discord.EmbedBuilder()
            .setTitle('🎴 | Loja Ranqueada')
            .setDescription('**1: Carta Escondida | 15000 ouros:** receba 5% de chance de ganhar na aposta;\n**2: 3 Cartas Escondidas | 30000 ouros:** receba 15% de chance de ganhar na aposta.')
            .setFooter({ text: 'Compre usando: ranqueada loja <1 ou 2>' })
            .setColor('#A52A2A')

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('loja')
					.setPlaceholder('Selecione um produto')
					.addOptions(
						{
							label: '1 Carta Escondida',
							value: '1',
						},
						{
							label: '3 Cartas Escondidas',
							value: '2',
						}
					),
			);

        let msgMS = await message.reply({
            embeds: [lojaEmbed],
            components: [row]
        })

        const filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
        };
        
        msgMS.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
            .then(async id => {

                id = parseInt(id.values[0])

            if (id == "1") {
                if (memberDB.val().ouro < 15000) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem ouros suficientes para comprar este item.')] })
                if (rankedDB.val().item >= 2) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui mais de uma carta escondida.')] })
                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(15000))
                database.ref(`Ranqueada/${message.author.id}/item`).set(1)
                message.reply({ embeds: [sucEmbed.setDescription('Você comprou o item **Carta Escondida** com sucesso!')] })
            }

            if (id == "2") {
                if (memberDB.val().ouro < 15000) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem ouros suficientes para comprar este item.')] })
                if (rankedDB.val().item >= 2) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui mais de uma carta escondida.')] })
                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(30000))
                database.ref(`Ranqueada/${message.author.id}/item`).set(2)
                message.reply({ embeds: [sucEmbed.setDescription('Você comprou o item **3 Cartas Escondidas** com sucesso!')] })
                }
            })
        }

        if (cmd == "INFO") {
            let cartasEscondidas = 0
            if (rankedDB.val().item == 1) cartasEscondidas = 1
            if (rankedDB.val().item == 2) cartasEscondidas = 3
            let infoEmbed = new Discord.EmbedBuilder()
                .setTitle('⚔️ Informações: Ranqueada')
                .setDescription(`**Vitórias:** ${rankedDB.val().wins}\n**Derrotas:** ${rankedDB.val().loses}\n**Patente:** ${patente}\n**Cartas Escondidas:** ${cartasEscondidas}`)
                .setFooter({ text: message.author.tag })
                .setColor('#EE6363')
            message.reply({ embeds: [infoEmbed] })
        }

        if (cmd == "TOP" || cmd == "RANK") {
            let rankedG = await database.ref(`Ranqueada`).once('value')
            const values = Object.entries(rankedG.val()).map(([userID, value]) => ({ userID, ...value }))
            const ordered = values.sort((a, b) => b.wins - a.wins).slice(0, 9)

            return message.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle('⚔️ | TOP Vitórias')
                    .setDescription(ordered.map((d, i) => `**${i + 1} - <@${d.userID}>:** ${d.wins} vitórias`).join('\n'))
                    .setColor('#838B8B')]
                })
            }
        })
    }
}