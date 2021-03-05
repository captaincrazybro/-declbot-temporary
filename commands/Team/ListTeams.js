const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const Discord = require('discord.js')
const _League = require('../../util/Constructors/_League.js');

module.exports.run = async (bot,message,args,cmd) => {

    let settings = require('../../settings.json');
    if(_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    let league = _League.getLeague(message.guild.id);

    if(args.length >= 1) league = _League.parseLeague(args[0]);

    if(league == null) return new _NoticeEmbed(Colors.ERROR, "Invalid league - Please specify a valid league").send(message.channel);

    let teams = await _Team.getTeams(league);

    if(league == "cotc"){
        teams = teams.sort(function(a, b){
            if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
            if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
            return 0;
        })
    }

    if(teams.length == 0) return new _NoticeEmbed(Colors.ERROR, "There are currently no teams").send(message.channel);

    let embed = new Discord.MessageEmbed()
        .setColor(Colors.INFO)
        .setTitle("Teams")


    if(league == "cotc"){
        let description = "";
        teams.forEach(val => {
            description += `**${val.name}** - Member Count: ${val.getMembers().length}\n`;
        })
        embed.setDescription(description);
    } else {
        let i = 0;
        while(i < teams.length){
            let memberCount = (await teams[i].getMembers()).length;
            embed.addField(teams[i].name, `${memberCount} Members`)
            i++;
        }
    }

    message.channel.send(embed);

}

module.exports.help = {
    name: "listteams",
    aliases: ["teams", "list-teams", "lt"],
    permission: Groups.DEFAULT,
    description: "Lists the teams",
    usage: "listteams"
}