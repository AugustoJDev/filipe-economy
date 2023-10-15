const Discord = require('discord.js')
const ms = require('parse-ms')
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js")

module.exports = {
    name: "produzir",
    aliases: [],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let ouroDB = await database.ref(`Global/${message.author.id}`).once('value')
        let producaoDB = await database.ref(`Global/${message.author.id}/Producao`).once('value')
        let facDB = await database.ref(`Global/${message.author.id}/Fabrica`).once('value')

        let cooldown = 7200000

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('produzir')
					.setPlaceholder('Selecione uma categoria')
					.addOptions(
						{
							label: 'Produzir',
							description: 'Inicie uma produção',
							value: 'produzir',
						},
						{
							label: 'Coletar',
							description: 'Colete suas produções',
							value: 'coletar',
						},
						{
							label: 'Inventário',
							description: 'Veja seu inventário de produção',
							value: 'inventario',
						},
						{
							label: 'Tempo',
							description: 'Veja uma progress bar com base no tempo que falta para produzir novamente',
							value: 'tempo',
						}
					),
			);

            let msgMS = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('🪵 | Produção - Ajuda')
                        .setDescription('`produzir` - Inicie uma produção;\n`coletar` - Colete suas produções;\n`inventário` - Veja seu inventário de produção;\n`tempo` - Veja uma progress bar com base no tempo\nque falta para produzir novamente.')
                        .setColor('#B4EEB4')],
                components: [row]
            })
        
            const filter = i => {
                i.deferUpdate();
                return i.user.id === message.author.id;
            };
                
            msgMS.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
                .then(async cmd => {

            cmd = cmd.values[0].toUpperCase();

            if(cmd === "PRODUZIR") {

            if (ouroDB.val().Fabrica.id == null || ouroDB.val().Fabrica.id == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não é funcionário de uma fábrica.').setFooter({ text: 'Utilize `produzir > ajuda` para ver os outros comandos.'})] })

            if (producaoDB.val() !== null && cooldown - (Date.now() - producaoDB.val().cooldown) > 0) {
                let time = ms(cooldown - (Date.now() - producaoDB.val().cooldown))
                let hours = time.hours > 0 ? `${time.hours} horas,` : ""
                let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá produzir novamente em ${hours} ${minutes} ${seconds}.`)] })
            } else {
                database.ref(`Global/${message.author.id}/Producao`).update({ cooldown: Date.now() })
            }

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('producao')
					.setPlaceholder('Selecione algo para produzir')
					.addOptions(
						{
							label: 'Madeira',
							value: 'madeira'
						},
						{
							label: 'Ferro',
							value: 'ferro'
						},
						{
							label: 'Aço',
							value: 'aco'
						},
						{
							label: 'Vidro',
							value: 'vidro'
						},
						{
							label: 'Alumínio',
							value: 'aluminio'
						}
					),
			);

            let msgMS = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription('Selecione algo para produzir.')
                        .setColor('#90EE90')],
                components: [row]
            })
        
            const filter = i => {
                i.deferUpdate();
                return i.user.id === message.author.id;
            };
                
            msgMS.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
                .then(async cmd => {

            let item = cmd.values[0].toUpperCase()
            let quantiaProduzida = Math.floor(Math.random() * (20 - 5)) + 5;

            if (item == "MADEIRA") {
                if (ouroDB.val() < 5000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente! São necessários **5.000* ouros.')] })
                let isNull = producaoDB.val().madeira == null ? database.ref(`Global/${message.author.id}/Producao`).update({ madeira: quantiaProduzida }) : database.ref(`Global/${message.author.id}/Producao`).update({ madeira: Number(producaoDB.val().madeira) + Number(quantiaProduzida) })
                isNull
                return message.reply({ embeds: [sucEmbed.setTitle('🪵 | Produção Finalizada').setDescription(`Wow! Você produziu **${quantiaProduzida}** madeiras!`)] })
            }

            if (item == "FERRO") {
                if (ouroDB.val() < 8500) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente! São necessários **8.500* ouros.')] })
                let isNull = producaoDB.val().ferro == null ? database.ref(`Global/${message.author.id}/Producao`).update({ ferro: quantiaProduzida }) : database.ref(`Global/${message.author.id}/Producao`).update({ ferro: Number(producaoDB.val().ferro) + Number(quantiaProduzida) })
                isNull
                return message.reply({ embeds: [sucEmbed.setTitle('🪵 | Produção Finalizada').setDescription(`Wow! Você produziu **${quantiaProduzida}** ferro!`)] })
            }

            if (item == "AÇO" || item == "ACO") {
                if (ouroDB.val() < 15000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente! São necessários **15.000* ouros.')] })
                let isNull = producaoDB.val().aco == null ? database.ref(`Global/${message.author.id}/Producao`).update({ aco: quantiaProduzida }) : database.ref(`Global/${message.author.id}/Producao`).update({ aco: Number(producaoDB.val().aco) + Number(quantiaProduzida) })
                isNull
                return message.reply({ embeds: [sucEmbed.setTitle('🪵 | Produção Finalizada').setDescription(`Wow! Você produziu **${quantiaProduzida}** aços!`)] })
            }

            if (item == "VIDRO") {
                if (ouroDB.val() < 35000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente! São necessários **35.000* ouros.')] })
                let isNull = producaoDB.val().vidro == null ? database.ref(`Global/${message.author.id}/Producao`).update({ vidro: quantiaProduzida }) : database.ref(`Global/${message.author.id}/Producao`).update({ vidro: Number(producaoDB.val().vidro) + Number(quantiaProduzida) })
                isNull
                return message.reply({ embeds: [sucEmbed.setTitle('🪵 | Produção Finalizada').setDescription(`Wow! Você produziu **${quantiaProduzida}** vidros!`)] })
            }

            if (item == "ALUMINIO" || item == "ALUMÍNIO") {
                if (ouroDB.val() < 60000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente! São necessários **60.000* ouros.')] })
                let isNull = producaoDB.val().aluminio == null ? database.ref(`Global/${message.author.id}/Producao`).update({ aluminio: quantiaProduzida }) : database.ref(`Global/${message.author.id}/Producao`).update({ aluminio: Number(producaoDB.val().aluminio) + Number(quantiaProduzida) })
                isNull
                return message.reply({ embeds: [sucEmbed.setTitle('🪵 | Produção Finalizada').setDescription(`Wow! Você produziu **${quantiaProduzida}** alumínios!`)] })
            }
            })
        }

        if (cmd == "COLETAR") {
            
        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('producao')
					.setPlaceholder('Selecione algo para coletar')
					.addOptions(
						{
							label: 'Madeira',
							value: 'madeira'
						},
						{
							label: 'Ferro',
							value: 'ferro'
						},
						{
							label: 'Aço',
							value: 'aco'
						},
						{
							label: 'Vidro',
							value: 'vidro'
						},
						{
							label: 'Alumínio',
							value: 'aluminio'
						},
						{
							label: 'Tudo',
							value: 'tudo'
						}
					),
			);

            let msgMS = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription('Selecione algo para produzir.')
                        .setColor('#90EE90')],
                components: [row]
            })
        
            const filter = i => {
                i.deferUpdate();
                return i.user.id === message.author.id;
            };
                
            msgMS.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
                .then(async item => {

            let itemCollected = item.values[0].toUpperCase()

            if (itemCollected == "MADEIRA") {
                if (producaoDB.val().madeira == null || producaoDB.val().madeira <= 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nenhuma madeira para recolher.')] })
                let isNull = facDB.val().madeira == null ? database.ref(`Global/${message.author.id}/Fabrica`).update({ madeira: producaoDB.val().madeira }) : database.ref(`Global/${message.author.id}/Fabrica`).update({ madeira: Number(producaoDB.val().madeira) + Number(facDB.val().madeira) })
                isNull
                database.ref(`Global/${message.author.id}/Producao/madeira`).set(0)
                return message.reply({ embeds: [sucEmbed.setTitle('🪵 | Produção Coletada').setDescription(`Yeah! Você coletou **${producaoDB.val().madeira}** madeiras!`)] })
            }

            if (itemCollected == "FERRO") {
                if (producaoDB.val().ferro == null || producaoDB.val().ferro <= 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nenhum ferro para recolher.')] })
                let isNull = facDB.val().ferro == null ? database.ref(`Global/${message.author.id}/Fabrica`).update({ ferro: producaoDB.val().ferro }) : database.ref(`Global/${message.author.id}/Fabrica`).update({ ferro: Number(producaoDB.val().ferro) + Number(facDB.val().ferro) })
                isNull
                database.ref(`Global/${message.author.id}/Producao/ferro`).set(0)
                return message.reply({ embeds: [sucEmbed.setTitle('🪵 | Produção Coletada').setDescription(`Yeah! Você coletou **${producaoDB.val().ferro}** ferro!`)] })
            }

            if (itemCollected == "AÇO" || itemCollected == "ACO") {
                if (producaoDB.val().aco == null || producaoDB.val().aco <= 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nenhum aço para recolher.')] })
                let isNull = facDB.val().aco == null ? database.ref(`Global/${message.author.id}/Fabrica`).update({ aco: producaoDB.val().aco }) : database.ref(`Global/${message.author.id}/Fabrica`).update({ aco: Number(producaoDB.val().aco) + Number(facDB.val().aco) })
                isNull
                database.ref(`Global/${message.author.id}/Producao/aco`).set(0)
                return message.reply({ embeds: [sucEmbed.setTitle('🪵 | Produção Coletada').setDescription(`Yeah! Você coletou **${producaoDB.val().aco}** aços!`)] })
            }

            if (itemCollected == "VIDRO") {
                if (producaoDB.val().vidro == null || producaoDB.val().vidro <= 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nenhum vidro para recolher.')] })
                let isNull = facDB.val().vidro == null ? database.ref(`Global/${message.author.id}/Fabrica`).update({ vidro: producaoDB.val().vidro }) : database.ref(`Global/${message.author.id}/Fabrica`).update({ vidro: Number(producaoDB.val().vidro) + Number(facDB.val().vidro) })
                isNull
                database.ref(`Global/${message.author.id}/Producao/vidro`).set(0)
                return message.reply({ embeds: [sucEmbed.setTitle('🪵 | Produção Coletada').setDescription(`Yeah! Você coletou **${producaoDB.val().vidro}** vidros!`)] })
            }

            if (itemCollected == "ALUMÍNIO" || itemCollected == "ALUMINIO") {
                if (producaoDB.val().aluminio == null || producaoDB.val().aluminio <= 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nenhum alumínio para recolher.')] })
                let isNull = facDB.val().aluminio == null ? database.ref(`Global/${message.author.id}/Fabrica`).update({ aluminio: producaoDB.val().aluminio }) : database.ref(`Global/${message.author.id}/Fabrica`).update({ aluminio: Number(producaoDB.val().aluminio) + Number(facDB.val().aluminio) })
                isNull
                database.ref(`Global/${message.author.id}/Producao/aluminio`).set(0)
                return message.reply({ embeds: [sucEmbed.setTitle('🪵 | Produção Coletada').setDescription(`Yeah! Você coletou **${producaoDB.val().aluminio}** alumínios!`)] })
            }

            if (itemCollected == "TUDO" || itemCollected == "ALL") {
                if (producaoDB.val().madeira <= 0 && producaoDB.val().ferro <= 0 && producaoDB.val().aco <= 0 && producaoDB.val().vidro <= 0 && producaoDB.val().aluminio <= 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nenhum item para recolher.')] })
                let isNull1 = facDB.val().madeira == null ? database.ref(`Global/${message.author.id}/Fabrica`).update({ madeira: producaoDB.val().madeira }) : database.ref(`Global/${message.author.id}/Fabrica`).update({ madeira: Number(producaoDB.val().madeira) + Number(facDB.val().madeira) })
                let isNull2 = facDB.val().ferro == null ? database.ref(`Global/${message.author.id}/Fabrica`).update({ ferro: producaoDB.val().ferro }) : database.ref(`Global/${message.author.id}/Fabrica`).update({ ferro: Number(producaoDB.val().ferro) + Number(facDB.val().ferro) })
                let isNull3 = facDB.val().aco == null ? database.ref(`Global/${message.author.id}/Fabrica`).update({ aco: producaoDB.val().aco }) : database.ref(`Global/${message.author.id}/Fabrica`).update({ aco: Number(producaoDB.val().aco) + Number(facDB.val().aco) })
                let isNull4 = facDB.val().vidro == null ? database.ref(`Global/${message.author.id}/Fabrica`).update({ vidro: producaoDB.val().vidro }) : database.ref(`Global/${message.author.id}/Fabrica`).update({ vidro: Number(producaoDB.val().vidro) + Number(facDB.val().vidro) })
                let isNull5 = facDB.val().aluminio == null ? database.ref(`Global/${message.author.id}/Fabrica`).update({ aluminio: producaoDB.val().aluminio }) : database.ref(`Global/${message.author.id}/Fabrica`).update({ aluminio: Number(producaoDB.val().aluminio) + Number(facDB.val().aluminio) })
                isNull1, isNull2, isNull3, isNull4, isNull5

                database.ref(`Global/${message.author.id}/Producao`).update({ madeira: 0, ferro: 0, aco: 0, vidro: 0, aluminio: 0 })
                return message.reply({ embeds: [sucEmbed.setTitle('🪵 | Produção Coletada').setDescription(`Eba! Você recolheu **${new Intl.NumberFormat('de-DE').format(producaoDB.val().madeira)}** madeiras, **${producaoDB.val().ferro}** ferros, **${producaoDB.val().aco}** aços, **${producaoDB.val().vidro}** vidros e **${producaoDB.val().aluminio}** alumínios.`)] })
                }
            })
        }

        if (cmd == "INVENTARIO" || cmd == "INVENTÁRIO") {
            message.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle('🪵 | Inventário de Produções')
                    .setDescription(`**🌴 | Esperando Recolha:**\nㅤㅤMadeira: ${producaoDB.val().madeira}\nㅤㅤFerro: ${producaoDB.val().ferro}\nㅤㅤAço: ${producaoDB.val().aco}\nㅤㅤVidro: ${producaoDB.val().vidro}\nㅤㅤAlumínio: ${producaoDB.val().aluminio}\n\n**🌲 | Recolhidos:**\nㅤㅤMadeira: ${facDB.val().madeira}\nㅤㅤFerro: ${facDB.val().ferro}\nㅤㅤAço: ${facDB.val().aco}\nㅤㅤVidro: ${facDB.val().vidro}\nㅤㅤAlumínio: ${facDB.val().aluminio}`)
                    .setColor('#8B3626')]
            })
        }

        if (cmd == "TEMPO") {
            let progBar;
            let current;

            if (producaoDB.val() !== null && cooldown - (Date.now() - producaoDB.val().cooldown) > 0) {
                let time = ms(cooldown - (Date.now() - producaoDB.val().cooldown))
                if (time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0) progBar = "[ ▪▪▪▪▪▪▪▪▪▪ ]", current = 100
                if (time.minutes <= 12) progBar = "[ ▪▪▪▪▪▪▪▪▪▫ ]", current = 60 + (60 - time.minutes)
                if (time.minutes > 12 && time.minutes <= 24) progBar = "[ ▪▪▪▪▪▪▪▪▫▫ ]", current = 60 + (60 - time.minutes)
                if (time.minutes > 36 && time.minutes <= 48) progBar = "[ ▪▪▪▪▪▪▪▫▫▫ ]", current = 60 + (60 - time.minutes)
                if (time.minutes > 48 && time.hours == 1) progBar = "[ ▪▪▪▪▪▪▫▫▫▫ ]", current = 60 + (60 - time.minutes)
                if (time.hours == 1 && time.minutes <= 12) progBar = "[ ▪▪▪▪▪▫▫▫▫▫ ]", current = 60 - time.minutes
                if (time.hours == 1 && time.minutes > 12 && time.minutes <= 24) progBar = "[ ▪▪▪▪▫▫▫▫▫▫ ]", current = 60 - time.minutes
                if (time.hours == 1 && time.minutes > 24 && time.minutes <= 36) progBar = "[ ▪▪▪▫▫▫▫▫▫▫ ]", current = 60 - time.minutes
                if (time.hours == 1 && time.minutes > 36 && time.minutes <= 48) progBar = "[ ▪▪▫▫▫▫▫▫▫▫ ]", current = 60 - time.minutes
                if (time.hours == 1 && time.minutes > 48) progBar = "[ ▪▫▫▫▫▫▫▫▫▫ ]", current = 60 - time.minutes
            } else {
                progBar = "[ ▪▪▪▪▪▪▪▪▪▪ ]", current = 100
            }

            message.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle('🛢️ | Produção')
                    .setDescription(`Veja uma barra de progresso com base no tempo que\nfalta para você poder produzir novamente:\n \`\`\`${progBar} - ${current}%\`\`\` `)
                    .setColor('#4682B4')]
                })
            }
        })
    }
}