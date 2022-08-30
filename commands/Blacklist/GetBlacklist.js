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

        if (val == false || val == undefined) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

        let player = await _Player.getPlayer(val.id, league);

        if (player == null) player = await _Player.addPlayer(val.id, league);

        let blacklist = await _Blacklist.getBlacklist(val.id, league);

        if (blacklist == null) return new _NoticeEmbed(Colors.ERROR, "This player is not blacklisted").send(message.channel);

        let embed = new Discord.MessageEmbed()
            .setColor(Colors.ERROR)
            .setTitle(`Blacklist`)
            .addField("Name", val.name)
            .addField("UUID", blacklist.uuid)
            .addField("Start Date", blacklist.start_date)
            .addField("Reason", blacklist.reason)
            .addField("Referee", blacklist.referee)
            .addField("Type", blacklist.type)
        if (blacklist.type == "temporary") embed.addField("End Date", blacklist.end_date)
        embed.addField("Alts", blacklist.alts)
        embed.addField("Notes", blacklist.notes)

        message.channel.send(embed);

    });

}

module.exports.help = {
    name: "blacklist",
    aliases: ["getblacklist", "get-blacklist", "bl", "b"],
    permission: Groups.DEFAULT,
    description: "Gets the details of a blacklist",
    usage: "blacklist <player>"
}
