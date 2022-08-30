const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const ranks = require('../../storage/ranks.json');
const _Player = require('../../util/Constructors/_Player');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI');
const _League = require('../../util/Constructors/_League.js');

module.exports.run = async (bot,message,args,cmd) => {

    let settings = require('../../settings.json');
    if(_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    let league = _League.getLeague(message.guild.id);

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a player").send(message.channel);

    let playerName = args[0];

    let promise = _MinecraftApi.getUuid(playerName)

    promise.then(async val => {

        if(val == false) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);
            
        let player = await _Player.getPlayer(val.id, league);

        if(!player)  return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

        if(player == null) {
            player = await _Player.addPlayer(val.id, league);
        }
    
        if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a rank").send(message.channel);

        let rank = args[1];

        if(getRankOrNull(rank) == null) return new _NoticeEmbed(Colors.ERROR, "Invalid rank - This rank does not exist").send(message.channel);

        player.rank1 = capitalize(rank.toLowerCase());

        var rank2 = null;

        if(args.length >= 3){

            rank2 = args[2];

            if(rank2.toLowerCase() == "member" || rank2.toLowerCase() == "none") rank2 = "None";
            else if(getRankOrNull(rank2) == null) return new _NoticeEmbed(Colors.ERROR, "Invalid second rank - This rank does not exist").send(message.channel);
            else rank2 = capitalize(rank2.toLowerCase());

            player.rank2 = rank2;

        }

        await player.update();

        if(rank2 != null) new _NoticeEmbed(Colors.SUCCESS, `Successfully set ${val.name}'s rank to ${capitalize(rank.toLowerCase())} and second rank to ${rank2}`).send(message.channel);
        else new _NoticeEmbed(Colors.SUCCESS, `Successfully set ${val.name}'s rank to ${capitalize(rank.toLowerCase())}`).send(message.channel);

    })

    return;

}

function getRankOrNull(rank){

    let outcome = null;

    ranks.forEach(val => {
        if(val.split("-")[0].toLowerCase() == rank.toLowerCase()) outcome = val.split("-")[1]
    })

    return outcome;

}

function capitalize(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports.help = {
    name: "setrank",
    aliases: ["set-rank","setrank"],
    permission: Groups.MOD,
    description: "Sets the rank for a player",
    usage: "setrank <player> <rank> [rank2]"
}
