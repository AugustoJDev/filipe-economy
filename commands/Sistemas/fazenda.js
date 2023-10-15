const Discord = require("discord.js")
const ms = require("parse-ms")
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, ComponentType } = require("discord.js")
module.exports = {
    name: "fazenda",
    aliases: ["farm"],
    async execute(client, message, args, database) {

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let farmDB = await database.ref(`Global/${message.author.id}/Fazenda`).once('value')

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let neutEmbed = new Discord.EmbedBuilder()
            .setColor('#40C0FF')

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('fazenda')
					.setPlaceholder('Selecione uma categoria')
					.addOptions(
						{
							label: 'Arar',
							description: 'Are seus hectares',
							value: 'arar',
						},
						{
							label: 'Plantar',
							description: 'Realize plantações',
							value: 'plantar',
						},
						{
							label: 'Colher',
							description: 'Colha suas plantações',
							value: 'colher',
						},
						{
							label: 'Vender',
							description: 'Venda suas colheitas',
							value: 'vender',
						},
						{
							label: 'Loja',
							description: 'Veja a loja das plantações',
							value: 'loja',
						},
						{
							label: 'Info',
							description: 'Veja as informações da sua fazenda',
							value: 'info',
						}
					),
			);

            let msgMS = await message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle('🧑‍🌾 | Fazenda - Ajuda')
                    .setDescription('`arar` - Are seus hectares;\n`plantar` - Realize plantações;\n`colher` - Colha suas plantações;\n`loja` - Veja a loja da fazenda;\n`vender` - Venda suas colheitas;\n`info` - Veja as informações da sua fazenda.')
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

        let valH1 = farmDB.val().hectare1
        let valH2 = farmDB.val().hectare2
        let valH3 = farmDB.val().hectare3
        let valH4 = farmDB.val().hectare4
        let valH5 = farmDB.val().hectare5
        let valH6 = farmDB.val().hectare6
        let valH7 = farmDB.val().hectare7
        let valH8 = farmDB.val().hectare8

        if (cmd == "ARAR") {
            if (valH1 == "arado" && valH2 == "arado" && valH3 == "arado" && valH4 == "arado" && valH5 == "arado" && valH6 == "arado" && valH7 == "arado" && valH8 == "arado") return message.reply({ embeds: [errorEmbed.setDescription('Todos seus hectares já estão arados.')] })

            let hectaresParaArar = 0
            if (valH1 == "null") hectaresParaArar++
            if (valH2 == "null") hectaresParaArar++
            if (valH3 == "null") hectaresParaArar++
            if (valH4 == "null") hectaresParaArar++
            if (valH5 == "null") hectaresParaArar++
            if (valH6 == "null") hectaresParaArar++
            if (valH7 == "null") hectaresParaArar++
            if (valH8 == "null") hectaresParaArar++

            if (memberDB.val().ouro < hectaresParaArar * 250) return message.reply({ embeds: [errorEmbed.setDescription(`Você não possui ouro suficiente para arar. São necessários **${new Intl.NumberFormat('de-DE').format(hectaresParaArar * 250)}** ouros.`)] })
            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(hectaresParaArar * 250))

            if (valH1 == "null") {
                database.ref(`Global/${message.author.id}/Fazenda/hectare1`).set("arado")
            }

            if (valH2 == "null") {
                database.ref(`Global/${message.author.id}/Fazenda/hectare2`).set("arado")
            }

            if (valH3 == "null") {
                database.ref(`Global/${message.author.id}/Fazenda/hectare3`).set("arado")
            }

            if (valH4 == "null") {
                database.ref(`Global/${message.author.id}/Fazenda/hectare4`).set("arado")
            }

            if (valH5 == "null") {
                database.ref(`Global/${message.author.id}/Fazenda/hectare5`).set("arado")
            }

            if (valH6 == "null") {
                database.ref(`Global/${message.author.id}/Fazenda/hectare6`).set("arado")
            }

            if (valH7 == "null") {
                database.ref(`Global/${message.author.id}/Fazenda/hectare7`).set("arado")
            }

            if (valH8 == "null") {
                database.ref(`Global/${message.author.id}/Fazenda/hectare8`).set("arado")
            }

            return message.reply({ embeds: [sucEmbed.setTitle('🌵 | Hectares Arados').setDescription(`**${hectaresParaArar}** hectares foram arados!`)] })
        }

        if (cmd == "PLANTAR") {

            message.reply({ content: "Insira a semente para plantar e a quantidade de hectares: `milho 5`.\n\nSementes: `Milho`, `Cenoura`, `Cereja`, `Tomate`, `Batata`, `Manga`, `Melão`", ephemeral: true })
				.then(() => {
					
				message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
					.then(async collected => {

            let semente = collected.first().content.split(" ")[0].toLowerCase()
            let quantiaHec = parseInt(collected.first().content.split(" ")[1])
            if (!quantiaHec) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu o hectare.\n`<semente> <quantia de hectares>`')] })

            if (!["milho", "cenoura", "cereja", "tomate", "batata", "manga", "melao", "melão"].includes(semente)) return message.reply({ embeds: [errorEmbed.setDescription('Semente não encontrada.\nSementes: `Milho`, `Cenoura`, `Cereja`, `Tomate`, `Batata`, `Manga`, `Melão`')] })
            if (farmDB.val().hectare1 != "arado" && farmDB.val().hectare2 != "arado" && farmDB.val().hectare3 != "arado" && farmDB.val().hectare4 != "arado" && farmDB.val().hectare5 != "arado" && farmDB.val().hectare6 != "arado" && farmDB.val().hectare7 != "arado" && farmDB.val().hectare8 != "arado") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nenhum hectare arado.')] })

            if (semente) {
                if (semente == "melão") semente = "melao"

                let sementeWith = semente[0].toUpperCase() + semente.substr(1);
                let qntHect = 0;
                let plantados = 0;

                if (farmDB.val().hectare1 == "arado") qntHect++
                if (farmDB.val().hectare2 == "arado") qntHect++
                if (farmDB.val().hectare3 == "arado") qntHect++
                if (farmDB.val().hectare4 == "arado") qntHect++
                if (farmDB.val().hectare5 == "arado") qntHect++
                if (farmDB.val().hectare6 == "arado") qntHect++
                if (farmDB.val().hectare7 == "arado") qntHect++
                if (farmDB.val().hectare8 == "arado") qntHect++

                if (qntHect < quantiaHec) return message.reply({ embeds: [errorEmbed.setDescription(`Você não possui ${quantiaHec} hectares disponíveis.`)] })

                let qntSeed = quantiaHec * 3
                let seedDB = await database.ref(`Global/${message.author.id}/Fazenda/Sementes/semente${sementeWith}`).once('value')

                if (seedDB.val() < qntSeed) return message.reply({ embeds: [errorEmbed.setDescription(`Você não possui sementes suficiente. São necessárias **${qntSeed}** sementes.`)] })
                database.ref(`Global/${message.author.id}/Fazenda/Sementes/semente${sementeWith}`).transaction(n => n - Number(qntSeed))

                if (semente == "milho") {
                    cooldown = 4200000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 4200000 / 1.5
                }

                if (semente == "cenoura") {
                    cooldown = 6600000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 6600000 / 1.5
                }

                if (semente == "cereja") {
                    cooldown = 7800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 7800000 / 1.5
                }

                if (semente == "tomate") {
                    cooldown = 10800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 10800000 / 1.5
                }

                if (semente == "batata") {
                    cooldown = 5400000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 5400000 / 1.5
                }

                if (semente == "manga") {
                    cooldown = 9000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 9000000 / 1.5
                }

                if (semente == "melao") {
                    cooldown = 15000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 15000000 / 1.5
                }

                if (farmDB.val().hectare1 == "arado") {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare1`).set(semente)
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/cooldownHectare1`).set(Date.now())
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/delayHectare1`).set(cooldown)
                    plantados++

                    setTimeout(() => {
                        database.ref(`Global/${message.author.id}/Fazenda/hectare1`).set(`${semente}Pronto`)
                    }, cooldown);
                }

                if (plantados == quantiaHec) return message.reply({ embeds: [sucEmbed.setTitle('🌱 | Plantação Efetuada').setDescription(`Você plantou ${semente} em ${quantiaHec} hectares!`)] })

                if (farmDB.val().hectare2 == "arado") {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare2`).set(semente)
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/cooldownHectare2`).set(Date.now())
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/delayHectare2`).set(cooldown)
                    plantados++

                    setTimeout(() => {
                        database.ref(`Global/${message.author.id}/Fazenda/hectare2`).set(`${semente}Pronto`)
                    }, cooldown);
                }

                if (plantados == quantiaHec) return message.reply({ embeds: [sucEmbed.setTitle('🌱 | Plantação Efetuada').setDescription(`Você plantou ${semente} em ${quantiaHec} hectares!`)] })

                if (farmDB.val().hectare3 == "arado") {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare3`).set(semente)
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/cooldownHectare3`).set(Date.now())
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/delayHectare3`).set(cooldown)
                    plantados++

                    setTimeout(() => {
                        database.ref(`Global/${message.author.id}/Fazenda/hectare3`).set(`${semente}Pronto`)
                    }, cooldown);
                }

                if (plantados == quantiaHec) return message.reply({ embeds: [sucEmbed.setTitle('🌱 | Plantação Efetuada').setDescription(`Você plantou ${semente} em ${quantiaHec} hectares!`)] })

                if (farmDB.val().hectare4 == "arado") {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare4`).set(semente)
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/cooldownHectare4`).set(Date.now())
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/delayHectare4`).set(cooldown)
                    plantados++

                    setTimeout(() => {
                        database.ref(`Global/${message.author.id}/Fazenda/hectare4`).set(`${semente}Pronto`)
                    }, cooldown);
                }

                if (plantados == quantiaHec) return message.reply({ embeds: [sucEmbed.setTitle('🌱 | Plantação Efetuada').setDescription(`Você plantou ${semente} em ${quantiaHec} hectares!`)] })

                if (farmDB.val().hectare5 == "arado") {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare5`).set(semente)
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/cooldownHectare5`).set(Date.now())
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/delayHectare5`).set(cooldown)
                    plantados++

                    setTimeout(() => {
                        database.ref(`Global/${message.author.id}/Fazenda/hectare5`).set(`${semente}Pronto`)
                    }, cooldown);
                }

                if (plantados == quantiaHec) return message.reply({ embeds: [sucEmbed.setTitle('🌱 | Plantação Efetuada').setDescription(`Você plantou ${semente} em ${quantiaHec} hectares!`)] })

                if (farmDB.val().hectare6 == "arado") {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare6`).set(semente)
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/cooldownHectare6`).set(Date.now())
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/delayHectare6`).set(cooldown)
                    plantados++

                    setTimeout(() => {
                        database.ref(`Global/${message.author.id}/Fazenda/hectare6`).set(`${semente}Pronto`)
                    }, cooldown);
                }

                if (plantados == quantiaHec) return message.reply({ embeds: [sucEmbed.setTitle('🌱 | Plantação Efetuada').setDescription(`Você plantou ${semente} em ${quantiaHec} hectares!`)] })

                if (farmDB.val().hectare7 == "arado") {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare7`).set(semente)
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/cooldownHectare7`).set(Date.now())
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/delayHectare7`).set(cooldown)
                    plantados++

                    setTimeout(() => {
                        database.ref(`Global/${message.author.id}/Fazenda/hectare7`).set(`${semente}Pronto`)
                    }, cooldown);
                }

                if (plantados == quantiaHec) return message.reply({ embeds: [sucEmbed.setTitle('🌱 | Plantação Efetuada').setDescription(`Você plantou ${semente} em ${quantiaHec} hectares!`)] })

                if (farmDB.val().hectare8 == "arado") {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare8`).set(semente)
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/cooldownHectare8`).set(Date.now())
                    database.ref(`Global/${message.author.id}/Fazenda/Cooldown/delayHectare8`).set(cooldown)
                    plantados++

                    setTimeout(() => {
                        database.ref(`Global/${message.author.id}/Fazenda/hectare8`).set(`${semente}Pronto`)
                    }, cooldown);
                }

                if (plantados == quantiaHec) return message.reply({ embeds: [sucEmbed.setTitle('🌱 | Plantação Efetuada').setDescription(`Você plantou ${semente} em ${quantiaHec} hectares!`)] })
                    }
                })
            })
        }

        if (cmd == "COLHER") {

            if (!valH1.endsWith("Pronto") && !valH2.endsWith("Pronto") && !valH3.endsWith("Pronto") && !valH4.endsWith("Pronto") && !valH5.endsWith("Pronto") && !valH6.endsWith("Pronto") && !valH7.endsWith("Pronto") && !valH8.endsWith("Pronto")) return message.reply({ embeds: [errorEmbed.setDescription('Nenhum de seus hectares estão prontos para colheita.')] })

            let qntColhida = memberDB.val().Pets.papagaioAlimentado == "true" ? 12 : 6

            let hec1;
            let hec2;
            let hec3;
            let hec4;
            let hec5;
            let hec6;
            let hec7;
            let hec8;

            if (valH1.endsWith("Pronto")) {
                database.ref(`Global/${message.author.id}/Fazenda/hectare1`).set("null")
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/${valH1.slice(0, -6)}`).transaction(n => n + Number(qntColhida))
                let strPl = valH1.slice(0, -6)
                if (strPl == "melao") strPl = "melõe"

                let emojeh;
                if (strPl == "milho") emojeh = '🌽'
                if (strPl == "cenoura") emojeh = '🥕'
                if (strPl == "cereja") emojeh = '🍒'
                if (strPl == "tomate") emojeh = '🍅'
                if (strPl == "batata") emojeh = '🥔'
                if (strPl == "manga") emojeh = '🥭'
                if (strPl == "melõe") emojeh = '🍈'
                hec1 = `${emojeh} Hectare 1: \`${qntColhida}x\` ${strPl}s\n`
            }

            if (valH2.endsWith("Pronto")) {
                database.ref(`Global/${message.author.id}/Fazenda/hectare2`).set("null")
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/${valH2.slice(0, -6)}`).transaction(n => n + Number(qntColhida))
                let strPl = valH2.slice(0, -6)
                if (strPl == "melao") strPl = "melõe"

                let emojeh;
                if (strPl == "milho") emojeh = '🌽'
                if (strPl == "cenoura") emojeh = '🥕'
                if (strPl == "cereja") emojeh = '🍒'
                if (strPl == "tomate") emojeh = '🍅'
                if (strPl == "batata") emojeh = '🥔'
                if (strPl == "manga") emojeh = '🥭'
                if (strPl == "melõe") emojeh = '🍈'
                hec2 = `${emojeh} Hectare 2: \`${qntColhida}x\` ${strPl}s\n`
            }

            if (valH3.endsWith("Pronto")) {
                database.ref(`Global/${message.author.id}/Fazenda/hectare3`).set("null")
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/${valH3.slice(0, -6)}`).transaction(n => n + Number(qntColhida))
                let strPl = valH3.slice(0, -6)
                if (strPl == "melao") strPl = "melõe"

                let emojeh;
                if (strPl == "milho") emojeh = '🌽'
                if (strPl == "cenoura") emojeh = '🥕'
                if (strPl == "cereja") emojeh = '🍒'
                if (strPl == "tomate") emojeh = '🍅'
                if (strPl == "batata") emojeh = '🥔'
                if (strPl == "manga") emojeh = '🥭'
                if (strPl == "melõe") emojeh = '🍈'
                hec3 = `${emojeh} Hectare 3: \`${qntColhida}x\` ${strPl}s\n`
            }

            if (valH4.endsWith("Pronto")) {
                database.ref(`Global/${message.author.id}/Fazenda/hectare4`).set("null")
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/${valH4.slice(0, -6)}`).transaction(n => n + Number(qntColhida))
                let strPl = valH4.slice(0, -6)
                if (strPl == "melao") strPl = "melõe"

                let emojeh;
                if (strPl == "milho") emojeh = '🌽'
                if (strPl == "cenoura") emojeh = '🥕'
                if (strPl == "cereja") emojeh = '🍒'
                if (strPl == "tomate") emojeh = '🍅'
                if (strPl == "batata") emojeh = '🥔'
                if (strPl == "manga") emojeh = '🥭'
                if (strPl == "melõe") emojeh = '🍈'
                hec4 = `${emojeh} Hectare 4: \`${qntColhida}x\` ${strPl}s\n`
            }

            if (valH5.endsWith("Pronto")) {
                database.ref(`Global/${message.author.id}/Fazenda/hectare5`).set("null")
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/${valH5.slice(0, -6)}`).transaction(n => n + Number(qntColhida))
                let strPl = valH5.slice(0, -6)
                if (strPl == "melao") strPl = "melõe"

                let emojeh;
                if (strPl == "milho") emojeh = '🌽'
                if (strPl == "cenoura") emojeh = '🥕'
                if (strPl == "cereja") emojeh = '🍒'
                if (strPl == "tomate") emojeh = '🍅'
                if (strPl == "batata") emojeh = '🥔'
                if (strPl == "manga") emojeh = '🥭'
                if (strPl == "melõe") emojeh = '🍈'
                hec5 = `${emojeh} Hectare 5: \`${qntColhida}x\` ${strPl}s\n`
            }

            if (valH6.endsWith("Pronto")) {
                database.ref(`Global/${message.author.id}/Fazenda/hectare6`).set("null")
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/${valH6.slice(0, -6)}`).transaction(n => n + Number(qntColhida))
                let strPl = valH6.slice(0, -6)
                if (strPl == "melao") strPl = "melõe"

                let emojeh;
                if (strPl == "milho") emojeh = '🌽'
                if (strPl == "cenoura") emojeh = '🥕'
                if (strPl == "cereja") emojeh = '🍒'
                if (strPl == "tomate") emojeh = '🍅'
                if (strPl == "batata") emojeh = '🥔'
                if (strPl == "manga") emojeh = '🥭'
                if (strPl == "melõe") emojeh = '🍈'
                hec6 = `${emojeh} Hectare 6: \`${qntColhida}x\` ${strPl}s\n`
            }

            if (valH7.endsWith("Pronto")) {
                database.ref(`Global/${message.author.id}/Fazenda/hectare7`).set("null")
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/${valH7.slice(0, -6)}`).transaction(n => n + Number(qntColhida))
                let strPl = valH7.slice(0, -6)
                if (strPl == "melao") strPl = "melõe"

                let emojeh;
                if (strPl == "milho") emojeh = '🌽'
                if (strPl == "cenoura") emojeh = '🥕'
                if (strPl == "cereja") emojeh = '🍒'
                if (strPl == "tomate") emojeh = '🍅'
                if (strPl == "batata") emojeh = '🥔'
                if (strPl == "manga") emojeh = '🥭'
                if (strPl == "melõe") emojeh = '🍈'
                hec7 = `${emojeh} Hectare 7: \`${qntColhida}x\` ${strPl}s\n`
            }

            if (valH8.endsWith("Pronto")) {
                database.ref(`Global/${message.author.id}/Fazenda/hectare8`).set("null")
                database.ref(`Global/${message.author.id}/Fazenda/Produzidos/${valH8.slice(0, -6)}`).transaction(n => n + Number(qntColhida))
                let strPl = valH8.slice(0, -6)
                if (strPl == "melao") strPl = "melõe"

                let emojeh;
                if (strPl == "milho") emojeh = '🌽'
                if (strPl == "cenoura") emojeh = '🥕'
                if (strPl == "cereja") emojeh = '🍒'
                if (strPl == "tomate") emojeh = '🍅'
                if (strPl == "batata") emojeh = '🥔'
                if (strPl == "manga") emojeh = '🥭'
                if (strPl == "melõe") emojeh = '🍈'
                hec8 = `${emojeh} Hectare 8: \`${qntColhida}x\` ${strPl}s\n`
            }

            if (!hec1) hec1 = ""
            if (!hec2) hec2 = ""
            if (!hec3) hec3 = ""
            if (!hec4) hec4 = ""
            if (!hec5) hec5 = ""
            if (!hec6) hec6 = ""
            if (!hec7) hec7 = ""
            if (!hec8) hec8 = ""

            return message.reply({ embeds: [sucEmbed.setTitle('🌿 | Colheita Efetuada').setDescription(`Você colheu:\n${hec1}${hec2}${hec3}${hec4}${hec5}${hec6}${hec7}${hec8}`)] })
        }

        if (cmd == "LOJA") {
            if (!args[1]) {
                // EMBEDS
                let currentPage = 1
                let embed1 = new Discord.EmbedBuilder()
                    .setTitle('🌿 | Loja - Sementes')
                    .setDescription(`**🌽 | Milho:**\n**Preço:** 3 por 150 ${emoji.moeda}\n**Preço de Venda:** 1 por 28 ${emoji.moeda}\n**Duração:** 1 hora e 10 minutos`)
                    .setFooter({ text: 'Para comprar use: fazenda loja <tipo>'})
                    .setColor('#9ACD32')
                    .setFooter({ text: "milho" })

                let embed2 = new Discord.EmbedBuilder()
                    .setTitle('🌿 | Loja - Sementes')
                    .setDescription(`**🥕 | Cenoura:**\n**Preço:** 3 por 300 ${emoji.moeda}\n**Preço de Venda:** 1 por 60 ${emoji.moeda}\n**Duração:** 1 hora e 50 minutos`)
                    .setFooter({ text: 'Para comprar use: fazenda loja <tipo>'})
                    .setColor('#9ACD32')
                    .setFooter({ text: "cenoura" })

                let embed3 = new Discord.EmbedBuilder()
                    .setTitle('🌿 | Loja - Sementes')
                    .setDescription(`**🍒 | Cereja:**\n**Preço:** 3 por 450 ${emoji.moeda}\n**Preço de Venda:** 1 por 76 ${emoji.moeda}\n**Duração:** 2 horas e 10 minutos`)
                    .setFooter({ text: 'Para comprar use: fazenda loja <tipo>'})
                    .setColor('#9ACD32')
                    .setFooter({ text: "cereja" })

                let embed4 = new Discord.EmbedBuilder()
                    .setTitle('🌿 | Loja - Sementes')
                    .setDescription(`**🍅 | Tomate:**\n**Preço:** 3 por 500 ${emoji.moeda}\n**Preço de Venda:** 1 por 85 ${emoji.moeda}\n**Duração:** 3 horas`)
                    .setFooter({ text: 'Para comprar use: fazenda loja <tipo>'})
                    .setColor('#9ACD32')
                    .setFooter({ text: "tomate" })

                let embed5 = new Discord.EmbedBuilder()
                    .setTitle('🌿 | Loja - Sementes')
                    .setDescription(`**🥔 | Batata:**\n**Preço:** 3 por 1.000 ${emoji.moeda}\n**Preço de Venda:** 1 por 170 ${emoji.moeda}\n**Duração:** 1 hora e 30 minutos`)
                    .setFooter({ text: 'Para comprar use: fazenda loja <tipo>'})
                    .setColor('#9ACD32')
                    .setFooter({ text: "batata" })

                let embed6 = new Discord.EmbedBuilder()
                    .setTitle('🌿 | Loja - Sementes')
                    .setDescription(`**🥭 | Manga:**\n**Preço:** 3 por 1.250 ${emoji.moeda}\n**Preço de Venda:** 1 por 215 ${emoji.moeda}\n**Duração:** 2 horas e 30 minutos`)
                    .setFooter({ text: 'Para comprar use: fazenda loja <tipo>'})
                    .setColor('#9ACD32')
                    .setFooter({ text: "manga" })

                let embed7 = new Discord.EmbedBuilder()
                    .setTitle('🌿 | Loja - Sementes')
                    .setDescription(`**🍈 | Melão:**\n**Preço:** 3 por 2.000 ${emoji.moeda}\n**Preço de Venda:** 1 por 350 ${emoji.moeda}\n**Duração:** 4 horas e 10 minutos`)
                    .setFooter({ text: 'Para comprar use: fazenda loja <tipo>'})
                    .setColor('#9ACD32')
                    .setFooter({ text: "melao" })

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
                    }

                    if (collected.id == "next") {
                        if (currentPage == 1) {
                            currentPage++
                            return m.edit(embed2)
                        }
                        if (currentPage == 2) {
                            currentPage++
                            return m.edit(embed3)
                        }
                        if (currentPage == 3) {
                            currentPage++
                            return m.edit(embed4)
                        }
                        if (currentPage == 4) {
                            currentPage++
                            return m.edit(embed5)
                        }
                        if (currentPage == 5) {
                            currentPage++
                            return m.edit(embed6)
                        }
                        if (currentPage == 6) {
                            currentPage++
                            return m.edit(embed7)
                        }
                        if (currentPage == 7) return
                    }

                    if (collected.customId == "delete") {
                        s.delete()
                        m.delete()
                        return;
                    }

                    if (collected.customId == "buy") {

                        let tipo = collected.message.embeds[0].data.footer.text.toUpperCase()
                        let tipoM = tipo[0].toUpperCase() + tipo.slice(1).toLowerCase()

                        if (tipo == "MELÃO" || tipo == "MELAO") tipoM = "Melão"

                        if (tipo == "MILHO") sementeTipo = "sementeMilho", valorSemente = 150
                        if (tipo == "CENOURA") sementeTipo = "sementeCenoura", valorSemente = 300
                        if (tipo == "CEREJA") sementeTipo = "sementeCereja", valorSemente = 450
                        if (tipo == "TOMATE") sementeTipo = "sementeTomate", valorSemente = 500
                        if (tipo == "BATATA") sementeTipo = "sementeBatata", valorSemente = 1000
                        if (tipo == "MANGA") sementeTipo = "sementeManga", valorSemente = 1250
                        if (tipo == "MELÃO" || tipo == "MELAO") sementeTipo = "sementeMelao", valorSemente = 2000

                        if (tipo) {
                        if (memberDB.val().ouro < valorSemente) return message.reply({ embeds: [errorEmbed.setDescription(`Você não possui ouro suficiente. São necessários **${new Intl.NumberFormat('de-DE').format(valorSemente)}** ouros.`)] })
                            database.ref(`Global/${message.author.id}/Fazenda/Sementes/${sementeTipo}`).transaction(n => n + Number(3))
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(valorSemente))
                            
                            return message.reply({ embeds: [sucEmbed.setTitle('🌾 | Semente Comprada').setDescription(`Yeah! Você comprou 3 sementes de **${tipoM}** com sucesso`)] })
                        }       
                    }
                });
                return
            }
        }

        if (cmd == "VENDER") {
            message.reply('Fazer aqui, né!')

            /*     database.ref(`Global/${message.author.id}/Fazenda/Produzidos`).update({ milho: 0, cenoura: 0, cereja: 0, tomate: 0, batata: 0, manga: 0, melao: 0 })
                 database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(total))
                 m.removeAll()
                 return m.edit({
                     embed: new Discord.EmbedBuilder()
                         .setTitle('🌱 | Venda')
                         .setDescription(`🌽 \`${farmDB.val().Produzidos.milho}x Milhos\` - **${new Intl.NumberFormat('de-DE').format(vlrMilho)}** ouros\n🥕 \`${farmDB.val().Produzidos.cenoura}x Cenouras\` - **${new Intl.NumberFormat('de-DE').format(vlrCenoura)}** ouros\n🍒 \`${farmDB.val().Produzidos.cereja}x Cerejas\` - **${new Intl.NumberFormat('de-DE').format(vlrCereja)}** ouros\n🍅 \`${farmDB.val().Produzidos.tomate}x Tomates\` - **${new Intl.NumberFormat('de-DE').format(vlrTomate)}** ouros\n🥔 \`${farmDB.val().Produzidos.batata}x Batatas\` - **${new Intl.NumberFormat('de-DE').format(vlrBatata)}** ouros\n🥭 \`${farmDB.val().Produzidos.manga}x Mangas\` - **${new Intl.NumberFormat('de-DE').format(vlrManga)}** ouros\n🍈 \`${farmDB.val().Produzidos.melao}x Melões\` - **${new Intl.NumberFormat('de-DE').format(vlrMelao)}** ouros`)
                         .setColor('#9ACD32')
                         .setFooter(`Total: ${new Intl.NumberFormat('de-DE').format(total)} ouros`)
             }
             */

        }

        if (cmd == "INFO") {

            let timeHec1 = ms(farmDB.val().Cooldown.delayHectare1 - (Date.now() - farmDB.val().Cooldown.cooldownHectare1))
            let hoursHec1 = timeHec1.hours > 0 ? `${timeHec1.hours} horas,` : ""
            let minutesHec1 = timeHec1.minutes > 0 ? `${timeHec1.minutes} minutos e` : ""
            let secondsHec1 = timeHec1.seconds > 0 ? `${timeHec1.seconds} segundos` : ""
            if (timeHec1.hours <= 0 && timeHec1.minutes <= 0 && timeHec1.seconds <= 0) hoursHec1 = "Esperando colheita..."
            if (farmDB.val().hectare1 == "null") hoursHec1 = "Hectare vazio"
            if (farmDB.val().hectare1 == "arado") hoursHec1 = "Hectare arado"

            if (farmDB.val().hectare1 == "null") emojiHec1 = '💨', plantadoHec1 = ""
            if (farmDB.val().hectare1 == "arado") emojiHec1 = '🍃', plantadoHec1 = "💧"
            if (farmDB.val().hectare1 == "milho" || farmDB.val().hectare1 == "milhoPronto") emojiHec1 = '🌽', plantadoHec1 = "Milho"
            if (farmDB.val().hectare1 == "cenoura" || farmDB.val().hectare1 == "cenouraPronto") emojiHec1 = '🥕', plantadoHec1 = "Cenoura"
            if (farmDB.val().hectare1 == "cereja" || farmDB.val().hectare1 == "cerejaPronto") emojiHec1 = '🍒', plantadoHec1 = "Cereja"
            if (farmDB.val().hectare1 == "tomate" || farmDB.val().hectare1 == "tomatePronto") emojiHec1 = '🍅', plantadoHec1 = "Tomate"
            if (farmDB.val().hectare1 == "batata" || farmDB.val().hectare1 == "batataPronto") emojiHec1 = '🥔', plantadoHec1 = "Batata"
            if (farmDB.val().hectare1 == "manga" || farmDB.val().hectare1 == "mangaPronto") emojiHec1 = '🥭', plantadoHec1 = "Manga"
            if (farmDB.val().hectare1 == "melao" || farmDB.val().hectare1 == "melaoPronto") emojiHec1 = '🍈', plantadoHec1 = "Melão"

            let timeHec2 = ms(farmDB.val().Cooldown.delayHectare2 - (Date.now() - farmDB.val().Cooldown.cooldownHectare2))
            let hoursHec2 = timeHec2.hours > 0 ? `${timeHec2.hours} horas,` : ""
            let minutesHec2 = timeHec2.minutes > 0 ? `${timeHec2.minutes} minutos e` : ""
            let secondsHec2 = timeHec2.seconds > 0 ? `${timeHec2.seconds} segundos` : ""
            if (timeHec2.hours <= 0 && timeHec2.minutes <= 0 && timeHec2.seconds <= 0) hoursHec2 = "Esperando colheita..."
            if (farmDB.val().hectare2 == "null") hoursHec2 = "Hectare vazio"
            if (farmDB.val().hectare2 == "arado") hoursHec2 = "Hectare arado"

            if (farmDB.val().hectare2 == "null") emojiHec2 = '💨', plantadoHec2 = ""
            if (farmDB.val().hectare2 == "arado") emojiHec2 = '🍃', plantadoHec2 = "💧"
            if (farmDB.val().hectare2 == "milho" || farmDB.val().hectare2 == "milhoPronto") emojiHec2 = '🌽', plantadoHec2 = "Milho"
            if (farmDB.val().hectare2 == "cenoura" || farmDB.val().hectare2 == "cenouraPronto") emojiHec2 = '🥕', plantadoHec2 = "Cenoura"
            if (farmDB.val().hectare2 == "cereja" || farmDB.val().hectare2 == "cerejaPronto") emojiHec2 = '🍒', plantadoHec2 = "Cereja"
            if (farmDB.val().hectare2 == "tomate" || farmDB.val().hectare2 == "tomatePronto") emojiHec2 = '🍅', plantadoHec2 = "Tomate"
            if (farmDB.val().hectare2 == "batata" || farmDB.val().hectare2 == "batataPronto") emojiHec2 = '🥔', plantadoHec2 = "Batata"
            if (farmDB.val().hectare2 == "manga" || farmDB.val().hectare2 == "mangaPronto") emojiHec2 = '🥭', plantadoHec2 = "Manga"
            if (farmDB.val().hectare2 == "melao" || farmDB.val().hectare2 == "melaoPronto") emojiHec2 = '🍈', plantadoHec2 = "Melão"

            let timeHec3 = ms(farmDB.val().Cooldown.delayHectare3 - (Date.now() - farmDB.val().Cooldown.cooldownHectare3))
            let hoursHec3 = timeHec3.hours > 0 ? `${timeHec3.hours} horas,` : ""
            let minutesHec3 = timeHec3.minutes > 0 ? `${timeHec3.minutes} minutos e` : ""
            let secondsHec3 = timeHec3.seconds > 0 ? `${timeHec3.seconds} segundos` : ""
            if (timeHec3.hours <= 0 && timeHec3.minutes <= 0 && timeHec3.seconds <= 0) hoursHec3 = "Esperando colheita..."
            if (farmDB.val().hectare3 == "null") hoursHec3 = "Hectare vazio"
            if (farmDB.val().hectare3 == "arado") hoursHec3 = "Hectare arado"

            if (farmDB.val().hectare3 == "null") emojiHec3 = '💨', plantadoHec3 = ""
            if (farmDB.val().hectare3 == "arado") emojiHec3 = '🍃', plantadoHec3 = "💧"
            if (farmDB.val().hectare3 == "milho" || farmDB.val().hectare3 == "milhoPronto") emojiHec3 = '🌽', plantadoHec3 = "Milho"
            if (farmDB.val().hectare3 == "cenoura" || farmDB.val().hectare3 == "cenouraPronto") emojiHec3 = '🥕', plantadoHec3 = "Cenoura"
            if (farmDB.val().hectare3 == "cereja" || farmDB.val().hectare3 == "cerejaPronto") emojiHec3 = '🍒', plantadoHec3 = "Cereja"
            if (farmDB.val().hectare3 == "tomate" || farmDB.val().hectare3 == "tomatePronto") emojiHec3 = '🍅', plantadoHec3 = "Tomate"
            if (farmDB.val().hectare3 == "batata" || farmDB.val().hectare3 == "batataPronto") emojiHec3 = '🥔', plantadoHec3 = "Batata"
            if (farmDB.val().hectare3 == "manga" || farmDB.val().hectare3 == "mangaPronto") emojiHec3 = '🥭', plantadoHec3 = "Manga"
            if (farmDB.val().hectare3 == "melao" || farmDB.val().hectare3 == "melaoPronto") emojiHec3 = '🍈', plantadoHec3 = "Melão"

            let timeHec4 = ms(farmDB.val().Cooldown.delayHectare4 - (Date.now() - farmDB.val().Cooldown.cooldownHectare4))
            let hoursHec4 = timeHec4.hours > 0 ? `${timeHec4.hours} horas,` : ""
            let minutesHec4 = timeHec4.minutes > 0 ? `${timeHec4.minutes} minutos e` : ""
            let secondsHec4 = timeHec4.seconds > 0 ? `${timeHec4.seconds} segundos` : ""
            if (timeHec4.hours <= 0 && timeHec4.minutes <= 0 && timeHec4.seconds <= 0) hoursHec4 = "Esperando colheita..."
            if (farmDB.val().hectare4 == "null") hoursHec4 = "Hectare vazio"
            if (farmDB.val().hectare4 == "arado") hoursHec4 = "Hectare arado"

            if (farmDB.val().hectare4 == "null") emojiHec4 = '💨', plantadoHec4 = ""
            if (farmDB.val().hectare4 == "arado") emojiHec4 = '🍃', plantadoHec4 = "💧"
            if (farmDB.val().hectare4 == "milho" || farmDB.val().hectare4 == "milhoPronto") emojiHec4 = '🌽', plantadoHec4 = "Milho"
            if (farmDB.val().hectare4 == "cenoura" || farmDB.val().hectare4 == "cenouraPronto") emojiHec4 = '🥕', plantadoHec4 = "Cenoura"
            if (farmDB.val().hectare4 == "cereja" || farmDB.val().hectare4 == "cerejaPronto") emojiHec4 = '🍒', plantadoHec4 = "Cereja"
            if (farmDB.val().hectare4 == "tomate" || farmDB.val().hectare4 == "tomatePronto") emojiHec4 = '🍅', plantadoHec4 = "Tomate"
            if (farmDB.val().hectare4 == "batata" || farmDB.val().hectare4 == "batataPronto") emojiHec4 = '🥔', plantadoHec4 = "Batata"
            if (farmDB.val().hectare4 == "manga" || farmDB.val().hectare4 == "mangaPronto") emojiHec4 = '🥭', plantadoHec4 = "Manga"
            if (farmDB.val().hectare4 == "melao" || farmDB.val().hectare4 == "melaoPronto") emojiHec4 = '🍈', plantadoHec4 = "Melão"

            let timeHec5 = ms(farmDB.val().Cooldown.delayHectare5 - (Date.now() - farmDB.val().Cooldown.cooldownHectare5))
            let hoursHec5 = timeHec5.hours > 0 ? `${timeHec5.hours} horas,` : ""
            let minutesHec5 = timeHec5.minutes > 0 ? `${timeHec5.minutes} minutos e` : ""
            let secondsHec5 = timeHec5.seconds > 0 ? `${timeHec5.seconds} segundos` : ""
            if (timeHec5.hours <= 0 && timeHec5.minutes <= 0 && timeHec5.seconds <= 0) hoursHec5 = "Esperando colheita..."
            if (farmDB.val().hectare5 == "null") hoursHec5 = "Hectare vazio"
            if (farmDB.val().hectare5 == "arado") hoursHec5 = "Hectare arado"

            if (farmDB.val().hectare5 == "null") emojiHec5 = '💨', plantadoHec5 = ""
            if (farmDB.val().hectare5 == "arado") emojiHec5 = '🍃', plantadoHec5 = "💧"
            if (farmDB.val().hectare5 == "milho" || farmDB.val().hectare5 == "milhoPronto") emojiHec5 = '🌽', plantadoHec5 = "Milho"
            if (farmDB.val().hectare5 == "cenoura" || farmDB.val().hectare5 == "cenouraPronto") emojiHec5 = '🥕', plantadoHec5 = "Cenoura"
            if (farmDB.val().hectare5 == "cereja" || farmDB.val().hectare5 == "cerejaPronto") emojiHec5 = '🍒', plantadoHec5 = "Cereja"
            if (farmDB.val().hectare5 == "tomate" || farmDB.val().hectare5 == "tomatePronto") emojiHec5 = '🍅', plantadoHec5 = "Tomate"
            if (farmDB.val().hectare5 == "batata" || farmDB.val().hectare5 == "batataPronto") emojiHec5 = '🥔', plantadoHec5 = "Batata"
            if (farmDB.val().hectare5 == "manga" || farmDB.val().hectare5 == "mangaPronto") emojiHec5 = '🥭', plantadoHec5 = "Manga"
            if (farmDB.val().hectare5 == "melao" || farmDB.val().hectare5 == "melaoPronto") emojiHec5 = '🍈', plantadoHec5 = "Melão"

            let timeHec6 = ms(farmDB.val().Cooldown.delayHectare6 - (Date.now() - farmDB.val().Cooldown.cooldownHectare6))
            let hoursHec6 = timeHec6.hours > 0 ? `${timeHec6.hours} horas,` : ""
            let minutesHec6 = timeHec6.minutes > 0 ? `${timeHec6.minutes} minutos e` : ""
            let secondsHec6 = timeHec6.seconds > 0 ? `${timeHec6.seconds} segundos` : ""
            if (timeHec6.hours <= 0 && timeHec6.minutes <= 0 && timeHec6.seconds <= 0) hoursHec6 = "Esperando colheita..."
            if (farmDB.val().hectare6 == "null") hoursHec6 = "Hectare vazio"
            if (farmDB.val().hectare6 == "arado") hoursHec6 = "Hectare arado"

            if (farmDB.val().hectare6 == "null") emojiHec6 = '💨', plantadoHec6 = ""
            if (farmDB.val().hectare6 == "arado") emojiHec6 = '🍃', plantadoHec6 = "💧"
            if (farmDB.val().hectare6 == "milho" || farmDB.val().hectare6 == "milhoPronto") emojiHec6 = '🌽', plantadoHec6 = "Milho"
            if (farmDB.val().hectare6 == "cenoura" || farmDB.val().hectare6 == "cenouraPronto") emojiHec6 = '🥕', plantadoHec6 = "Cenoura"
            if (farmDB.val().hectare6 == "cereja" || farmDB.val().hectare6 == "cerejaPronto") emojiHec6 = '🍒', plantadoHec6 = "Cereja"
            if (farmDB.val().hectare6 == "tomate" || farmDB.val().hectare6 == "tomatePronto") emojiHec6 = '🍅', plantadoHec6 = "Tomate"
            if (farmDB.val().hectare6 == "batata" || farmDB.val().hectare6 == "batataPronto") emojiHec6 = '🥔', plantadoHec6 = "Batata"
            if (farmDB.val().hectare6 == "manga" || farmDB.val().hectare6 == "mangaPronto") emojiHec6 = '🥭', plantadoHec6 = "Manga"
            if (farmDB.val().hectare6 == "melao" || farmDB.val().hectare6 == "melaoPronto") emojiHec6 = '🍈', plantadoHec6 = "Melão"

            let timeHec7 = ms(farmDB.val().Cooldown.delayHectare7 - (Date.now() - farmDB.val().Cooldown.cooldownHectare7))
            let hoursHec7 = timeHec7.hours > 0 ? `${timeHec7.hours} horas,` : ""
            let minutesHec7 = timeHec7.minutes > 0 ? `${timeHec7.minutes} minutos e` : ""
            let secondsHec7 = timeHec7.seconds > 0 ? `${timeHec7.seconds} segundos` : ""
            if (timeHec7.hours <= 0 && timeHec7.minutes <= 0 && timeHec7.seconds <= 0) hoursHec7 = "Esperando colheita..."
            if (farmDB.val().hectare7 == "null") hoursHec7 = "Hectare vazio"
            if (farmDB.val().hectare7 == "arado") hoursHec7 = "Hectare arado"

            if (farmDB.val().hectare7 == "null") emojiHec7 = '💨', plantadoHec7 = ""
            if (farmDB.val().hectare7 == "arado") emojiHec7 = '🍃', plantadoHec7 = "💧"
            if (farmDB.val().hectare7 == "milho" || farmDB.val().hectare7 == "milhoPronto") emojiHec7 = '🌽', plantadoHec7 = "Milho"
            if (farmDB.val().hectare7 == "cenoura" || farmDB.val().hectare7 == "cenouraPronto") emojiHec7 = '🥕', plantadoHec7 = "Cenoura"
            if (farmDB.val().hectare7 == "cereja" || farmDB.val().hectare7 == "cerejaPronto") emojiHec7 = '🍒', plantadoHec7 = "Cereja"
            if (farmDB.val().hectare7 == "tomate" || farmDB.val().hectare7 == "tomatePronto") emojiHec7 = '🍅', plantadoHec7 = "Tomate"
            if (farmDB.val().hectare7 == "batata" || farmDB.val().hectare7 == "batataPronto") emojiHec7 = '🥔', plantadoHec7 = "Batata"
            if (farmDB.val().hectare7 == "manga" || farmDB.val().hectare7 == "mangaPronto") emojiHec7 = '🥭', plantadoHec7 = "Manga"
            if (farmDB.val().hectare7 == "melao" || farmDB.val().hectare7 == "melaoPronto") emojiHec7 = '🍈', plantadoHec7 = "Melão"

            let timeHec8 = ms(farmDB.val().Cooldown.delayHectare8 - (Date.now() - farmDB.val().Cooldown.cooldownHectare8))
            let hoursHec8 = timeHec8.hours > 0 ? `${timeHec8.hours} horas,` : ""
            let minutesHec8 = timeHec8.minutes > 0 ? `${timeHec8.minutes} minutos e` : ""
            let secondsHec8 = timeHec8.seconds > 0 ? `${timeHec8.seconds} segundos` : ""
            if (timeHec8.hours <= 0 && timeHec8.minutes <= 0 && timeHec8.seconds <= 0) hoursHec8 = "Esperando colheita..."
            if (farmDB.val().hectare8 == "null") hoursHec8 = "Hectare vazio"
            if (farmDB.val().hectare8 == "arado") hoursHec8 = "Hectare arado"

            if (farmDB.val().hectare8 == "null") emojiHec8 = '💨', plantadoHec8 = ""
            if (farmDB.val().hectare8 == "arado") emojiHec8 = '🍃', plantadoHec8 = "💧"
            if (farmDB.val().hectare8 == "milho" || farmDB.val().hectare8 == "milhoPronto") emojiHec8 = '🌽', plantadoHec8 = "Milho"
            if (farmDB.val().hectare8 == "cenoura" || farmDB.val().hectare8 == "cenouraPronto") emojiHec8 = '🥕', plantadoHec8 = "Cenoura"
            if (farmDB.val().hectare8 == "cereja" || farmDB.val().hectare8 == "cerejaPronto") emojiHec8 = '🍒', plantadoHec8 = "Cereja"
            if (farmDB.val().hectare8 == "tomate" || farmDB.val().hectare8 == "tomatePronto") emojiHec8 = '🍅', plantadoHec8 = "Tomate"
            if (farmDB.val().hectare8 == "batata" || farmDB.val().hectare8 == "batataPronto") emojiHec8 = '🥔', plantadoHec8 = "Batata"
            if (farmDB.val().hectare8 == "manga" || farmDB.val().hectare8 == "mangaPronto") emojiHec8 = '🥭', plantadoHec8 = "Manga"
            if (farmDB.val().hectare8 == "melao" || farmDB.val().hectare8 == "melaoPronto") emojiHec8 = '🍈', plantadoHec8 = "Melão"

            message.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle('🫒 | Informações - Fazenda')
                    .addFields(
                        { name: `${emojiHec1} **Hectare 1:**`, value: `Plantado: ${plantadoHec1}\nSituação: ${hoursHec1} ${minutesHec1} ${secondsHec1}`, inline: true },
                        { name: `${emojiHec2} **Hectare 2:**`, value: `Plantado: ${plantadoHec2}\nSituação: ${hoursHec2} ${minutesHec2} ${secondsHec2}`, inline: true },
                        { name: `${emojiHec3} **Hectare 3:**`, value: `Plantado: ${plantadoHec3}\nSituação: ${hoursHec3} ${minutesHec3} ${secondsHec3}`, inline: true },
                        { name: `${emojiHec4} **Hectare 4:**`, value: `Plantado: ${plantadoHec4}\nSituação: ${hoursHec4} ${minutesHec4} ${secondsHec4}`, inline: true },
                        { name: `${emojiHec5} **Hectare 5:**`, value: `Plantado: ${plantadoHec5}\nSituação: ${hoursHec5} ${minutesHec5} ${secondsHec5}`, inline: true },
                        { name: `${emojiHec6} **Hectare 6:**`, value: `Plantado: ${plantadoHec6}\nSituação: ${hoursHec6} ${minutesHec6} ${secondsHec6}`, inline: true },
                        { name: `${emojiHec7} **Hectare 7:**`, value: `Plantado: ${plantadoHec7}\nSituação: ${hoursHec7} ${minutesHec7} ${secondsHec7}`, inline: true },
                        { name: `${emojiHec8} **Hectare 8:**`, value: `Plantado: ${plantadoHec8}\nSituação: ${hoursHec8} ${minutesHec8} ${secondsHec8}`, inline: true },
                        //  { name: `❌ **Hectare 9:**`, value: `Plantado: ${plantadoHec8}\nSituação: Hectare bloqueado`, inline: true },
                        // { name: `❌ **Hectare 10:**`, value: `Plantado: ${plantadoHec8}\nSituação: Hectare bloqueado`, inline: true },
                    )
                    .setColor('#7CCD7C')]
                })
            }
        })
    }
}