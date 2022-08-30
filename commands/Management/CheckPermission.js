const fs = require('fs');
//const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');
const _League = require('../../util/Constructors/_League');

module.exports.run = async (bot,message,args,cmd) => {

    let settings = require('../../settings.json');
    if(_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a guild set! Use the " + settings.prefix + "setleague command to set the league's guild").send(message.channel);

    let league = _League.getLeague(message.guild.id);

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a role or user (mention or id)").send(message.channel);

    let typeName = "user";
    let memOrRole = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(memOrRole != null) if(memOrRole.username == undefined) memOrRole = memOrRole.user;

    if(!memOrRole) {
        memOrRole = message.mentions.roles.first() || message.guild.roles.get(args[0]) || message.guild.roles.find(val => val.name.toLowerCase() == args[0].toLowerCase());
        typeName = "role";
    }

    if(!memOrRole) return new _NoticeEmbed(Colors.ERROR, "Invalid role or user - Specify a valid role or user (mention or id)").send(message.channel);

    var type;
    var name;

    if(typeName == "user"){
        type = await _User.getUser(memOrRole.id, league);
        name = memOrRole.username;
    } else {
        type = await _Role.getRole(memOrRole.id, league);
        name = memOrRole.name;
    }

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a command").send(message.channel);

    let commandName = args[1].toLowerCase();
    let commandfile = bot.commands.get(commandName);

    if(!commandfile) {
        return new _NoticeEmbed(Colors.ERROR, "Could not find command").send(message.channel);
    }

    var outcome = `<@${memOrRole.id}> is not allowed to use this command.`

    let hasPermission = type.hasPermission(commandfile);

    if(hasPermission) outcome = `<@${memOrRole.id}> is allowed to use this command.`

    if(typeName == "role") outcome = outcome.replace("@", "@&")

    let embed = new Discord.MessageEmbed()
        .setColor(Colors.INFO)
        .setDescription(outcome)

    message.channel.send(embed);

}

module.exports.help = {
    name: "checkpermission",
    aliases: ["checkperm", "checkperm", "perm", "permission"],
    permission: Groups.ADMIN,
    description: "Checks to see if a user or role has a command permission",
    usage: "checkpermission <role|user> <command>"
}