const Discord = require('discord.js')
const ms = require('parse-ms')
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js")

module.exports = {
    name: "escavacao",
    aliases: ["escavar"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let escavationDB = await database.ref(`Global/${message.author.id}/Escavacao`).once('value')
        let cooldownDB = await database.ref(`Global/${message.author.id}/Cooldown`).once('value')
        let cooldown = 7200000

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('escavacao')
					.setPlaceholder('Selecione uma categoria')
					.addOptions(
						{
							label: 'Start',
							description: 'Inicie a escavação',
							value: 'start',
						},
						{
							label: 'Info',
							description: 'Informações da escavação',
							value: 'info',
						},
						{
							label: 'Loja',
							description: 'Compre pás e venda minérios',
							value: 'loja',
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

        // PÁS:
        let myPa = "Nenhuma";
        if (escavationDB.val().pa == "null") myPa = "Nenhuma"
        if (escavationDB.val().pa == "madeira") myPa = "Pá de Madeira"
        if (escavationDB.val().pa == "pedra") myPa = "Pá de Pedra"
        if (escavationDB.val().pa == "ferro") myPa = "Pá de Ferro"
        if (escavationDB.val().pa == "ouro") myPa = "Pá de Ouro"
        if (escavationDB.val().pa == "diamante") myPa = "Pá de Diamante"
        if (escavationDB.val().pa == "ruby") myPa = "Pá de Ruby"
        if (escavationDB.val().pa == "magica") myPa = "Pá Mágica"
        if (escavationDB.val().pa == "arcoiris") myPa = "Pá Arco-Íris"
        if (escavationDB.val().pa == "adamantium") myPa = "Pá de Adamantium"
        // PÁS^

        if (cmd == "START" || cmd == "INICIAR") {

            // CHANCE DE DROPAR MINÉRIOS:
            let carvaoPorc = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            let pedraPorc = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            let ferroPorc = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            let ouroPorc = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            let diamantePorc = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            let ametistaPorc = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            let esmeraldaPorc = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            let rubiPorc = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            let lapisPorc = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            let jadeitePorc = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            // CHANCE DE DROPAR MINÉRIOS^

            // QUANTIA ALEATÓRIA DE MINÉRIOS:
            let carvao = Math.floor(Math.random() * (60 - 5 + 1)) + 5;
            let pedra = Math.floor(Math.random() * (55 - 5 + 1)) + 5;
            let ferro = Math.floor(Math.random() * (50 - 5 + 1)) + 5;
            let ouro = Math.floor(Math.random() * (45 - 5 + 1)) + 5;
            let diamante = Math.floor(Math.random() * (40 - 5 + 1)) + 5;
            let ametista = Math.floor(Math.random() * (35 - 5 + 1)) + 5;
            let esmeralda = Math.floor(Math.random() * (30 - 5 + 1)) + 5;
            let rubi = Math.floor(Math.random() * (25 - 5 + 1)) + 5;
            let lapis = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
            let jadeite = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
            // QUANTIA ALEATÓRIA DE MINÉRIOS^

            if (escavationDB.val().pa == "null") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui uma pá.')] })
            let addXP = Math.floor(Math.random() * (15 - 5 + 1)) + 5;

            if (escavationDB.val().durabilidade <= 0) {
                database.ref(`Global/${message.author.id}/Escavacao/pa`).set("null")
                return message.reply({ embeds: [errorEmbed.setDescription('Opa! Sua pá quebrou, você precisará comprar outra.')] })
            }

            if (cooldownDB.val() != null && cooldown - (Date.now() - cooldownDB.val().escavacao) > 0) {
                let time = ms(cooldown - (Date.now() - cooldownDB.val().escavacao))
                let hours = time.hours > 0 ? `${time.hours} horas,` : ""
                let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá usar esse comando novamente em ${hours} ${minutes} ${seconds}.`)] })
            } else {
                database.ref(`Global/${message.author.id}/Cooldown`).update({ escavacao: Date.now() })
            }

            database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
            database.ref(`Global/${message.author.id}/Escavacao/durabilidade`).transaction(n => n - Number(1))

            if (myPa == "Pá de Madeira") {
                ''
                let msgIn;
                if (carvaoPorc <= 80) {
                    database.ref(`Global/${message.author.id}/Escavacao/carvao`).transaction(n => n + Number(carvao))
                    msgIn = carvao
                } else { msgIn = 0 }

                if (pedraPorc <= 75) {
                    database.ref(`Global/${message.author.id}/Escavacao/pedra`).transaction(n => n + Number(pedra))
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${msgIn}** carvões, **${pedra}** pedras e recebeu **${addXP}** XP!`)] })
                } else {
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${msgIn}** carvões, **0** pedras e recebeu **${addXP}** XP!`)] })
                }
            }

            if (myPa == "Pá de Pedra") {
                let msgIn;
                if (pedraPorc <= 75) {
                    database.ref(`Global/${message.author.id}/Escavacao/pedra`).transaction(n => n + Number(pedra))
                    msgIn = pedra
                } else { msgIn = 0 }

                if (ferroPorc <= 70) {
                    database.ref(`Global/${message.author.id}/Escavacao/ferro`).transaction(n => n + Number(ferro))
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${msgIn}** pedras, **${ferro}** ferro e recebeu **${addXP}** XPs!`)] })
                } else {
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${msgIn}** pedras, **0** ferros e recebeu **${addXP}** XP!`)] })
                }
            }

            if (myPa == "Pá de Ferro") {
                if (ouroPorc <= 65) {
                    database.ref(`Global/${message.author.id}/Escavacao/ouro`).transaction(n => n + Number(ouro))
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${ouro}** ouros e recebeu **${addXP}** XP!`)] })
                } else {
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **0** ouros e recebeu **${addXP}** XP!`)] })
                }
            }

            if (myPa == "Pá de Ouro") {
                let msgIn;
                if (ouroPorc <= 65) {
                    database.ref(`Global/${message.author.id}/Escavacao/ouro`).transaction(n => n + Number(ouro))
                    msgIn = ouro
                } else { msgIn = 0 }

                if (diamantePorc <= 60) {
                    database.ref(`Global/${message.author.id}/Escavacao/diamante`).transaction(n => n + Number(diamante))
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${msgIn}** ouros, **${diamante}** diamantes e recebeu **${addXP}** XP!`)] })
                } else {
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${msgIn}** ouros, **0** diamantes e recebeu **${addXP}** XP!`)] })
                }
            }

            if (myPa == "Pá de Diamante") {
                let msgIn;
                if (ametistaPorc <= 55) {
                    database.ref(`Global/${message.author.id}/Escavacao/ametista`).transaction(n => n + Number(ametista))
                    msgIn = ouro
                } else { msgIn = 0 }

                if (esmeraldaPorc <= 50) {
                    database.ref(`Global/${message.author.id}/Escavacao/esmeralda`).transaction(n => n + Number(esmeralda))
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${msgIn}** diamantes, **${esmeralda}** esmeraldas e recebeu **${addXP}** XP!`)] })
                } else {
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${msgIn}** diamantes, **0** esmeralda e recebeu **${addXP}** XP!`)] })
                }
            }

            if (myPa == "Pá de Diamante") {
                let msgIn;
                if (ametistaPorc <= 55) {
                    database.ref(`Global/${message.author.id}/Escavacao/ametista`).transaction(n => n + Number(ametista))
                    msgIn = ouro
                } else { msgIn = 0 }

                if (esmeraldaPorc <= 50) {
                    database.ref(`Global/${message.author.id}/Escavacao/esmeralda`).transaction(n => n + Number(esmeralda))
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${msgIn}** diamantes, **${esmeralda}** esmeraldas e recebeu **${addXP}** XP!`)] })
                } else {
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${msgIn}** diamantes, **0** esmeralda e recebeu **${addXP}** XP!`)] })
                }
            }

            if (myPa == "Pá de Ruby") {
                if (rubiPorc <= 45) {
                    database.ref(`Global/${message.author.id}/Escavacao/rubi`).transaction(n => n + Number(rubi))
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${rubi}** rubis e recebeu **${addXP}** XP!`)] })
                } else {
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **0** rubis e recebeu **${addXP}** XP!`)] })
                }
            }

            if (myPa == "Pá Mágica") {
                let msgIn;
                if (ametistaPorc <= 55) {
                    database.ref(`Global/${message.author.id}/Escavacao/ametista`).transaction(n => n + Number(ametista))
                    msgIn = ouro
                } else { msgIn = 0 }

                if (lapisPorc <= 40) {
                    database.ref(`Global/${message.author.id}/Escavacao/lapis`).transaction(n => n + Number(lapis))
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${msgIn}** ametistas, **${lapis}** lápis-lazúlis e recebeu **${addXP}** XP!`)] })
                } else {
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${msgIn}** ametistas, **0** lápis-lazúlis e recebeu **${addXP}** XP!`)] })
                }
            }

            if (myPa == "Pá Arco-Íris") {
                if (jadeitePorc <= 40) {
                    database.ref(`Global/${message.author.id}/Escavacao/jadeite`).transaction(n => n + Number(jadeite))
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${jadeite}** jadeites e recebeu **${addXP}** XP!`)] })
                } else {
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **0** jadeites e recebeu **${addXP}** XP!`)] })
                }
            }

            if (myPa == "Pá de Adamantium") {
                if (jadeitePorc <= 50) {
                    database.ref(`Global/${message.author.id}/Escavacao/jadeite`).transaction(n => n + Number(jadeite))
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **${jadeite}** jadeites e recebeu **${addXP}** XP!`)] })
                } else {
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.paCategoria} | Escavação Concluída`).setDescription(`${emoji.paNormal} Você escavou, encontrou **0** jadeites e recebeu **${addXP}** XP!`)] })
                }
            }
        }

        if (cmd == "LOJA") {
            let noitemEmbed = new Discord.EmbedBuilder()
                .setTitle(`${emoji.loja} | Loja - Escavação`)
                .setDescription('`loja de itens` - Compre pás;\n`loja de minerios` - Venda seus minérios.')
                .setColor('#8B4726')
                .setFooter({ text: 'Escave usando: escavacao > start' })

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('loja')
                        .setPlaceholder('Selecione uma categoria')
                        .addOptions(
                            {
                                label: 'Loja de Itens',
                                description: 'Compre sua pá',
                                value: 'item',
                            },
                            {
                                label: 'Loja de minérios',
                                description: 'Venda seus minérios',
                                value: 'minerio',
                            },
                        ),
                );

            const rowItens = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('itens')
                        .setPlaceholder('Selecione uma pá')
                        .addOptions(
                            {
                                label: 'Pá de Madeira',
                                value: '1',
                            },
                            {
                                label: 'Pá de Pedra',
                                value: '2',
                            },
                            {
                                label: 'Pá de Ferro',
                                value: '3',
                            },
                            {
                                label: 'Pá de Ouro',
                                value: '4',
                            },
                            {
                                label: 'Pá de Diamante',
                                value: '5',
                            },
                            {
                                label: 'Pá de Rubi',
                                value: '6',
                            },
                            {
                                label: 'Pá Mágica',
                                value: '7',
                            },
                            {
                                label: 'Pá Arco-íris',
                                value: '8',
                            },
                            {
                                label: 'Pá de Adamantium',
                                value: '9',
                            }
                        ),
                );

        let msgMS = await message.reply({
            embeds: [noitemEmbed],
            components: [row]
        })

        const filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
        };
        
        msgMS.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
            .then(async cmd => {

            let item = cmd.values[0].toUpperCase()

            if (item == "ITENS" || item == "ITEM") {
                let idPa = parseInt(args[2])
                let shopIEmbed = new Discord.EmbedBuilder()
                    .setTitle(`${emoji.paNormal} | Loja - Itens para Escavação`)
                    .addFields(
                        { name: emoji.paMadeira.toString() + " 1- Pá de Madeira", value: `**Drop.:** Carvão e Pedra\n**Valor:** 6.000 ${emoji.moeda}`, inline: true },
                        { name: emoji.paPedra.toString() + " 2- Pá de Pedra", value: `**Drop.:** Pedra e Ferro\n**Valor:** 15.000 ${emoji.moeda}`, inline: true },
                        { name: emoji.paFerro.toString() + " 3- Pá de Ferro", value: `**Drop.:** Ouro\n**Valor:** 30.000 ${emoji.moeda}`, inline: true },
                        { name: emoji.paOuro.toString() + " 4- Pá de Ouro", value: `**Drop.:** Ouro e Diamante\n**Valor:** 50.000 ${emoji.moeda}`, inline: true },
                        { name: emoji.paDiamante.toString() + " 5- Pá de Diamante", value: `**Drop.:** Ametista e Esmeralda\n**Valor:** 80.000 ${emoji.moeda}`, inline: true },
                        { name: emoji.paRuby.toString() + " 6- Pá de Ruby", value: `**Drop.:** Rubi\n**Valor:** 125.000 ${emoji.moeda}`, inline: true },
                        { name: emoji.paMagia.toString() + " 7- Pá Mágica", value: `**Drop.:** Ametista e Lápis-Lazúli\n**Valor:** 180.000 ${emoji.moeda}`, inline: true },
                        { name: emoji.paArcoIris.toString() + " 8- Pá Arco-Íris", value: `**Drop.:** Jadeite\n**Valor:** 250.000 ${emoji.moeda}`, inline: true },
                        { name: emoji.paAdamantium.toString() + " 9- Pá de Adamantium", value: `**Drop.:** Jadeite (maior chance)\n**Valor:** 1.000 diamantes`, inline: true },
                    )
                    .setColor('#828282')
                    .setFooter({ text: 'Para comprar use: escavacao > loja > itens > id' })
                
                    let msgMST = await message.reply({
                        embeds: [shopIEmbed],
                        components: [rowItens]
                    })
            
                    const filter = i => {
                        i.deferUpdate();
                        return i.user.id === message.author.id;
                    };
                    
                    msgMST.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
                        .then(async idPa => {

                    idPa = parseInt(idPa.values[0])

                if (idPa == 1) {
                    if (memberDB.val().ouros < 6000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente.')] })
                    if (["madeira", "pedra", "ferro", "ouro", "diamante", "ruby", "magica", "arcoiris"].includes(escavationDB.val().pa)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma Pá de Madeira ou outra melhor.')] })
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(6000))
                    database.ref(`Global/${message.author.id}/Escavacao`).update({ pa: "madeira", durabilidade: 15 })
                    message.reply({ embeds: [sucEmbed.setTitle('${emoji.paNormal} | Pá Comprada!').setDescription('Você comprou uma **Pá de Madeira** com sucesso!')] })
                }

                if (idPa == 2) {
                    if (memberDB.val().ouros < 15000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente.')] })
                    if (["pedra", "ferro", "ouro", "diamante", "ruby", "magica", "arcoiris"].includes(escavationDB.val().pa)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma Pá de Pedra ou outra melhor.')] })
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(15000))
                    database.ref(`Global/${message.author.id}/Escavacao`).update({ pa: "pedra", durabilidade: 15 })
                    message.reply({ embeds: [sucEmbed.setTitle('${emoji.paNormal} | Pá Comprada!').setDescription('Você comprou uma **Pá de Pedra** com sucesso!')] })
                }

                if (idPa == 3) {
                    if (memberDB.val().ouros < 30000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente.')] })
                    if (["ferro", "ouro", "diamante", "ruby", "magica", "arcoiris"].includes(escavationDB.val().pa)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma Pá de Ferro ou outra melhor.')] })
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(30000))
                    database.ref(`Global/${message.author.id}/Escavacao`).update({ pa: "ferro", durabilidade: 15 })
                    message.reply({ embeds: [sucEmbed.setTitle('${emoji.paNormal} | Pá Comprada!').setDescription('Você comprou uma **Pá de Ferro** com sucesso!')] })
                }

                if (idPa == 4) {
                    if (memberDB.val().ouros < 50000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente.')] })
                    if (["ouro", "diamante", "ruby", "magica", "arcoiris"].includes(escavationDB.val().pa)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma Pá de Ouro ou outra melhor.')] })
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(50000))
                    database.ref(`Global/${message.author.id}/Escavacao`).update({ pa: "ouro", durabilidade: 15 })
                    message.reply({ embeds: [sucEmbed.setTitle('${emoji.paNormal} | Pá Comprada!').setDescription('Você comprou uma **Pá de Ouro** com sucesso!')] })
                }

                if (idPa == 5) {
                    if (memberDB.val().ouros < 80000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente.')] })
                    if (["diamante", "ruby", "magica", "arcoiris"].includes(escavationDB.val().pa)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma Pá de Diamante ou outra melhor.')] })
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(80000))
                    database.ref(`Global/${message.author.id}/Escavacao`).update({ pa: "diamante", durabilidade: 15 })
                    message.reply({ embeds: [sucEmbed.setTitle('${emoji.paNormal} | Pá Comprada!').setDescription('Você comprou uma **Pá de Diamante** com sucesso!')] })
                }

                if (idPa == 6) {
                    if (memberDB.val().ouros < 125000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente.')] })
                    if (["ruby", "magica", "arcoiris"].includes(escavationDB.val().pa)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma Pá de Ruby ou outra melhor.')] })
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(125000))
                    database.ref(`Global/${message.author.id}/Escavacao`).update({ pa: "ruby", durabilidade: 15 })
                    message.reply({ embeds: [sucEmbed.setTitle('${emoji.paNormal} | Pá Comprada!').setDescription('Você comprou uma **Pá de Ruby** com sucesso!')] })
                }

                if (idPa == 7) {
                    if (memberDB.val().ouros < 180000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente.')] })
                    if (["magica", "arcoiris"].includes(escavationDB.val().pa)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma Pá Mágica ou outra melhor.')] })
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(180000))
                    database.ref(`Global/${message.author.id}/Escavacao`).update({ pa: "magica", durabilidade: 15 })
                    message.reply({ embeds: [sucEmbed.setTitle('${emoji.paNormal} | Pá Comprada!').setDescription('Você comprou uma **Pá Mágica** com sucesso!')] })
                }

                if (idPa == 8) {
                    if (memberDB.val().ouros < 250000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente.')] })
                    if (["arcoiris", "adamantium"].includes(escavationDB.val().pa)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma Pá Arco-Íris ou outra melhor.')] })
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(250000))
                    database.ref(`Global/${message.author.id}/Escavacao`).update({ pa: "arcoiris", durabilidade: 15 })
                    message.reply({ embeds: [sucEmbed.setTitle('${emoji.paNormal} | Pá Comprada!').setDescription('Você comprou uma **Pá Arco-Íris** com sucesso!')] })
                }

                if (idPa == 9) {
                    if (memberDB.val().diamante < 1000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente.')] })
                    if (["adamantium"].includes(escavationDB.val().pa)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma Pá Adamantium ou outra melhor.')] })
                    database.ref(`Global/${message.author.id}/diamante`).transaction(n => n - Number(1000))
                    database.ref(`Global/${message.author.id}/Escavacao`).update({ pa: "adamantium", durabilidade: 15 })
                    message.reply({ embeds: [sucEmbed.setTitle('${emoji.paNormal} | Pá Comprada!').setDescription('Você comprou uma **Pá de Adamantium** com sucesso!')] })
                    }
                })
            }

            if (item == "MINERIOS" || item == "MINERIO") {

            const rowMinerios = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('minerioszap')
                        .setPlaceholder('Selecione um Minério')
                        .addOptions(
                            {
                                label: 'Carvão',
                                value: '1',
                            },
                            {
                                label: 'Pedra',
                                value: '2',
                            },
                            {
                                label: 'Ferro',
                                value: '3',
                            },
                            {
                                label: 'Ouro',
                                value: '4',
                            },
                            {
                                label: 'Diamante',
                                value: '5',
                            },
                            {
                                label: 'Ametista',
                                value: '6',
                            },
                            {
                                label: 'Esmeralda',
                                value: '7',
                            },
                            {
                                label: 'Rubi',
                                value: '8',
                            },
                            {
                                label: 'Lapis-Lazuli',
                                value: '9',
                            },
                            {
                                label: 'Judeite',
                                value: '10'
                            }
                        ),
                );
                
                let shopMEmbed = new Discord.EmbedBuilder()
                    .setTitle(`${emoji.diamante} | Loja - Minérios`)
                    .addFields(
                        { name: emoji.carvao.toString() + ` 1- Carvão", value: "**Valor:** 10 ${emoji.moeda}`, inline: true },
                        { name: emoji.pedra.toString() + ` 2- Pedra", value: "**Valor:** 20 ${emoji.moeda}`, inline: true },
                        { name: emoji.ferro.toString() + ` 3- Ferro", value: "**Valor:** 40 ${emoji.moeda}`, inline: true },
                        { name: emoji.ouro.toString() + ` 4- Ouro", value: "**Valor:** 55 ${emoji.moeda}`, inline: true },
                        { name: emoji.diamante.toString() + ` 5- Diamante", value: "**Valor:** 65 ${emoji.moeda}`, inline: true },
                        { name: emoji.ametista.toString() + ` 6- Ametista", value: "**Valor:** 80 ${emoji.moeda}`, inline: true },
                        { name: emoji.esmeralda.toString() + ` 7- Esmeralda", value: "**Valor:** 100 ${emoji.moeda}`, inline: true },
                        { name: emoji.rubi.toString() + ` 8- Rubi", value: "**Valor:** 150 ${emoji.moeda}`, inline: true },
                        { name: emoji.lapislazuli.toString() + ` 9- Lápis-Lazúli", value: "**Valor:** 200 ${emoji.moeda}`, inline: true },
                        { name: emoji.jadeite.toString() + ` 10- Jadeite", value: "**Valor:** 400 ${emoji.moeda}`, inline: true },
                    )
                    .setColor('#87CEEB')
                    .setFooter({ text: 'Para vender use: escavacao > loja > minerios > ID' })

                    let msgMST = await message.reply({
                        embeds: [shopMEmbed],
                        components: [rowMinerios]
                    })
            
                    const filter = i => {
                        i.deferUpdate();
                        return i.user.id === message.author.id;
                    };
                    
                    msgMST.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
                        .then(async idMin => {

                    idMin = parseInt(idMin.values[0])

                if (idMin == 1) {
                    if (escavationDB.val().carvao == 0 || escavationDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem carvão para vender.')] })
                    let multiCarv = Number(escavationDB.val().carvao) * 10
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(multiCarv))
                    database.ref(`Global/${message.author.id}/Escavacao/carvao`).set(0)
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.diamante} | Venda de Minérios`).setDescription(`Você vendeu **${escavationDB.val().carvao}** carvões por **${new Intl.NumberFormat('de-DE').format(multiCarv)}** ouros.`)] })
                }

                if (idMin == 2) {
                    if (escavationDB.val().pedra == 0 || escavationDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem pedra para vender.')] })
                    let multiPedr = Number(escavationDB.val().pedra) * 20
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(multiPedr))
                    database.ref(`Global/${message.author.id}/Escavacao/pedra`).set(0)
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.diamante} | Venda de Minérios`).setDescription(`Você vendeu **${escavationDB.val().pedra}** pedras por **${new Intl.NumberFormat('de-DE').format(multiPedr)}** ouros.`)] })
                }

                if (idMin == 3) {
                    if (escavationDB.val().ferro == 0 || escavationDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem ferro para vender.')] })
                    let multiFerr = Number(escavationDB.val().ferro) * 40
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(multiFerr))
                    database.ref(`Global/${message.author.id}/Escavacao/ferro`).set(0)
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.diamante} | Venda de Minérios`).setDescription(`Você vendeu **${escavationDB.val().ferro}** ferros por **${new Intl.NumberFormat('de-DE').format(multiFerr)}** ouros.`)] })
                }

                if (idMin == 4) {
                    if (escavationDB.val().ouro == 0 || escavationDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem ouro para vender.')] })
                    let multiOuro = Number(escavationDB.val().ouro) * 55
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(multiOuro))
                    database.ref(`Global/${message.author.id}/Escavacao/ouro`).set(0)
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.diamante} | Venda de Minérios`).setDescription(`Você vendeu **${escavationDB.val().ouro}** ouros por **${new Intl.NumberFormat('de-DE').format(multiOuro)}** ouros.`)] })
                }

                if (idMin == 5) {
                    if (escavationDB.val().diamante == 0 || escavationDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem diamante para vender.')] })
                    let multiDiam = Number(escavationDB.val().diamante) * 65
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(multiDiam))
                    database.ref(`Global/${message.author.id}/Escavacao/diamante`).set(0)
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.diamante} | Venda de Minérios`).setDescription(`Você vendeu **${escavationDB.val().diamante}** diamantes por **${new Intl.NumberFormat('de-DE').format(multiDiam)}** ouros.`)] })
                }

                if (idMin == 6) {
                    if (escavationDB.val().ametista == 0 || escavationDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem ametista para vender.')] })
                    let multiAmet = Number(escavationDB.val().ametista) * 80
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(multiAmet))
                    database.ref(`Global/${message.author.id}/Escavacao/ametista`).set(0)
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.diamante} | Venda de Minérios`).setDescription(`Você vendeu **${escavationDB.val().ametista}** ametista por **${new Intl.NumberFormat('de-DE').format(multiAmet)}** ouros.`)] })
                }

                if (idMin == 7) {
                    if (escavationDB.val().esmeralda == 0 || escavationDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem esmeralda para vender.')] })
                    let multiEsme = Number(escavationDB.val().esmeralda) * 100
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(multiEsme))
                    database.ref(`Global/${message.author.id}/Escavacao/esmeralda`).set(0)
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.diamante} | Venda de Minérios`).setDescription(`Você vendeu **${escavationDB.val().esmeralda}** esmeraldas por **${new Intl.NumberFormat('de-DE').format(multiEsme)}** ouros.`)] })
                }

                if (idMin == 8) {
                    if (escavationDB.val().rubi == 0 || escavationDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem rubi para vender.')] })
                    let multiRubi = Number(escavationDB.val().rubi) * 150
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(multiRubi))
                    database.ref(`Global/${message.author.id}/Escavacao/rubi`).set(0)
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.diamante} | Venda de Minérios`).setDescription(`Você vendeu **${escavationDB.val().rubi}** rubis por **${new Intl.NumberFormat('de-DE').format(multiRubi)}** ouros.`)] })
                }

                if (idMin == 9) {
                    if (escavationDB.val().lapis == 0 || escavationDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem lápis-lazúli para vender.')] })
                    let multiLapis = Number(escavationDB.val().lapis) * 200
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(multiLapis))
                    database.ref(`Global/${message.author.id}/Escavacao/lapis`).set(0)
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.diamante} | Venda de Minérios`).setDescription(`Você vendeu **${escavationDB.val().lapis}** lápis-lazulis por **${new Intl.NumberFormat('de-DE').format(multiLapis)}** ouros.`)] })
                }

                if (idMin == 10) {
                    if (escavationDB.val().jadeite == 0 || escavationDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem jadeite para vender.')] })
                    let multiJade = Number(escavationDB.val().jadeite) * 400
                    database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(multiJade))
                    database.ref(`Global/${message.author.id}/Escavacao/jadeite`).set(0)
                    return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.diamante} | Venda de Minérios`).setDescription(`Você vendeu **${escavationDB.val().jadeite}** jadeites por **${new Intl.NumberFormat('de-DE').format(multiJade)}** ouros.`)] })
                        }
                    })
                }
            })
        }

        if (cmd == "INFO") {
            let time = ms(cooldown - (Date.now() - cooldownDB.val().escavacao))
            let timed = time.hours < 0 && time.minutes < 0 && time.seconds < 0 ? "Já pode ser usado" : `${time.hours} hora, ${time.minutes} minutos e ${time.seconds} segundos`

            let dbCarvao = escavationDB.val().carvao == undefined ? "0" : escavationDB.val().carvao
            let dbPedra = escavationDB.val().pedra == undefined ? "0" : escavationDB.val().pedra
            let dbFerro = escavationDB.val().ferro == undefined ? "0" : escavationDB.val().ferro
            let dbOuro = escavationDB.val().ouro == undefined ? "0" : escavationDB.val().ouro
            let dbDiamante = escavationDB.val().diamante == undefined ? "0" : escavationDB.val().diamante
            let dbAmetista = escavationDB.val().ametista == undefined ? "0" : escavationDB.val().ametista
            let dbEsmeralda = escavationDB.val().esmeralda == undefined ? "0" : escavationDB.val().esmeralda
            let dbRubi = escavationDB.val().rubi == undefined ? "0" : escavationDB.val().rubi
            let dbLapis = escavationDB.val().lapis == undefined ? "0" : escavationDB.val().lapis
            let dbJadeite = escavationDB.val().jadeite == undefined ? "0" : escavationDB.val().jadeite

            let infoEmbed = new Discord.EmbedBuilder()
                .setTitle(`${emoji.paNormal} | Informações: Escavação`)
                .setDescription(`**Cooldown:** ${timed}\n\n**Pá:** ${myPa}\n**Durabilidade:** ${escavationDB.val().durabilidade}/15\n\n**Minérios:**\nㅤCarvão: \`${dbCarvao}\`\nㅤPedra: \`${dbPedra}\`\nㅤFerro: \`${dbFerro}\`\nㅤOuro: \`${dbOuro}\`\nㅤDiamante: \`${dbDiamante}\`\nㅤAmetista: \`${dbAmetista}\`\nㅤEsmeralda: \`${dbEsmeralda}\`\nㅤRubi: \`${dbRubi}\`\nㅤLápis-Lazúli: \`${dbLapis}\`\nㅤJadeite: \`${dbJadeite}\``)
                .setColor('#A0522D')
            message.reply({ embeds: [infoEmbed] })
            }
        })
    }
}