const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const ranks = require('../../storage/ranks.json');
const _Player = require('../../util/Constructors/_Player');
const Discord = require('discord.js');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI');
const _Blacklist = require('../../util/Constructors/_Blacklist');
const _League = require('../../util/Constructors/_League.js');
const botFile = require("../../bot.js")
var leagues = botFile.leagues;

module.exports.run = async (bot, message, args, cmd) => {

    let settings = require('../../settings.json');
    if (_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);
    let league = _League.getLeague(message.guild.id);

    if (args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a player").send(message.channel);

    let playerName = args[0];

    let promise = _MinecraftApi.getUuid(playerName)

    promise.then(async val => {

        if (val == false || val == undefined) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

        let player = await _Player.getPlayer(val.id, league); 
        
        if (player == null) player = await _Player.addPlayer(val.id, league); 
        var ranks = `${player.rank1}`

        if (player.rank2 != undefined) if (player.rank2.toLowerCase() != "none") ranks += ` and ${player.rank2}`

        //let blacklist = _Blacklist.getBlacklist(val.id);

        if(player.discordId != null && player.discordId != 0) {
            let discordUser = await bot.users.fetch(player.discordId)
        }

        let theLeagues = getLeagues(player.name);

        let embed = new Discord.MessageEmbed()
            .setColor(Colors.INFO)
            .setTitle(`${val.name.replace(/_/g, "\\_")}'s Profile`)
            .addField("Team", player.team)
            .addField("Rank", ranks)
            .addField("UUID", val.id)
            if(player.discordId != null && player.discordId != 0) embed.addField("Discord", discordUser.tag)
            //if(theLeagues.length != 0) embed.addField("Leagues", theLeagues.toString(", ").toUpperCase())
            //else embed.addField("Leagues", "None")
            embed.setThumbnail(`http://minotar.net/helm/${val.name}/64.png`)
        /*if(player.rating["Rifle"] == null) embed.addField("Rifle Rating", "None");
        else embed.addField("Rifle Rating", player.rating["Rifle"])
        if(player.rating["Shotgun"] == null) embed.addField("Shotgun Rating", "None");
        else embed.addField("Shotgun Rating", player.rating["Shotgun"])
        if(player.rating["Machinegun"] == null) embed.addField("Machinegun Rating", "None");
        else embed.addField("Machinegun Rating", player.rating["Machinegun"])*/

        //if(blacklist != null) embed.addField("Blacklist Status", "true");
        //else embed.addField("Blacklist Status", "false");

        message.channel.send(embed);

    })

    return;

}

function getLeagues(name) {

    let theLeagues = [];

    leagues = leagues.filter(val => val != "cotc");

    leagues.forEach(l => {
        let player = _Player.getPlayer(name, l);
        if (player) {
            if ((player.team != null && player.team != "None") || ((player.rank != null && player.rank != "None" && player.rank != "Member") || (player.rank2 != null && player.rank2 != "None" && player.rank2 != "Member"))) {
                theLeagues.push(l);
            }
        }
    })

    return theLeagues;

}

module.exports.help = {
    name: "profile",
    aliases: ["player", "p", "pro", "pl"],
    permission: Groups.DEFAULT,
    description: "Gets the profile of a player",
    usage: "player <name>"
}
