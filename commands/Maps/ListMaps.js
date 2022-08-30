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

    let maps = _Map.getMaps(league);

    let msg = "";

    maps.forEach(map => {
        msg += map.name + "\n";
    })

    let embed = new Discord.MessageEmbed()
        .setColor(Colors.INFO)
        .setAuthor("List Maps")
        .setDescription(msg);

    message.channel.send(embed);

}

module.exports.help = {
    name: "listmaps",
    aliases: ["list-maps", "maps"],
    permission: Groups.DEFAULT,
    description: "Creates a map",
    usage: "createmap"
}