import { startBot } from "https://deno.land/x/discordeno/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

const decoder = new TextDecoder("utf-8");
let user = [];
let eitaCounter = 0;
let caraioCounter = 0;
let panificadoraAlfaCounter = 0;
var block = false;

startBot({
  token: Deno.env.get("TOKEN"),
  intents: ["GUILDS", "GUILD_MESSAGES"],
  eventHandlers: {
    ready() {
      console.log("Successfully connected to gateway");
    },
    messageCreate(message) {
      if (message.author.bot) return;
      message.content = message.content.toLowerCase();
      const splitMessage = message.content.split(" ");

      antiDesculpasForMorganna(message);
      executeStandard(message);
      generalCommands(message, splitMessage);
    },
  },
});

function antiDesculpasForMorganna(message) {
  const sorries = ["desculpas", "perdão", "perdões", "desculpa", "foi mal"];
  let checkSorries = sorries.some((v) => message.content.includes(v));
  if (message.author.username == "morgiovanelli" && checkSorries) {
    message.reply("SEM DESCULPAS MORGANNA!");
  }
}

function executeStandard(message) {
  try {
    const channel = message.channel.name;
    const standard = decoder.decode(Deno.readFileSync("intro.txt"));

    messageSplited = message.content.split(" ");

    if (
      message.content != standard &&
      standard != "" &&
      messageSplited[0] != "!padrao"
    ) {
      message.reply(
        "Você não seguiu o padrão! Adicionando mais uma quebra de padrão á sua ficha!"
      );

      writeTextFileSync(`padrao-${channel}.txt`, "");

      try {
        const username = message.author.username;
        const breakersBrute = decoder.decode(Deno.readFileSync("breakers.txt"));
        const breakersLine = breakersBrute.split("\n");
        const breakers = [];

        breakersLine.forEach((breaker) => {
          breakers.push(breaker.split(","));
        });

        const index = findBreaker(breakers, username);

        if (index != -1) {
          const userData = breakers[index];
          const username = userData[0];
          const breaks = Number(userData[1]);

          const content = breakersBrute.replace(
            `${username},${breaks}`,
            `${username},${breaks + 1}`
          );

          writeTextFileSync("breakers.txt", content);
        } else {
          fs.appendFileSync("breakers.txt", `${username},1\n`);

          writeTextFileSync("breakers.txt", `${username},1\n`, {
            append: true,
          });
        }
      } catch (err) {}
    }
  } catch (err) {}
}

async function generalCommands(message, splitMessage) {
  const deninhoReact = "777326021007245323";
  const username = message.author.username;
  const userId = message.author.id;

  if (message.content == "bom dia" || message.content == "dia") {
    message.reply(`Bom Dia!`);
  } else if (message.content == "boa noite" || message.content == "noite") {
    message.reply(`Boa Noite!`);
  } else if (message.content == "boas festas") {
    message.reply(`Boas Festas!`);
  } else if (splitMessage[0] == "!eita") {
    eitaCounter++;
    message.reply(`A Lexyca já falou eita ${eitaCounter} vezes`);
  } else if (splitMessage[0] == "!caraio") {
    caraioCounter++;
    message.reply(`A Pachi já falou caraio ${caraioCounter} vezes`);
  } else if (splitMessage[0] == "!alfa") {
    panificadoraAlfaCounter++;
    message.reply(
      `Já escutamos Panificadora Alfa ${panificadoraAlfaCounter} vezes`
    );
  } else if (splitMessage[0] == "!splash") {
    message.reply("Splash Splash");
  } else if (splitMessage[0] == "!selvagem") {
    message.reply(
      "Vá na live do pokemao dar o seu !selvagem https://twitch.tv/pokemaobr"
    );
  } else if (splitMessage[0] == "!capturar") {
    message.reply(
      "Vá na live do pokemao dar o seu !capturar https://twitch.tv/pokemaobr"
    );
  } else if (splitMessage[0] == "!selva") {
    message.reply(
      "Vá na live do pokemao dar o seu !selva https://twitch.tv/pokemaobr"
    );
  } else if (splitMessage[0] == "!bifeday") {
    now = new Date();

    if (now.getMonth() == 3 && now.getDate() == 20) {
      message.reply("BIFEDAY!");
    } else {
      message.reply("noti tuday.");
    }
  } else if (splitMessage[0] == "!amor") {
    message.reply("Amor!", { files: ["./img/pachiLuv.png"] });
  } else if (splitMessage[0] == "!cancelar") {
    cancelamentosBrute = decoder.decode(Deno.readFileSync("cancelamentos.txt"));
    cancelamentos = cancelamentosBrute.split("\n");

    var cancelamento =
      cancelamentos[Math.floor(Math.random() * cancelamentos.length)];

    if (splitMessage[1]) {
      message.reply(`cancelou ${splitMessage[1]} por ${cancelamento}`);
    } else {
      message.reply(`cancelou o mundo por ${cancelamento}`);
    }
  } else if (splitMessage[0] == "!padrao") {
    if (splitMessage[1]) {
      const standard = splitMessage[1].toLowerCase();
      const channel = message.channel.name;
      writeTextFileSync(`padrao-${channel}.txt`, standard);
      message.delete();
    }
  } else if (splitMessage[0] == "!vergonha") {
    try {
      const breakersBrute = decoder.decode(Deno.readFileSync("breakers.txt"));
      const breakersLine = breakersBrute.split("\n");
      breakersMessage = "";

      breakersLine.forEach((breaker) => {
        if (breaker != "") {
          breakerData = breaker.split(",");

          breakersMessage += `\n${breakerData[0]} quebrou o padrão ${breakerData[1]} vezes`;
        }
      });

      message.reply(breakersMessage);
    } catch (err) {}
  } else if (splitMessage[0] == "!clap") {
    userClapped = splitMessage[1];

    message.delete();
    message.channel.send(`${userClapped} CLAP`, { files: ["img/clap.gif"] });
  }
}
