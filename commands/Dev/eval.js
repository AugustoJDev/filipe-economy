const Discord = require("discord.js");
module.exports = {
    name: "eval",
    aliases: [], // pode botar quantas vc quiser
    async execute(client, message, args, database) {
        if (!infos.economyOwners.includes(message.author.id)) return;

        try {
            let codein = args.join(" ");
            if (!codein) return;
            let code = eval(codein);

            if (typeof code !== 'string')
                code = require('util').inspect(code, { depth: 0 });
            let embed = new Discord.EmbedBuilder()
                .setColor('#F2C438')
                .addFields({ 
                    name: '\:inbox_tray: Entrada', value: `\`\`\`js\n${codein}\`\`\``
                }, 
                {
                    name: '\:outbox_tray: Saída', value: `\`\`\`js\n${code}\n\`\`\``
                })
            message.channel.send({ embeds: [embed] });
        } catch (e) {
            message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
        }
    }
}
