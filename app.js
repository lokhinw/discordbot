const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');
const config = require('./config.json');
const client = new Discord.Client();
const Cleverbot = require('cleverbot-node');
const clev = new Cleverbot;

clev.configure({
  botapi: config.cleverbot_api_key
});

client.on('ready', () => {
  client.user.setStatus('online');
  client.user.setGame(config.status_message);
  console.log('[' + config.bot_name + ']' + ' Ready!');
});

client.on('message', message => {
  let messageParts = message.content.split(" "),
    command = messageParts[0].toLowerCase(),
    args = messageParts.splice(1, messageParts.length);
  switch (command) {
    case config.prefix + 'ping':
      try {
        let pingEmbed = new Discord.RichEmbed()
          .setDescription(':ping_pong: Pong! ' + client.ping + 'ms');
        message.channel.sendEmbed(pingEmbed);
      } catch (err) {
        console.log(err);
      }
      break;
    case config.prefix + 'weather':
      try {
        let url = "http://api.openweathermap.org/data/2.5/weather?q=" + args.join(' ') + "&units=metric&appid=" + config.openweathermap_api_key;
        getWeather(url, message);
      } catch (err) {
        console.log(err);
      }
      break;
    case config.prefix + '8ball':
      const eightBallAnswers = ['It is certain', 'It is decidedly so', 'Without a doubt', 'Yes, definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Yes', 'Signs point to yes', 'Reply hazy try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', 'Don\'t count on it', 'My reply is no', 'My sources say no', 'Outlook not so good', 'Very doubtful'];
      let eightBallEmbed = new Discord.RichEmbed()
      if (args.length !== 0) {
        eightBallEmbed.setDescription(':8ball: ' + eightBallAnswers[[Math.floor(Math.random() * eightBallAnswers.length)]]);
      } else {
        eightBallEmbed.setDescription(':8ball: ' + ' You must ask me something!');
      }
      message.channel.sendEmbed(eightBallEmbed);
      break;
    case config.prefix + 'gamble':
      try {
        if (!isNaN(args[0]) && (args[0] > 0)) {
          if (Math.random() >= 0.5) {
            message.channel.sendMessage(message.author + ' won **' + args[0] + '**' + ' points.' + '\nYou now have **' + '0' + '** points!');
          } else {
            message.channel.sendMessage(message.author + ' lost **' + args[0] + '**' + ' points.' + '\nYou have **' + '0' + '** points left.');
          }
        } else {
          message.reply("Invalid amount of points.");
        }
      } catch (err) {
        console.log(err);
      }
      break;
    case config.prefix + 'price':
      try {
        let url = "https://www.google.com/finance?q=" + args;
        getPrice(url, message);
      } catch (err) {
        console.log(err);
      }
      break;
    case config.prefix + 'chat':
      Cleverbot.prepare(function () {
        clev.write(args.join(' '), function (response) {
          message.reply(response.message);
        });
      });
      break;
  }
});

const getWeather = (url, message) => {
  request(url, function (error, response, body) {
    if (!error) {
      try {
        const compassSectors = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
        let parsedData = JSON.parse(body);
        let weatherEmbed = new Discord.RichEmbed()
          .setTitle('Weather for ' + parsedData.name + ', ' + parsedData.sys.country)
          .setThumbnail('http://openweathermap.org/img/w/' + parsedData.weather[0].icon + '.png')
          .addField('Country', ':flag_' + parsedData.sys.country.toLowerCase() + ':', true)
          .addField('Temperature', parsedData.main.temp + '°C', true)
          .addField('Sunrise', convertUnixTime(parsedData.sys.sunrise), true)
          .addField('Sunset', convertUnixTime(parsedData.sys.sunset), true)
          .addField('Wind Direction', compassSectors[Math.round(parsedData.wind.deg / 22.5)], true)
          .addField('Wind Speed', parsedData.wind.speed + ' km/h', true)
          .addField('Pressure', parsedData.main.pressure + ' mb', true)
          .addField('Humidity', parsedData.main.humidity + '%', true);
        message.channel.sendEmbed(weatherEmbed);
      } catch (err) {
        console.log(err);
      }
    }
  });
}

const getPrice = (url, message) => {
  request(url, function (error, response, body) {
    if (!error) {
      try {
        let a = cheerio.load(body),
          stockname = a('title').text().split(":"),
          stockprice = a('span.pr span:nth-child(1)').text(),
          stockchange = a('span.ch').text();
        if (stockchange[0] === '+') {
          message.channel.sendMessage(":chart_with_upwards_trend: " + "**" + stockname[0] + "** - $" + stockprice + " (" + stockchange.split("(")[1]);
        } else if (stockchange[0] === '-') {
          message.channel.sendMessage(":chart_with_downwards_trend: " + "**" + stockname[0] + "** - $" + stockprice + " (" + stockchange.split("(")[1]);
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
}

const convertUnixTime = (unixTime) => {
  let date = new Date(unixTime * 1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();
  let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;
}

client.login(config.discord_api_key);