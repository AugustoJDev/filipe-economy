const Discord = require("discord.js");
module.exports = {
    name: "ping",
    aliases: [],
    async execute(client, message, args) {

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')
        message.reply({ embeds: [sucEmbed.setDescription(`Meu ping é ${Math.round(client.ws.ping)}ms`)] })
    }
}