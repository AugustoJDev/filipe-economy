const Discord = require('discord.js')
module.exports = {
    name: "help",
    aliases: ["ajuda", "comandos", "commands"],
    async execute(client, message, args) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')
            .setTimestamp()
            .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true, format: 'webp', size: 2048 })}` })

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')
            .setTimestamp()
            .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })

        if (!args[0]) return message.reply({ embeds: [errorEmbed.setDescription(`O meu prefixo é **t.**\n Use o comando \`t.help <sistema>\` para mais detalhes de um sistema.\n\n**Sistemas Disponíveis:**\n${emoji.staffCategoria} \`ADM\`\n 💰 \`Diários\`\n${emoji.escavarCategoria} \`Escavação\`\n🏭 \`Fábrica\`\n💵 \`Mega-Sena\`\n🎣 \`Pesca\`\n🐶 \`Pets\`\n🔪 \`Ranqueada\`\n🔖 \`Outros\``)] })
        let hh = args[0].toUpperCase()

        if (hh == "ADM") {
            if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [errorEmbed.setDescription('Ops! Você não é um administrador...')] })
            let admEmbed = new Discord.EmbedBuilder()
                .setTitle(`${emoji.staffCategoria} | Administração`)
                .setDescription('`adddiamante`, `addouro`, `megasena iniciar`, `remdiamante`, `remouro`')
                .setColor('#FF4040')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })
            return message.reply({ embeds: [admEmbed] })
        }

        if (hh == "DIÁRIOS" || hh == "DIARIOS" || hh == "DIÁRIO" || hh == "DIARIO") {
            let dailyEmbed = new Discord.EmbedBuilder()
                .setTitle('🌞 | Diários')
                .setDescription('`booster`, `daily`, `dailyvip`')
                .setColor('#FF8C00')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })
            return message.reply({ embeds: [dailyEmbed] })
        }

        if (hh == "ESCAVAÇÃO" || hh == "ESCAVACAO") {
            let escavacaoEmbed = new Discord.EmbedBuilder()
                .setTitle(`${emoji.escavarCategoria} | Escavação`)
                .setDescription('`escavacao start` - Inicia uma escavação;\n`escavacao info` - Informações da escavação;\n`escavacao loja` - Loja da escavação.')
                .setColor('#CD6839')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })
            return message.reply({ embeds: [escavacaoEmbed] })
        }

        if (hh == "FACTORY" || hh == "FACTORYS" || hh == "FABRICA" || hh == "FÁBRICA" || hh == "FABRICAS" || hh == "FÁBRICAS") {
            let factoryEmbed = new Discord.EmbedBuilder()
                .setTitle(`${emoji.fabricaCategoria} | Fábricas`)
                .setDescription('`fabrica criar` - Criar fábrica;\n`fabrica depositar <valor>` - Depositar FabriCoins na fábrica;\n`fabrica sacar <valor>` - Sacar FabriCoins da fábrica;\n`fabrica nome <nome>` - Altera nome da fábrica;\n`fabrica evoluir` - Evoluir FabriLevel;\n`fabrica funcionarios` - Ver funcionários da fábrica;\n`fabrica convidar <@membro>` - Contratar funcionário;\n`fabrica promover <@membro>` - Promover funcionário;\n`fabrica expulsar <@membro>` Demitir funcionário;\n`fabrica trabalhar/work` - Trabalhar na fábrica;\n`fabrica aceitar <id>` - Aceitar convite;\n`fabrica recusar <id>` - Recusar convite;\n`fabrica convites` - Mostra lista de convites;\n`fabrica deletar` - Deletar fábrica;\n`fabrica info` - Informações da fábrica.')
                .setColor('#87CEEB')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })
            return message.reply({ embeds: [factoryEmbed] })
        }

        if (hh == "MEGA-SENA" || hh == "MEGASENA" || hh == "MEGA SENA") {
            let msEmbed = new Discord.EmbedBuilder()
                .setTitle('🎫 | Mega-Sena')
                .setDescription('`megasena ticket` - Comprar um ticket;\n`megasena info` - Informações da Mega-Sena.')
                .setColor('#FFD700')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })
            return message.reply({ embeds: [msEmbed] })
        }

        if (hh == "PESCA" || hh == "FISH") {
            let fishEmbed = new Discord.EmbedBuilder()
                .setTitle('🐟 | Pesca')
                .setDescription('`pesca enviar <id>` - Enviar barco;\n`pesca comprar <id>` - Comprar comida, água, saúde ou gasolina;\n`pesca vender` - Recolher e vender peixes pescados;\n`pesca info` - Informações da pesca.')
                .setColor('#6495ED')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })
            return message.reply({ embeds: [fishEmbed] })
        }

        if (hh == "PET" || hh == "PETS") {
            let petsEmbed = new Discord.EmbedBuilder()
                .setTitle('🐶 | Pets')
                .setDescription('`pets alimentar` - Alimentar seu pet;\n`pets produzir` - Produzir algo com seu pet;\n`pets info` - Informações dos seus pets;\n`pets loja` - Loja de pets;\n`pets vender` - Vender produção dos seus pets.')
                .setColor('#CD6839')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })
            return message.reply({ embeds: [petsEmbed] })
        }

        if (hh == "RANQUEADA" || hh == "RANQUEADAS" || hh == "RANKED" || hh == "RANKEDS") {
            let rankedEmbed = new Discord.EmbedBuilder()
                .setTitle('⚔️ | Ranqueada')
                .setDescription('`ranqueada start` - Iniciar uma batalha;\n`ranqueada loja` - Loja Ranqueada;\n`ranqueada info` - Suas informações ranqueadas;\n`ranqueada top` - Ranking de vitórias.')
                .setColor('#9C9C9C')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })
            return message.reply({ embeds: [rankedEmbed] })
        }

        if (hh == "OUTROS" || hh == "OUTRO") {
            let otherEmbed = new Discord.EmbedBuilder()
                .setTitle('🔔 | Outros')
                .setDescription('`cooldown` - Veja o cooldown dos seus comandos;\n`depositar` - Deposite ouro no cofre;\n`fianca` - Pague a fiança da sua prisão;\n`loja` - Veja a loja;\n`pagar` - Envie ouro para outro jogador;\n`retirar` - Saque ouro do seu cofre;\n`roubar` - Roube outro jogador;\n`top` - Veja o ranking de riqueza.')
                .setColor('#FFA500')
                .setTimestamp()
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })
            return message.reply({ embeds: [otherEmbed] })
        }
    }
}