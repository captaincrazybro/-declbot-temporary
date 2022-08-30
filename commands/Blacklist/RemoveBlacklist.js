const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _MinecraftApi =  require('../../util/Constructors/_MinecraftAPI');
const _Player = require('../../util/Constructors/_Player');
const _Blacklist = require('../../util/Constructors/_Blacklist.js');
const Discord = require('discord.js');
const _League = require('../../util/Constructors/_League')
const leagues = require('../../bot.js').leagues;

module.exports.run = async (bot,message,args,cmd) => {

    let settings = require('../../settings.json');
    if(_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    let league = _League.getLeague(message.guild.id)

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a name").send(message.channel);

    let name = args[0];
    
    _MinecraftApi.getUuid(name).then(async val => {
        
        if(val == false) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);
        
        if(val == undefined) return new _NoticeEmbed(Colors.ERROR, "Name update in progress.").send(message.channel);

        let player = await _Player.getPlayer(val.id, league);

        if(player == null) player = await _Player.addPlayer(val.id, league);
    
        let blacklist = await _Blacklist.getBlacklist(val.id, league);

        if(args[2] && args[2].toLowerCase() == "-g"){
            let i = 0;
            while(i < leagues.length){
                let gL = leagues[i]; 
                let gBl = await _Blacklist.getBlacklist(val.id, gL);
                gBl.delete();
            }
            return new _NoticeEmbed(Colors.SUCCESS, "You have successfully globally deleted the blacklist for " + val.name).send(message.channel);
        }
    
        if(blacklist == null) return new _NoticeEmbed(Colors.ERROR, "This player is not blacklisted").send(message.channel);
    
        await blacklist.delete()
		
		return new _NoticeEmbed(Colors.SUCCESS, "You have successfully deleted the blacklist for " + val.name).send(message.channel);
        
    });

}

module.exports.help = {
    name: "removeblacklist",
    aliases: ["deleteblacklist", "remove-blacklist", "rmbl", "removebl"],
    permission: Groups.MOD,
    description: "Removes a blacklist",
    usage: "removeblacklist <player>"
}
