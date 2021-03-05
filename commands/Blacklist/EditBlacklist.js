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

        if (args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a field").send(message.channel)

        let field = args[1].toLowerCase();

        if (blacklist[field] == null || !blacklist[field] || field == "name" || field == "uuid") return new _NoticeEmbed(Colors.ERROR, "Invalid field - Please specify an existing blacklist field").send(message.channel);

        if (args.length == 2) return new _NoticeEmbed(Colors.WARN, "Please specify a value").send(message.channel);

        let value = args;
        value.shift();
        value.shift();

        // console.log(value)
        value = value.join(" ");
        // console.log("fiel", field, value)

        blacklist[field] = value;

        await blacklist.update();

        return new _NoticeEmbed(Colors.SUCCESS, "Successfully edited the blacklist " + val.name + ", settings the field " + field + " to " + value).send(message.channel);

    });

}

module.exports.help = {
    name: "editblacklist",
    aliases: ["edit-blacklist", "edit-bl", "editbl", "ebl"],
    permission: Groups.MOD,
    description: "Edits a blacklist",
    usage: "editblacklist <player> <field> <value>"
}
