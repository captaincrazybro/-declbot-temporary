const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const settings = require('../../settings.json')

module.exports.run = async (bot, message, args, cmd) => {
    // console.log(bot.users)
    //bot.users.cache.size}

    console.log(bot.users.cache.size)

    let embed = new Discord.MessageEmbed()
        .setColor(Colors.INFO)
        .setAuthor("Bot Info")
        .setDescription(`\n\n
        **Username**: ${bot.user.username}
        **Servers**: ${bot.guilds.cache.size}
        **Users**: ${bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}
        **Author**: ${settings.author}
        **CLN Discord**: https://discord.gg/yEvAQPy 
        **Repository**: https://github.com/captaincrazybro/declbot`)

    message.channel.send(embed);

}

module.exports.help = {
    name: "botinfo",
    aliases: ["bot-info", "info"],
    permission: Groups.DEFAULT,
    description: "Gets the info about the bot",
    usage: "botinfo"
}