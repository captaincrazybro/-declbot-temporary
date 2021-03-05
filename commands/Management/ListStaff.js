const fs = require('fs');
//const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');
const _League = require('../../util/Constructors/_League');

module.exports.run = async (bot, message, args, cmd) => {

	let settings = require('../../settings.json');
	if (_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a guild set! Use the " + settings.prefix + "setleague command to set the league's guild").send(message.channel);

	let league = _League.getLeague(message.guild.id);

	let users = require("../../storage/permissions.json")

	let usersObj = await _User.users(league);
	let rolesObj = await _Role.roles(league);

	let userMap = new Map(Object.entries(usersObj))

	var members = ""; 

	//order
	let map = [...userMap];
	let newMap = [];
	for (let k = Object.keys(Groups.parse).length - 1; k >= 0; k--) {
		for (let i = 0; i < map.length; i++) {
			if (map[i][1].group == k) {
				newMap.push(map[i]);
			}
		}
	} 

	(new Map(newMap)).forEach((k, v) => {
		if (k.group != 0) {
			var group = Groups.parse[k.group];
			members += `User - <@${v.toString()}> - ${group}\n`
		}
	});

	if (rolesObj) {
		let roleMap = new Map(Object.entries(rolesObj))
		roleMap.forEach((k, v) => {
			if (k.group != 0) {
				var group = Groups.parse[k.group];
				members += `Role - <@${v}> - ${group}\n`
			}
		})
	}

	let embed = new Discord.MessageEmbed()
		.setColor(Colors.INFO)
		.setAuthor("Staff")
		.setDescription(members);

	message.channel.send(embed);

}

module.exports.help = {
	name: "liststaff",
	aliases: ["list-staff"],
	permission: Groups.MOD,
	description: "Lists the staff",
	usage: "liststaff"
}
