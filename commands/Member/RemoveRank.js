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

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a player").send(message.channel);

    let playerName = args[0];

    let promise = _MinecraftApi.getUuid(playerName)

    promise.then(val => {

        if(val == false || !_Player.getPlayer(playerName, league)) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

        let player = _Player.getPlayer(val.name, league);

        if(player == null) player = _Player.addPlayer(val.name, league);

        player.remRank();
        player.remRank2();

        new _NoticeEmbed(Colors.SUCCESS, `Successfully removed ${val.name}'s rank`).send(message.channel);

    })

    return;

}

module.exports.help = {
    name: "removerank",
    aliases: ["remove-rank", "rem-rank"],
    permission: Groups.MOD,
    description: "Removes the rank of a player",
    usage: "removerank <player>"
}
