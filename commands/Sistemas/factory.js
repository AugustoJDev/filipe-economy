const Discord = require("discord.js")
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js")
const ms = require("parse-ms")

module.exports = {
    name: "factory",
    aliases: ["fabrica", "fab", "fac", "fábrica"],
    async execute(client, message, args, database) {

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let mfactoryDB = await database.ref(`Global/${message.author.id}/Fabrica`).once('value')
        let myFactoryDB = await database.ref(`Global/${message.author.id}/Fabrica/id`).once('value')
        let myyFactoryDB = await database.ref(`Fabricas/${myFactoryDB.val()}`).once('value')
        let factoryDB = await database.ref(`Fabricas`).once('value')

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let neutEmbed = new Discord.EmbedBuilder()
            .setColor('#40C0FF')

        if (factoryDB.val() == null) {
            database.ref(`Fabricas/-1`).update({ nome: "init" })
            database.ref(`Fabricas/lastID`).set(0)
        }

        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('factory')
					.setPlaceholder('Selecione uma categoria')
					.addOptions(
						{
							label: 'Criar',
							description: 'Cria uma fábrica',
							value: 'criar',
						},
						{
							label: 'Depositar',
							description: 'Deposita FabriCoins',
							value: 'depositar',
						},
						{
							label: 'Sacar',
							description: 'Saca FabriCoins',
							value: 'sacar',
						},
						{
							label: 'Nome',
							description: 'Altera o nome',
							value: 'nome',
						},
						{
							label: 'Evoluir',
							description: 'Evolui o FabriLevel',
							value: 'evoluir',
						},
						{
							label: 'Funcionários',
							description: 'Mostra a lista de funcionários',
							value: 'funcionários',
						},
						{
							label: 'Convidar',
							description: 'Convide alguém',
							value: 'convidar',
						},
						{
							label: 'Promover',
							description: 'Promova alguém',
							value: 'promover',
						},
						{
							label: 'Expulsar',
							description: 'Expulse alguém',
							value: 'expulsar',
						},
						{
							label: 'Trabalhar',
							description: 'Trabalhe na fábrica',
							value: 'trabalhar',
						},
						{
							label: 'Aceitar',
							description: 'Aceite um convite',
							value: 'aceitar',
						},
						{
							label: 'Recusar',
							description: 'Recuse um convite',
							value: 'recusar',
						},
						{
							label: 'Convites',
							description: 'Veja seus convites',
							value: 'convites',
						},
						{
							label: 'Deletar',
							description: 'Delete sua fábrica',
							value: 'deletar',
						},
						{
							label: 'Info',
							description: 'Veja as informações da sua fábrica',
							value: 'info',
						}
					),
			);

        let msgMS = await message.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setDescription('Selecione uma categoria de fábrica para acessar.')
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

        if (cmd == "CREATE" || cmd == "CRIAR") {
            if (mfactoryDB.val().id != 0) return message.reply({ embeds: [errorEmbed.setDescription('Você já está em uma fábrica.')] })
            if (memberDB.val().ouro < 25000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente! São necessários **25.000** ouros.')] })

            message.reply({ content: "Insira o nome da sua fábrica", ephemeral: true })
                .then(() => {

            let filter = u => {
                return u.author.id === message.author.id
            }
                
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                .then(async collected => {

            let nameFab = collected.first().content

            if (nameFab.length > 30) return message.reply({ embeds: [errorEmbed.setDescription('O nome da sua fábrica é muito grande.')] })

            let values = Object.entries(factoryDB.val()).map(([fabID, value]) => ({ fabID, ...value }))
            if (values.some(fabrica => fabrica.nome == nameFab)) return message.reply({ embeds: [errorEmbed.setDescription('Já existe uma fábrica com este nome.')] })

            database.ref(`Fabricas/${factoryDB.val().lastID + 1}`).update({ owner: message.author.id, nome: nameFab, fabriCoins: 0, fabriLevel: 0, id: factoryDB.val().lastID + 1, funcionario1: "null", funcionario2: "null", funcionario3: "null", funcionario4: "null", funcionario5: "null", funcionario6: "null" })
            database.ref(`Global/${message.author.id}/Fabrica/id`).set(factoryDB.val().lastID + 1)
            database.ref(`Global/${message.author.id}/Fabrica/cargo`).set("owner")
            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(25000))
            database.ref(`Fabricas/lastID`).transaction(n => n + Number(1))
            return message.reply({ embeds: [sucEmbed.setTitle('🏭 | Fábrica Criada').setDescription(`Wow, você criou uma fábrica com sucesso. Tenho certeza que você vai lucrar muito com a **${nameFab}**!\n**ID:** ${new Intl.NumberFormat('de-DE').format(factoryDB.val().lastID + 1)}`)] })
                })
            })
        }

        if (cmd == "DEPOSIT" || cmd == "DEPOSITAR") {
            if (mfactoryDB.val().id == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não está em uma fábrica.')] })
            
            message.reply({ content: "Insira o valor do depósito", ephemeral: true })
                .then(() => {

            let filter = u => {
                return u.author.id === message.author.id
            }
                
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                .then(async collected => {

            let vlr = collected.first().content.toUpperCase();

            if (isNaN(vlr)) return message.reply({ embeds: [errorEmbed.setDescription('O valor fornecido não é um número.')]})
            if (memberDB.val().ouro < vlr) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui toda essa quantia para depositar.')] })

            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(vlr))
            database.ref(`Fabricas/${mfactoryDB.val().id}/fabriCoins`).transaction(n => n + Number(vlr))
            let nameFabDB = await database.ref(`Fabricas/${mfactoryDB.val().id}`).once('value')
            let nameFabID = nameFabDB.val().nome
            return message.reply({ embeds: [sucEmbed.setTitle('🪙 | FabriCoins Depositados').setDescription(`Você depositou **${new Intl.NumberFormat('de-DE').format(vlr)}** FabriCoins para a fábrica \`${nameFabID}\`.`)] })
                })
            })
        }

        if (cmd == "SACAR") {
            if (mfactoryDB.val().id == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não está em uma fábrica.')] })
            if (mfactoryDB.val().cargo != "owner") return message.reply({ embeds: [errorEmbed.setDescription('Somente o fundador da fábrica pode sacar FabriCoins.')] })

            message.reply({ content: "Insira o valor do saque", ephemeral: true })
                .then(() => {

            let filter = u => {
                return u.author.id === message.author.id
            }
                
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                .then(async collected => {

            let vlr = collected.first().content.toUpperCase()
            if (!vlr || isNaN(vlr)) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu o valor.\n`t.fabrica sacar <quantia>`')] })

            let dbfab = await database.ref(`Fabricas/${mfactoryDB.val().id}/fabriCoins`).once('value')
            if (dbfab.val() < vlr) return message.reply({ embeds: [errorEmbed.setDescription('A fábrica não possui toda essa quantia para sacar.')] })

            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(vlr))
            database.ref(`Fabricas/${mfactoryDB.val().id}/fabriCoins`).transaction(n => n - Number(vlr))
            return message.reply({ embeds: [sucEmbed.setTitle('🪙 | FabriCoins Depositados').setDescription(`Você sacou **${new Intl.NumberFormat('de-DE').format(vlr)}** FabriCoins da sua fábrica.`)] })
                })
            })
        }

        if (cmd == "NAME" || cmd == "NOME") {
            if (mfactoryDB.val().id == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não está em uma fábrica.')] })
            if (mfactoryDB.val().cargo != "owner") return message.reply({ embeds: [errorEmbed.setDescription('Somente o fundador da fábrica pode alterar o nome.')] })
            if (memberDB.val().ouro < 3500) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui a quantidade de ouro para alterar o nome.')] })
            
            message.reply({ content: "Insira o nome da fábrica", ephemeral: true })
                .then(() => {

            let filter = u => {
                return u.author.id === message.author.id
            }
                
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                .then(async collected => {

            if (!collected.first().content) return message.reply({ embeds: [errorEmbed.setDescription('Você não inseriu o nome da Fábrica. `fabrica > nome`')] })

            let nameFab = collected.first().content;

            if (myyFactoryDB.val().nome == nameFab) return message.reply({ embeds: [errorEmbed.setDescription('Este já é o nome da sua fábrica.')] })
            if (nameFab.length > 30) return message.reply({ embeds: [errorEmbed.setDescription('O nome da sua fábrica é muito grande.')] })

            let values = Object.entries(factoryDB.val()).map(([fabID, value]) => ({ fabID, ...value }))
            if (values.some(fabrica => fabrica.nome == nameFab)) return message.reply({ embeds: [errorEmbed.setDescription('Já existe uma fábrica com este nome.')] })

            database.ref(`Fabricas/${myFactoryDB.val()}/nome`).set(nameFab)
            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(3500))
            return message.reply({ embeds: [sucEmbed.setTitle(`${emoji.patente} | Nome da Fábrica Alterado`).setDescription(`Você alterou o nome da sua fábrica para **${nameFab}**!`)] })
                })
            })
        }

        if (cmd == "EVOLUIR" || cmd == "UP" || cmd == "UPAR") {
            if (mfactoryDB.val().id == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não está em uma fábrica.')] })
            if (mfactoryDB.val().cargo != "owner") return message.reply({ embeds: [errorEmbed.setDescription('Somente o fundador da fábrica pode evoluir.')] })

            if (myyFactoryDB.val().fabriLevel <= 0) {
                if (myyFactoryDB.val().fabriCoins < 85000) return message.reply({ embeds: [errorEmbed.setDescription('Sua fábrica não possui FabriCoins suficiente. São necessários 85.000!\n`fabrica > depositar`')] })
                database.ref(`Fabricas/${myFactoryDB.val()}/fabriLevel`).set(1)
                database.ref(`Fabricas/${myFactoryDB.val()}/fabriCoins`).transaction(n => n - Number(85000))
                return message.reply({ embeds: [sucEmbed.setTitle('🎚️ | Fábrica Evoluída').setDescription('Yeah! Você evoluiu sua fábrica para o nível **1**!')] })
            }

            if (myyFactoryDB.val().fabriLevel == 1) {
                if (myyFactoryDB.val().fabriCoins < 150000) return message.reply({ embeds: [errorEmbed.setDescription('Sua fábrica não possui FabriCoins suficiente. São necessários 150.000!\n`b.fabrica > depositar`')] })
                database.ref(`Fabricas/${myFactoryDB.val()}/fabriLevel`).set(2)
                database.ref(`Fabricas/${myFactoryDB.val()}/fabriCoins`).transaction(n => n - Number(150000))
                return message.reply({ embeds: [sucEmbed.setTitle('🎚️ | Fábrica Evoluída').setDescription('Yeah! Você evoluiu sua fábrica para o nível **2**!')] })
            }

            if (myyFactoryDB.val().fabriLevel == 2) {
                if (myyFactoryDB.val().fabriCoins < 300000) return message.reply({ embeds: [errorEmbed.setDescription('Sua fábrica não possui FabriCoins suficiente. São necessários 300.000!\n`b.fabrica > depositar`')] })
                database.ref(`Fabricas/${myFactoryDB.val()}/fabriLevel`).set(3)
                database.ref(`Fabricas/${myFactoryDB.val()}/fabriCoins`).transaction(n => n - Number(300000))
                return message.reply({ embeds: [sucEmbed.setTitle('🎚️ | Fábrica Evoluída').setDescription('Yeah! Você evoluiu sua fábrica para o nível **3**!')] })
            }

            if (myyFactoryDB.val().fabriLevel == 3) {
                if (myyFactoryDB.val().fabriCoins < 500000) return message.reply({ embeds: [errorEmbed.setDescription('Sua fábrica não possui FabriCoins suficiente. São necessários 500.000!\n`b.fabrica > depositar`')] })
                database.ref(`Fabricas/${myFactoryDB.val()}/fabriLevel`).set(4)
                database.ref(`Fabricas/${myFactoryDB.val()}/fabriCoins`).transaction(n => n - Number(500000))
                return message.reply({ embeds: [sucEmbed.setTitle('🎚️ | Fábrica Evoluída').setDescription('Yeah! Você evoluiu sua fábrica para o nível **4**!')] })
            }

            if (myyFactoryDB.val().fabriLevel == 4) {
                if (myyFactoryDB.val().fabriCoins < 1000000) return message.reply({ embeds: [errorEmbed.setDescription('Sua fábrica não possui FabriCoins suficiente. São necessários 1.000.000!\n`b.fabrica > depositar`')] })
                database.ref(`Fabricas/${myFactoryDB.val()}/fabriLevel`).set(5)
                database.ref(`Fabricas/${myFactoryDB.val()}/fabriCoins`).transaction(n => n - Number(1000000))
                return message.reply({ embeds: [sucEmbed.setTitle('🎚️ | Fábrica Evoluída').setDescription('Yeah! Você evoluiu sua fábrica para o nível **5**!')] })
            }

            if (myyFactoryDB.val().fabriLevel == 5) {
                return message.reply({ embeds: [errorEmbed.setDescription('Sua fábrica já está no level máximo!')] })
            }
        }

        if (cmd == "FUNCIONARIOS" || cmd == "FUNCIONARIO" || cmd == "FUNCIONÁRIO" || cmd == "FUNCIONÁRIOS") {
            if (mfactoryDB.val().id == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não está em uma fábrica.')] })

            let haveFunc1 = myyFactoryDB.val().funcionario1 == "null" ? "Sem Funcionário" : `<@${myyFactoryDB.val().funcionario1}> \`(${myyFactoryDB.val().funcionario1})\``
            let func1DB = await database.ref(`Global/${myyFactoryDB.val().funcionario1}/Fabrica`).once('value')
            let func1NL = myyFactoryDB.val().funcionario1 == "null" ? "Vago" : func1DB.val().cargo

            let haveFunc2 = myyFactoryDB.val().funcionario2 == "null" ? "Sem Funcionário" : `<@${myyFactoryDB.val().funcionario2}> \`(${myyFactoryDB.val().funcionario2})\``
            let func2DB = await database.ref(`Global/${myyFactoryDB.val().funcionario2}/Fabrica`).once('value')
            let func2NL = myyFactoryDB.val().funcionario2 == "null" ? "Vago" : func2DB.val().cargo

            let haveFunc3 = myyFactoryDB.val().funcionario3 == "null" ? "Sem Funcionário" : `<@${myyFactoryDB.val().funcionario3}> \`(${myyFactoryDB.val().funcionario3})\``
            let func3DB = await database.ref(`Global/${myyFactoryDB.val().funcionario3}/Fabrica`).once('value')
            let func3NL = myyFactoryDB.val().funcionario3 == "null" ? "Vago" : func3DB.val().cargo

            let haveFunc4 = myyFactoryDB.val().funcionario4 == "null" ? "Sem Funcionário" : `<@${myyFactoryDB.val().funcionario4}> \`(${myyFactoryDB.val().funcionario4})\``
            let func4DB = await database.ref(`Global/${myyFactoryDB.val().funcionario4}/Fabrica`).once('value')
            let func4NL = myyFactoryDB.val().funcionario4 == "null" ? "Vago" : func4DB.val().cargo

            let haveFunc5 = myyFactoryDB.val().funcionario5 == "null" ? "Sem Funcionário" : `<@${myyFactoryDB.val().funcionario5}> \`(${myyFactoryDB.val().funcionario5})\``
            let func5DB = await database.ref(`Global/${myyFactoryDB.val().funcionario5}/Fabrica`).once('value')
            let func5NL = myyFactoryDB.val().funcionario5 == "null" ? "Vago" : func5DB.val().cargo

            let haveFunc6 = myyFactoryDB.val().funcionario6 == "null" ? "Sem Funcionário" : `<@${myyFactoryDB.val().funcionario6}> \`(${myyFactoryDB.val().funcionario6})\``
            let func6DB = await database.ref(`Global/${myyFactoryDB.val().funcionario6}/Fabrica`).once('value')
            let func6NL = myyFactoryDB.val().funcionario6 == "null" ? "Vago" : func6DB.val().cargo

            let funcEmbed = new Discord.EmbedBuilder()
                .setTitle(`<:factory2:877742745966493837> | ${myyFactoryDB.val().nome} - Funcionários`)
                .setDescription(`**💼 | Fundador:**\n <@${myyFactoryDB.val().owner}> \`(${myyFactoryDB.val().owner})\`\nCargo: Dono\n\n**👨‍🏭 | Funcionário 1:**\n${haveFunc1} \nCargo: ${func1NL}\n\n**👨‍🏭 | Funcionário 2:**\n${haveFunc2} \nCargo: ${func2NL}\n\n**👨‍🏭 | Funcionário 3:**\n${haveFunc3} \nCargo: ${func3NL}\n\n**👨‍🏭 | Funcionário 4:**\n${haveFunc4} \nCargo: ${func4NL}\n\n**👨‍🏭 | Funcionário 5:**\n${haveFunc5} \nCargo: ${func5NL}\n\n**👨‍🏭 | Funcionário 6:**\n${haveFunc6} \nCargo: ${func6NL}\n\n`)
                .setColor('#CDC9C9')
            return message.reply({ embeds: [funcEmbed] })
        }

        if (cmd == "CONVIDAR" || cmd == "INVITE") {

            message.reply({ content: "Mencione o usuário que deseja convidar", ephemeral: true })
                .then(() => {

            let filter = u => {
                return u.author.id === message.author.id
            }
                
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                .then(async collected => {

            let convidado = collected.first().mentions.users.first();
            if (!convidado) return message.reply({ embeds: [errorEmbed.setDescription('Você não mencionou nenhum membro.\n`b.fabrica convidar <@membro>`')] })
            let invitedDB = await database.ref(`Global/${convidado.id}/Fabrica`).once('value')

            if (mfactoryDB.val().id == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não está em uma fábrica.')] })
            if (mfactoryDB.val().cargo != "owner") return message.reply({ embeds: [errorEmbed.setDescription('Somente o fundador da fábrica pode convidar.')] })
            if (message.author.id == convidado.id) return message.reply({ embeds: [errorEmbed.setDescription('Você não pode se convidar.')] })
            if (invitedDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription(`\`${convidado.username}\` não pode receber convites, provavelmente o banco de dados dele não existe.`)] })
            if (invitedDB.val().convite1 != "null" && invitedDB.val().convite2 != "null" && invitedDB.val().convite3 != "null") return message.reply({ embeds: [errorEmbed.setDescription('Este membro já está com a lista de convites cheia.')] })
            if (invitedDB.val().convite1 == myyFactoryDB.val().id || invitedDB.val().convite2 == myyFactoryDB.val().id || invitedDB.val().convite3 == myyFactoryDB.val().id) return message.reply({ embeds: [errorEmbed.setDescription('Você já convidou este membro uma vez.')] })

            if (invitedDB.val().convite1 == "null") {
                database.ref(`Global/${convidado.id}/Fabrica/convite1`).set(myFactoryDB.val())

                let invitedEmbed = new Discord.EmbedBuilder()
                    .setTitle('Você foi convidado para uma fábrica!')
                    .setDescription(`**${message.author.tag}** quer te contratar para a fábrica **${myyFactoryDB.val().nome}**, que possui o level **${myyFactoryDB.val().fabriLevel}** e **${myyFactoryDB.val().fabriCoins}** FabriCoins!`)
                    .setFooter({ text: `Para aceitar use: factory > aceitar > ${myyFactoryDB.val().id}` })
                    .setColor('#9AFF9A')

                convidado.send({ embeds: [invitedEmbed] })
                return message.reply({ embeds: [sucEmbed.setTitle('🧩 | Membro Convidado').setDescription(`Você convidou \`${convidado.tag}\` para sua fábrica!`)] })
            }

            if (invitedDB.val().convite2 == "null") {
                database.ref(`Global/${convidado.id}/Fabrica/convite2`).set(myFactoryDB.val())

                let invitedEmbed = new Discord.EmbedBuilder()
                    .setTitle('Você foi convidado para uma fábrica!')
                    .setDescription(`**${message.author.tag}** quer te contratar para a fábrica **${myyFactoryDB.val().nome}**, que possui o level **${myyFactoryDB.val().fabriLevel}** e **${myyFactoryDB.val().fabriCoins}** FabriCoins!`)
                    .setFooter({ text: `Para aceitar use: factory > aceitar > ${myyFactoryDB.val().id}`})
                    .setColor('#9AFF9A')

                convidado.send({ embeds: [invitedEmbed] })
                return message.reply({ embeds: [sucEmbed.setTitle('🧩 | Membro Convidado').setDescription(`Você convidou \`${convidado.tag}\` para sua fábrica!`)] })
            }

            if (invitedDB.val().convite3 == "null") {
                database.ref(`Global/${convidado.id}/Fabrica/convite3`).set(myFactoryDB.val())

                let invitedEmbed = new Discord.EmbedBuilder()
                    .setTitle('Você foi convidado para uma fábrica!')
                    .setDescription(`**${message.author.tag}** quer te contratar para a fábrica **${myyFactoryDB.val().nome}**, que possui o level **${myyFactoryDB.val().fabriLevel}** e **${myyFactoryDB.val().fabriCoins}** FabriCoins!`)
                    .setFooter({ text: `Para aceitar use: factory > aceitar > ${myyFactoryDB.val().id}`})
                    .setColor('#9AFF9A')

                convidado.send({ embeds: [invitedEmbed] })
                return message.reply({ embeds: [sucEmbed.setTitle('🧩 | Membro Convidado').setDescription(`Você convidou \`${convidado.tag}\` para sua fábrica!`)] })
                    }
                })
            })
        }

        if (cmd == "PROMOVER" || cmd == "PROMOTE") {

            message.reply({ content: "Mencione o usuário que deseja promover", ephemeral: true })
                .then(() => {

            let filter = u => {
                return u.author.id === message.author.id
            }
                
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                .then(async collected => {

            let promovido = collected.first().mentions.users.first()
            if (!promovido) return message.reply({ embeds: [errorEmbed.setDescription('Você não mencionou nenhum membro.\n`fabrica promover <@membro>`')] })
            let promotedDB = await database.ref(`Global/${promovido.id}/Fabrica`).once('value')

            if (mfactoryDB.val().id == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não está em uma fábrica.')] })
            if (mfactoryDB.val().cargo != "owner") return message.reply({ embeds: [errorEmbed.setDescription('Somente o fundador da fábrica pode promover.')] })
            if (message.author.id == promovido.id) return message.reply({ embeds: [errorEmbed.setDescription('Você não pode se promover.')] })
            if (promotedDB.val().id != myyFactoryDB.val().id) return message.reply({ embeds: [errorEmbed.setDescription('Este membro não é da sua fábrica.')] })
            if (promotedDB.val().cargo == "Coordenador") return message.reply({ embeds: [errorEmbed.setDescription('Este membro já é um **Coordenador**.')] })

            database.ref(`Global/${promovido.id}/Fabrica/cargo`).set("Coordenador")
            return message.reply({ embeds: [sucEmbed.setTitle('💼 | Promoção Concedida').setDescription(`\`${promovido.tag}\` foi promovido para **Coordenador** da fábrica **${myyFactoryDB.val().nome}** com sucesso!`)] })
                })
            })
        }

        if (cmd == "KICK" || cmd == "KICKAR" || cmd == "EXPULSAR" || cmd == "DEMITIR") {

            message.reply({ content: "Mencione o usuário que deseja convidar", ephemeral: true })
                .then(() => {

            let filter = u => {
                return u.author.id === message.author.id
            }
                
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                .then(async collected => {

            let kicked = collected.first().mentions.users.first()
            if (!kicked) return message.reply({ embeds: [errorEmbed.setDescription('Você não mencionou nenhum membro.\n`fabrica > demitir > <@membro>`')] })
            let kickedDB = await database.ref(`Global/${kicked.id}/Fabrica`).once('value')

            if (mfactoryDB.val().id == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não está em uma fábrica.')] })
            if (mfactoryDB.val().cargo != "owner") return message.reply({ embeds: [errorEmbed.setDescription('Somente o fundador da fábrica pode expulsar.')] })
            if (message.author.id == kicked.id) return message.reply({ embeds: [errorEmbed.setDescription('Você não pode se expulsar.')] })
            if (kickedDB.val().id != myyFactoryDB.val().id) return message.reply({ embeds: [errorEmbed.setDescription('Este membro não é da sua fábrica.')] })

            if (myyFactoryDB.val().funcionario1 == kicked.id) {
                database.ref(`Fabricas/${myFactoryDB.val()}/funcionario1`).set("null")
            }

            if (myyFactoryDB.val().funcionario2 == kicked.id) {
                database.ref(`Fabricas/${myFactoryDB.val()}/funcionario2`).set("null")
            }

            if (myyFactoryDB.val().funcionario3 == kicked.id) {
                database.ref(`Fabricas/${myFactoryDB.val()}/funcionario3`).set("null")
            }

            if (myyFactoryDB.val().funcionario4 == kicked.id) {
                database.ref(`Fabricas/${myFactoryDB.val()}/funcionario4`).set("null")
            }

            if (myyFactoryDB.val().funcionario5 == kicked.id) {
                database.ref(`Fabricas/${myFactoryDB.val()}/funcionario5`).set("null")
            }

            if (myyFactoryDB.val().funcionario6 == kicked.id) {
                database.ref(`Fabricas/${myFactoryDB.val()}/funcionario6`).set("null")
            }

            database.ref(`Global/${kicked.id}/Fabrica`).update({ cargo: "null", id: 0 })
            message.reply({ embeds: [sucEmbed.setTitle('🎫 | Demissão Concedida').setDescription(`Você demitiu \`${kicked.tag}\` com sucesso!`)] })
            kicked.send({ embeds: [errorEmbed.setDescription(`Que pena! Você foi demitido da fábrica ${myyFactoryDB.val().nome}`)] })
                })
            })
        }

        if (cmd == "WORK" || cmd == "TRABALHAR") {
            if (mfactoryDB.val().id == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não está em uma fábrica.')] })

            let cooldown = 3600000
            if (mfactoryDB.val().cooldownWork !== null && cooldown - (Date.now() - mfactoryDB.val().cooldownWork) > 0) {
                let time = ms(cooldown - (Date.now() - mfactoryDB.val().cooldownWork))
                let hours = time.hours > 0 ? `${time.hours} horas,` : ""
                let minutes = time.minutes > 0 ? `${time.minutes} minutos e` : ""
                let seconds = time.seconds > 0 ? `${time.seconds} segundos` : ""
                return message.reply({ embeds: [errorEmbed.setDescription(`Você poderá usar esse comando novamente em ${hours} ${minutes} ${seconds}.`)] })
            } else {
                database.ref(`Global/${message.author.id}/Fabrica/cooldownWork`).set(Date.now())
            }

            let cargoIsCoord = mfactoryDB.val().cargo == "Coordenador" ? Number(50) : 0
            let cargoIsDono = mfactoryDB.val().cargo == "owner" ? Number(100) : 0

            if (myyFactoryDB.val().fabriLevel == 0) {
                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(250) + Number(cargoIsCoord || cargoIsDono))
                return message.reply({ embeds: [sucEmbed.setTitle('👨‍🏭 | Turno Exercido').setDescription(`Você trabalhou na fábrica **${myyFactoryDB.val().nome}** com sucesso e recebeu **${new Intl.NumberFormat('de-DE').format(Number(250) + Number(cargoIsCoord || cargoIsDono))}** ouros!`)] })
            }

            if (myyFactoryDB.val().fabriLevel == 1) {
                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(500) + Number(cargoIsCoord || cargoIsDono))
                return message.reply({ embeds: [sucEmbed.setTitle('👨‍🏭 | Turno Exercido').setDescription(`Você trabalhou na fábrica **${myyFactoryDB.val().nome}** com sucesso e recebeu **${new Intl.NumberFormat('de-DE').format(Number(500) + Number(cargoIsCoord || cargoIsDono))}** ouros!`)] })
            }

            if (myyFactoryDB.val().fabriLevel == 2) {
                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(1000) + Number(cargoIsCoord || cargoIsDono))
                return message.reply({ embeds: [sucEmbed.setTitle('👨‍🏭 | Turno Exercido').setDescription(`Você trabalhou na fábrica **${myyFactoryDB.val().nome}** com sucesso e recebeu **${new Intl.NumberFormat('de-DE').format(Number(1000) + Number(cargoIsCoord || cargoIsDono))}** ouros!`)] })
            }

            if (myyFactoryDB.val().fabriLevel == 3) {
                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(2100) + Number(cargoIsCoord || cargoIsDono))
                return message.reply({ embeds: [sucEmbed.setTitle('👨‍🏭 | Turno Exercido').setDescription(`Você trabalhou na fábrica **${myyFactoryDB.val().nome}** com sucesso e recebeu **${new Intl.NumberFormat('de-DE').format(Number(2100) + Number(cargoIsCoord || cargoIsDono))}** ouros!`)] })
            }

            if (myyFactoryDB.val().fabriLevel == 4) {
                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(4000) + Number(cargoIsCoord || cargoIsDono))
                return message.reply({ embeds: [sucEmbed.setTitle('👨‍🏭 | Turno Exercido').setDescription(`Você trabalhou na fábrica **${myyFactoryDB.val().nome}** com sucesso e recebeu **${new Intl.NumberFormat('de-DE').format(Number(4000) + Number(cargoIsCoord || cargoIsDono))}** ouros!`)] })
            }

            if (myyFactoryDB.val().fabriLevel == 5) {
                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n + Number(6500) + Number(cargoIsCoord || cargoIsDono))
                return message.reply({ embeds: [sucEmbed.setTitle('👨‍🏭 | Turno Exercido').setDescription(`Você trabalhou na fábrica **${myyFactoryDB.val().nome}** com sucesso e recebeu **${Number(6500) + Number(cargoIsCoord || cargoIsDono)}** ouros!`)] })
            }
        }

        if (cmd == "ACEITAR") {
            if (mfactoryDB.val().id != 0) return message.reply({ embeds: [errorEmbed.setDescription('Você já está em uma fábrica.')] })
            if (mfactoryDB.val().convite1 == "null" && mfactoryDB.val().convite2 == "null" && mfactoryDB.val().convite3 == "null") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nenhum convite.')] })

            message.reply({ content: "Forneça o ID da fábrica que deseja entrar", ephemeral: true })
                .then(() => {

            let filter = u => {
                return u.author.id === message.author.id
            }
                
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                .then(async collected => {

            let idFab = parseInt(collected.first().content)
            let acceptDB = await database.ref(`Fabricas/${idFab}`).once('value')

            if (acceptDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Fábrica inexistente.')] })
            if (mfactoryDB.val().convite1 != idFab && mfactoryDB.val().convite2 != idFab && mfactoryDB.val().convite3 != idFab) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nenhum convite desta fábrica...')] })

            if (acceptDB.val().fabriLevel == 0 && acceptDB.val().funcionario1 != "null") return message.reply({ embeds: [errorEmbed.setDescription('Esta fábrica está sem vagas.')] })
            if (acceptDB.val().fabriLevel == 1 && acceptDB.val().funcionario1 != "null" && acceptDB.val().funcionario2 != "null") return message.reply({ embeds: [errorEmbed.setDescription('Esta fábrica está sem vagas.')] })
            if (acceptDB.val().fabriLevel == 2 && acceptDB.val().funcionario1 != "null" && acceptDB.val().funcionario2 != "null" && acceptDB.val().funcionario3 != "null") return message.reply({ embeds: [errorEmbed.setDescription('Esta fábrica está sem vagas.')] })
            if (acceptDB.val().fabriLevel == 3 && acceptDB.val().funcionario1 != "null" && acceptDB.val().funcionario2 != "null" && acceptDB.val().funcionario3 != "null" && acceptDB.val().funcionario4 != "null") return message.reply({ embeds: [errorEmbed.setDescription('Esta fábrica está sem vagas.')] })
            if (acceptDB.val().fabriLevel == 4 && acceptDB.val().funcionario1 != "null" && acceptDB.val().funcionario2 != "null" && acceptDB.val().funcionario3 != "null" && acceptDB.val().funcionario4 != "null" && acceptDB.val().funcionario5 != "null") return message.reply({ embeds: [errorEmbed.setDescription('Esta fábrica está sem vagas.')] })
            if (acceptDB.val().fabriLevel == 5 && acceptDB.val().funcionario1 != "null" && acceptDB.val().funcionario2 != "null" && acceptDB.val().funcionario3 != "null" && acceptDB.val().funcionario4 != "null" && acceptDB.val().funcionario5 != "null" && acceptDB.val().funcionario6 != "null") return message.reply({ embeds: [errorEmbed.setDescription('Esta fábrica está sem vagas.')] })
            if (acceptDB.val().funcionario1 != "null" && acceptDB.val().funcionario2 != "null" && acceptDB.val().funcionario3 != "null" && acceptDB.val().funcionario4 != "null" && acceptDB.val().funcionario5 != "null" && acceptDB.val().funcionario6 != "null") return message.reply({ embeds: [errorEmbed.setDescription('Esta fábrica está sem vagas.')] })

            if (mfactoryDB.val().convite1 == idFab) database.ref(`Global/${message.author.id}/Fabrica/convite1`).set("null")
            if (mfactoryDB.val().convite2 == idFab) database.ref(`Global/${message.author.id}/Fabrica/convite2`).set("null")
            if (mfactoryDB.val().convite3 == idFab) database.ref(`Global/${message.author.id}/Fabrica/convite3`).set("null")

            if (acceptDB.val().funcionario1 == "null") {
                database.ref(`Global/${message.author.id}/Fabrica/cargo`).set("Funcionário")
                database.ref(`Global/${message.author.id}/Fabrica/id`).set(idFab)
                database.ref(`Fabricas/${idFab}/funcionario1`).set(message.author.id)
                return message.reply({ embeds: [sucEmbed.setTitle('🖇️ | Convite Aceito').setDescription(`Você aceitou o convite e agora trabalha na fábrica **${acceptDB.val().nome}**.`)] })
            }

            if (acceptDB.val().funcionario2 == "null") {
                database.ref(`Global/${message.author.id}/Fabrica/cargo`).set("Funcionário")
                database.ref(`Global/${message.author.id}/Fabrica/id`).set(idFab)
                database.ref(`Fabricas/${idFab}/funcionario2`).set(message.author.id)
                return message.reply({ embeds: [sucEmbed.setTitle('🖇️ | Convite Aceito').setDescription(`Você aceitou o convite e agora trabalha na fábrica **${acceptDB.val().nome}**.`)] })
            }

            if (acceptDB.val().funcionario3 == "null") {
                database.ref(`Global/${message.author.id}/Fabrica/cargo`).set("Funcionário")
                database.ref(`Global/${message.author.id}/Fabrica/id`).set(idFab)
                database.ref(`Fabricas/${idFab}/funcionario3`).set(message.author.id)
                return message.reply({ embeds: [sucEmbed.setTitle('🖇️ | Convite Aceito').setDescription(`Você aceitou o convite e agora trabalha na fábrica **${acceptDB.val().nome}**.`)] })
            }

            if (acceptDB.val().funcionario4 == "null") {
                database.ref(`Global/${message.author.id}/Fabrica/cargo`).set("Funcionário")
                database.ref(`Global/${message.author.id}/Fabrica/id`).set(idFab)
                database.ref(`Fabricas/${idFab}/funcionario4`).set(message.author.id)
                return message.reply({ embeds: [sucEmbed.setTitle('🖇️ | Convite Aceito').setDescription(`Você aceitou o convite e agora trabalha na fábrica **${acceptDB.val().nome}**.`)] })
            }

            if (acceptDB.val().funcionario5 == "null") {
                database.ref(`Global/${message.author.id}/Fabrica/cargo`).set("Funcionário")
                database.ref(`Global/${message.author.id}/Fabrica/id`).set(idFab)
                database.ref(`Fabricas/${idFab}/funcionario5`).set(message.author.id)
                return message.reply({ embeds: [sucEmbed.setTitle('🖇️ | Convite Aceito').setDescription(`Você aceitou o convite e agora trabalha na fábrica **${acceptDB.val().nome}**.`)] })
            }

            if (acceptDB.val().funcionario6 == "null") {
                database.ref(`Global/${message.author.id}/Fabrica/cargo`).set("Funcionário")
                database.ref(`Global/${message.author.id}/Fabrica/id`).set(idFab)
                database.ref(`Fabricas/${idFab}/funcionario6`).set(message.author.id)
                return message.reply({ embeds: [sucEmbed.setTitle('🖇️ | Convite Aceito').setDescription(`Você aceitou o convite e agora trabalha na fábrica **${acceptDB.val().nome}**.`)] })
                    }
                })
            })
        }

        if (cmd == "RECUSAR") {
            if (mfactoryDB.val().convite1 == "null" && mfactoryDB.val().convite2 == "null" && mfactoryDB.val().convite3 == "null") return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nenhum convite.')] })

            message.reply({ content: "Forneça o ID da fábrica que deseja recusar o convite", ephemeral: true })
                .then(() => {

            let filter = u => {
                return u.author.id === message.author.id
            }
                
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                .then(async collected => {

            let idFab = parseInt(collected.first().content)
            let acceptDB = await database.ref(`Fabricas/${idFab}`).once('value')

            if (acceptDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Fábrica inexistente.')] })
            if (mfactoryDB.val().convite1 != idFab && mfactoryDB.val().convite2 != idFab && mfactoryDB.val().convite3 != idFab) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui nenhum convite desta fábrica...')] })

            if (mfactoryDB.val().convite1 == idFab) database.ref(`Global/${message.author.id}/Fabrica/convite1`).set("null")
            if (mfactoryDB.val().convite2 == idFab) database.ref(`Global/${message.author.id}/Fabrica/convite2`).set("null")
            if (mfactoryDB.val().convite3 == idFab) database.ref(`Global/${message.author.id}/Fabrica/convite3`).set("null")
            return message.reply({ embeds: [sucEmbed.setDescription('Convite recusado com sucesso!')] })
                })
            })
        }

        if (cmd == "CONVITES" || cmd == "INVITES") {
            let invite1DB = await database.ref(`Fabricas/${mfactoryDB.val().convite1}`).once('value')
            let invite2DB = await database.ref(`Fabricas/${mfactoryDB.val().convite2}`).once('value')
            let invite3DB = await database.ref(`Fabricas/${mfactoryDB.val().convite3}`).once('value')

            let haveInv1 = mfactoryDB.val().convite1 == "null" ? "Não possui" : `Nome: ${invite1DB.val().nome}\nID: ${mfactoryDB.val().convite1}`
            let haveInv2 = mfactoryDB.val().convite2 == "null" ? "Não possui" : `Nome: ${invite2DB.val().nome}\nID: ${mfactoryDB.val().convite2}`
            let haveInv3 = mfactoryDB.val().convite3 == "null" ? "Não possui" : `Nome: ${invite3DB.val().nome}\nID: ${mfactoryDB.val().convite3}`

            let inviteEmbed = new Discord.EmbedBuilder()
                .setTitle(`${emoji.fabricaCategoria} | Seus Convites`)
                .setDescription(`**🗳️ | Convite 1:**\n${haveInv1}\n\n**🗳️ | Convite 2:**\n${haveInv2}\n\n**🗳️ | Convite 3:**\n${haveInv3}`)
                .setFooter({ text: 'Para aceitar use: fabrica aceitar <ID>'})
                .setColor('#A0522D')
            return message.reply({ embeds: [inviteEmbed] })
        }

        if (cmd == "DELETAR" || cmd == "DELETE") {
            if (mfactoryDB.val().id == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não está em uma fábrica.')] })
            if (mfactoryDB.val().cargo != "owner") return message.reply({ embeds: [errorEmbed.setDescription('Somente o fundador da fábrica pode deletá-la.')] })
            message.reply({ embeds: [neutEmbed.setDescription('Você tem certeza que deseja deletar sua fábrica? **Tenha em mente que esta ação é irreversível.**')] }).then((async m => {
                await m.react('✅')

                const filtro = (reaction, user) => user.id === message.author.id;
                const collector = m.createReactionCollector(filtro, { time: 60000 });

                collector.on('collect', (reaction, user) => {
                    if (reaction.emoji.name == "✅") {
                        if (myyFactoryDB.val().funcionario1 != "null") database.ref(`Global/${myyFactoryDB.val().funcionario1}/Fabrica`).update({ cargo: "null", id: 0 })
                        if (myyFactoryDB.val().funcionario2 != "null") database.ref(`Global/${myyFactoryDB.val().funcionario2}/Fabrica`).update({ cargo: "null", id: 0 })
                        if (myyFactoryDB.val().funcionario3 != "null") database.ref(`Global/${myyFactoryDB.val().funcionario3}/Fabrica`).update({ cargo: "null", id: 0 })
                        if (myyFactoryDB.val().funcionario4 != "null") database.ref(`Global/${myyFactoryDB.val().funcionario4}/Fabrica`).update({ cargo: "null", id: 0 })
                        if (myyFactoryDB.val().funcionario5 != "null") database.ref(`Global/${myyFactoryDB.val().funcionario5}/Fabrica`).update({ cargo: "null", id: 0 })
                        if (myyFactoryDB.val().funcionario6 != "null") database.ref(`Global/${myyFactoryDB.val().funcionario6}/Fabrica`).update({ cargo: "null", id: 0 })
                        database.ref(`Global/${myyFactoryDB.val().owner}/Fabrica`).update({ cargo: "null", id: 0 })
                        message.reply({ embeds: [sucEmbed.setTitle(`${emoji.fabricaCategoria} | Fábrica Deletada`).setDescription(`Que pena, você deletou sua fábrica! **${myyFactoryDB.val().nome}** que usava o ID **${myyFactoryDB.val().id}** já não existe mais...`)] })
                        database.ref(`Fabricas/${myFactoryDB.val()}`).remove()
                        m.delete()
                    }
                })
            })
            )
        }

        if (cmd == "HELP" || cmd == "AJUDA") {
            let helpEmbed = new Discord.EmbedBuilder()
                .setTitle(`${emoji.fabricaCategoria} | Fábrica - Ajuda`)
                .setDescription('`fabrica criar` - Criar fábrica;\n`fabrica depositar` - Depositar FabriCoins;\n`fabrica sacar` - Sacar FabriCoins;\n`fabrica nome` - Alterar o nome;\n`fabrica evoluir` - Evoluir FabriLevel;\n`fabrica funcionários` - Lista de funcionários;\n`fabrica convidar` - Convide alguém;\n`fabrica promover` - Promova alguém;\n`fabrica expulsar` - Expulse alguém;\n`fabrica trabalhar` - Trabalhe na fábrica;\n`fabrica aceitar` - Aceite um convite;\n`fabrica recusar` - Recuse um convite;\n`fabrica convites` - Veja seus convites\n`fabrica deletar` - Delete sua fábrica;\n`fabrica info` - Veja informações da sua fábrica.')
                .setColor('#8B5742')
            return message.reply({ embeds: [helpEmbed] })
        }

        if (cmd == "INFO" || cmd == "INFORMACOES" || cmd == "INFORMAÇÕES") {
            if (mfactoryDB.val().id == 0) return message.reply({ embeds: [errorEmbed.setDescription('Você não está em uma fábrica.')] })
            let infoEmbed = new Discord.EmbedBuilder()
                .setTitle(`${emoji.fabricaCategoria} | Informações de ${myyFactoryDB.val().nome}`)
                .setDescription(`**${emoji.info} | Fábrica**\n**ㅤNome:** ${myyFactoryDB.val().nome}\n**ㅤID:** ${myyFactoryDB.val().id}\n\n**🪙 | Saldo**\n**ㅤFabriCoins:** ${new Intl.NumberFormat('de-DE').format(myyFactoryDB.val().fabriCoins)}\n**ㅤFabriLevel:** ${new Intl.NumberFormat('de-DE').format(myyFactoryDB.val().fabriLevel)}`)
                .setColor('#977257')
            return message.reply({ embeds: [infoEmbed] })
            }
        })
    }
}