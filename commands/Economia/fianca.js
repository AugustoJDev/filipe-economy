const Discord = require('discord.js')
module.exports = {
    name: "fianca",
    aliases: [],
    async execute(client, message, args, database) {

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let neutEmbed = new Discord.EmbedBuilder()
            .setColor('#40C0FF')

        if (memberDB.val().preso == "true") {
            if (Number(memberDB.val().ouro) < 2000) return message.reply({ embeds: [errorEmbed.setDescription(`Você não tem ouro suficiente! São necessários **2.000** ${emoji.moeda}.`)] })
            message.reply({ embeds: [neutEmbed.setDescription(`Você tem certeza que deseja pagar a fiança? Isso lhe custará **2000** ${emoji.moeda}.`)] }).then(async msg => {
                await msg.react(`${emoji.confirmar}`)

                const filtro = (reaction, user) => user.id === message.author.id;
                const collector = msg.createReactionCollector(filtro, { time: 60000 });

                collector.on('collect', (reaction, user) => {

                    if (reaction.emoji.id === `${emoji.confirmar}`) {
                        msg.delete()
                        database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(2000))
                        database.ref(`Global/${message.author.id}/preso`).set("false")
                        message.reply({ embeds: [sucEmbed.setTitle('🛏️ | Fiança').setDescription(`Você pagou a fiança e agora está liberto!`)] })
                    }

                })
            })

        } else {
            return message.reply({ embeds: [errorEmbed.setDescription('Você não está preso.')] })
        }

    }
}