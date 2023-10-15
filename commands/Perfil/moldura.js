const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    name: "moldura",
    aliases: [],
    async execute(client, message, args, database) {
        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let invBDB = await database.ref(`Global/${message.author.id}/Perfil`).once('value')

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        const molduras = [
            {
                titulo: "Galaxy",
                valor: "1.000",
                image: "https://i.imgur.com/cPu6EaZ.png",
                color: "#D02090"
            },
            {
                titulo: "Nature",
                valor: "2.500",
                image: "https://i.imgur.com/Qo0TrFn.png",
                color: "#32CD32"
            }
        ]

        if (!args[0]) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu o subcomando.\n`t.moldura loja` - Veja a loja de molduras;\n`t.moldura comprar` - Compre molduras;\n`t.moldura inventario` - Veja seu inventário de molduras.')] })
        let cmd = args[0].toUpperCase()
        let currentPage = 0

        if (cmd == "LOJA") {
            // BUTTONS

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

            let bgEmbed = (number) => new Discord.EmbedBuilder()
                .setTitle('🖼️ | Loja - Backgrounds')
                .setDescription(`**Tema:** ${molduras[number].titulo}\n**ID:** ${number}\n**Valor:** ${molduras[number].valor} ouros`)
                .setImage(`${molduras[number].image}`)
                .setColor(molduras[number].color)
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })


            let s = await message.channel.send(`${message.author}`)
            let m = await message.channel.send({ embeds: [bgEmbed(0)], components: [row] })

            const filter = (button) => button.user.id === message.author.id;
            const collector = m.createMessageComponentCollector({ filter, time: 120000 });

            collector.on('collect', (collected) => {
                if (collected.customId == "back") {
                    if (currentPage == 0) {
                        currentPage = molduras.length - 1
                    } else {
                        currentPage--
                    }

                    m.edit({ embeds: [bgEmbed(currentPage)], components: [row] })
                }

                if (collected.customId == "next") {
                    if (currentPage == molduras.length - 1) {
                        currentPage = 0
                    } else {
                        currentPage++
                    }

                    m.edit({ embeds: [bgEmbed(currentPage)], components: [row] })
                }
                if (collected.customId == "delete") {
                    m.delete()
                    s.delete()
                    return
                }
            });
        }

        if (["INV", "INVENTARIO"].includes(cmd)) {
            const profileDB = await database.ref(`Global/${message.author.id}/Perfil`).once('value')
            const invDB = profileDB.val() != null && profileDB.val().invMol != null ? profileDB.val().invMol : []
            if (invDB.length < 1) return message.reply({ embeds: [errorEmbed.setDescription(`Você não possui nenhum background.`)] })

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

            let bgEmbed = (number) => new Discord.EmbedBuilder()
                .setTitle('🖼️ | Inventário de Molduras')
                .setDescription(`**Tema:** ${molduras[number].titulo}\n**ID:** ${number}\n**Valor:** ${molduras[number].valor} ouros`)
                .setImage(`${molduras[number].image}`)
                .setColor(molduras[number].color)

            let s = await message.channel.send(`${message.author}`)
            let m = await message.channel.send({ embeds: [bgEmbed(invDB[currentPage])], components: [row] })

            const filter = (button) => button.user.id === message.author.id;
            const collector = m.createMessageComponentCollector({ filter, time: 120000 });

            collector.on('collect', (collected) => {
                if (collected.customId == "back") {
                    if (currentPage == 0) {
                        currentPage = invDB.length - 1
                    } else {
                        currentPage--
                    }

                    m.edit({ embeds: [bgEmbed(invDB[currentPage])], components: [row] })
                }

                if (collected.customId == "next") {
                    if (currentPage == invDB.length - 1) {
                        currentPage = 0
                    } else {
                        currentPage++
                    }

                    m.edit({ embeds: [bgEmbed(invDB[currentPage])], components: [row] })
                }
                if (collected.customId == "delete") {
                    m.delete()
                    s.delete()
                    return;
                }
            });
        }

        if (cmd == "COMPRAR") {
            let idMol = args[1]
            if (!idMol) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu o ID da moldura.')] })
            if (isNaN(idMol)) return message.reply({ embeds: [errorEmbed.setDescription('O ID inserido não é um número.')] })
            if (memberDB.val().ouro < 5000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessários **5.000** ouros.')] })

            const profileDB = await database.ref(`Global/${message.author.id}/Perfil`).once('value')
            const invDB = profileDB.val() != null && profileDB.val().invMol != null ? profileDB.val().invMol : []
            var pes = invDB.indexOf(idMol)
            if (pes != -1) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui esta moldura.')] })

            var add = invDB.push(idMol)

            database.ref(`Global/${message.author.id}/Perfil/invMol`).set(invDB)
            database.ref(`Global/${message.author.id}/Perfil/moldura`).set(idMol)
            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(6000))

            message.reply({ embeds: [sucEmbed.setTitle('🖼️ | Moldura Comprada!').setDescription(`Você comprou a **Moldura ${molduras[idMol].titulo} (${idMol})** com sucesso!`)] })
        }

        if (cmd == "ATIVAR") {
            let id = args[1]
            if (!id) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu o ID da moldura que deseja ativar.')] })

            const profileDB = await database.ref(`Global/${message.author.id}/Perfil`).once('value')
            const invDB = profileDB.val() != null && profileDB.val().invMol != null ? profileDB.val().invMol : []
            if (!invDB.includes(id)) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui esta moldura.')] })

            database.ref(`Global/${message.author.id}/Perfil/moldura`).set(id)
            return message.reply({ embeds: [sucEmbed.setDescription(`Moldura ${id} ativada!`)] })
        }

    }
}