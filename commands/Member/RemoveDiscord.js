const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI');
const _Player = require('../../util/Constructors/_Player');
const _League = require('../../util/Constructors/_League.js');
const { DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');

module.exports.run = async (bot, message, args, cmd) => {

    let settings = require('../../settings.json');
    if (_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);
    let league = _League.getLeague(message.guild.id);

    if (args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a player").send(message.channel);

    let playerName = args[0];

    let promise = _MinecraftApi.getUuid(playerName)

    promise.then(async val => {

        if (val == false || val == undefined) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

        let player = await _Player.getPlayer(val.id, league);

        player.discordId = null;
        await player.update();

        return new _NoticeEmbed(Colors.SUCCESS, "Successfully removed " + val.name + "'s discord").send(message.channel);

    })

}

module.exports.help = {
    name: "removediscord",
    aliases: ["remove-discord","remdiscord","rem-discord", "remdc", "rdc"],
    permission: Groups.MOD,
    description: "Removes a players discord",
    usage: "removediscord <player>"
}