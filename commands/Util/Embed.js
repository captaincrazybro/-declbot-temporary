const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const EmbedWizard = require('../../modules/EmbedWizard.js');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a channel to send the embed in (either #channel-name or id)").send(message.channel);

    if(!args[0].includes("<#") || !args[0].includes(">")) return new _NoticeEmbed(Colors.ERROR, "Invalid channel - Please specify a valid channel (either #channel-name or id)").send(message.channel);
    
    let num = args[0].replace("<#", "")
    num.replace(">","");

    if(isNaN(num)) return new _NoticeEmbed(Colors.ERROR, "Invalid channel - Please specify a valid channel (either #channel-name or id)").send(mesasge.channel);

    num = parseFloat(num);

    let channel = message.guild.channels.cache.get(num);

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a title").send(message.channel);

    let newArgs = args;
    newArgs.pop();
    let title = newArgs.join(" ");

    EmbedWizard.embedWizardMap.set(message.author.id, {title: title, channel: channel, step: 1})

    return new _NoticeEmbed(Colors.SUCCESS, "You have successfully started the embed creation wizard. The title has been set as " + title + ". Please specify a color for the embed.").send(message.channel);

}

module.exports.help = {
    name: "embed",
    aliases: ["embedcreater"],
    permission: Groups.MOD,
    description: "Creates and sends an embed",
    usage: "embed <channel> <title>"
}