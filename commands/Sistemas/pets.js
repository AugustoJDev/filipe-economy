const Discord = require("discord.js")
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, ComponentType } = require("discord.js")
const ms = require("parse-ms")
module.exports = {
    name: "pets",
    aliases: ["pet"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let petsDB = await database.ref(`Global/${message.author.id}/Pets`).once('value')
        let cooldownDB = await database.ref(`Global/${message.author.id}/Pets/Interacoes`).once('value')
        let farmDB = await database.ref(`Global/${message.author.id}/Fazenda/Produzidos`).once('value')

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('pets')
					.setPlaceholder('Selecione uma categoria')
					.addOptions(
						{
							label: 'Brincar',
							description: 'Brinque com seus pets',
							value: 'play',
						},
						{
							label: 'Produzir',
							description: 'Produza com seus pets',
							value: 'produce',
						},
						{
							label: 'Alimentar',
							description: 'Alimente seus pets',
							value: 'food',
						},
						{
							label: 'Comprar',
							description: 'Compre pets',
							value: 'buy',
						},
						{
							label: 'Vender',
							description: 'Venda a produção dos seus pets',
							value: 'sell',
						},
						{
							label: 'Info',
							description: 'Veja a informação dos seus pets',
							value: 'info',
						}
					),
			);

            let msgPets = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('🐓 | Pets - Ajuda')
                        .setDescription('`brincar` - Brincar com seus pets;\n`produzir` - Produza com seus pets;\n`alimentar` - Alimente seus pets;\n`comprar` - Compre pets;\n`vender` - Venda a produção dos seus pets;\n`info` - Veja as informações dos seus pets.')
                        .setColor('#6495ED')],
                components: [row]
            })

        const filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
        };
        
        msgPets.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
            .then(async cmd => {

            cmd = cmd.values[0];

        if (cmd == "play") {

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('play')
					.setPlaceholder('Selecione um pet')
					.addOptions(
						{
							label: 'Cachorro',
							description: 'Brinque com seu cachorro',
							value: 'cachorro',
						},
						{
							label: 'Papagaio',
							description: 'Brinque com seu papagaio',
							value: 'papagaio',
						},
						{
							label: 'Coelho',
							description: 'Brinque seu coelho',
							value: 'coelho',
						},
						{
							label: 'Pinguim',
							description: 'Brinque com seu pinguim',
							value: 'pinguim',
						}
					),
			);

            let msgPlay = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('🐓 | Pets - Brincar')
                        .setDescription('Escolha um pet para brincar')
                        .setColor('#4CFF40')],
                components: [row]
            })

        const filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
        };
        
        msgPlay.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
            .then(async pet => {
            
            pet = pet.values[0].toUpperCase()

            let addXP = Math.floor(Math.random() * (40 - 15)) + 15;
            let addMoney = Math.floor(Math.random() * (500 - 125)) + 125;
            let cooldownBrincar = 3600000;

            if (pet == "CACHORRO") {
                if (petsDB.val().cachorro != 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você não possui um cachorro.')] })
                if (petsDB.val().cachorroAlimentado != "true") return message.reply({ embeds: [errorEmbed.setDescription('Seu cachorro não foi alimentado.')] })

                if (cooldownDB.val() !== null && cooldownBrincar - (Date.now() - cooldownDB.val().cooldownCachorro) > 0) {
                    let time = ms(cooldownBrincar - (Date.now() - cooldownDB.val().cooldownCachorro))
                    let hours = time.hours > 0 ? `${time.hours} hora,` : ""
                    let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                    let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                    return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá brincar com seu cachorro novamente em ${hours} ${minutes} ${seconds}.`)] })
                } else { database.ref(`Global/${message.author.id}/Pets/Interacoes`).update({ cooldownCachorro: Date.now() }) }

                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(addMoney))
                database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                return message.reply({ embeds: [sucEmbed.setTitle('🐶 | Cachorro').setDescription(`Você brincou com seu cachorro e recebeu **${addMoney}** ouros e **${addXP}** XP!`)] })
            }

            if (pet == "PAPAGAIO") {
                if (petsDB.val().papagaio != 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você não possui um papagaio.')] })
                if (petsDB.val().papagaioAlimentado != "true") return message.reply({ embeds: [errorEmbed.setDescription('Seu papagaio não foi alimentado.')] })

                if (cooldownDB.val() !== null && cooldownBrincar - (Date.now() - cooldownDB.val().cooldownPapagaio) > 0) {
                    let time = ms(cooldownBrincar - (Date.now() - cooldownDB.val().cooldownPapagaio))
                    let hours = time.hours > 0 ? `${time.hours} hora,` : ""
                    let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                    let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                    return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá brincar com seu papagaio novamente em ${hours} ${minutes} ${seconds}.`)] })
                } else { database.ref(`Global/${message.author.id}/Pets/Interacoes`).update({ cooldownPapagaio: Date.now() }) }

                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(addMoney))
                database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                return message.reply({ embeds: [sucEmbed.setTitle('🐔 | Galinha').setDescription(`Você brincou com seu papagaio e recebeu **${addMoney}** ouros e **${addXP}** XP!`)] })
            }

            if (pet == "COELHO") {
                if (petsDB.val().coelho != 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você não possui um coelho.')] })
                if (petsDB.val().coelhoAlimentado != "true") return message.reply({ embeds: [errorEmbed.setDescription('Seu coelho não foi alimentado.')] })

                if (cooldownDB.val() !== null && cooldownBrincar - (Date.now() - cooldownDB.val().cooldownCoelho) > 0) {
                    let time = ms(cooldownBrincar - (Date.now() - cooldownDB.val().cooldownCoelho))
                    let hours = time.hours > 0 ? `${time.hours} hora,` : ""
                    let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                    let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                    return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá brincar com seu coelho novamente em ${hours} ${minutes} ${seconds}.`)] })
                } else { database.ref(`Global/${message.author.id}/Pets/Interacoes`).update({ cooldownCoelho: Date.now() }) }

                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(addMoney))
                database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                return message.reply({ embeds: [sucEmbed.setTitle('🐇 | Coelho').setDescription(`Você brincou com seu coelho e recebeu **${addMoney}** ouros e **${addXP}** XP!`)] })
            }

            if (pet == "PINGUIM") {
                if (petsDB.val().pinguim != 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você não possui um pinguim.')] })
                if (petsDB.val().pinguimAlimentado != "true") return message.reply({ embeds: [errorEmbed.setDescription('Seu pinguim não foi alimentado.')] })

                if (cooldownDB.val() !== null && cooldownBrincar - (Date.now() - cooldownDB.val().cooldownPinguim) > 0) {
                    let time = ms(cooldownBrincar - (Date.now() - cooldownDB.val().cooldownPinguim))
                    let hours = time.hours > 0 ? `${time.hours} hora,` : ""
                    let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                    let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                    return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá brincar com seu pinguim novamente em ${hours} ${minutes} ${seconds}.`)] })
                } else { database.ref(`Global/${message.author.id}/Pets/Interacoes`).update({ cooldownPinguim: Date.now() }) }

                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(addMoney))
                database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                return message.reply({ embeds: [sucEmbed.setTitle('🐧 | Pinguim').setDescription(`Você brincou com seu pinguim e recebeu **${addMoney}** ouros e **${addXP}** XP!`)] })
                }
            })
        }

        if (cmd == "produce") {

            const row2 = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('produce')
					.setPlaceholder('Selecione um pet')
					.addOptions(
						{
							label: 'Galinha',
							description: 'Produza itens com seu animal.',
							value: 'galinha',
						},
						{
							label: 'Vaca',
							description: 'Produza itens com seu animal.',
							value: 'vaca',
						},
						{
							label: 'Porco',
							description: 'Produza itens com seu animal.',
							value: 'porco',
						},
						{
							label: 'Abelha',
							description: 'Produza itens com seu animal.',
							value: 'abelha',
						},
						{
							label: 'Pavão',
							description: 'Produza itens com seu animal.',
							value: 'pavao',
						}
					),
			);

            let msgProduce = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('🐓 | Pets - Produzir')
                        .setDescription('Escolha um animal para produzir itens')
                        .setColor('#4CFF40')],
                components: [row2]
            })

        const filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
        };
        
        msgProduce.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
            .then(async pet => {
            
            pet = pet.values[0].toUpperCase()

            let addXP = Math.floor(Math.random() * (15 - 5)) + 5;
            let cooldownProduzir = 7200000;

            if (pet == "GALINHA") {
                if (petsDB.val().galinha != 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você não possui uma galinha.')] })
                if (petsDB.val().galinhaAlimentada != "true") return message.reply({ embeds: [errorEmbed.setDescription('Sua galinha não foi alimentada.')] })

                if (memberDB.val().mochila == 1) {
                    if (10 + petsDB.val().Produzidos.ovo >= 50) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 2) {
                    if (10 + petsDB.val().Produzidos.ovo >= 100) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 3) {
                    if (10 + petsDB.val().Produzidos.ovo >= 200) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 4) {
                    if (10 + petsDB.val().Produzidos.ovo >= 300) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 5) {
                    if (10 + petsDB.val().Produzidos.ovo >= 400) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (cooldownDB.val() !== null && cooldownProduzir - (Date.now() - cooldownDB.val().cooldownGalinha) > 0) {
                    let time = ms(cooldownProduzir - (Date.now() - cooldownDB.val().cooldownGalinha))
                    let hours = time.hours > 0 ? `${time.hours} hora,` : ""
                    let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                    let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                    return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá produzir sua galinha novamente em ${hours} ${minutes} ${seconds}.`)] })
                } else { database.ref(`Global/${message.author.id}/Pets/Interacoes`).update({ cooldownGalinha: Date.now() }) }

                let ovos = 0;
                const intervalGalinha = setInterval(() => {
                    ovos++
                    database.ref(`Global/${message.author.id}/Pets/Produzidos/ovo`).transaction(n => n + Number(1))
                    if (ovos >= 10) {
                        database.ref(`Global/${message.author.id}/Pets`).update({ galinha: "false", galinhaAlimentada: "false" })
                        database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                        message.reply({ embeds: [sucEmbed.setTitle('🥚 | Produção de Ovo').setDescription(`**10** ovos foram produzidos.`)] })
                        clearInterval(intervalGalinha)
                    }
                }, 1380000);
            }

            if (pet == "VACA") {
                if (petsDB.val().vaca != 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você não possui uma vaca.')] })
                if (petsDB.val().vacaAlimentada != "true") return message.reply({ embeds: [errorEmbed.setDescription('Sua vaca não foi alimentada.')] })

                if (memberDB.val().mochila == 1) {
                    if (10 + petsDB.val().Produzidos.leite >= 50) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 2) {
                    if (10 + petsDB.val().Produzidos.leite >= 100) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 3) {
                    if (10 + petsDB.val().Produzidos.leite >= 200) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 4) {
                    if (10 + petsDB.val().Produzidos.leite >= 300) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 5) {
                    if (10 + petsDB.val().Produzidos.leite >= 400) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (cooldownDB.val() !== null && cooldownProduzir - (Date.now() - cooldownDB.val().cooldownVaca) > 0) {
                    let time = ms(cooldownProduzir - (Date.now() - cooldownDB.val().cooldownVaca))
                    let hours = time.hours > 0 ? `${time.hours} hora,` : ""
                    let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                    let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                    return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá produzir sua vaca novamente em ${hours} ${minutes} ${seconds}.`)] })
                } else { database.ref(`Global/${message.author.id}/Pets/Interacoes`).update({ cooldownVaca: Date.now() }) }

                let leite = 0;
                const intervalVaca = setInterval(() => {
                    leite++
                    database.ref(`Global/${message.author.id}/Pets/Produzidos/leite`).transaction(n => n + Number(1))
                    if (leite >= 15) {
                        database.ref(`Global/${message.author.id}/Pets`).update({ vaca: "false", vacaAlimentada: "false" })
                        database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                        message.reply({ embeds: [sucEmbed.setTitle('🥛 | Produção de Leite').setDescription(`**15** litros de leite foram produzidos.`)] })
                        clearInterval(intervalVaca)
                    }
                }, 1800000);
            }

            if (pet == "OVELHA") {
                if (petsDB.val().ovelha != 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você não possui uma ovelha.')] })
                if (petsDB.val().ovelhaAlimentada != "true") return message.reply({ embeds: [errorEmbed.setDescription('Sua ovelha não foi alimentada.')] })

                if (memberDB.val().mochila == 1) {
                    if (10 + petsDB.val().Produzidos.la >= 50) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 2) {
                    if (10 + petsDB.val().Produzidos.la >= 100) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 3) {
                    if (10 + petsDB.val().Produzidos.la >= 200) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 4) {
                    if (10 + petsDB.val().Produzidos.la >= 300) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 5) {
                    if (10 + petsDB.val().Produzidos.la >= 400) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (cooldownDB.val() !== null && cooldownProduzir - (Date.now() - cooldownDB.val().cooldownOvelha) > 0) {
                    let time = ms(cooldownProduzir - (Date.now() - cooldownDB.val().cooldownOvelha))
                    let hours = time.hours > 0 ? `${time.hours} hora,` : ""
                    let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                    let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                    return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá produzir sua ovelha novamente em ${hours} ${minutes} ${seconds}.`)] })
                } else { database.ref(`Global/${message.author.id}/Pets/Interacoes`).update({ cooldownOvelha: Date.now() }) }

                let la = 0;
                const intervalOvelha = setInterval(() => {
                    la++
                    database.ref(`Global/${message.author.id}/Pets/Produzidos/la`).transaction(n => n + Number(1))
                    if (la >= 20) {
                        database.ref(`Global/${message.author.id}/Pets`).update({ ovelha: "false", ovelhaAlimentada: "false" })
                        database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                        message.reply({ embeds: [sucEmbed.setTitle('🧶 | Produção de Lã').setDescription(`**20** lãs foram produzidas.`)] })
                        clearInterval(intervalOvelha)
                    }
                }, 300000);
            }

            if (pet == "PAVÃO" || pet == "PAVAO") {
                if (petsDB.val().pavao != 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você não possui um pavão.')] })
                if (petsDB.val().pavaoAlimentado != "true") return message.reply({ embeds: [errorEmbed.setDescription('Seu pavão não foi alimentado.')] })

                if (memberDB.val().mochila == 1) {
                    if (10 + petsDB.val().Produzidos.pena >= 50) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 2) {
                    if (10 + petsDB.val().Produzidos.pena >= 100) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 3) {
                    if (10 + petsDB.val().Produzidos.pena >= 200) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 4) {
                    if (10 + petsDB.val().Produzidos.pena >= 300) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 5) {
                    if (10 + petsDB.val().Produzidos.pena >= 400) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (cooldownDB.val() !== null && cooldownProduzir - (Date.now() - cooldownDB.val().cooldownPavao) > 0) {
                    let time = ms(cooldownProduzir - (Date.now() - cooldownDB.val().cooldownPavao))
                    let hours = time.hours > 0 ? `${time.hours} hora,` : ""
                    let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                    let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                    return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá produzir seu pavão novamente em ${hours} ${minutes} ${seconds}.`)] })
                } else { database.ref(`Global/${message.author.id}/Pets/Interacoes`).update({ cooldownPavao: Date.now() }) }

                let pena = 0;
                const intervalPavao = setInterval(() => {
                    pena++
                    database.ref(`Global/${message.author.id}/Pets/Produzidos/pena`).transaction(n => n + Number(1))
                    if (pena >= 15) {
                        database.ref(`Global/${message.author.id}/Pets`).update({ pavao: "false", pavaoAlimentado: "false" })
                        database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                        message.reply({ embeds: [sucEmbed.setTitle('🪶 | Produção de Pena').setDescription(`**15** penas foram produzidas.`)] })
                        clearInterval(intervalPavao)
                    }
                }, 2280000);
            }

            if (pet == "PORCO") {
                if (petsDB.val().porco != 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você não possui um porco.')] })
                if (petsDB.val().porcoAlimentado != "true") return message.reply({ embeds: [errorEmbed.setDescription('Seu porco não foi alimentado.')] })

                if (memberDB.val().mochila == 1) {
                    if (10 + petsDB.val().Produzidos.bacon >= 50) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 2) {
                    if (10 + petsDB.val().Produzidos.bacon >= 100) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 3) {
                    if (10 + petsDB.val().Produzidos.bacon >= 200) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 4) {
                    if (10 + petsDB.val().Produzidos.bacon >= 300) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 5) {
                    if (10 + petsDB.val().Produzidos.bacon >= 400) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (cooldownDB.val() !== null && cooldownProduzir - (Date.now() - cooldownDB.val().cooldownPorco) > 0) {
                    let time = ms(cooldownProduzir - (Date.now() - cooldownDB.val().cooldownPorco))
                    let hours = time.hours > 0 ? `${time.hours} hora,` : ""
                    let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                    let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                    return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá produzir seu porco novamente em ${hours} ${minutes} ${seconds}.`)] })
                } else { database.ref(`Global/${message.author.id}/Pets/Interacoes`).update({ cooldownPorco: Date.now() }) }

                let bacon = 0;
                const intervalPorco = setInterval(() => {
                    bacon++
                    database.ref(`Global/${message.author.id}/Pets/Produzidos/bacon`).transaction(n => n + Number(1))
                    if (bacon >= 15) {
                        database.ref(`Global/${message.author.id}/Pets`).update({ porco: "false", porcoAlimentado: "false" })
                        database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                        message.reply({ embeds: [sucEmbed.setTitle('🥓 | Produção de Bacon').setDescription(`**15** bacons foram produzidos.`)] })
                        clearInterval(intervalPorco)
                    }
                }, 2520000);
            }

            if (pet == "ABELHA") {
                if (petsDB.val().abelha != 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você não possui uma abelha.')] })
                if (petsDB.val().abelhaAlimentada != "true") return message.reply({ embeds: [errorEmbed.setDescription('Sua abelha não foi alimentada.')] })

                if (memberDB.val().mochila == 1) {
                    if (10 + petsDB.val().Produzidos.mel >= 50) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 2) {
                    if (10 + petsDB.val().Produzidos.mel >= 100) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 3) {
                    if (10 + petsDB.val().Produzidos.mel >= 200) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 4) {
                    if (10 + petsDB.val().Produzidos.mel >= 300) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (memberDB.val().mochila == 5) {
                    if (10 + petsDB.val().Produzidos.mel >= 400) return message.reply({ embeds: [errorEmbed.setDescription('Sua mochila não possui espaço suficiente.')] })
                }

                if (cooldownDB.val() !== null && cooldownProduzir - (Date.now() - cooldownDB.val().cooldownAbelha) > 0) {
                    let time = ms(cooldownProduzir - (Date.now() - cooldownDB.val().cooldownAbelha))
                    let hours = time.hours > 0 ? `${time.hours} hora,` : ""
                    let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                    let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                    return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá produzir sua abelha novamente em ${hours} ${minutes} ${seconds}.`)] })
                } else { database.ref(`Global/${message.author.id}/Pets/Interacoes`).update({ cooldownAbelha: Date.now() }) }

                let mel = 0;

                let poteOuro = Math.floor(Math.random() * (2 - 1)) + 1;
                let poteOuroM = poteOuro == 1 ? "**1 Pote de Ouro produzido!**" : ""
                if (poteOuro == 1) {
                    database.ref(`Global/${message.author.id}/Pets/Produzidos/poteOuro`).transaction(n => n + Number(1))
                }

                let intervalAbelha = setInterval(() => {
                    mel++
                    database.ref(`Global/${message.author.id}/Pets/Produzidos/mel`).transaction(n => n + Number(1))
                    if (mel >= 15) {
                        database.ref(`Global/${message.author.id}/Pets`).update({ abelha: "false", abelhaAlimentada: "false" })
                        database.ref(`Global/${message.author.id}/xp`).transaction(n => n + Number(addXP))
                        message.reply({ embeds: [sucEmbed.setTitle('🍯 | Produção de Mel').setDescription(`**15** potes de mel foram produzidos.\n\n${poteOuroM}`)] })
                        clearInterval(intervalAbelha)
                        }
                    }, 100);
                }
            })
        }

        if (cmd == "food") {

            const row3 = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('food')
					.setPlaceholder('Selecione um pet')
					.addOptions(
						{
							label: 'Cachorro',
							description: 'Alimente seu cachorro',
							value: 'cachorro',
						},
						{
							label: 'Papagaio',
							description: 'Alimente seu papagaio',
							value: 'papagaio',
						},
						{
							label: 'Coelho',
							description: 'Alimente seu coelho',
							value: 'coelho',
						},
						{
							label: 'Pinguim',
							description: 'Alimente seu pinguim',
							value: 'pinguim',
						},
						{
							label: 'Vaca',
							description: 'Alimente sua vaca',
							value: 'vaca',
						},
						{
							label: 'Porco',
							description: 'Alimente seu porco',
							value: 'porco',
						},
						{
							label: 'Pavão',
							description: 'Alimente seu pavão',
							value: 'pavao',
						},
						{
							label: 'Abelha',
							description: 'Alimente sua abelha',
							value: 'abelha',
						},
						{
							label: 'Ovelha',
							description: 'Alimente sua ovelha',
							value: 'Ovelha',
						},
						{
							label: 'Galinha',
							description: 'Alimente sua galinha',
							value: 'galinha',
						},
					),
			);

            let msgFood = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('🐓 | Pets - Alimentar')
                        .setDescription('Escolha um pet para alimentar')
                        .setColor('#4CFF40')],
                components: [row3]
            })

        const filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
        };
        
        msgFood.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
            .then(async pet => {

            pet = pet.values[0].toUpperCase()

            if (pet == "CACHORRO") {
                if (petsDB.val().cachorro == "false") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui um cachorro.')] })
                if (petsDB.val().cachorroAlimentado != "false") return message.reply({ embeds: [errorEmbed.setDescription('Seu cachorro já está alimentado.')] })

                if (farmDB.val().cereja < 15) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui cereja suficiente. São necessárias **15** cerejas.')] })
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/cereja`).transaction(n => n - Number(15))
                database.ref(`Global/${message.author.id}/Pets/cachorroAlimentado`).set("true")
                return message.reply({ embeds: [sucEmbed.setTitle('🍗 | Pet Alimentado').setDescription('Você alimentou seu pet com sucesso!')] })
            }

            if (pet == "GALINHA") {
                if (petsDB.val().galinha == "false") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui uma galinha.')] })
                if (petsDB.val().galinhaAlimentada != "false") return message.reply({ embeds: [errorEmbed.setDescription('Sua galinha já está alimentada.')] })

                if (farmDB.val().milho < 15) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui milho suficiente. São necessários **15** milhos.')] })
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/milho`).transaction(n => n - Number(15))
                database.ref(`Global/${message.author.id}/Pets/galinhaAlimentada`).set("true")
                return message.reply({ embeds: [sucEmbed.setTitle('🍗 | Pet Alimentado').setDescription('Você alimentou seu pet com sucesso!')] })
            }

            if (pet == "VACA") {
                if (petsDB.val().vaca == "false") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui uma vaca.')] })
                if (petsDB.val().vacaAlimentada != "false") return message.reply({ embeds: [errorEmbed.setDescription('Sua vaca já está alimentada.')] })

                if (farmDB.val().cenoura < 15) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui cenoura suficiente. São necessárias **15** cenouras.')] })
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/cenoura`).transaction(n => n - Number(15))
                database.ref(`Global/${message.author.id}/Pets/vacaAlimentada`).set("true")
                return message.reply({ embeds: [sucEmbed.setTitle('🍗 | Pet Alimentado').setDescription('Você alimentou seu pet com sucesso!')] })
            }

            if (pet == "PAPAGAIO") {
                if (petsDB.val().papagaio == "false") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui um papagaio.')] })
                if (petsDB.val().papagaioAlimentado != "false") return message.reply({ embeds: [errorEmbed.setDescription('Seu papagaio já está alimentado.')] })

                if (farmDB.val().tomate < 15) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui tomate suficiente. São necessários **15** tomates.')] })
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/tomate`).transaction(n => n - Number(15))
                database.ref(`Global/${message.author.id}/Pets/papagaioAlimentado`).set("true")
                return message.reply({ embeds: [sucEmbed.setTitle('🍗 | Pet Alimentado').setDescription('Você alimentou seu pet com sucesso!')] })
            }

            if (pet == "OVELHA") {
                if (petsDB.val().ovelha == "false") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui uma ovelha.')] })
                if (petsDB.val().ovelhaAlimentada != "false") return message.reply({ embeds: [errorEmbed.setDescription('Sua ovelha já está alimentada.')] })

                if (farmDB.val().tomate < 15) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui tomate suficiente. São necessários **15** tomates.')] })
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/tomate`).transaction(n => n - Number(15))
                database.ref(`Global/${message.author.id}/Pets/ovelhaAlimentada`).set("true")
                return message.reply({ embeds: [sucEmbed.setTitle('🍗 | Pet Alimentado').setDescription('Você alimentou seu pet com sucesso!')] })
            }

            if (pet == "PAVÃO" || pet == "PAVAO") {
                if (petsDB.val().pavao == "false") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui um pavão.')] })
                if (petsDB.val().pavaoAlimentado != "false") return message.reply({ embeds: [errorEmbed.setDescription('Seu pavão já está alimentado.')] })

                if (farmDB.val().batata < 15) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui batata suficiente. São necessárias **15** batatas.')] })
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/batata`).transaction(n => n - Number(15))
                database.ref(`Global/${message.author.id}/Pets/pavaoAlimentado`).set("true")
                return message.reply({ embeds: [sucEmbed.setTitle('🍗 | Pet Alimentado').setDescription('Você alimentou seu pet com sucesso!')] })
            }

            if (pet == "PORCO") {
                if (petsDB.val().porco == "false") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui um porco.')] })
                if (petsDB.val().porcoAlimentado != "false") return message.reply({ embeds: [errorEmbed.setDescription('Seu porco já está alimentado.')] })

                if (farmDB.val().milho < 15) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui milho suficiente. São necessários **15** milhos.')] })
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/milho`).transaction(n => n - Number(15))
                database.ref(`Global/${message.author.id}/Pets/porcoAlimentado`).set("true")
                return message.reply({ embeds: [sucEmbed.setTitle('🍗 | Pet Alimentado').setDescription('Você alimentou seu pet com sucesso!')] })
            }

            if (pet == "ABELHA") {
                if (petsDB.val().abelha == "false") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui uma abelha.')] })
                if (petsDB.val().abelhaAlimentada != "false") return message.reply({ embeds: [errorEmbed.setDescription('Sua abelha já está alimentada.')] })

                if (farmDB.val().melao < 15) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui melão suficiente. São necessários **15** melões.')] })
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/melao`).transaction(n => n - Number(15))
                database.ref(`Global/${message.author.id}/Pets/abelhaAlimentada`).set("true")
                return message.reply({ embeds: [sucEmbed.setTitle('🍗 | Pet Alimentado').setDescription('Você alimentou seu pet com sucesso!')] })
            }

            if (pet == "COELHO") {
                if (petsDB.val().coelho == "false") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui um coelho.')] })
                if (petsDB.val().coelhoAlimentado != "false") return message.reply({ embeds: [errorEmbed.setDescription('Seu coelho já está alimentado.')] })

                if (farmDB.val().melancia < 15) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui melancia suficiente. São necessárias **15** melancias.')] })
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/melancia`).transaction(n => n - Number(15))
                database.ref(`Global/${message.author.id}/Pets/coelhoAlimentado`).set("true")
                return message.reply({ embeds: [sucEmbed.setTitle('🍗 | Pet Alimentado').setDescription('Você alimentou seu pet com sucesso!')] })
            }

            if (pet == "PINGUIM") {
                if (petsDB.val().pinguim == "false") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui um pinguim.')] })
                if (petsDB.val().pinguimAlimentado != "false") return message.reply({ embeds: [errorEmbed.setDescription('Seu pinguim já está alimentado.')] })

                if (farmDB.val().melao < 15) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui melão suficiente. São necessários **15** melões.')] })
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/melao`).transaction(n => n - Number(15))
                database.ref(`Global/${message.author.id}/Pets/pinguimAlimentado`).set("true")
                return message.reply({ embeds: [sucEmbed.setTitle('🍗 | Pet Alimentado').setDescription('Você alimentou seu pet com sucesso!')] })
                }
            })
        }

        if (cmd == "buy") {

                let currentPage = 1
                let embed1 = new Discord.EmbedBuilder()
                    .setTitle('🐾 | Loja - Pets')
                    .setDescription(`🐶 **Cachorro**\n**Valor:** 50.000 ${emoji.moeda}`)
                    .setFooter({ text: 'cachorro' })
                    .setColor('#A0522D')

                let embed2 = new Discord.EmbedBuilder()
                    .setTitle('🐾 | Loja - Pets')
                    .setDescription(`🐔 **Galinha**\n**Valor:** 5.000 ${emoji.moeda}\n**Função:** produz ovos.`)
                    .setFooter({ text: 'galinha' })
                    .setColor('#A0522D')

                let embed3 = new Discord.EmbedBuilder()
                    .setTitle('🐾 | Loja - Pets')
                    .setDescription(`🐮 **Vaca**\n**Valor:** 7.500 ${emoji.moeda}\n**Função:** produz litros de leite.`)
                    .setFooter({ text: 'vaca' })
                    .setColor('#A0522D')

                let embed4 = new Discord.EmbedBuilder()
                    .setTitle('🐾 | Loja - Pets')
                    .setDescription(`🦜 **Papagaio**\n**Valor:** 50.000 ${emoji.moeda}\n**Função:** dobro de colheita na fazenda.`)
                    .setFooter({ text: 'papagaio' })
                    .setColor('#A0522D')

                let embed5 = new Discord.EmbedBuilder()
                    .setTitle('🐾 | Loja - Pets')
                    .setDescription(`🐑 **Ovelha**\n**Valor:** 12.000 ${emoji.moeda}\n**Função:** produz lã.`)
                    .setFooter({ text: 'ovelha' })
                    .setColor('#A0522D')

                let embed6 = new Discord.EmbedBuilder()
                    .setTitle('🐾 | Loja - Pets')
                    .setDescription(`🦚 **Pavão**\n**Valor:** 15.000 ${emoji.moeda}\n**Função:** produz penas.`)
                    .setFooter({ text: 'pavao' })
                    .setColor('#A0522D')

                let embed7 = new Discord.EmbedBuilder()
                    .setTitle('🐾 | Loja - Pets')
                    .setDescription(`🐖 **Porco**\n**Valor:** 30.0000 ${emoji.moeda}\n**Função:** produz bacon.`)
                    .setFooter({ text: 'porco' })
                    .setColor('#A0522D')

                let embed8 = new Discord.EmbedBuilder()
                    .setTitle('🐾 | Loja - Pets')
                    .setDescription(`🐝 **Abelha**\n**Valor:** 50.0000 ${emoji.moeda}\n**Função:** produz potes de mel.`)
                    .setFooter({ text: 'abelha' })
                    .setColor('#A0522D')

                let embed9 = new Discord.EmbedBuilder()
                    .setTitle('🐾 | Loja - Pets')
                    .setDescription(`🐇 **Coelho**\n**Valor:** 50.0000 ${emoji.moeda}\n**Função:** reduz o tempo da plantação na fazenda.`)
                    .setFooter({ text: 'coelho' })
                    .setColor('#A0522D')

                let embed10 = new Discord.EmbedBuilder()
                    .setTitle('🐾 | Loja - Pets')
                    .setDescription(`🐧 **Pinguim**\n**Valor:** 30.0000 ${emoji.moeda}`)
                    .setFooter({ text: 'pinguim' })
                    .setColor('#A0522D')

                // BOTÕES
                let button1 = new ButtonBuilder()
                .setCustomId('back')
                .setLabel('Anterior')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("👈")

            let button2 = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Próximo')
                .setStyle(ButtonStyle.Primary)
                .setEmoji("👉")

            let button3 = new ButtonBuilder()
                .setCustomId('delete')
                .setLabel('Excluir')
                .setStyle(ButtonStyle.Danger)
                .setEmoji("❌")

            let button4 = new ButtonBuilder()
                .setCustomId('buy')
                .setLabel('Comprar')
                .setStyle(ButtonStyle.Success)
                .setEmoji("✅")

            let row = new ActionRowBuilder()
                .addComponents(button1, button2, button3, button4);

                let s = await message.channel.send(`${message.author}`)
                let m = await message.channel.send({ embeds: [embed1], components: [row] })

                const filter = (button) => button.user.id === message.author.id;
                const collector = m.createMessageComponentCollector({ filter, time: 120000 });

                collector.on('collect', (collected) => {
                    if (collected.customId == "back") {
                        if (currentPage == 1) return
                        if (currentPage == 2) {
                            currentPage--
                            return m.edit({ embeds: [embed1] })
                        }
                        if (currentPage == 3) {
                            currentPage--
                            return m.edit({ embeds: [embed2] })
                        }
                        if (currentPage == 4) {
                            currentPage--
                            return m.edit({ embeds: [embed3] })
                        }
                        if (currentPage == 5) {
                            currentPage--
                            return m.edit({ embeds: [embed4] })
                        }
                        if (currentPage == 6) {
                            currentPage--
                            return m.edit({ embeds: [embed5] })
                        }
                        if (currentPage == 7) {
                            currentPage--
                            return m.edit({ embeds: [embed6] })
                        }
                        if (currentPage == 8) {
                            currentPage--
                            return m.edit({ embeds: [embed7] })
                        }
                        if (currentPage == 9) {
                            currentPage--
                            return m.edit({ embeds: [embed8] })
                        }
                        if (currentPage == 10) {
                            currentPage--
                            return m.edit({ embeds: [embed9] })
                        }
                    }

                    if (collected.customId == "next") {
                        if (currentPage == 1) {
                            currentPage++
                            return m.edit({ embeds: [embed2] })
                        }
                        if (currentPage == 2) {
                            currentPage++
                            return m.edit({ embeds: [embed3] })
                        }
                        if (currentPage == 3) {
                            currentPage++
                            return m.edit({ embeds: [embed4] })
                        }
                        if (currentPage == 4) {
                            currentPage++
                            return m.edit({ embeds: [embed5] })
                        }
                        if (currentPage == 5) {
                            currentPage++
                            return m.edit({ embeds: [embed6] })
                        }
                        if (currentPage == 6) {
                            currentPage++
                            return m.edit({ embeds: [embed7] })
                        }
                        if (currentPage == 7) {
                            currentPage++
                            return m.edit({ embeds: [embed8] })
                        }
                        if (currentPage == 8) {
                            currentPage++
                            return m.edit({ embeds: [embed9] })
                        }
                        if (currentPage == 9) {
                            currentPage++
                            return m.edit({ embeds: [embed10] })
                        }
                        if (currentPage == 10) return
                    }

                    if (collected.customId == "delete") {
                        s.delete()
                        m.delete()
                        return;
                    }

                    if (collected.customId == "buy") {
                        let pet = collected.message.embeds[0].data.footer.text
                            pet = pet.toUpperCase()

                        if (pet == "CACHORRO") {
                            if (petsDB.val().cachorro == 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você já possui um cachorro.')] })
                            if (memberDB.val().ouro < 50000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessário **50.000** ouros')] })
            
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(50000))
                            database.ref(`Global/${message.author.id}/Pets/cachorro`).set("true")
                            return message.reply({ embeds: [sucEmbed.setTitle('🏡 | Pet Comprado').setDescription(`Você comprou um **Cachorro** com sucesso!`)] })
                        }
            
                        if (pet == "GALINHA") {
                            if (petsDB.val().galinha == 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma galinha.')] })
                            if (memberDB.val().ouro < 5000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessário **5.000** ouros')] })
            
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(5000))
                            database.ref(`Global/${message.author.id}/Pets/galinha`).set("true")
                            return message.reply({ embeds: [sucEmbed.setTitle('🏡 | Pet Comprado').setDescription(`Você comprou uma **Galinha** com sucesso!`)] })
                        }
            
                        if (pet == "VACA") {
                            if (petsDB.val().vaca == 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma vaca.')] })
                            if (memberDB.val().ouro < 5000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessário **7.500** ouros')] })
            
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(7500))
                            database.ref(`Global/${message.author.id}/Pets/vaca`).set("true")
                            return message.reply({ embeds: [sucEmbed.setTitle('🏡 | Pet Comprado').setDescription(`Você comprou uma **Vaca** com sucesso!`)] })
                        }
            
                        if (pet == "PAPAGAIO") {
                            if (petsDB.val().papagaio == 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você já possui um papagaio.')] })
                            if (memberDB.val().ouro < 50000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessário **50.000** ouros')] })
            
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(50000))
                            database.ref(`Global/${message.author.id}/Pets/papagaio`).set("true")
                            return message.reply({ embeds: [sucEmbed.setTitle('🏡 | Pet Comprado').setDescription(`Você comprou um **Papagaio** com sucesso!`)] })
                        }
            
                        if (pet == "OVELHA") {
                            if (petsDB.val().ovelha == 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma ovelha.')] })
                            if (memberDB.val().ouro < 12000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessário **12.000** ouros')] })
            
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(12000))
                            database.ref(`Global/${message.author.id}/Pets/ovelha`).set("true")
                            return message.reply({ embeds: [sucEmbed.setTitle('🏡 | Pet Comprado').setDescription(`Você comprou uma **Ovelha** com sucesso!`)] })
                        }
            
                        if (pet == "PAVÃO" || pet == "PAVAO") {
                            if (petsDB.val().pavao == 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você já possui um pavão.')] })
                            if (memberDB.val().ouro < 15000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessário **15.000** ouros')] })
            
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(15000))
                            database.ref(`Global/${message.author.id}/Pets/pavao`).set("true")
                            return message.reply({ embeds: [sucEmbed.setTitle('🏡 | Pet Comprado').setDescription(`Você comprou um **Pavão** com sucesso!`)] })
                        }
            
                        if (pet == "PORCO") {
                            if (petsDB.val().porco == 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você já possui um porco.')] })
                            if (memberDB.val().ouro < 30000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessário **30.000** ouros')] })
            
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(30000))
                            database.ref(`Global/${message.author.id}/Pets/porco`).set("true")
                            return message.reply({ embeds: [sucEmbed.setTitle('🏡 | Pet Comprado').setDescription(`Você comprou um **Porco** com sucesso!`)] })
                        }
            
                        if (pet == "ABELHA") {
                            if (petsDB.val().abelha == 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma abelha.')] })
                            if (memberDB.val().ouro < 50000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessário **50.000** ouros')] })
            
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(50000))
                            database.ref(`Global/${message.author.id}/Pets/abelha`).set("true")
                            return message.reply({ embeds: [sucEmbed.setTitle('🏡 | Pet Comprado').setDescription(`Você comprou uma **Abelha** com sucesso!`)] })
                        }
            
                        if (pet == "COELHO") {
                            if (petsDB.val().coelho == 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você já possui um coelho.')] })
                            if (memberDB.val().ouro < 50000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessário **50.000** ouros')] })
            
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(50000))
                            database.ref(`Global/${message.author.id}/Pets/coelho`).set("true")
                            return message.reply({ embeds: [sucEmbed.setTitle('🏡 | Pet Comprado').setDescription(`Você comprou um **Coelho** com sucesso!`)] })
                        }
            
                        if (pet == "PINGUIM") {
                            if (petsDB.val().pinguim == 'true') return message.reply({ embeds: [errorEmbed.setDescription('Você já possui um pinguim.')] })
                            if (memberDB.val().ouro < 30000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessário **30.000** ouros')] })
            
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(30000))
                            database.ref(`Global/${message.author.id}/Pets/pinguim`).set("true")
                            return message.reply({ embeds: [sucEmbed.setTitle('🏡 | Pet Comprado').setDescription(`Você comprou um **Pinguim** com sucesso!`)] })
                        }
                    }
                });

            return;
        }

        if (cmd == "sell") {
            if (petsDB.val().Produzidos.bacon <= 0 && petsDB.val().Produzidos.la <= 0 && petsDB.val().Produzidos.leite <= 0 && petsDB.val().Produzidos.mel <= 0 && petsDB.val().Produzidos.ovo <= 0 && petsDB.val().Produzidos.pena <= 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nada para vender.')] })

            let ovos = petsDB.val().Produzidos.ovo > 0 ? `**${petsDB.val().Produzidos.mel}**` : "Nenhum"
            let leites = petsDB.val().Produzidos.leite > 0 ? `**${petsDB.val().Produzidos.leite}**` : "Nenhum"
            let las = petsDB.val().Produzidos.la > 0 ? `**${petsDB.val().Produzidos.la}**` : "Nenhum"
            let penas = petsDB.val().Produzidos.pena > 0 ? `**${petsDB.val().Produzidos.pena}**` : "Nenhum"
            let bacons = petsDB.val().Produzidos.bacon > 0 ? `**${petsDB.val().Produzidos.bacon}**` : "Nenhum"
            let mels = petsDB.val().Produzidos.mel > 0 ? `**${petsDB.val().Produzidos.mel}**` : "Nenhum"

            let vlrOvo = petsDB.val().Produzidos.ovo * 550
            let vlrLeite = petsDB.val().Produzidos.leite * 575
            let vlrLa = petsDB.val().Produzidos.la * 630
            let vlrPena = petsDB.val().Produzidos.pena * 1100
            let vlrBacon = petsDB.val().Produzidos.bacon * 3300
            let vlrMel = petsDB.val().Produzidos.mel * 3000

            let total = vlrOvo + vlrLeite + vlrLa + vlrPena + vlrBacon + vlrMel

            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(total))
            database.ref(`Global/${message.author.id}/Pets/Produzidos`).update({ ovo: 0, leite: 0, la: 0, pena: 0, bacon: 0, mel: 0 })
            return message.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle('🥩 | Venda de Produções')
                    .addFields(
                        { name: '🥚 Ovos', value: ovos, inline: true },
                        { name: '🥛 Litros de Leite', value: leites, inline: true },
                        { name: '🧶 Lãs', value: las, inline: true },
                        { name: '🪶 Penas', value: penas, inline: true },
                        { name: '🥓 Bacons', value: bacons, inline: true },
                        { name: '🍯 Potes de Mel', value: mels, inline: true }
                    )
                    .setFooter({ text: `Total: ${new Intl.NumberFormat('de-DE').format(total)} ouros` })
                    .setDescription('Veja a quantia de itens vendidos:')]
            })
        }

        if (cmd == "info") {
            let cooldownBrincar = 3600000;
            let cooldownProduzir = 7200000;

            // CACHORRO
            let emojiCachorro = petsDB.val().cachorro == "true" ? "🐶" : "❌"
            let fomeCachorro = petsDB.val().cachorroAlimentado == "true" ? "🍖" : "🍽️"
            let intCachorro = cooldownBrincar - (Date.now() - cooldownDB.val().cooldownCachorro) > 0 ? "💦" : "🥏"

            // GALINHA
            let emojiGalinha = petsDB.val().galinha == "true" ? "🐔" : "❌"
            let fomeGalinha = petsDB.val().galinhaAlimentada == "true" ? "🍖" : "🍽️"
            let intGalinha = cooldownProduzir - (Date.now() - cooldownDB.val().cooldownGalinha) > 0 ? "💦" : "🥚"

            // VACA
            let emojiVaca = petsDB.val().vaca == "true" ? "🐮" : "❌"
            let fomeVaca = petsDB.val().vacaAlimentada == "true" ? "🍖" : "🍽️"
            let intVaca = cooldownProduzir - (Date.now() - cooldownDB.val().cooldownVaca) > 0 ? "💦" : "🥛"

            // PAPAGAIO
            let emojiPapagaio = petsDB.val().papagaio == "true" ? "🦜" : "❌"
            let fomePapagaio = petsDB.val().papagaioAlimentado == "true" ? "🍖" : "🍽️"
            let intPapagaio = cooldownBrincar - (Date.now() - cooldownDB.val().cooldownPapagaio) > 0 ? "💦" : "🥏"

            // OVELHA
            let emojiOvelha = petsDB.val().ovelha == "true" ? "🐑" : "❌"
            let fomeOvelha = petsDB.val().ovelhaAlimentada == "true" ? "🍖" : "🍽️"
            let intOvelha = cooldownProduzir - (Date.now() - cooldownDB.val().cooldownOvelha) > 0 ? "💦" : "🧶"

            // PAVÃO
            let emojiPavao = petsDB.val().pavao == "true" ? "🦚" : "❌"
            let fomePavao = petsDB.val().pavaoAlimentado == "true" ? "🍖" : "🍽️"
            let intPavao = cooldownProduzir - (Date.now() - cooldownDB.val().cooldownPavao) > 0 ? "💦" : "🪶"

            // PORCO 
            let emojiPorco = petsDB.val().porco == "true" ? "🐷" : "❌"
            let fomePorco = petsDB.val().porcoAlimentado == "true" ? "🍖" : "🍽️"
            let intPorco = cooldownProduzir - (Date.now() - cooldownDB.val().cooldownPorco) > 0 ? "💦" : "🥓"

            // ABELHA
            let emojiAbelha = petsDB.val().abelha == "true" ? "🐝" : "❌"
            let fomeAbelha = petsDB.val().abelhaAlimentada == "true" ? "🍖" : "🍽️"
            let intAbelha = cooldownProduzir - (Date.now() - cooldownDB.val().cooldownAbelha) > 0 ? "💦" : "🍯"

            // COELHO 
            let emojiCoelho = petsDB.val().coelho == "true" ? "🐇" : "❌"
            let fomeCoelho = petsDB.val().coelhoAlimentado == "true" ? "🍖" : "🍽️"
            let intCoelho = cooldownBrincar - (Date.now() - cooldownDB.val().cooldownCoelho) > 0 ? "💦" : "🥏"

            // PINGUIM
            let emojiPinguim = petsDB.val().pinguim == "true" ? "🐧" : "❌"
            let fomePinguim = petsDB.val().pinguimAlimentado == "true" ? "🍖" : "🍽️"
            let intPinguim = cooldownBrincar - (Date.now() - cooldownDB.val().cooldownPinguim) > 0 ? "💦" : "🥏"

            message.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle('🐢 | Pets - Informações')
                    .setDescription(`${emojiGalinha} Galinha: ${fomeGalinha} ${intGalinha}\n${emojiVaca} Vaca: ${fomeVaca} ${intVaca}\n${emojiOvelha} Ovelha: ${fomeOvelha} ${intOvelha}\n${emojiPavao} Pavão: ${fomePavao} ${intPavao}\n${emojiPorco} Porco: ${fomePorco} ${intPorco}\n${emojiAbelha} Abelha: ${fomeAbelha} ${intAbelha}\n${emojiCachorro} Cachorro: ${fomeCachorro} ${intCachorro}\n${emojiPapagaio} Papagaio: ${fomePapagaio} ${intPapagaio}\n${emojiCoelho} Coelho: ${fomeCoelho} ${intCoelho}\n${emojiPinguim} Pinguim: ${fomePinguim} ${intPinguim}`)
                    .addFields([
                        { name: 'ㅤ', value: 'ㅤ', inline: true }, 
                        { name: 'ㅤ', value: 'ㅤ', inline: true }, 
                        { name: 'ㅤ', value: 'ㅤ', inline: true }, 
                        { name: '🥚 Ovos', value: `${petsDB.val().Produzidos.ovo}`, inline: true },
                        { name: '🥛 Litros de Leite', value: `${petsDB.val().Produzidos.leite}`, inline: true },
                        { name: '🧶 Lãs', value: `${petsDB.val().Produzidos.la}`, inline: true },
                        { name: '🪶 Penas', value: `${petsDB.val().Produzidos.pena}`, inline: true },
                        { name: '🥓 Bacons', value: `${petsDB.val().Produzidos.bacon}`, inline: true },
                        { name: '🍯 Potes de Mel', value: `${petsDB.val().Produzidos.mel}`, inline: true }
                    ])
                    .setColor('#43CD80')]
            })
        }
        })
    }
}