const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const Discord = require('discord.js');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI')
//const ranks = require('../../storage/ranks.json')
//const teams = require('../../storage/teams.json')
const _Player = require('../../util/Constructors/_Player');
// const stringUtil = require('string-similarity');
const _League = require('../../util/Constructors/_League.js');

module.exports.run = async (bot, message, args, cmd) => {

    let settings = require('../../settings.json');
    if (_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    var ranksThing = "";

    ranks.forEach(val => ranksThing += `${val.split("-")[1]} - ${val.split("-")[0]}\n`);

    let embed = new Discord.MessageEmbed()
        .setColor(Colors.INFO)
        .setTitle("Ranks")
        .setDescription(ranksThing);

    message.channel.send(embed);


    return;

}

module.exports.help = {
    name: "listranks",
    aliases: ["list-ranks", "ranks", "listranks"],
    permission: Groups.DEFAULT,
    description: "Gets the ranks",
    usage: "ranks"
}
