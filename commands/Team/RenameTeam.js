const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _League = require('../../util/Constructors/_League.js');

module.exports.run = async (bot,message,args,cmd) => {

    let settings = require('../../settings.json');
    if(_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    let league = _League.getLeague(message.guild.id);

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a team").send(message.channel);

    let teamName = args[0];

    let team = await _Team.getTeam(teamName, league);

    if(team == null) return new _NoticeEmbed(Colors.ERROR, "This team does not exist").send(message.channel);
    
    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a new team name").send(message.channel);
    
    let newName = args[1];

    team.name = newName;
    await team.update();

    new _NoticeEmbed(Colors.SUCCESS, `Successfully renamed team ${teamName} to ${newName}`).send(message.channel);

}

module.exports.help = {
    name: "renameteam",
    aliases: ["rename-team"],
    permission: Groups.MOD,
    description: "Renames a team",
    usage: "renameteam <team> <name>"
}
