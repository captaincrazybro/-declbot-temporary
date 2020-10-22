const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const Discord = require('discord.js');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI')
const ranks = require('../../storage/ranks.json')
const teams = require('../../storage/teams.json')
const _League = require('../../util/Constructors/_League.js');

module.exports.run = async (bot,message,args,cmd) => {

    let settings = require('../../settings.json');
    if(_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    let league = _League.getLeague(message.guild.id);

    if(args.length >= 1) league = _League.parseLeague(args[0]);

    if(league == null) return new _NoticeEmbed(Colors.ERROR, "Invalid league - Please specify a valid league").send(message.channel);

    if(league == "clt"){
        return new _NoticeEmbed(Colors.WARN, "This command is not supported in this league").send(message.channel);
    }

    if(league == "ctfcl" || league == "mbcl" || league == "dcl" || league == "cdcl"){

        var rankings = "";

        let teamsSorted = _Team.getTeamObj(league).sort((a, b) => { return parseInt(`${a.losses}.${a.wins}`) - parseInt(`${b.losses}.${b.wins}`) })

        teamsSorted.forEach(val => { 
            let index = teamsSorted.indexOf(val) + 1
            rankings += `${val.losses}. ${val.name} - Tier: ${val.wins}\n`
        })

        let embed = new Discord.RichEmbed()
            .setColor(Colors.INFO)
            .setTitle("Rankings")
            .setDescription(rankings);

        message.channel.send(embed);

        return;

    } else if(league == "twl" || league == "decl"){

        var rankings = "";

        let teamsSorted = _Team.getTeamObj(league).sort((a, b) => { return b.wins - a.wins })

        teamsSorted.forEach(val => { 
            let index = teamsSorted.indexOf(val) + 1
            rankings += `${index}. ${val.name} - Points: ${val.wins}\n`
        })

        let embed = new Discord.RichEmbed()
            .setColor(Colors.INFO)
            .setTitle("Rankings")
            .setDescription(rankings);

        message.channel.send(embed);

        return;

    } else {
        return new _NoticeEmbed(Colors.WARN, "This command is not supported in this league").send(message.channel);
    }

}

module.exports.help = {
    name: "rankings",
    aliases: ["leaderboard"],
    permission: Groups.DEFAULT,
    description: "Gets the rankings",
    usage: "rankings"
}
