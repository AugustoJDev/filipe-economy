const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
module.exports = {
    name: "mochila",
    aliases: ["bag", "bolsa", "inv", "inventario", "inventário"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')
            .setTimestamp()
            .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}`})

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')
            .setTimestamp()
            .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}`})

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let facDB = await database.ref(`Global/${message.author.id}/Fabrica`).once('value')
        let farmDB = await database.ref(`Global/${message.author.id}/Fazenda`).once('value')

        if (!args[0]) {
            let mochila;
            if (memberDB.val() == null || memberDB.val().mochila == null) mochila = "Nenhuma"
            if (memberDB.val().mochila == 1) mochila = "Muito Pequena"
            if (memberDB.val().mochila == 2) mochila = "Pequena"
            if (memberDB.val().mochila == 3) mochila = "Média"
            if (memberDB.val().mochila == 4) mochila = "Grande"
            if (memberDB.val().mochila == 5) mochila = "Gigante"

            let haveCofre = memberDB.val().cofre == "true" ? "`1x` Cofre" : ""
            let iRoubo = 0
            let haveIRoubo1 = memberDB.val().itemRoubo1 == "true" ? iRoubo++ : ""
            let haveIRoubo2 = memberDB.val().itemRoubo2 == "true" ? iRoubo++ : ""
            let iRoubom = iRoubo > 0 ? `\`${iRoubo}x\` Itens para Roubo` : ""

            let iRouboCofre = 0
            let haveIRouboCofre1 = memberDB.val().itemRCofre1 == "true" ? iRouboCofre++ : ""
            let haveIRouboCofre2 = memberDB.val().itemRCofre2 == "true" ? iRouboCofre++ : ""
            let iRouboCm = iRouboCofre > 0 ? `\`${iRouboCofre}x\` Itens para Roubo de Cofre` : ""

            let semMilho = farmDB.val().Produzidos.milho > 0 && farmDB.val().Sementes.sementeMilho > 0 ? `Milho: ${farmDB.val().Produzidos.milho} | Sementes: ${farmDB.val().Sementes.sementeMilho}` : ""
            let semCenoura = farmDB.val().Produzidos.cenoura > 0 && farmDB.val().Sementes.cenoura > 0 ? `Cenoura: ${farmDB.val().Produzidos.cenoura} | Sementes: ${farmDB.val().Sementes.sementeCenoura}` : ""
            let semCereja = farmDB.val().Produzidos.cereja > 0 && farmDB.val().Sementes.sementeCereja > 0 ? `Cereja: ${farmDB.val().Produzidos.cereja} | Sementes: ${farmDB.val().Sementes.sementeCereja}` : ""
            let semTomate = farmDB.val().Produzidos.tomate > 0 && farmDB.val().Sementes.sementeTomate > 0 ? `Tomate: ${farmDB.val().Produzidos.tomate} | Sementes: ${farmDB.val().Sementes.sementeTomate}` : ""
            let semBatata = farmDB.val().Produzidos.batata > 0 && farmDB.val().Sementes.sementeBatata > 0 ? `Batata: ${farmDB.val().Produzidos.batata} | Sementes: ${farmDB.val().Sementes.sementeBatata}` : ""
            let semManga = farmDB.val().Produzidos.manga > 0 && farmDB.val().Sementes.sementeManga > 0 ? `Manga: ${farmDB.val().Produzidos.manga} | Sementes: ${farmDB.val().Sementes.sementeManga}` : ""
            let semMelao = farmDB.val().Produzidos.melao > 0 && farmDB.val().Sementes.sementeMelao > 0 ? `Melão: ${farmDB.val().Produzidos.melao} | Sementes: ${farmDB.val().Sementes.sementeMelao}` : ""

            let fabMadeira = facDB.val().madeira > 0 ? `Madeira: ${facDB.val().madeira}` : ""
            let fabFerro = facDB.val().ferro > 0 ? `Ferro: ${facDB.val().ferro}` : ""
            let fabAco = facDB.val().aco > 0 ? `Aço: ${facDB.val().aco}` : ""
            let fabVidro = facDB.val().vidro > 0 ? `Vidro: ${facDB.val().vidro}` : ""
            let fabAluminio = facDB.val().aluminio > 0 ? `Alumínio: ${facDB.val().aluminio}` : ""

            let currentPage = 1

            // EMBEDS
            let embed1 = new Discord.EmbedBuilder()
                .setTitle('Sua Mochila')
                .setDescription(`\`Mochila:\` ${mochila}\n\n**Itens:**${haveCofre}\n${iRoubom}\n${iRouboCm}`)
                .setThumbnail('https://i.ibb.co/tmft2Bb/1123123.png')
                .setColor('#FFAEB9')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}`})

            let embed2 = new Discord.EmbedBuilder()
                .setTitle('Sua Mochila')
                .setDescription(`\`Mochila:\` ${mochila}\n\n**Itens de Fábrica:**\n${fabMadeira}\n${fabFerro}\n${fabAco}\n${fabVidro}\n${fabAluminio}`)
                .setThumbnail('https://images.vexels.com/media/users/3/205995/isolated/preview/bfe92fd4e97cc2db623d85942b26db30-desenho-de-mochila-bonito.png')
                .setColor('#FFAEB9')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}`})

            let embed3 = new Discord.EmbedBuilder()
                .setTitle('Sua Mochila')
                .setDescription(`\`Mochila:\` ${mochila}\n\n**Itens da Fazenda:**\n${semMilho}\n${semCenoura}\n${semCereja}\n${semTomate}\n${semBatata}\n${semManga}\n${semMelao}`)
                .setThumbnail('https://images.vexels.com/media/users/3/205995/isolated/preview/bfe92fd4e97cc2db623d85942b26db30-desenho-de-mochila-bonito.png')
                .setColor('#FFAEB9')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}`})

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

            let row = new ActionRowBuilder()
                .addComponents(button1, button2, button3);

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
                    if (currentPage == 3) return
                }
                if (collected.customId == "delete") {
                    s.delete()
                    m.delete()
                    return;
                }
            });
            return;
        }

        let cmd = args[0].toUpperCase()

        if (cmd == "COMPRAR") {
            if (!args[1]) return message.reply({
                embed: new Discord.EmbedBuilder()
                    .setTitle('🎒 | Loja - Mochilas')
                    .addFields(
                        { name: '**2- Pequena**', value: '100 itens de cada\n10.000 ouros', inline: true },
                        { name: '**3- Média**', value: '200 itens de cada\n25.000 ouros', inline: true },
                        { name: '**4- Grande**', value: '300 itens de cada\n40.000 ouros', inline: true },
                        { name: '**5- Gigante**', value: '400 itens de cada\n100.000 ouros', inline: true }
                    )
                    .setColor('#DB7093')
                    .setFooter({ text: 'Para comprar use: t.mochila comprar <id>' })
            })

            let idM = parseInt(args[1])
            if (idM == "2") {
                if (memberDB.val() == null) return
                if (memberDB.val().ouro < 10000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessários **10.000** ouros.')] })
                if (memberDB.val().mochila >= 2) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui a mochila **Pequena** ou outra melhor.')] })

                database.ref(`Global/${message.author.id}`).update({ mochila: 2, ouro: Number(memberDB.val().ouro) - Number(10000) })
                return message.reply({ embeds: [sucEmbed.setTitle('🎒 | Mochila Adquirida').setDescription('Boa! Você comprou a mochila **Pequena** com sucesso!')] })
            }

            if (idM == "3") {
                if (memberDB.val() == null) return
                if (memberDB.val().ouro < 25000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessários **25.000** ouros.')] })
                if (memberDB.val().mochila >= 3) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui a mochila **Média** ou outra melhor.')] })

                database.ref(`Global/${message.author.id}`).update({ mochila: 3, ouro: Number(memberDB.val().ouro) - Number(25000) })
                return message.reply({ embeds: [sucEmbed.setTitle('🎒 | Mochila Adquirida').setDescription('Boa! Você comprou a mochila **Média** com sucesso!')] })
            }

            if (idM == "4") {
                if (memberDB.val() == null) return
                if (memberDB.val().ouro < 40000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessários **40.000** ouros.')] })
                if (memberDB.val().mochila >= 4) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui a mochila **Grande** ou outra melhor.')] })

                database.ref(`Global/${message.author.id}`).update({ mochila: 4, ouro: Number(memberDB.val().ouro) - Number(40000) })
                return message.reply({ embeds: [sucEmbed.setTitle('🎒 | Mochila Adquirida').setDescription('Boa! Você comprou a mochila **Grande** com sucesso!')] })
            }

            if (idM == "4") {
                if (memberDB.val() == null) return
                if (memberDB.val().ouro < 100000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessários **100.000** ouros.')] })
                if (memberDB.val().mochila >= 5) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui a mochila **Gigante**.')] })

                database.ref(`Global/${message.author.id}`).update({ mochila: 5, ouro: Number(memberDB.val().ouro) - Number(100000) })
                return message.reply({ embeds: [sucEmbed.setTitle('🎒 | Mochila Adquirida').setDescription('Boa! Você comprou a mochila **Gigante** com sucesso!')] })
            } else return message.reply({ embeds: [errorEmbed.setDescription('ID não encontrado.')] })
        }

    }
}