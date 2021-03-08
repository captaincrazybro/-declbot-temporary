const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const settings = require('../../settings.json');
const fs = require('fs');
//const players = require('../../storage/players.json');
const index = require('../../bot.js')

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify either true or false").send(message.channel);
    
    if(args[0].toLowerCase() != "true" && args[0].toLowerCase() != "false") return new _NoticeEmbed(Colors.ERROR, "Invalid boolean - Specify either true or false").send(message.channel);

	var isTrueSet = (args[0].toLowerCase() == 'true');
	
	index.reload = isTrueSet;
	
	//if(isTrueSet) bot.guilds.cache.get('665698425601392749').channels.cache.get('678679440993288263').send("Bot maintenance in progress")
	
	settings.maintenance = isTrueSet;
	
	fs.writeFile('./settings.json', JSON.stringify(settings), (err) => {
		if(err) console.log(err);
	});
	
	/*fs.writeFile('./backups/players-reload.json', JSON.stringify(players), (err) => {
		if(err) console.log(err);
	});*/

	//process.exit()
	
	return new _NoticeEmbed(Colors.SUCCESS, `Successfully set reload to ${isTrueSet}`).send(message.channel);

}

module.exports.help = {
    name: "maintenance",
    aliases: ["reload"],
    permission: Groups.OWNER,
    description: "Puts the bot in maintenance mod",
    usage: "maintenance <true|false>"
}
 
