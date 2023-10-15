const Discord = require('discord.js')
module.exports = {
    name: "saldo",
    aliases: ["cofre", "carteira", "ouro", "diamante"],
    async execute(client, message, args, database) {

        let usuario = message.mentions.members.first()
        if (usuario) tag = usuario.user.tag
        if (!usuario) usuario = message.author, tag = message.author.tag
        let memberDB = await database.ref(`Global/${usuario.id}`).once('value')

        message.reply({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(`${emoji.carteira} | Fortuna de \`` + tag + `\``)
                .setTimestamp()
                .setDescription(`${emoji.moeda} **BillyCoin:** ${new Intl.NumberFormat('de-DE').format(memberDB.val().ouro)}\n${emoji.gema} **Gemas:** ${new Intl.NumberFormat('de-DE').format(memberDB.val().diamante)}\n${emoji.cofre} **Cofre:** ${new Intl.NumberFormat('de-DE').format(memberDB.val().ouroCofre)}`)
                .setColor('#FFD700')
                .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })]
        })

    }
}