const Discord = require('discord.js')
const fs = require("fs");
module.exports = {
    name: "reload",
    aliases: [],
    async execute(client, message, args) {
        if (!infos.economyOwners.includes(message.author.id)) return message.reply("Você não tem permissão!");

        fs.readdir("./commands/", (err, folders) => {
            if (err) return console.error(err);
            folders.forEach(folder => {
                fs.readdir(`./commands/${folder}/`, (err, files) => {
                    files.forEach(file => {
                        if (!file.endsWith(".js")) return;
                        let props = require(`../${folder}/${file}`);
                        let commandName = file.split(".")[0];
                        client.commands.set(commandName, props);

                        delete require.cache[require.resolve(`../${folder}/${commandName}.js`)];
                        client.commands.delete(commandName)
                        client.commands.set(commandName, props);
                    })
                })
            });
        });

        fs.readdir("./commands/", (err, folders) => {
            if (err) return console.error(err);
            folders.forEach(folder => {
                fs.readdir(`./commands/${folder}/`, (err, files) => {
                    files.forEach(file => {
                        if (!file.endsWith(".js")) return;
                        let props = require(`../${folder}/${file}`);
                        let commandName = file.split(".")[0];
                        client.commands.set(commandName, props);

                        delete require.cache[require.resolve(`../${folder}/${commandName}.js`)];
                        client.commands.delete(commandName)
                        client.commands.set(commandName, props);
                    })
                })
            });
        });

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')
        await message.channel.send({ embeds: [sucEmbed.setDescription('Atualizei os comandos com sucesso!')] })
    }
}