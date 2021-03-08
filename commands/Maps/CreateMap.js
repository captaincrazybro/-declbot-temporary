const fs = require('fs');
//const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');
const _League = require('../../util/Constructors/_League');
const _Map = require('../../util/Constructors/_Map.js');

module.exports.run = async(bot,message,args,cmd) => {

    if(_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    let league = _League.getLeague(message.guild.id);

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify the link to the map image url").send(message.channel);

    let url = args[0];

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a name").send(message.channel);

    let cArgs = args;
    cArgs.shift();

    let name = cArgs.join(" ");

    let map = _Map.getMap(name, league);

    if(map != null) return new _NoticeEmbed(Colors.ERROR, "This name is already taken").send(message.channel);

    _Map.createMap(name, url, league);

    new _NoticeEmbed(Colors.SUCCESS, "You have successfully created a new map with name " + name).send(message.channel);

}

module.exports.help = {
    name: "createmap",
    aliases: ["create-map"],
    permission: Groups.ADMIN,
    description: "Creates a map",
    usage: "createmap <name> <imgUrl>"
}