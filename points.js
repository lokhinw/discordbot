function giveOnlineUsersPoints() {
    var online = client.users.filter(u => u.presence.status == "online");
    var onlineUsers = online.map(m => m.id);
    try {
        for (i = 0; i < onlineUsers.length; i++) {
            createIfNotExist((onlineUsers[i]) + ".txt", '1500');
        }

        (function givePoints(j) {
            fs.readFile((onlineUsers[j]) + ".txt", 'utf8', function(err, data) {
                if (err) {
                    return console.log(err);
                }
                fs.writeFile((onlineUsers[j]) + ".txt", ((parseInt(data)) + (5)), function(err) {
                    if (err) return console.log(err);
                });
                j++;
                if (j < onlineUsers.length) givePoints(j);
            });
        })(0)
    } catch (err) {
        console.log(err);
    }
}
setInterval(giveOnlineUsersPoints, 300000);

client.on("message", function(message) {


    switch (parser.getCommand(message)) {
        case "gamble":
            try {
                createIfNotExist((message.author.id) + ".txt", '1500');
                fs.readFile((message.author.id) + ".txt", 'utf8', function(err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    if (parser.getContent(message)) {
                        if (!isNaN(parser.getContent(message))) {
                            if ((parseInt(parser.getContent(message)) > 0)) {
                                if ((parseInt(parser.getContent(message))) <= (parseInt(data))) {
                                    if (ifWin() === true) {
                                        message.channel.sendMessage(message.author + " won **" + parseInt(parser.getContent(message)).toString() + "**" + " rocks." + "\nYou now have **" + ((parseInt(data)) + parseInt(parser.getContent(message))) + "** rocks!");
                                        fs.writeFile((message.author.id) + ".txt", (parseInt(data)) + parseInt(parser.getContent(message)), function(err) {
                                            if (err) return console.log(err);
                                        });
                                    } else {
                                        message.channel.sendMessage(message.author + " lost **" + parseInt(parser.getContent(message)).toString() + "**" + " rocks." + "\nYou have **" + ((parseInt(data)) - parseInt(parser.getContent(message))) + "** rocks left.");
                                        fs.writeFile((message.author.id) + ".txt", (parseInt(data)) - parseInt(parser.getContent(message)), function(err) {
                                            if (err) return console.log(err);
                                        });
                                    }
                                }
                            }
                        } else if ((parser.getContent(message)) == "all") {
                            if (ifWin() === true) {
                                message.channel.sendMessage(message.author + " won **" + parseInt(data).toString() + "**" + " rocks." + "\nYou now have **" + ((parseInt(data)) + (parseInt(data))) + "** rocks!");
                                fs.writeFile((message.author.id) + ".txt", ((parseInt(data)) + (parseInt(data))), function(err) {
                                    if (err) return console.log(err);
                                });
                            } else {
                                message.channel.sendMessage(message.author + " lost **" + parseInt(data).toString() + "**" + " rocks." + "\nYou have **" + ((parseInt(data)) - (parseInt(data))) + "** rocks left.");
                                fs.writeFile((message.author.id) + ".txt", ((parseInt(data)) - (parseInt(data))), function(err) {
                                    if (err) return console.log(err);
                                });
                            }
                        } else {
                            message.reply("Invalid amount of rocks");
                        }
                    }
                });

            } catch (err) {
                console.log(err);
            }
            break;
        case "rocks":
        case "points":
            try {
                createIfNotExist((message.author.id) + ".txt", '1500');
                fs.readFile((message.author.id) + ".txt", 'utf8', function(err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    if (parseInt(data) === 1) {
                        message.channel.sendMessage(message.author + " has **" + data + "** rock.");
                    } else {
                        message.channel.sendMessage(message.author + " has **" + data + "** rocks.");
                    }
                });
            } catch (err) {
                console.log(err);
            }
            break;
        case "speak":
            try {
                if (parser.getTrueAuthor(message) === "Scarnity#3224") {
                    message.delete();
                    message.channel.sendMessage(parser.getContent(message));
                }
            } catch (err) {
                console.log(err);
            }
            break;
        case "test":
        var role1 = message.guild.roles.find("name", "Grimmie Mods");

              console.log(role1);
           message.guild.members.get('113744637939810305').removeRole(role1);
                break;


    }
});

function ifWin() {
    if (Math.random() >= 0.5) {
        return true;
    } else {
        return false;
    }
}