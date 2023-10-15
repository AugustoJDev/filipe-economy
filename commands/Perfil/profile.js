const { fillTextWithTwemoji } = require("node-canvas-with-twemoji-and-discord-emoji");
const { AttachmentBuilder } = require("discord.js");
const Discord = require('discord.js')
const { loadImage, registerFont, createCanvas } = require("canvas");
module.exports = {
    name: "profile",
    aliases: ["perfil"],
    async execute(client, message, args, database) {

        let errorEmbed = new Discord.EmbedBuilder()
            .setColor('#FF4040')

        let sucEmbed = new Discord.EmbedBuilder()
            .setColor('#4CFF40')

        let neutEmbed = new Discord.EmbedBuilder()

        registerFont("util/Myriad Pro Bold.ttf", {
            family: "Myriad Pro",
        });

        let memberDB = await database.ref(`Global/${message.author.id}`).once('value')

        if (args[0]) {
            if (args[0].toUpperCase() == "COR") {
                let colorhx = args[1]
                if (memberDB.val().ouro < 1000) return message.reply({ embeds: [errorEmbed.setDescription('Você não possui ouro suficiente. São necessários `1000` ouros.')] })
                if (colorhx.length != 7 || !colorhx.startsWith('#')) return message.reply({ embeds: [errorEmbed.setDescription('Código inválido.')] })
                database.ref(`Global/${message.author.id}/Perfil/cor`).set(colorhx)
                database.ref(`Global/${message.author.id}/ouro`).transaction(n => n - Number(1000))
                return message.reply({ embeds: [neutEmbed.setTitle('🖌️ | Cor do Perfil atualizada!').setDescription(`Você atualizou sua cor do perfil para **${colorhx}** com sucesso!`).setColor(colorhx)] })
            }
        }

        if (!args[0]) {
            /*
            
            Aqui você vai ter que baixar o arquivo da fonte que vc vai usar e colocar em uma pasta do Bot pra não dar erro na Host, e altera o caminho dela ali em cima.
          
            *Obs: O 'family: "Montserrat"' é só o nome da fonte que a gente puxa no Canvas, pode ser qualquer nome mas lá em baixo no "ctx.font" tem que ser o mesmo nome do family
          
            */

            const canvas = createCanvas(3661, 2480);
            const ctx = canvas.getContext("2d");
            const USER = message.author;

            // ==========> Importando o Background da Imagem <==========

                // com fundo: https://media.discordapp.net/attachments/1049155010090500186/1049840158045917224/perfil.png
                // sem fundo: https://media.discordapp.net/attachments/1049155010090500186/1049861573889503323/perfilv.png

                let background = await loadImage('https://media.discordapp.net/attachments/1049155010090500186/1049840158045917224/perfil.png');
                ctx.drawImage(background, 0, 0, 3661, 2480);

                let backgroundUser = await loadImage(memberDB.val().Perfil.background)
                ctx.drawImage(backgroundUser, 0, 0, canvas.width, 1000)

            // ==========> Importando os Textos da Imagem <==========

            ctx.font = '190px "Myriad Pro"';
            ctx.fillStyle = memberDB.val().Perfil.cor;
            ctx.textAlign = "left";

            ctx.fillText(USER.tag, 1200, 1200);

            ctx.font = '100px "Myriad Pro"';

            /*
          
            Aqui você vai ter q mudar todos os 9999 pelo jeito q vc pega cada coisa na DataBase
          
            */ 

            ctx.fillText(new Intl.NumberFormat('de-DE').format(memberDB.val().ouro), 2000, 1440); // Ouro
            ctx.fillText(new Intl.NumberFormat('de-DE').format(memberDB.val().diamante), 2000, 1680); // Diamantes
            ctx.fillText(new Intl.NumberFormat('de-DE').format(memberDB.val().ouroCofre), 2000, 1930); // Cofre

            // ctx.fillText("Instagram", 350, 2180); // Instagram
            ctx.fillText("Em Breve", 360, 2360); // Não sei oq é isso, mas fica em baixo do Instagram :c

            ctx.fillText(client.users.cache.get(memberDB.val().par).username, 2980, 1440); // Par
            ctx.fillText(new Intl.NumberFormat('de-DE').format(memberDB.val().level), 2980, 1680);
            ctx.fillText(new Intl.NumberFormat('de-DE').format(memberDB.val().reps), 2980, 1930);

            ctx.textAlign = "center";

            //   ctx.fillText("1d 5h 3m", 3250, 2430); // Tempo Casado

            ctx.textAlign = "left";

            // ==========> Importando o Avatar do Membro <==========

            ctx.lineWidth= 0;
            ctx.beginPath();
 
            var degree = 360;
            var radian = ( Math.PI / 180 ) * degree;
 
            ctx.arc(675, 1170, 425, 0, radian, false);
            ctx.strokeStyle= "red";
            ctx.stroke();
            ctx.closePath();
            ctx.clip()

            const avatar = await loadImage(
                USER.displayAvatarURL({ dynamic: false, extension: "jpg", size: 2048 })
            );

            ctx.drawImage(avatar, 255, 755, 835, 835);

            // ==========> Importando as Badges <==========

            /*   ctx.font = '120px "arial"';
               const badges = [
                   "<:developer:782733790426300456>",
                   "<:Zafriel_Staff:809510194161647656>",
                   "<:Zafriel_Owner:809510194027036724>",
               ];
       
               badges.push("<:amor:874669371706990642>");
       
               /*
             
               Como você vai fazer as Badges pra vip também, basta fazer um if verificando se ele tem VIP e dar push na array de badges.
             
               Exemplo:
             
               if(message.author.id === "UM ID") badge.push('<:amor:874669371706990642>') | Aqui ele tá verificando se o ID do membro é o mesmo que X id, só seguir esses passos :)
             
               */

            //  await fillTextWithTwemoji(ctx, badges.join(""), 1100, 1400);

        
            const attach = new AttachmentBuilder(canvas.toBuffer(), `Perfil.png`);

            return message.reply({ files: [attach] })

        }
    }
}