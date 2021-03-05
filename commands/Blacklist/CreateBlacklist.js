const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI');
const _Player = require('../../util/Constructors/_Player');
const _Blacklist = require('../../util/Constructors/_Blacklist.js');
const Discord = require('discord.js');
const _League = require('../../util/Constructors/_League')

module.exports.run = async (bot, message, args, cmd) => {

    let settings = require('../../settings.json');
    if (_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    let league = _League.getLeague(message.guild.id)

    if (args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a name").send(message.channel);

    let name = args[0];

    _MinecraftApi.getUuid(name).then(async val => {

        if (val == false) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

        if (val == undefined) return new _NoticeEmbed(Colors.ERROR, "Name update in progress.").send(message.channel);

        let player = _Player.getPlayer(val.id);

        if (player == null) player = await _Player.addPlayer(val.id);

        let blacklist = await _Blacklist.getBlacklist(val.id, league);

        if (blacklist != null) return new _NoticeEmbed(Colors.ERROR, "This player is already blacklisted").send(message.channel);

        if (args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a reason").send(message.channel);

        args.shift();

        let reason = args.join(" ");

        let bot = require('../../bot.js');

        bot.blAddMap.set(message.author.id, { league: league, name: val.name, uuid: val.id, reason: reason, step: 0 })

        return new _NoticeEmbed(Colors.SUCCESS, "You have successfully started the blacklist creation wizard for " + val.name + ". Please specify a referee.").send(message.channel);

    });

}

module.exports.help = {
    name: "createblacklist",
    aliases: ["addblacklist", "add-blacklist"],
    permission: Groups.MOD,
    description: "Starts the blacklist creation wizard",
    usage: "createblacklist <player> <reason>"
}
