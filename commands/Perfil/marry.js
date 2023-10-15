const Discord = require("discord.js")
const ms = require("parse-ms")
const { prefix } = require("../../config.json")
module.exports = {
    name: "marry",
    aliases: ["marry", "casar"],
    async execute(client, message, args, database) {

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')
        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let mention = message.mentions.users.first().id;
        let mentionUser = message.guild.members.cache.get(mention);

        if(!mentionUser) return message.reply({
            embeds: [errorEmbed.setDescription("Mencione um usuário ou forneça o ID")]
        });

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value');
        let parAuthor = memberDB.val().par;
        let parMention = await database.ref(`Global/${mentionUser.user.id}`).once('value');

        if(!parMention.val()) return message.reply({
            embeds: [errorEmbed.setDescription(`O usuário mencionado não está salvo no banco de dados... Peça para que ele use o comando \`${prefix}registrar\` para poder usar o comando.`)]
        })

        if(parMention.val().par !== "Ninguém") return message.reply({
            embeds: [errorEmbed.setDescription(`O usuário ${mentionUser.user} já está casado com alguém... Peça para ele se divorciar ou escolha outra pessoa.`)]
        });
        if(parAuthor !== "Ninguém") return message.reply({
            embeds: [errorEmbed.setDescription(`Você já está casado com alguém... Tente se divorciar para casar com esse usuário.`)]
        })

        const msg = await message.channel.send({
            content: `${mentionUser}`,
            embeds: [
                sucEmbed
                    .setTitle("Pedido de casamento recebido")
                    .setDescription(`Reaja com \`${emoji.confirmar}\` para aceitar o pedido de casamento, ou \`${emoji.recusar}\` para recusar.`)
                ]
        })

            await msg.react(`${emoji.confirmar}`);
            await msg.react(`${emoji.recusar}`);

            const filter = (reaction, user) => {
                return [`${emoji.confirmar}`, `${emoji.recusar}`].includes(reaction.emoji.id) && user.id === mention
            };

            const collector = msg.createReactionCollector({ filter, time: 60000 })
            
                collector.on('collect', async (reaction, user) => {

		            if (reaction.emoji.id === `${emoji.confirmar}`) {
			            await database.ref(`Global/${message.author.id}`).update({
                            par: mentionUser.user.id
                        })
                        await database.ref(`Global/${mentionUser.user.id}`).update({
                            par: message.author.id
                        })

                        message.channel.send({
                            embeds: [
                                sucEmbed
                                    .setTitle("Vocês se casaram com sucesso")
                                    .setDescription(`Os usuários ${message.author} e ${mentionUser.user} agora estão casados!`)
                            ]
                        })

                        setTimeout(() => {
                            msg.delete()
                        }, 5000)

		            } else if (reaction.emoji.id === `${emoji.recusar}`) {
			            message.channel.send({
                            embeds: [
                                errorEmbed
                                    .setDescription(`O usuário ${mentionUser.user} recusou seu pedido`)
                            ]
                        });

                        setTimeout(() => {
                            msg.delete()
                        }, 5000)
		            }
	            })

                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} items`);
                });
    }
}