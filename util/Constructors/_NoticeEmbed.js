const Groups = require('../Enums/Groups.js');
const fs = require('fs');
const settings = require("../../settings.json");
const Discord = require("discord.js");

module.exports = class _NoticeEmbed {

    /**
     * 
     * @param {String} color 
     * @param {String} message 
     */

    constructor(color, message){
        this.embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(message);
    }

    /**
     * 
     * @param {Channel} channel 
     */

    send(channel){
        channel.send(this.embed);
    }

}