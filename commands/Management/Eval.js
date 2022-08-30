const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const settings = require('../../settings.json');
const fs = require('fs');
//const players = require('../../storage/players.json');
const index = require('../../bot.js')
const _Blacklist = require('../../util/Constructors/_Blacklist');
const _User = require('../../util/Constructors/_User');
const _Role = require('../../util/Constructors/_Role');
const _MinecraftAPI = require('../../util/Constructors/_MinecraftAPI');
const _Player = require('../../util/Constructors/_Player');
const _Team = require('../../util/Constructors/_Team');
const util = require('util')
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "oukS$aA7o22#I8drlThK",
  database: "decl"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

con.query = util.promisify(con.query);


module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify either true or false").send(message.channel);
    
	
	try {
		let outcome = eval(args.join(" "));
		
		if(outcome == undefined) return message.channel.send('```undefined```');
		
		//console.log(typeof outcome);
	
		if((typeof outcome) == 'json' || (typeof outcome) == 'object') outcome = JSON.stringify(outcome);
	
		message.channel.send('```' + outcome + '```');
	} catch(err) {
		message.channel.send('```' + err + '```');
	}

}

module.exports.help = {
    name: "eval",
    aliases: ["evalcode"],
    permission: Groups.OWNER,
    description: "Evaluates a code string",
    usage: "eval <code>"
}
