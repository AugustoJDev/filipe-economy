const Discord = require('discord.js')
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js")

module.exports = {
    name: "barco",
    aliases: [],
    async execute(client, message, args, database) {

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let barcoDB = await database.ref(`Global/${message.author.id}/Pesca`).once('value')
        let itensDB = await database.ref(`Global/${message.author.id}/Fabrica`).once('value')

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let neutEmbed = new Discord.EmbedBuilder()
            .setColor('#40C0FF')

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('barco')
					.setPlaceholder('Selecione uma categoria')
					.addOptions(
						{
							label: 'Construir',
							description: 'Construa seu barco',
							value: 'construir',
						},
						{
							label: 'Comprar',
							description: 'Compre as necessidades do seu barco',
							value: 'comprar',
						},
						{
							label: 'Info',
							description: 'Mostra as informações do seu barco',
							value: 'info',
						}
					),
			);

            let msgMS = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription('Selecione uma categoria de escavação para acessar.')
                        .setColor('#90EE90')],
                components: [row]
            })
        
            const filter = i => {
                i.deferUpdate();
                return i.user.id === message.author.id;
            };
                
            msgMS.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
                .then(async cmd => {

            cmd = cmd.values[0].toUpperCase()

        if (cmd == "CONSTRUIR") {

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('barco')
					.setPlaceholder('Selecione um barco')
					.addOptions(
						{
							label: 'Médio',
							value: 'medio'
						},
						{
							label: 'Avançado',
							value: 'avancado'
						},
						{
							label: 'VIP',
							value: 'vip'
						}
					),
			);

            let msgMS = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription('Selecione uma categoria um barco para construir.')
                        .setColor('#90EE90')],
                components: [row]
            })
        
            const filter = i => {
                i.deferUpdate();
                return i.user.id === message.author.id;
            };
                
            msgMS.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
                .then(async barcoZap => {

            let nameBarco = barcoZap.values[0].toUpperCase()

            if (nameBarco == "MEDIO" || nameBarco == "MÉDIO") {

                if (barcoDB.val() != "inicial") return message.reply({ embeds: [errorEmbed.setDescription('Você já possui o barco médio ou outro melhor.')] })

                let funMadeira = itensDB.val().madeira >= 150 ? "**" : "~~"
                let funFerro = itensDB.val().ferro >= 200 ? "**" : "~~"
                let funAco = itensDB.val().aco >= 200 ? "**" : "~~"
                let funVidro = itensDB.val().vidro >= 25 ? "**" : "~~"
                let funAluminio = itensDB.val().aluminio >= 300 ? "**" : "~~"
                let medioEmbed = new Discord.EmbedBuilder()
                    .setTitle('⛵ | Construção do Barco')
                    .setDescription(`\`Madeira\` - ${funMadeira}${itensDB.val().madeira}/150${funMadeira}\n\`Ferro\` - ${funFerro}${itensDB.val().ferro}/200${funFerro}\n\`Aço\` - ${funAco}${itensDB.val().aco}/200${funAco}\n\`Vidro\` - ${funVidro}${itensDB.val().vidro}/25${funVidro}\n\`Alumínio\` - ${funAluminio}${itensDB.val().aluminio}/300${funAluminio}`)
                    .setColor('#FFB90F')

                if (itensDB.val().madeira < 150 || itensDB.val().ferro < 200 || itensDB.val().aco < 200 || itensDB.val().vidro < 25 || itensDB.val().aluminio < 300)
                    return message.reply({ content: `Você não possui todos os itens necessários.`, embeds: [medioEmbed] })

                database.ref(`Global/${message.author.id}/Fabrica`).update({ madeira: Number(itensDB.val().madeira) - Number(150), ferro: Number(itensDB.val().ferro) - Number(200), aco: Number(itensDB.val().aco) - Number(200), vidro: Number(itensDB.val().vidro) - Number(25), aluminio: Number(itensDB.val().aluminio) - Number(300) })
                database.ref(`Global/${message.author.id}/Pesca/barco`).set("medio")
                return message.reply({ embeds: [sucEmbed.setTitle('🚤 | Barco Construído!').setDescription('Remem! Você construiu o barco **Médio** com sucesso!')] })
            }

            if (nameBarco == "AVANCADO" || nameBarco == "AVANÇADO") {

                if (barcoDB.val() == "avancado" || barcoDB.val() == "vip") return message.reply({ embeds: [errorEmbed.setDescription('Você já possui o barco avaçado ou outro melhor.')] })

                let funMadeira = itensDB.val().madeira >= 300 ? "**" : "~~"
                let funFerro = itensDB.val().ferro >= 450 ? "**" : "~~"
                let funAco = itensDB.val().aco >= 450 ? "**" : "~~"
                let funVidro = itensDB.val().vidro >= 75 ? "**" : "~~"
                let funAluminio = itensDB.val().aluminio >= 650 ? "**" : "~~"
                let medioEmbed = new Discord.EmbedBuilder()
                    .setTitle('⛵ | Construção do Barco')
                    .setDescription(`\`Madeira\` - ${funMadeira}${itensDB.val().madeira}/300${funMadeira}\n\`Ferro\` - ${funFerro}${itensDB.val().ferro}/450${funFerro}\n\`Aço\` - ${funAco}${itensDB.val().aco}/450${funAco}\n\`Vidro\` - ${funVidro}${itensDB.val().vidro}/75${funVidro}\n\`Alumínio\` - ${funAluminio}${itensDB.val().aluminio}/650${funAluminio}`)
                    .setColor('#FFB90F')

                if (itensDB.val().madeira < 300 || itensDB.val().ferro < 450 || itensDB.val().aco < 450 || itensDB.val().vidro < 75 || itensDB.val().aluminio < 650)
                    return message.reply({ content: `Você não possui todos os itens necessários.`, embeds: [medioEmbed] })

                database.ref(`Global/${message.author.id}/Fabrica`).update({ madeira: Number(itensDB.val().madeira) - Number(300), ferro: Number(itensDB.val().ferro) - Number(450), aco: Number(itensDB.val().aco) - Number(450), vidro: Number(itensDB.val().vidro) - Number(75), aluminio: Number(itensDB.val().aluminio) - Number(650) })
                database.ref(`Global/${message.author.id}/Pesca/barco`).set("avancado")
                return message.reply({ embeds: [sucEmbed.setTitle('🚤 | Barco Construído!').setDescription('Remem! Você construiu o barco **Avançado** com sucesso!')] })
            }

            if (nameBarco == "VIP") {

                if (!message.member.roles.cache.has(infos.vipRole)) return message.reply('Você não é VIP.')
                if (barcoDB.val() == "vip") return message.reply({ embeds: [errorEmbed.setDescription('Você já possui o barco VIP.')] })

                let funMadeira = itensDB.val().madeira >= 500 ? "**" : "~~"
                let funFerro = itensDB.val().ferro >= 600 ? "**" : "~~"
                let funAco = itensDB.val().aco >= 600 ? "**" : "~~"
                let funVidro = itensDB.val().vidro >= 110 ? "**" : "~~"
                let funAluminio = itensDB.val().aluminio >= 750 ? "**" : "~~"
                let medioEmbed = new Discord.EmbedBuilder()
                    .setTitle('⛵ | Construção do Barco')
                    .setDescription(`\`Madeira\` - ${funMadeira}${itensDB.val().madeira}/500${funMadeira}\n\`Ferro\` - ${funFerro}${itensDB.val().ferro}/600${funFerro}\n\`Aço\` - ${funAco}${itensDB.val().aco}/600${funAco}\n\`Vidro\` - ${funVidro}${itensDB.val().vidro}/110${funVidro}\n\`Alumínio\` - ${funAluminio}${itensDB.val().aluminio}/750${funAluminio}`)
                    .setColor('#FFB90F')

                if (itensDB.val().madeira < 500 || itensDB.val().ferro < 600 || itensDB.val().aco < 600 || itensDB.val().vidro < 110 || itensDB.val().aluminio < 750)
                    return message.reply({ content: `Você não possui todos os itens necessários.`, embeds: [medioEmbed] })

                database.ref(`Global/${message.author.id}/Fabrica`).update({ madeira: Number(itensDB.val().madeira) - Number(500), ferro: Number(itensDB.val().ferro) - Number(600), aco: Number(itensDB.val().aco) - Number(600), vidro: Number(itensDB.val().vidro) - Number(110), aluminio: Number(itensDB.val().aluminio) - Number(750) })
                database.ref(`Global/${message.author.id}/Pesca/barco`).set("vip")
                return message.reply({ embeds: [sucEmbed.setTitle('🚤 | Barco Construído!').setDescription('Remem! Você construiu o barco **VIP** com sucesso!')] })
                }
            })
        }

        if (cmd == "COMPRAR") {
            if (cmd == "COMPRAR" || cmd == "BUY") {

                let nameBarco = barcoDB.val().barco;
                let maxNec;

                if (nameBarco == "inicial") maxNec = 100
                if (nameBarco == "medio") maxNec = 125
                if (nameBarco == "avancado") maxNec = 150
                if (nameBarco == "vip") maxNec = 200

                let buyEmbed = new Discord.EmbedBuilder()
                    .setTitle('🌞 | Compra de Necessidades')
                    .addFields(
                        { name: '💧 ** 1- Água**', value: '**Quant.**: 50 Águas\n**Valor:** 7.500 <:billycoin:886465691845296190>', inline: true },
                        { name: '🥩 ** 2- Comida**', value: '**Quant.**: 50 Carnes\n**Valor:** 8.000 <:billycoin:886465691845296190>', inline: true },
                        { name: '🩹 ** 3- Saúde**', value: '**Quant.**: 50 Curativos\n**Valor:** 8.000 <:billycoin:886465691845296190>', inline: true },
                        { name: '⛽ ** 4- Gasolina**', value: '**Quant.**: 50 Litros de Gasolina\n**Valor:** 9.000 <:billycoin:886465691845296190>', inline: true },
                    )
                    .setColor('#FFA500')
                    .setFooter({ text: 'Para comprar use: pesca comprar <id>' })

                const row = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('necessidades')
                            .setPlaceholder('Selecione um item para comprar')
                            .addOptions(
                                {
                                    label: 'Água',
                                    value: '1'
                                },
                                {
                                    label: 'Comida',
                                    value: '2'
                                },
                                {
                                    label: 'Saúde',
                                    value: '3'
                                },
                                {
                                    label: 'Gasolina',
                                    value: '4'
                                }
                            ),
                    );
        
                    let msgMS = await message.reply({
                        embeds: [buyEmbed],
                        components: [row]
                    })
                
                    const filter = i => {
                        i.deferUpdate();
                        return i.user.id === message.author.id;
                    };
                        
                    msgMS.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
                        .then(async idBuy => {

                idBuy = parseInt(idBuy.values[0])
                
                if (idBuy == 1) {
                    if (barcoDB.val().agua + Number(50) > maxNec) return message.reply(`Não é possível ter mais que ${maxNec} águas.`)
                    if (memberDB.val().ouro < 7500) return message.reply('Você não possui ouro suficiente.')

                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(7500))
                    database.ref(`Global/${message.author.id}/Pesca/agua`).transaction(n => n + Number(50))
                    message.reply(`Você comprou **50** águas com sucesso!`)
                }

                if (idBuy == 2) {
                    if (barcoDB.val().comida + Number(50) > maxNec) return message.reply(`Não é possível ter mais que ${maxNec} carnes.`)
                    if (memberDB.val().ouro < 8000) return message.reply('Você não possui ouro suficiente.')

                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(8000))
                    database.ref(`Global/${message.author.id}/Pesca/comida`).transaction(n => n + Number(50))
                    message.reply(`Você comprou **50** carnes com sucesso!`)
                }

                if (idBuy == 3) {
                    if (barcoDB.val().gasolina + Number(50) > maxNec) return message.reply(`Não é possível ter mais que ${maxNec} litros de gasolina.`)
                    if (memberDB.val().ouro < 8000) return message.reply('Você não possui ouro suficiente.')

                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(8000))
                    database.ref(`Global/${message.author.id}/Pesca/gasolina`).transaction(n => n + Number(50))
                    message.reply(`Você comprou **50** litros de gasolina com sucesso!`)
                }

                if (idBuy == 4) {
                    if (barcoDB.val().saude + Number(50) > maxNec) return message.reply(`Não é possível ter mais que ${maxNec} curativos.`)
                    if (memberDB.val().ouro < 9000) return message.reply('Você não possui ouro suficiente.')

                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(9000))
                    database.ref(`Global/${message.author.id}/Pesca/saude`).transaction(n => n + Number(50))
                    message.reply(`Você comprou **50** curativos com sucesso!`)
                }
                })
            }
        }

        if (cmd == "INFO") {
            let nameBarco = barcoDB.val().barco;
            let nameB;
            let maxNec;

            if (nameBarco == "inicial") maxNec = 100, nameB = "Inicial"
            if (nameBarco == "medio") maxNec = 125, nameB = "Médio"
            if (nameBarco == "avancado") maxNec = 150, nameB = "Avançado"
            if (nameBarco == "vip") maxNec = 200, nameB = "VIP"

            message.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle('🚣‍♂️ | Informações do Barco')
                    .setDescription(`**⛵ | Barco Atual:** ${nameB}\n\n🍗 **| Necessidades:**\nㅤㅤ**Águas:** ${barcoDB.val().agua}/${maxNec}\nㅤㅤ**Carnes:** ${barcoDB.val().comida}/${maxNec}\nㅤㅤ**Curativos:** ${barcoDB.val().saude}/${maxNec}\nㅤㅤ**Gasolina:** ${barcoDB.val().gasolina}/${maxNec}`)
                    .setColor('#708090')]
                })
            }
        })
    }
}