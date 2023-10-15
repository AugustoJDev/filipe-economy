const Discord = require('discord.js');
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');

global.client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates
    ], 
});

const { token, prefix } = require('./config.json')
const firebase = require('firebase');

global.infos = require("./infos.json")

require("./emojis.js");

var configF = {
    apiKey: "AIzaSyBBp_aNTUki6psv1nEt0PP7u4N-qkPa3GA",
    authDomain: "filipedozap.firebaseapp.com",
    databaseURL: "https://filipedozap-default-rtdb.firebaseio.com",
    projectId: "filipedozap",
    storageBucket: "filipedozap.appspot.com",
    messagingSenderId: "712185979884",
    appId: "1:712185979884:web:ecf9438aa467c1d8e096c9"
  };
firebase.initializeApp(configF);
const database = firebase.database();

client.commands = new Discord.Collection()

// Carregar commands
fs.readdir("./commands/", (err, folders) => {
    if (err) return console.error(err);
    folders.forEach(folder => {
        fs.readdir(`./commands/${folder}/`, (err, files) => {
            console.log(`[${folder.toUpperCase()}] Carregando um total de ${files.length} comando(s)`);

            files.forEach(file => {
                if (!file.endsWith(".js")) return;
                let props = require(`./commands/${folder}/${file}`);
                let commandName = file.split(".")[0];
                console.log(`Carregando: ${commandName}`);
                client.commands.set(commandName, props);
            })
        })
    });
});

// Linha 8 a 19: Carregar comandos e setar eles na Collection

let fEmbed = new Discord.EmbedBuilder()
    .setColor('#EEEE00')

let errorEmbed = new Discord.EmbedBuilder()
    .setColor('#FF4040')

let sucEmbed = new Discord.EmbedBuilder()
    .setColor('#4CFF40')

client.on('ready', async () => {
    console.log(`${client.user.tag} foi iniciado com sucesso.`)
    client.user.setPresence({ activities: [{ name: `o meu prefixo: t.`, status: `online` }], type: `PLAYING` });

    setInterval(async () => {
        const msg = await client.channels.cache.get(infos.pickChannel).send(`**📦 | Pick**\nEnvie "pick" no chat para ter a chance de coletar o prêmio`)

        const filter = msg => msg.content == "pick"
        const collector = msg.channel.createMessageCollector({filter, time: 5000 })
        let usersArray = []

        collector.on('collect', aMsg => {
            var add = usersArray.push(aMsg.author.id)

            aMsg.react(infos.pickReaction)
        })

        collector.on('end', async () => {
            const bMsg = await client.channels.cache.get(infos.pickChannel).send(`Calculando vencedor...`)
            if (usersArray.length == 0) return bMsg.channel.send(`Ninguém tentou pegar o prêmio! :(`)
            const winnerNumber = Math.floor(Math.random() * (usersArray.length - 1 - 0 + 1)) + 0;
            const winner = usersArray[winnerNumber];
            const winnerInfos = client.users.cache.get(winner)

            setTimeout(() => {
                bMsg.channel.send(`Parabéns ${winnerInfos}! Você ganhou o prêmio do pick!`)
                database.ref(`Global/${winnerInfos.id}/ouro`).transaction(n => n + Number(1000))
            }, 3000)
        })
    }, 10800000)
})

client.on('voiceStateUpdate', async (newState, oldState) => {
    let memberDB = await database.ref(`Global/${oldState.id}/Perfil`).once('value')

    if (newState.guild.id != infos.economyGuild) return;
    if (oldState.bot) return;
    if (memberDB.val() == null) return;
    let conta = Number(memberDB.val().callTime) + Number(Date.now()) - Number(memberDB.val().tempHorary)

    let gemaGanha = Number(Date.now()) - Number(memberDB.val().tempHorary)
    let gemaG = parseInt(gemaGanha / 1000)

    if (oldState.channelID != null) {
        if (oldState.selfMute && memberDB.val().tempHorary == null) return;
        if (oldState.selfMute) {
            database.ref(`Global/${oldState.id}/Perfil/tempHorary`).remove()
            database.ref(`Global/${oldState.id}/Perfil/callTime`).set(conta)
            database.ref(`Global/${oldState.id}/diamante`).set(gemaG)
            database.ref(`Global/${oldState.id}/Perfil/gemasCall`).set(gemaG)
            return database.ref(`Global/${oldState.id}/diamantes`).set(parseInt(conta / 1800000))
        }
        database.ref(`Global/${oldState.id}/Perfil/tempHorary`).set(Date.now())
    } else {
        database.ref(`Global/${oldState.id}/Perfil/tempHorary`).remove()
        if (conta <= 0 || memberDB.val().tempHorary == null) return;
        database.ref(`Global/${oldState.id}/Perfil/callTime`).set(conta)
        database.ref(`Global/${oldState.id}/diamante`).set(gemaG)
        database.ref(`Global/${oldState.id}/Perfil/gemasCall`).set(gemaG)
        return database.ref(`Global/${oldState.id}/diamantes`).set(parseInt(conta / 1800000))
    }
})

client.on('messageCreate', async message => {

    if (message.author.bot) return
    if (message.content == "<@" + client.user.id + ">" || message.content == "<@!" + client.user.id + ">") return message.reply({ embeds: [fEmbed.setDescription("Meu prefixo é ``b.`` e você pode encontrar meus comandos digitando ``b.help``")] })

    let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
    let farmDB = await database.ref(`Global/${message.author.id}/Fazenda`).once('value')

    // TIMEOUTs/INTERVALs
    if (farmDB.val() != null) {
        let plantType1 = farmDB.val().hectare1
        let plantType2 = farmDB.val().hectare2
        let plantType3 = farmDB.val().hectare3
        let plantType4 = farmDB.val().hectare4
        let plantType5 = farmDB.val().hectare5
        let plantType6 = farmDB.val().hectare6
        let plantType7 = farmDB.val().hectare7
        let plantType8 = farmDB.val().hectare8
        let plantType9 = farmDB.val().hectare9
        let plantType10 = farmDB.val().hectare10

        if (!['notHave', 'null', 'arado'].includes(farmDB.val().hectare1) && !farmDB.val().hectare1.endsWith('Pronto')) {
            if (plantType1) {
                if (plantType1 == "milho") {
                    cooldown = 4200000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 4200000 / 1.5
                }

                if (plantType1 == "cenoura") {
                    cooldown = 6600000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 6600000 / 1.5
                }

                if (plantType1 == "cereja") {
                    cooldown = 7800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 7800000 / 1.5
                }

                if (plantType1 == "tomate") {
                    cooldown = 10800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 10800000 / 1.5
                }

                if (plantType1 == "batata") {
                    cooldown = 5400000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 5400000 / 1.5
                }

                if (plantType1 == "manga") {
                    cooldown = 9000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 9000000 / 1.5
                }

                if (plantType1 == "melao") {
                    cooldown = 15000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 15000000 / 1.5
                }

                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare1`).set(`${plantType1}Pronto`)
                }, cooldown);
            }
        }

        if (!['notHave', 'null', 'arado'].includes(farmDB.val().hectare2) && !farmDB.val().hectare2.endsWith('Pronto')) {
            if (plantType2) {
                if (plantType2 == "milho") {
                    cooldown = 4200000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 4200000 / 1.5
                }

                if (plantType2 == "cenoura") {
                    cooldown = 6600000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 6600000 / 1.5
                }

                if (plantType2 == "cereja") {
                    cooldown = 7800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 7800000 / 1.5
                }

                if (plantType2 == "tomate") {
                    cooldown = 10800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 10800000 / 1.5
                }

                if (plantType2 == "batata") {
                    cooldown = 5400000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 5400000 / 1.5
                }

                if (plantType2 == "manga") {
                    cooldown = 9000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 9000000 / 1.5
                }

                if (plantType2 == "melao") {
                    cooldown = 15000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 15000000 / 1.5
                }

                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare2`).set(`${plantType2}Pronto`)
                }, cooldown);
            }
        }

        if (!['notHave', 'null', 'arado'].includes(farmDB.val().hectare3) && !farmDB.val().hectare3.endsWith('Pronto')) {
            if (plantType3) {
                if (plantType3 == "milho") {
                    cooldown = 4200000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 4200000 / 1.5
                }

                if (plantType3 == "cenoura") {
                    cooldown = 6600000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 6600000 / 1.5
                }

                if (plantType3 == "cereja") {
                    cooldown = 7800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 7800000 / 1.5
                }

                if (plantType3 == "tomate") {
                    cooldown = 10800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 10800000 / 1.5
                }

                if (plantType3 == "batata") {
                    cooldown = 5400000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 5400000 / 1.5
                }

                if (plantType3 == "manga") {
                    cooldown = 9000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 9000000 / 1.5
                }

                if (plantType3 == "melao") {
                    cooldown = 15000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 15000000 / 1.5
                }

                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare3`).set(`${plantType3}Pronto`)
                }, cooldown);
            }
        }

        if (!['notHave', 'null', 'arado'].includes(farmDB.val().hectare4) && !farmDB.val().hectare4.endsWith('Pronto')) {
            if (plantType4) {
                if (plantType4 == "milho") {
                    cooldown = 4200000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 4200000 / 1.5
                }

                if (plantType4 == "cenoura") {
                    cooldown = 6600000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 6600000 / 1.5
                }

                if (plantType4 == "cereja") {
                    cooldown = 7800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 7800000 / 1.5
                }

                if (plantType4 == "tomate") {
                    cooldown = 10800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 10800000 / 1.5
                }

                if (plantType4 == "batata") {
                    cooldown = 5400000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 5400000 / 1.5
                }

                if (plantType4 == "manga") {
                    cooldown = 9000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 9000000 / 1.5
                }

                if (plantType4 == "melao") {
                    cooldown = 15000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 15000000 / 1.5
                }

                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare4`).set(`${plantType4}Pronto`)
                }, cooldown);
            }
        }

        if (!['notHave', 'null', 'arado'].includes(farmDB.val().hectare5) && !farmDB.val().hectare5.endsWith('Pronto')) {
            if (plantType5) {
                if (plantType5 == "milho") {
                    cooldown = 4200000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 4200000 / 1.5
                }

                if (plantType5 == "cenoura") {
                    cooldown = 6600000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 6600000 / 1.5
                }

                if (plantType5 == "cereja") {
                    cooldown = 7800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 7800000 / 1.5
                }

                if (plantType5 == "tomate") {
                    cooldown = 10800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 10800000 / 1.5
                }

                if (plantType5 == "batata") {
                    cooldown = 5400000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 5400000 / 1.5
                }

                if (plantType5 == "manga") {
                    cooldown = 9000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 9000000 / 1.5
                }

                if (plantType5 == "melao") {
                    cooldown = 15000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 15000000 / 1.5
                }

                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare5`).set(`${plantType5}Pronto`)
                }, cooldown);
            }
        }

        if (!['notHave', 'null', 'arado'].includes(farmDB.val().hectare6) && !farmDB.val().hectare6.endsWith('Pronto')) {
            if (plantType6) {
                if (plantType6 == "milho") {
                    cooldown = 4200000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 4200000 / 1.5
                }

                if (plantType6 == "cenoura") {
                    cooldown = 6600000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 6600000 / 1.5
                }

                if (plantType6 == "cereja") {
                    cooldown = 7800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 7800000 / 1.5
                }

                if (plantType6 == "tomate") {
                    cooldown = 10800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 10800000 / 1.5
                }

                if (plantType6 == "batata") {
                    cooldown = 5400000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 5400000 / 1.5
                }

                if (plantType6 == "manga") {
                    cooldown = 9000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 9000000 / 1.5
                }

                if (plantType6 == "melao") {
                    cooldown = 15000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 15000000 / 1.5
                }

                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare6`).set(`${plantType6}Pronto`)
                }, cooldown);
            }
        }

        if (!['notHave', 'null', 'arado'].includes(farmDB.val().hectare7) && !farmDB.val().hectare7.endsWith('Pronto')) {
            if (plantType7) {
                if (plantType7 == "milho") {
                    cooldown = 4200000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 4200000 / 1.5
                }

                if (plantType7 == "cenoura") {
                    cooldown = 6600000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 6600000 / 1.5
                }

                if (plantType7 == "cereja") {
                    cooldown = 7800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 7800000 / 1.5
                }

                if (plantType7 == "tomate") {
                    cooldown = 10800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 10800000 / 1.5
                }

                if (plantType7 == "batata") {
                    cooldown = 5400000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 5400000 / 1.5
                }

                if (plantType7 == "manga") {
                    cooldown = 9000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 9000000 / 1.5
                }

                if (plantType7 == "melao") {
                    cooldown = 15000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 15000000 / 1.5
                }

                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare7`).set(`${plantType7}Pronto`)
                }, cooldown);
            }
        }

        if (!['notHave', 'null', 'arado'].includes(farmDB.val().hectare8) && !farmDB.val().hectare8.endsWith('Pronto')) {
            if (plantType8) {
                if (plantType8 == "milho") {
                    cooldown = 4200000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 4200000 / 1.5
                }

                if (plantType8 == "cenoura") {
                    cooldown = 6600000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 6600000 / 1.5
                }

                if (plantType8 == "cereja") {
                    cooldown = 7800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 7800000 / 1.5
                }

                if (plantType8 == "tomate") {
                    cooldown = 10800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 10800000 / 1.5
                }

                if (plantType8 == "batata") {
                    cooldown = 5400000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 5400000 / 1.5
                }

                if (plantType8 == "manga") {
                    cooldown = 9000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 9000000 / 1.5
                }

                if (plantType8 == "melao") {
                    cooldown = 15000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 15000000 / 1.5
                }

                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare8`).set(`${plantType8}Pronto`)
                }, cooldown);
            }
        }

        if (!['notHave', 'null', 'arado'].includes(farmDB.val().hectare9) && !farmDB.val().hectare9.endsWith('Pronto')) {
            if (plantType9) {
                if (plantType9 == "milho") {
                    cooldown = 4200000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 4200000 / 1.5
                }

                if (plantType9 == "cenoura") {
                    cooldown = 6600000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 6600000 / 1.5
                }

                if (plantType9 == "cereja") {
                    cooldown = 7800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 7800000 / 1.5
                }

                if (plantType9 == "tomate") {
                    cooldown = 10800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 10800000 / 1.5
                }

                if (plantType9 == "batata") {
                    cooldown = 5400000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 5400000 / 1.5
                }

                if (plantType9 == "manga") {
                    cooldown = 9000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 9000000 / 1.5
                }

                if (plantType9 == "melao") {
                    cooldown = 15000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 15000000 / 1.5
                }

                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare9`).set(`${plantType9}Pronto`)
                }, cooldown);
            }
        }

        if (!['notHave', 'null', 'arado'].includes(farmDB.val().hectare10) && !farmDB.val().hectare10.endsWith('Pronto')) {
            if (plantType10) {
                if (plantType10 == "milho") {
                    cooldown = 4200000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 4200000 / 1.5
                }

                if (plantType10 == "cenoura") {
                    cooldown = 6600000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 6600000 / 1.5
                }

                if (plantType10 == "cereja") {
                    cooldown = 7800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 7800000 / 1.5
                }

                if (plantType10 == "tomate") {
                    cooldown = 10800000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 10800000 / 1.5
                }

                if (plantType10 == "batata") {
                    cooldown = 5400000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 5400000 / 1.5
                }

                if (plantType10 == "manga") {
                    cooldown = 9000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 9000000 / 1.5
                }

                if (plantType10 == "melao") {
                    cooldown = 15000000
                    if (memberDB.val().Pets.coelhoAlimentado == "true") cooldown = 15000000 / 1.5
                }

                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Fazenda/hectare10`).set(`${plantType10}Pronto`)
                }, cooldown);
            }
        }
    }

    // PETS
    if (memberDB.val() != null && memberDB.val().Pets != null) {
        if (memberDB.val().Pets.cachorro == "true") {
            if (memberDB.val().Pets.cachorroAlimentado == "true") {
                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Pets/cachorroAlimentado`).set("false")
                }, 28800000);
            }
        }

        if (memberDB.val().Pets.papagaio == "true") {
            if (memberDB.val().Pets.papagaioAlimentado == "true") {
                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Pets/papagaioAlimentado`).set("false")
                }, 14400000);
            }

            setTimeout(() => {
                database.ref(`Global/${message.author.id}/Pets/papagaio`).set("false")
            }, 259200000);
        }

        if (memberDB.val().Pets.coelho == "true") {
            if (memberDB.val().Pets.coelhoAlimentado == "true") {
                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Pets/coelhoAlimentado`).set("false")
                }, 21600000);
            }

            setTimeout(() => {
                database.ref(`Global/${message.author.id}/Pets/coelho`).set("false")
            }, 259200000);
        }

        if (memberDB.val().Pets.pinguim == "true") {
            if (memberDB.val().Pets.pinguimAlimentado == "true") {
                setTimeout(() => {
                    database.ref(`Global/${message.author.id}/Pets/pinguimAlimentado`).set("false")
                }, 14400000);
            }

            setTimeout(() => {
                database.ref(`Global/${message.author.id}/Pets/pinguim`).set("false")
            }, 604800000);
        }
    }

    if (!message.content.toLowerCase().startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    if (cmdName != "registrar") {
        if (memberDB.val() == null) return message.reply({ embeds: [errorEmbed.setDescription('Não é possível usar meus comandos sem antes se registrar. Use `b.registrar`')] })
    }

    if (memberDB.val() != null) {
        if (memberDB.val().xp >= memberDB.val().level * 500) {
            database.ref(`Global/${message.author.id}/xp`).set(0)
            database.ref(`Global/${message.author.id}/level`).transaction(n => n + Number(1))
            message.reply(`Wow! Você evoluiu para o nível **${memberDB.val().level + 1}**.`)
        }
    }

    try {
        const getCommand = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName)); // puxa o comando e as aliases
        if (!getCommand) return message.reply({ embeds: [errorEmbed.setDescription(`Este comando não existe.`)] })

        getCommand.execute(client, message, args, database) // executa o comando
    } catch (err) {
        message.reply({ embeds: [errorEmbed.setDescription(`Houve um erro ao executar esse comando.`)] })
        console.log(err)
    }
})

client.on('messageUpdate', (oldMessage, newMessage) => {
    if (newMessage.author.bot) return
    if (!newMessage.content.toLowerCase().startsWith(prefix)) return;

    const args = newMessage.content.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    try {
        const getCommand = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName)); // puxa o comando e as aliases
        if (!getCommand) return;

        getCommand.execute(client, newMessage, args, database)
    } catch (err) {
        newMessage.reply(`Houve um erro ao executar esse comando.`) // mensagem de erro se o comando não funcionar
        console.log(err) // mostrar erro no console
    }
})

client.login(token);