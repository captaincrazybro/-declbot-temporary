const users = require('../../storage/permissions.json');
const Groups = require('../Enums/Groups.js');
const fs = require('fs');
const settings = require("../../settings.json");

module.exports = class _Role {

    constructor(id, league){
        this.league = league;
        if(!users[this.league].roles){
            users[this.league].roles = {};
        }
        if(!users[this.league].roles[id]){
            users[this.league].roles[id] = {}
        }
        if(!users[this.league].roles[id].group){
            users[this.league].roles[id].group = Groups.DEFAULT
        }
        if(!users[this.league].roles[id].commands){
            users[this.league].roles[id].commands = {}
        }
        fs.writeFile('./storage/permissions.json', JSON.stringify(users), (err) => {
          if(err) console.log(err);
        })
        this.id = id;
        this.bot = require("../../bot.js");
    }

    get getGroup(){
        return parseInt(users[this.league].roles[this.id].group);
    }

    hasCommadPerm(commandName){
        if(!users[this.league].roles[this.id].commands[commandName] || users[this.league].roles[this.id].commands[commandName] == false){
            return false;
        } else {
            return true;
        }
    }

    setGroup(group){
        users[this.league].roles[this.id].group = group;
        fs.writeFile('./storage/permissions.json', JSON.stringify(users), (err) => {
            if(err) console.log(err);
        })
    }

    setCommandPerm(commandName, boolean){
        users[this.league].roles[this.id].commands[commandName] = boolean;
        fs.writeFile('./storage/permissions.json', JSON.stringify(users), (err) => {
            if(err) console.log(err);
        })
    }

    hasPermission(prop){
        return prop.help.permission <= this.getGroup || this.hasCommadPerm(prop.help.name);
    }

}