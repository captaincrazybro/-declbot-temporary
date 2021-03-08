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

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a name").send(message.channel);

    let name = args.join(" ");

    let map = _Map.getMap(name, league);

    let mapName = map.name;

    if(map == null) return new _NoticeEmbed(Colors.ERROR, "Invalid map - Please specify a valid map").send(message.channel);

    map.delete();

    new _NoticeEmbed(Colors.SUCCESS, "You have successfully removed the map " + mapName).send(message.channel);

}

module.exports.help = {
    name: "removemap",
    aliases: ["remove-map","rem-map","remmap"],
    permission: Groups.ADMIN,
    description: "Removes a map",
    usage: "removemap <mapName>"
}