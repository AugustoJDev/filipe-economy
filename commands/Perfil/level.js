const Discord = require('discord.js')
const canvacord = require("canvacord");
module.exports = {
    name: "level",
    aliases: ["nivel"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let neutEmbed = new Discord.EmbedBuilder()

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        let profileDB = await database.ref(`Global/${message.author.id}/Perfil/Level`).once('value')

        if (profileDB.val().ativo == "COLOR") atv = profileDB.val().cor
        if (profileDB.val().ativo == "IMAGE") atv = profileDB.val().imagem

        if (!args[0]) {
            const data = 'https://i.imgur.com/jrmeku7.png'

            const rank = new canvacord.Rank()
                .setAvatar(message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
                .setCurrentXP(memberDB.val().xp)
                .setRequiredXP(memberDB.val().level * 500)
                .setStatus(message.guild.members.cache.get(message.author.id).presence.status)
                .setLevel(memberDB.val().level)
                .setRank(0, 0, false)
                .setProgressBar("#FFFFFF", "COLOR")
                .setBackground(profileDB.val().ativo, atv)
                .setUsername(message.author.username, '#FFFFFF')
                .setDiscriminator(message.author.discriminator, '#FFFFFF')

            rank.build()
                .then(data => {
                    const attachment = new Discord.AttachmentBuilder(data, "RankCard.png");
                    message.reply({ files: [attachment] });
                });
            return;
        }

        if (args[0].toUpperCase() == "COR") {
            let colorhx = args[1]
            if (!imagem) return message.reply({ embeds: [errorEmbed.setDescription(`Você não inseriu a cor. Use #.`)] })
            if (memberDB.val().ouro < 1000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessários `1000` ouros.')] })
            if (colorhx.length != 7 || !colorhx.startsWith('#')) return message.reply({ embeds: [errorEmbed.setDescription('Código inválido.')] })
            database.ref(`Global/${message.author.id}/Perfil/Level/cor`).set(colorhx)
            database.ref(`Global/${message.author.id}/Perfil/Level/ativo`).set("COLOR")
            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(1000))
            return message.reply({ embeds: [neutEmbed.setTitle('🖌️ | Cor do Level atualizado!').setDescription(`Você atualizou sua cor do level para **${colorhx}** com sucesso!`).setColor(colorhx)] })
        }

        if (args[0].toUpperCase() == "IMAGEM") {
            let imagem = args[1]
            if (!imagem) return message.reply({ embeds: [errorEmbed.setDescription(`Você não inseriu a imagem. Use https://.`)] })
            if (memberDB.val().ouro < 1000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessários `1000` ouros.')] })
            if (!imagem.startsWith('https://') || !imagem.startsWith('http://')) return message.reply({ embeds: [errorEmbed.setDescription('Link inválido. Use (https://)')] })
            database.ref(`Global/${message.author.id}/Perfil/Level/imagem`).set(imagem)
            database.ref(`Global/${message.author.id}/Perfil/Level/ativo`).set("IMAGE")
            database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(1000))
            return message.reply({ embeds: [neutEmbed.setTitle('🖌️ | Imagem do Level atualizado!').setDescription(`Você atualizou sua imagem do level com sucesso!`).setColor('#5F9EA0')] })
        }

    }
}