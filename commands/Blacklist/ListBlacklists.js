const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _MinecaftAPI = require('../../util/Constructors/_MinecraftAPI');
const _Player = require('../../util/Constructors/_Player');
var blacklist = require("../../storage/blacklist.json");
const Discord = require("discord.js");
const _Blacklist = require('../../util/Constructors/_Blacklist');
const _League = require('../../util/Constructors/_League')

module.exports.run = async (bot, message, args, cmd) => {

    let settings = require('../../settings.json');
    if (_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    let league = _League.getLeague(message.guild.id)
    blacklist = await _Blacklist.getBlacklists(league);

    let list = "";
    console.log(blacklist)
    let time = new Date(), i = 0;
    while (i < blacklist.length) {
        blacklist[blacklist.map(val => val.uuid).indexOf(blacklist[i].uuid)].name = await _MinecaftAPI.getName(blacklist[i].uuid);
        i++;
    }
    blacklist.sort((a, b) => {
        if (a.name && b.name && a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
        if (a.name && b.name && a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
        return 0;
    })
    for(let i = 0; i < blacklist.length; i++){
        let val = blacklist[i];
        console.log(val[0])
        // val.name = playerNames[val.uuid]
        if (!val.uuid) return;
        let player = await _Player.getPlayer(val.uuid, league);

        if (!player) player = await _Player.addPlayer(val.uuid, league);
        if (!player) {
            val.name = `<player ${player.uuid}>`
            console.log(player.uuid, "Please add a name to this player");
        }
        list += `${val.name.replace(/_/g, "\\_")}\n`;
        // - Referee: ${val.referee} - Date: ${val.start_date}
    }
    let time2 = new Date();
    console.log("sort", new Date(time2 - time))


    if (blacklist.length == 0) return new _NoticeEmbed(Colors.ERROR, "There are currently no active blacklists").send(message.channel);

    let embed = new Discord.MessageEmbed()
        .setColor(Colors.ERROR)
        .setTitle("Blacklists")
        .setDescription(list);

    message.channel.send(embed);

}

module.exports.help = {
    name: "blacklists",
    aliases: ["list-blacklists", "listblacklists", "bls", "bl*", "b*"],
    permission: Groups.DEFAULT,
    description: "Lists all the blacklists",
    usage: "blacklists"
}
