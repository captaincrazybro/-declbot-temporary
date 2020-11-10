const fs = require('fs');
const users = require('../../storage/permissions.json');
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
    let memOrRole = message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(memOrRole != null) if(memOrRole.username == undefined) memOrRole = memOrRole.user;

    if(!memOrRole && userExists(args[0], league)) memOrRole = {id:args[0],id:args[0]}

    if(!memOrRole) {
        memOrRole = message.mentions.roles.first() || message.guild.roles.get(args[0]) || message.guild.roles.find(val => val.name.toLowerCase() == args[0].toLowerCase());
        typeName = "role";
    }

    if(!memOrRole) return new _NoticeEmbed(Colors.ERROR, "Invalid role or user - Specify a valid role or user (mention or id)").send(message.channel);

    var type;
    var name;

    if(typeName == "user"){
        type = new _User(memOrRole.id, league);
        name = memOrRole.username;
    } else {
        type = new _Role(memOrRole.id, league);
        name = memOrRole.name;
    }

    var group;

    if(type.getGroup == 0){
        group = "Default";
    } else if(type.getGroup == 1){
        group = "Mod";
    } else if(type.getGroup == 2){
        group = "Admin";
    } else if(type.getGroup == 3){
        group = "Manager";
    } else {
        group = "Owner"
    }

    name = `<@${memOrRole.id}>`;
    
    if(memOrRole.id == memOrRole.username){
        name = memOrRole.username;
    }

    if(typeName == "role") name = name.replace("@", "@&")

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setDescription(`${name}'s group is ${group}`)

    message.channel.send(embed);

}

function userExists(id, league){
    let users = _User.users(league);
    return users[league].users[id];
}

module.exports.help = {
    name: "getgroup",
    aliases: ["get-group"],
    permission: Groups.MOD,
    description: "Gets the permission group of a role or user",
    usage: "getgroup <role|user>"
}
