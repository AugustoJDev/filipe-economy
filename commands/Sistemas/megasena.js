const Discord = require('discord.js')
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js")

module.exports = {
    name: "megasena",
    aliases: [],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let geralDB = await database.ref(`MegaSena`).once('value')
        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')

        if (geralDB.val() == null) database.ref(`MegaSena/valor`).set(0)

        if (memberDB.val() == null) {
            database.ref(`Global/${message.author.id}`).update({
                ouro: 0,
                diamantes: 0,
                level: 0,
                xp: 0
            })
        }

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('megasena')
					.setPlaceholder('Selecione uma categoria')
					.addOptions(
						{
							label: 'Ticket',
							description: 'Compre um ticket da Mega-Sena',
							value: 'ticket',
						},
						{
							label: 'Iniciar',
							description: 'Inicia uma Mega-Sena [ADM]',
							value: 'iniciar',
						},
						{
							label: 'Cancelar',
							description: 'Cancela uma Mega-Sena em andamento [ADM]',
							value: 'cancelar',
						},
						{
							label: 'Info',
							description: 'Mostra as informações da Mega-Sena',
							value: 'info',
						}
					),
			);

            let msgMS = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('🧧 | Mega-Sena - Menu')
                        .setDescription('`iniciar` - Inicia uma Mega-Sena;\n`ticket` - Compre um ticket;\n`info` - Informações da Mega-Sena;\n`cancelar` - Cancele uma Mega-Sena.')
                        .setColor('#6495ED')],
                components: [row]
            })

        const filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
        };
        
        msgMS.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
            .then(async cmd => {

        cmd = cmd.values[0].toUpperCase()

        let valTicket = 5000

        if (cmd == "TICKET") {
            if (geralDB.val() == null || geralDB.val().valor <= 0) return message.reply({ embeds: [errorEmbed.setDescription('Não está ocorrendo Mega-Sena.')] })
            if (memberDB.val() == null || memberDB.val().money < geralDB.val().valor) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem dinheiro suficiente.')] })
            if (memberDB.val().ouro < valTicket) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui 5000 ouros para apostar na Mega-Sena.')] })
            let partArray = geralDB.val().participantes ? geralDB.val().participantes : []
            if (partArray.indexOf(message.author.id) != -1) return message.reply({ embeds: [errorEmbed.setDescription('Você já está participando da Mega-Sena')] })
            var add = partArray.push(message.author.id)

            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(valTicket))
            database.ref(`MegaSena/participantes`).set(partArray)
            message.reply({ embeds: [sucEmbed.setTitle(`${emoji.cofre} | Ticket Adquirido`).setDescription('🪙 Agora você está participando da Mega-Sena!')] })
        }

        if (cmd == "INICIAR") {
            if (!message.member.permissions.has("ADMINISTRATOR")  || message.guild != infos.economyGuild) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem permissão.')] })

            if (geralDB.val().valor != 0) return message.reply({ embeds: [errorEmbed.setDescription('Já está ocorrendo uma Mega-Sena. Caso queira cancelar, use `megasena > cancelar`')] })

			const filter = response => {
				return response.author.id === message.author.id
			};

			message.reply({ content: "Insina o valor da Mega-Sena", ephemeral: true })
				.then(() => {
					
				message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
					.then(async collected => {
						
			let valor = Number(collected.first().content)
					
            if (!valor) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu o valor.')] })

            let msEmbed = new Discord.EmbedBuilder()
                .setTitle(`${emoji.moeda} | Mega-Sena`)
                .setDescription(`**Mega-Sena iniciada valendo ${valor} ouros!**\n**Valor do Ticket:** 5000 ouros.\n**Duração:** 1 hora.`)
                .setFooter({ text: 'Para comprar um ticket use: megasena ticket' })
                .setColor('#EEAD0E')

            database.ref(`MegaSena/clearTim`).remove()
            database.ref(`MegaSena`).update({ valor: valor, participantes: [] })
            message.channel.send({ embeds: [msEmbed] });

            const timeout = setTimeout(async () => {
                let geralDatabase = await database.ref(`MegaSena`).once('value')
                let partArray = geralDatabase.val().participantes ? geralDatabase.val().participantes : []
                let sorteado = Math.floor(Math.random() * (partArray.length - 1 - 0 + 1)) + 0;

                if (geralDatabase.val().clearTim == "true") {
                    clearTimeout(timeout)
                    database.ref(`MegaSena/valor`).set(0)
                    return database.ref(`MegaSena/clearTim`).set("false")
                }

                message.channel.send(`Sorteado: <@${partArray[sorteado]}> \`(${partArray[sorteado]})\``)
                database.ref(`Global/${partArray[sorteado]}/ouro`).transaction(n => n + Number(valor))
                database.ref(`MegaSena/clearTim`).remove()
                database.ref(`MegaSena/valor`).set(0)
				}, 3600000);
				})
			})
        }

        if (cmd == "CANCELAR") {
            if (!message.member.permissions.has("ADMINISTRATOR") || message.guild != infos.economyGuild) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem permissão.')] })
            if (geralDB.val().valor == 0) return message.reply({ embeds: [errorEmbed.setDescription('Não está ocorrendo uma Mega-Sena.')] })

            database.ref(`MegaSena/valor`).set(0)
            database.ref(`MegaSena/clearTim`).set("true")
            return message.reply({ embeds: [sucEmbed.setDescription('Mega-Sena cancelada com sucesso!')] })
        }

        if (cmd == "INFO") {
            let situacionMS = geralDB.val().valor > 0 ? "Sim" : "Não"
            let participantesMS = geralDB.val() == null || geralDB.val().participantes == null ? "0" : geralDB.val().participantes.length
            let valorMS = geralDB.val() == null ? "0" : geralDB.val().valor

            let infoMSEmbed = new Discord.EmbedBuilder()
                .setTitle('🪙 | Informações: Mega-Sena')
                .setDescription(`**Está acontecendo?** ${situacionMS}\n**Participantes:** ${participantesMS}\n**Valor:** ${valorMS}`)
                .setColor('#FF7F50')
            message.reply({ embeds: [infoMSEmbed] })
            }
        })
    }
}