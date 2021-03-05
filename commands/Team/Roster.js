const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const Discord = require('discord.js');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI')
const ranks = require('../../storage/ranks.json')
const teams = require('../../storage/teams.json')
const _Player = require('../../util/Constructors/_Player');
// const stringUtil = require('string-similarity');
const _Blacklist = require('../../util/Constructors/_Blacklist');
const _League = require('../../util/Constructors/_League.js');
const _MinecaftAPI = require("../../util/Constructors/_MinecraftAPI")
const util = require('util')
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
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

    if (args.length >= 2) league = _League.parseLeague(args[1]);

    if (args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a team").send(message.channel);

    let teamName = args[0];

    if (league == null) return new _NoticeEmbed(Colors.ERROR, "Invalid league - Please specify a valid league").send(message.channel);

    let team = await getTeam(teamName, league);

    if (team == null) return new _NoticeEmbed(Colors.ERROR, "Invalid name - This team does not exist").send(message.channel);

    var membersArray = [];

    //_Player.updateNames()
    let players = await team.getMembers();
    let time = new Date();
    let i = 0, playerNames = [];
    while (i < players.length) {
        playerNames[players[i].uuid] = await _MinecaftAPI.getName(players[i].uuid);
        i++;
    }
    for (val of players) {
        val.name = playerNames[val.uuid]
        // console.log("val val ", val.name)
        var member = "";
        if (getRankOrNull(val.rank1) != null) member += `${getRankOrNull(val.rank1)} `
        member += `${val.name.replace(/_/g, "\\_")}`
        if (val.rank2 != undefined) if (val.rank2.toLowerCase() != "none" && getRankOrNull(val.rank2) != null) member += ` ${getRankOrNull(val.rank2)}`
        if (_Blacklist.getBlacklist(val.uuid, league)) {
            member = `:x: ${val.name.replace(/_/g, "\\_")}`
        }
        if (isAlt(val.name, league)) member = `:x: ${val.name.replace(/_/g, "\\_")}`
        membersArray.push(member);
    }
    let time2 = new Date();
    console.log("sort", new Date(time2 - time).toISOString().split("T")[1])
    membersArray.sort((a, b) => {
        return getRankOrder(a.split(" ")[0]) - getRankOrder(b.split(" ")[0]);
    })

    let members = membersArray.join("\n");

    if (membersArray.length == 0) members = "None";

    _MinecraftApi.getName(team.owner).then(val => {

        var owner;

        if (members == "") members = "None";

        if (val == null) owner = "None";
        else owner = val;

       /*var teams = require('../../storage/teams.json');
        var teamsSorted = teams[league];
        if (league == "ctfc") {
            teamsSorted.sort((a, b) => { return (parseInt(`${b.losses}.${b.wins}`) - parseInt(`${a.losses}.${a.wins}`)) })
        } else {
            teamsSorted.sort((a, b) => { return a.wins - b.wins })
        }
        var index;
        teamsSorted.forEach((val, i) => {
            if (val.name == team.name) index = i
        })*/

        let embed = new Discord.MessageEmbed()
            .setColor(team.color)
            .setTitle(`${team.name}`)
        //.addField("Mentor", owner)
        //.addField("Nick", team.nick)
        if (["ctfcl", "ctcl", "cdcl", "cwcl", "sgcl", "cecl"].includes(league)) {
            embed.addField("Tier", team.wins);
            embed.addField("Rank", team.losses);
        } else if (league == "decl") {
            embed.addField("Points", team.points)
        } else if (league == "twl") {
            embed.addField("Wins", team.wins);
            embed.addField("Losses", team.losses);
        }
        embed.addField("League", league.toUpperCase())
        embed.addField("Members", members)

        if (team.logo.toLowerCase() != "none") embed.setThumbnail(team.logo);

        message.channel.send(embed);

    })

    return;

}

async function getTeam(team, league) {

    let rows = await con.query(`SELECT * FROM teams WHERE name LIKE "%${team}%" AND league = "${league}"`)

    if(rows.length == 0) return null;

    return await _Team.getTeam(rows[0].name, league);

}

function getRankOrder(emoji) {

    if (emoji == null) return 9;

    let outcome = null;

    ranks.forEach(val => {
        if (val.split("-")[1] == emoji) outcome = val.split("-")[2]
    })

    if (emoji == ":x:") outcome = 100;

    return outcome;
}

function getRankOrNull(rank) {

    let outcome = null;

    ranks.forEach(val => {
        if (val.split("-")[0].toLowerCase() == rank.toLowerCase()) outcome = val.split("-")[1]
    })

    return outcome;

}

function isAlt(name, league) {

    let outcome = false;

    _Blacklist.blacklists(league).forEach(bl => {
        let alts = bl.alts;
        if (arrayContains(alts.split(", "), name) || arrayContains(alts.split(","), name) || arrayContains(alts.split(" "), name) || alts.replace(" ").toLowerCase() == name.toLowerCase()) outcome = true;
    })

    return outcome;

}

function arrayContains(arr, obj) {

    let outcome = false;

    arr.forEach(val => {
        if (val.replace(" ", "").toLowerCase() == obj) outcome = true;
    })

    return outcome;

}

module.exports.help = {
    name: "roster",
    aliases: ["team", "r"],
    permission: Groups.DEFAULT,
    description: "Gets the roster for a team",
    usage: "roster <name>"
}
