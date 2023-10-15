const Discord = require('discord.js')
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

module.exports = {
    name: "loja",
    aliases: ["shop"],
    async execute(client, message, args, database) {

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

            const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('shop')
					.setPlaceholder('Selecione uma categoria')
					.addOptions(
						{
							label: 'Armas',
							description: 'Embed com as opções das armas para comprar',
							value: 'guns',
						},
						{
							label: 'Acessórios',
							description: 'Embed com as opções dos acessórios para comprar',
							value: 'acessories',
						},
					),
			);

        /* let shopEmbed = new Discord.EmbedBuilder()
            .setTitle('<:billy_shop:887518597935681607> | Loja')
            .setDescription(`Veja a lista de lojas:\n\n\`b.loja armas\` - Loja de Armas;\n\`b.escavacao loja\` - Loja de Escavação;\n\`b.bag loja\` - Loja de Mochilas;\n\`b.pets loja\` - Loja de Pets;\n\`b.loja acessorios\` - Loja de Acessórios;\n\`b.loja badges\` - Loja de Badges (Em Breve);\n\`b.loja diamantes\` - Loja de Diamantes (Em Breve).`)
            .setColor('#DAA520')
            .setFooter({ text: 'Para comprar use: b.loja comprar <id>' }) */

        let shopEmbed = new Discord.EmbedBuilder()
            .setTitle("💰 | Loja")
            .setDescription("Selecione no dropdown abaixo a categoria da loja que deseja checar os produtos para a compra.")
            .setColor('#DAA520')
            .setFooter({ text: 'Para conseguir dinheiro, realize as atividades de economia do bot!' })

        let msgShop = await message.reply({ embeds: [shopEmbed], components: [row] })

        const filter = i => {
            i.deferUpdate();
            return i.user.id === message.author.id;
        };
        
        msgShop.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
            .then(async cmd => {

        if (cmd.values[0] == "acessories") {

            let acessoriosEmbed = new Discord.EmbedBuilder()
                .setTitle('💰 | Loja - Acessórios')
                .setDescription('🔐** Cofre**\nPermite que você retire ou deposite ouro para não ser roubado e envie ouro para outros membros. | 3.000 ouros\n\n**🥷 Roubo de Caixa (CaixaRoubo)**\nPermite que você roube outras pessoas. | 7.500 ouros | 2x\n\n**🏛 Roubo de Cofre (RouboCofre)**\nPermite que você roube cofres. | 25.000 ouros | 2x')
                .setColor('#FF6347')
                .setFooter({ text: 'Para conseguir dinheiro, realize as atividades de economia do bot!' })

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('acessories')
                        .setPlaceholder('Selecione um acessório')
                        .addOptions(
                            {
                                label: 'Cofre',
                                description: 'Compre um cofre para guardar dinheiro',
                                value: 'safebox',
                            },
                            {
                                label: 'Roubo de Caixa',
                                description: 'Compre para roubar outros jogadores',
                                value: 'theftbox',
                            },
                            {
                                label: 'Roubo de Cofre',
                                description: 'Compre para roubar cofre dos jogadores',
                                value: 'theftsafebox'
                            }
                        ),
                );

                const filter = i => {
                    i.deferUpdate();
                    return i.user.id === message.author.id;
                };

                let msgAcessories = await message.reply({ embeds: [acessoriosEmbed], components: [row] })
                
                msgAcessories.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
                    .then(item => {

                        item = item.values[0]

                        if (item == "safebox") {
                            if (memberDB.val().ouro < 3000) return message.channel.send({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente.')] })
                            if (memberDB.val().cofre == "true") return message.channel.send({ embeds: [errorEmbed.setDescription('Você já possui um cofre.')] })
        
                            if (memberDB.val().cofre == null) database.ref(`Global/${message.author.id}/cofre`).set("true")
                            if (memberDB.val().cofre != "true") database.ref(`Global/${message.author.id}/cofre`).set("true")
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(3000))
                            return message.channel.send({ embeds: [sucEmbed.setTitle('🛒 | Item Comprado!').setDescription('Você comprou um **Cofre** com sucesso!')] })
                        }
        
                        if (item == "theftbox") {
                            if (memberDB.val().ouro < 7500) return message.channel.send({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente.')] })
                            if (memberDB.val().itemRoubo1 == "true" || memberDB.val().itemRoubo2 == "true") return message.channel.send({ embeds: [errorEmbed.setDescription('Você já possui o item para roubos.')] })
        
                            if (memberDB.val().itemRoubo1 == null) database.ref(`Global/${message.author.id}/itemRoubo1`).set("true")
                            if (memberDB.val().itemRoubo2 == null) database.ref(`Global/${message.author.id}/itemRoubo2`).set("true")
                            if (memberDB.val().itemRoubo1 != "true") database.ref(`Global/${message.author.id}/itemRoubo1`).set("true")
                            if (memberDB.val().itemRoubo2 != "true") database.ref(`Global/${message.author.id}/itemRoubo2`).set("true")
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(7500))
                            return message.channel.send({ embeds: [sucEmbed.setTitle('🛒 | Item Comprado!').setDescription('Você comprou dois **Itens para Roubos** com sucesso!')] })
                        }
        
                        if (item == "theftsafebox") {
                            if (memberDB.val().ouro < 25000) return message.channel.send('Você não possui ouro suficiente.')
                            if (memberDB.val().itemRCofre1 == "true" || memberDB.val().itemRCofre2 == "true") return message.reply({ embeds: [errorEmbed.setDescription('Você já possui o item para roubos.')] })
        
                            if (memberDB.val().itemRCofre1 == null) database.ref(`Global/${message.author.id}/itemRCofre1`).set("true")
                            if (memberDB.val().itemRCofre2 == null) database.ref(`Global/${message.author.id}/itemRCofre2`).set("true")
                            if (memberDB.val().itemRCofre1 != "true") database.ref(`Global/${message.author.id}/itemRCofre1`).set("true")
                            if (memberDB.val().itemRCofre2 != "true") database.ref(`Global/${message.author.id}/itemRCofre2`).set("true")
        
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(25000))
                            return message.channel.send({ embeds: [sucEmbed.setTitle('🛒 | Item Comprado!').setDescription('Você comprou dois **Itens para Roubos de Cofre** com sucesso!')] })
                        }
                    })

            
        }
        if (cmd.values[0] == "guns") {

            let gunsEmbed = new Discord.EmbedBuilder()
                .setTitle('🔫 | Loja de Armas')
                .setDescription(`**Glock:** 5% | 3.000 💸\n**Espingarda:** 10% | 10.000 💸\n**AK47:** 20% | 25.000 💸\n**Sniper:** 30% | 50.000 💸\n\n**Cartucho com 10 munições (Cartucho10):** 1.000 💸`)
                .setColor('#98FB98')
                .setFooter({ text: 'Para conseguir dinheiro, realize as atividades de economia do bot!' })

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('acessories')
                        .setPlaceholder('Selecione um acessório')
                        .addOptions(
                            {
                                label: 'Glock',
                                description: 'Compre uma glock',
                                value: 'glock',
                            },
                            {
                                label: 'Espingarda',
                                description: 'Compre uma espingarda',
                                value: 'shotgun',
                            },
                            {
                                label: 'Ak47',
                                description: 'Compre uma Ak47',
                                value: 'ak47',
                            },
                            {
                                label: 'Sniper',
                                description: 'Compre uma sniper',
                                value: 'sniper'
                            },
                            {
                                label: 'Cartucho 10 munições',
                                description: 'Compre um cartucho com 10 munições',
                                value: 'cartridge',
                            },
                        ),
                );

                const filter = i => {
                    i.deferUpdate();
                    return i.user.id === message.author.id;
                };

                let msgGuns = await message.reply({ embeds: [gunsEmbed], components: [row] })

                msgGuns.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
                    .then(item => {
                        if (item.values[0] == "glock") {
                            if (memberDB.val().ouro < 3000) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem ouro suficiente.')] })
                            if (["glock", "espingarda", "ak47", "sniper"].includes(memberDB.val().arma)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma Glock ou outra arma melhor.')] })
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(3000))
                            database.ref(`Global/${message.author.id}/municoes`).transaction(n => 0)
                            database.ref(`Global/${message.author.id}/arma`).set("glock")
                            return message.reply({ embeds: [sucEmbed.setTitle('🔫 | Arma comprada!').setDescription('Você comprou uma **Glock** com sucesso!')] })
                        }
        
                        if (item.values[0] == "shotgun") {
                            if (memberDB.val().ouro < 10000) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem ouro suficiente.')] })
                            if (["espingarda", "ak47", "sniper"].includes(memberDB.val().arma)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma Espingarda ou outra arma melhor.')] })
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(10000))
                            database.ref(`Global/${message.author.id}/municoes`).transaction(n => 0)
                            database.ref(`Global/${message.author.id}/arma`).set("espingarda")
                            return message.reply({ embeds: [sucEmbed.setTitle('🔫 | Arma comprada!').setDescription('Você comprou uma **Espingarda** com sucesso!')] })
                        }
        
                        if (item.values[0] == "ak47") {
                            if (memberDB.val().ouro < 25000) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem ouro suficiente.')] })
                            if (["ak47", "sniper"].includes(memberDB.val().arma)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma AK-47 ou outra arma melhor.')] })
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(25000))
                            database.ref(`Global/${message.author.id}/municoes`).transaction(n => 0)
                            database.ref(`Global/${message.author.id}/arma`).set("ak47")
                            return message.reply({ embeds: [sucEmbed.setTitle('🔫 | Arma comprada!').setDescription('Você comprou uma **AK-47** com sucesso!')] })
                        }
        
                        if (item.values[0] == "sniper") {
                            if (memberDB.val().ouro < 50000) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem ouro suficiente.')] })
                            if (["sniper"].includes(memberDB.val().arma)) return message.reply({ embeds: [errorEmbed.setDescription('Você já possui uma Sniper ou outra arma melhor.')] })
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(50000))
                            database.ref(`Global/${message.author.id}/municoes`).transaction(n => 0)
                            database.ref(`Global/${message.author.id}/arma`).set("sniper")
                            return message.reply({ embeds: [sucEmbed.setTitle('🔫 | Arma comprada!').setDescription('Você comprou uma **Sniper** com sucesso!')] })
                        }
        
                        if (item.values[0] == "cartridge") {
                            if (memberDB.val().ouro < 1000) return message.reply({ embeds: [errorEmbed.setDescription('Você não tem ouro suficiente.')] })
                            if (Number(memberDB.val().municoes) + Number(10) > 20) return message.reply({ embeds: [errorEmbed.setDescription(`O limite de munições é 20, você já possui ${memberDB.val().municoes}`)] })
                            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(1000))
                            database.ref(`Global/${message.author.id}/municoes`).transaction(n => n + Number(10))
                            database.ref(`Global/${message.author.id}/arma`).set("sniper")
                            return message.reply({ embeds: [sucEmbed.setDescription('Você comprou um **Cartucho com 10 munições** com sucesso!')] })
                        }
                    })
        }
            })
            .catch(err => 
                console.log(`No interactions were collected.`)
            );
    }
}