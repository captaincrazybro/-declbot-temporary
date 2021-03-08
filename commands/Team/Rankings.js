const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const Discord = require('discord.js');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI')
const ranks = require('../../storage/ranks.json')
//const teams = require('../../storage/teams.json')
const _League = require('../../util/Constructors/_League.js');
const util = require('util')
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "oukS$aA7o22#I8drlThK",
  database: "decl"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

con.query = util.promisify(con.query);

module.exports.run = async (bot, message, args, cmd) => {

    let settings = require('../../settings.json');
    if (_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    let league = _League.getLeague(message.guild.id).toLowerCase();

    if (args.length >= 1) league = _League.parseLeague(args[0]);

    if (league == null) return new _NoticeEmbed(Colors.ERROR, "Invalid league - Please specify a valid league").send(message.channel);

    if (league == "clt") {
        return new _NoticeEmbed(Colors.WARN, "This command is not supported in this league").send(message.channel);
    }

    if (["ctfcl", "ctcl", "cdcl", "cwcl", "sgcl", "cecl"].includes(league)) {

        var rankings = "";

        let teamsSorted = _Team.getTeamObj(league).sort((a, b) => { return parseInt(`${a.losses}.${a.wins}`) - parseInt(`${b.losses}.${b.wins}`) })

        teamsSorted.forEach(val => {
            let index = teamsSorted.indexOf(val) + 1
            rankings += `${val.losses}. ${val.name} - Tier: ${val.wins}\n`
        })

        let embed = new Discord.MessageEmbed()
            .setColor(Colors.INFO)
            .setTitle("Rankings")
            .setDescription(rankings);

        message.channel.send(embed);

        return;

    } else if (league == "decl") {

        var rankings = "";

        let rows = await con.query(`SELECT * FROM teams WHERE league = "${league}" ORDER BY points DESC`)

        rows.forEach(val => {
            let index = rows.indexOf(val) + 1
            rankings += `${index}. ${val.name} - Points: ${val.points}\n`
        })

        let embed = new Discord.MessageEmbed()
            .setColor(Colors.INFO)
            .setTitle("Rankings")
            .setDescription(rankings);

        message.channel.send(embed);

        return;
    } else if (league == "twl") {

        var rankings = "";

        let teamsSorted = _Team.getTeamObj(league).sort((a, b) => { return twlRanking(b) - twlRanking(a) });

        teamsSorted.forEach((team, i) => {
            rankings += `${i + 1}. ${team.name} | ${team.wins}-${team.losses}\n`
        })

        let embed = new Discord.MessageEmbed()
            .setColor(Colors.INFO)
            .setTitle("Rankings")
            .setDescription(rankings);

        message.channel.send(embed);

    } else {
        return new _NoticeEmbed(Colors.WARN, "This command is not supported in this league").send(message.channel);
    }

}

function twlRanking(team) {
    let numLength = `${team.losses}`.length
    let numO0s = 3 - numLength;
    let num = `0.`
    let i = 1;
    while (i <= numO0s) {
        num += "0";
        i++;
    }
    num += team.losses;
    let finalNum = team.wins + (1 - parseFloat(num));
    return finalNum;
}

module.exports.help = {
    name: "rankings",
    aliases: ["leaderboard"],
    permission: Groups.DEFAULT,
    description: "Gets the rankings",
    usage: "rankings"
}
