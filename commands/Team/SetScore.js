const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _League = require('../../util/Constructors/_League.js');

module.exports.run = async (bot, message, args, cmd) => {

    let settings = require('../../settings.json');
    if (_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    let league = _League.getLeague(message.guild.id).toLowerCase();

    if (args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a team name").send(message.channel);

    let teamName = args[0];

    let team = await _Team.getTeam(teamName, league);

    if (team == null) return new _NoticeEmbed(Colors.ERROR, "Invalid name - This team does not exist").send(message.channel);

    if (league == "clt") return new _NoticeEmbed(Colors.WARN, "This command is not supported in this league").send(message.channel);

    if (["ctfcl", "ctcl", "cdcl", "cwcl", "twl", "sgcl", "cecl"].includes(league)) {

        if (args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a tier").send(message.channel);

        if (isNaN(args[1])) return new _NoticeEmbed(Colors.ERROR, "Invalid tier - Please specify a number").send(message.channel);

        let tier = parseInt(args[1]);

        if (args.length == 2) return new _NoticeEmbed(Colors.WARN, "Please specify a rank").send(message.channel);

        if (isNaN(args[2])) return new _NoticeEmbed(Colors.ERROR, "Invalid rank - Please specify a number").send(message.channel);

        let rank = parseInt(args[2]);

        team.setWins(tier);
        team.setLosses(rank);

        new _NoticeEmbed(Colors.SUCCESS, `Successfully set ${team.name}'s score to tier ${tier} and rank ${rank}`).send(message.channel);

        return;

    } else if (league == "twl") {

        if (args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify wins").send(message.channel);

        if (isNaN(args[1])) return new _NoticeEmbed(Colors.ERROR, "Invalid wins - Please specify a number").send(message.channel);

        let wins = parseInt(args[1]);

        if (args.length == 2) return new _NoticeEmbed(Colors.WARN, "Please specify losses").send(message.channel);

        if (isNaN(args[2])) return new _NoticeEmbed(Colors.ERROR, "Invalid losses - Please specify a number").send(message.channel);

        let losses = parseInt(args[2]);

        team.setWins(wins);

        team.setLosses(losses);

        new _NoticeEmbed(Colors.SUCCESS, `Successfully set ${team.name}'s wins to ${wins} and losses to ${losses}`).send(message.channel);

    } else {

        if (args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify points").send(message.channel);

        if (isNaN(args[1])) return new _NoticeEmbed(Colors.ERROR, "Invalid points - Please specify a number").send(message.channel);

        let points = parseInt(args[1]);

        team.points = points;
        await team.update();

        new _NoticeEmbed(Colors.SUCCESS, `Successfully set ${team.name}'s points to ${points}`).send(message.channel);

        return;

    }

}

module.exports.help = {
    name: "setscore",
    aliases: ["set-score"],
    permission: Groups.MOD,
    description: "Sets score for a team",
    usage: "setscore <team> <parameters>"
}
