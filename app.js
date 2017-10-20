const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');
const config = require('./config.json');
const client = new Discord.Client();

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
  }
});

const getWeather = (url, message) => {
  request(url, function(error, response, body) {
    if (!error) {
      try {
        var compassSectors = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
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

const convertUnixTime = (unixTime) => {
  let date = new Date(unixTime * 1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();
  let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;
}

client.login(config.discord_api_key);
