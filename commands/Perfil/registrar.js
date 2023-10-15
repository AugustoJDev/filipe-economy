const Discord = require('discord.js')
const ms = require('parse-ms')
module.exports = {
    name: "registrar",
    aliases: ["register"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')
        if (memberDB.val() != null) return message.reply({ embeds: [errorEmbed.setDescription('Você já se registrou.')] })

        // BARCO
        database.ref(`Global/${message.author.id}/Pesca`).update({ agua: 100, comida: 100, gasolina: 100, saude: 100, salmao: 0, atum: 0, tilapia: 0, bacalhau: 0, sardinha: 0, id: 0, cooldown: 0, barco: "inicial" })

        // CALL
        database.ref(`Global/${message.author.id}/Perfil`).update({ callTime: 0 })

        // ESCAVAÇÃO
        database.ref(`Global/${message.author.id}/Escavacao`).update({ pa: "null", durabilidade: 0 })
        database.ref(`Global/${message.author.id}/Cooldown/escavacao`).set(0)

        // FÁBRICA
        database.ref(`Global/${message.author.id}/Fabrica`).update({ cargo: "null", id: 0, cooldownWork: 0, convite1: "null", convite2: "null", convite3: "null" })

        // FAZENDA
        database.ref(`Global/${message.author.id}/Fazenda`).update({ hectare1: "null", hectare2: "null", hectare3: "null", hectare4: "null", hectare5: "null", hectare6: "null", hectare7: "null", hectare8: "null", hectare9: "notHave", hectare10: "notHave" })
        database.ref(`Global/${message.author.id}/Fazenda/Sementes`).update({ sementeMilho: 0, sementeCenoura: 0, sementeCereja: 0, sementeTomate: 0, sementeBatata: 0, sementeManga: 0, sementeMelao: 0 })
        database.ref(`Global/${message.author.id}/Fazenda/Produzidos`).update({ milho: 0, cenoura: 0, cereja: 0, tomate: 0, batata: 0, manga: 0, melao: 0 })
        database.ref(`Global/${message.author.id}/Fazenda/Cooldown`).update({ cooldownHectare1: 0, cooldownHectare2: 0, cooldownHectare3: 0, cooldownHectare4: 0, cooldownHectare5: 0, cooldownHectare6: 0, cooldownHectare7: 0, cooldownHectare8: 0, cooldownHectare9: 0, cooldownHectare10: 0, delayHectare1: 0, delayHectare2: 0, delayHectare3: 0, delayHectare4: 0, delayHectare5: 0, delayHectare6: 0, delayHectare7: 0, delayHectare8: 0, delayHectare9: 0, delayHectare10: 0 })

        // PESCA
        database.ref(`Global/${message.author.id}/Pesca`).update({ agua: 100, comida: 100, gasolina: 100, saude: 100, salmao: 0, atum: 0, tilapia: 0, bacalhau: 0, sardinha: 0, id: 0, cooldown: 0, barco: "inicial" })

        // PETS
        database.ref(`Global/${message.author.id}/Pets`).update({ cachorro: "false", galinha: "false", vaca: "false", papagaio: "false", ovelha: "false", pavao: "false", porco: "false", abelha: "false", coelho: "false", pinguim: "false", cachorroAlimentado: "false", galinhaAlimentada: "false", vacaAlimentada: "false", papagaioAlimentado: "false", ovelhaAlimentada: "false", pavaoAlimentado: "false", porcoAlimentado: "false", abelhaAlimentada: "false", coelhoAlimentado: "false", pinguimAlimentado: "false" })
        database.ref(`Global/${message.author.id}/Pets/Produzidos`).update({ ovo: 0, leite: 0, la: 0, pena: 0, bacon: 0, mel: 0, poteOuro: 0 })
        database.ref(`Global/${message.author.id}/Pets/Interacoes`).update({ cooldownCachorro: 0, cooldownPapagaio: 0, cooldownCoelho: 0, cooldownPinguim: 0, cooldownGalinha: 0, cooldownVaca: 0, cooldownOvelha: 0, cooldownPavao: 0, cooldownPorco: 0, cooldownAbelha: 0, })

        // PERFIL
        database.ref(`Global/${message.author.id}/Perfil`).update({ moldura: 1, background: "https://media.discordapp.net/attachments/1049856101413306389/1050214764950851635/anime_scenery_wallpaper_desktop_background_in_hd_w_by_alyssa123123_dacv5h0-fullview.png?width=768&height=432", cor: '#FFFFFF', gemasCall: 0 })
        database.ref(`Global/${message.author.id}/Perfil/Level`).update({ cor: '#B0E2FF', imagem: 'null', ativo: 'COLOR' })

        // PRINCIPAIS
        database.ref(`Global/${message.author.id}`).update({ ouro: 0, ouroCofre: 0, diamante: 0, xp: 0, level: 1, reps: 0, mochila: 1, preso: "false", par: "Ninguém", cofre: "false", arma: null, municoes: 0 })

        // PRODUZIR
        database.ref(`Global/${message.author.id}/Producao`).update({ madeira: 0, ferro: 0, aco: 0, vidro: 0, aluminio: 0, cooldown: 0 })
        database.ref(`Global/${message.author.id}/Fabrica`).update({ madeira: 0, ferro: 0, aco: 0, vidro: 0, aluminio: 0, cooldown: 0 })

        // RANQUEADA
        database.ref(`Ranqueada/${message.author.id}`).update({ wins: 0, loses: 0, patente: 1, item: 0 })

        // VIGILANTE
        database.ref(`Global/${message.author.id}/Vigilante`).update({ temVigilante: "false", turno: 0 })

        return message.reply({ embeds: [sucEmbed.setTitle('👤 | Registro').setDescription('Oba! Você se registrou e agora é possível usar meus comandos!')] })
    }
}