const Groups = require('../../util/Enums/Groups');
const Discord = require('discord.js');
const fs = require('fs');
const Colors = require("../../util/Enums/Colors.js");
const settings = require('../../settings.json')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const _User = require('../../util/Constructors/_User.js')
const _Role = require('../../util/Constructors/_Role.js')
const _League = require('../../util/Constructors/_League')

module.exports.run = async (bot, message, args, cmd) => {

    let league = _League.getLeague(message.guild.id);
    if (league == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    let user = new _User(message.author.id, league);

    if (args.length == 0) {

        fs.readdir('./commands/', (err, files) => {

            var embed = new Discord.MessageEmbed()//.RichEmbed()
                .setColor(Colors.INFO)
                .setTitle("Commands")
                .setDescription(`The prefix for this bot is ${settings.prefix}
                '[]'s means the parameter is not necessary and '<>'s means that it is necessary`)
                .setFooter("If you ever have any issues with the bot please report it in the CLN discord, https://discord.gg/yEvAQPy, or contact cqptain#3247 or ._.#1238 through discord.")

            files.filter(f => f.split(".").length == 1).forEach((f2, i) => {

                let folderFiles = fs.readdirSync(`./commands/${f2}/`)

                let commandsArray = [];


                folderFiles.forEach(function (val, i, array) {
                    let props = require(`../${f2}/${val}`);
                    //if (user.hasPermission(props) || hasPermissionRoles(message, props)) {
                        commandsArray.push(props.help.name);
                    //}
                })

                let commands = commandsArray.join(", ");

                if (commands.length != 0) {
                    embed.addField(f2, commands, false)
                }

            })

            message.channel.send(embed);

        })

    } else {

        let commandName = args[0].toLowerCase();
        let commandfile = bot.commands.get(commandName);

        if (!commandfile || (!user.hasPermission(commandfile) && !hasPermissionRoles(message, props))) {
            return new _NoticeEmbed(Colors.ERROR, "Could not find command").send(message.channel);
        }

        var group;

        switch (commandfile.help.permission) {
            case (Groups.DEFAULT): {
                group = "Default";
                break;
            }
            case (Groups.MOD): {
                group = "Mod";
                break;
            }
            case (Groups.ADMIN): {
                group = "Admin";
                break;
            }
            case (Groups.OWNER): {
                group = "Owner";
                break;
            }
        }

        let embed = new Discord.MessageEmbed()
            .setColor(Colors.INFO)
            .setTitle(`Help for ${commandfile.help.name}`)
            .setDescription(`**Aliases**: ${commandfile.help.aliases.join(", ")}\n**Description**: ${commandfile.help.description}\n**Usage**: ${settings.prefix}${commandfile.help.usage}\n**Group**: ${group}`)

        message.channel.send(embed);

    }

}

function hasPermissionRoles(message, prop) {
    let league = _League.getLeague(message.guild.id);
    let member = message.guild.members.cache.get(message.author.id);
    let outcome = false; 
    member.roles.cache.forEach((val, i, map) => {
        let role = new _Role(val.id, league);
        if (role.hasPermission(prop)) {
            outcome = true;
            return;
        }
    })
    return outcome;
}

module.exports.help = {
    name: "help",
    aliases: ["commands", "cmds"],
    permission: Groups.DEFAULT,
    description: "Gives you some help",
    usage: "help [command]"
}