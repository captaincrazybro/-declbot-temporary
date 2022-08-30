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

        if (args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a discord user (id or mention)").send(message.channel);

        let user = message.mentions.users.first() || await bot.users.fetch(args[1])

        player.discordId = user.id;
        await player.update();

        let embed = new Discord.MessageEmbed()
            .setColor(Colors.SUCCESS)
            .setDescription(`Successfully set ${val.name}'s discord to <@${user.id}>`)

        message.channel.send(embed);

    })

}

module.exports.help = {
    name: "setdiscord",
    aliases: ["set-discord","setdiscorduser","sd"],
    permission: Groups.MOD,
    description: "Sets a player's discord",
    usage: "setdiscord <player> <user>"
}