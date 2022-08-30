var users = require('../../storage/permissions.json');
const Groups = require('../Enums/Groups.js');
const fs = require('fs');
const settings = require("../../settings.json");
let economy = require('../../storage/economy.json');
const punishments = require('../../storage/punishments.json');

module.exports = class _User {

    constructor(id, league){
        this.league = league;
        if(!users[league]){
            users[league] = {};
        }
        if(!users[league].users){
            users[league].users = {};
        }
        if(!users[league].users[id]){
            users[league].users[id] = {}
        }
        if(!users[league].users[id].group){
            users[league].users[id].group = Groups.DEFAULT
        }
        if(settings.owners.includes(id)){
            users[league].users[id].group = Groups.OWNER
        } 
        if(settings.managers.includes(id)){
            users[league].users[id].group = Groups.MANAGER;
        }
        if(!users[league].users[id].commands){
            users[league].users[id].commands = {}
        }
        if(users[league].users[id].group == Groups.MANAGER && !settings.managers.includes(id)){
            users[league].users[id].group = Groups.DEFAULT;
        }
        /*if(!punishments[league][id]){
            punishments[league][id] = [];
            fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), (err) => {
                if(err) console.log(err);
            })
        }
        if(!punishments[league].number){
            punishments[league].number = 0;
            fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), (err) => {
                if(err) console.log(err);
            })
        }
        if(!economy[league][id]){
            economy[league][id] = {
                xp: 0
            }
            fs.writeFile('./storage/economy.json', JSON.stringify(economy), err => {
                if(err) console.log(err);
            })
        }*/
        fs.writeFile('./storage/permissions.json', JSON.stringify(users), (err) => {
          if(err) console.log(err);
        })
        //this.xp = economy[league][id].xp;
        this.id = id;
        this.bot = require("../../bot.js").bot;
    }

    get getGroup(){
        return users[this.league].users[this.id].group;
    }

    hasCommadPerm(commandName){
        if(!users[this.league].users[this.id].commands[commandName] || users[this.league].users[this.id].commands[commandName] == false){
            return false;
        } else {
            return true;
        }
    }
    
    /*getLevel(){
        let outcome = this.xp / 15000;
        outcome++;
        return `${outcome}`.charAt(0);
    }*/
    
    /*updateEconomy(){
        let newObj = economy[this.league][this.id];
        newObj.xp = this.xp;
        economy[this.league][this.id] = newObj;
        fs.writeFile('./storage/economy.json', JSON.stringify(economy), err => {
            if(err) console.log(err);
        });
        return this;
    }*/

    setGroup(group){
        users[this.league].users[this.id].group = group;
        fs.writeFile('./storage/permissions.json', JSON.stringify(users), (err) => {
            if(err) console.log(err);
        })
    }

    /*addPunishment(type, moderatorId, reason, duration){
        if(!punishments[this.league][this.id].number){
            punishments[this.league][this.id].number = 0;
        }
        if(!duration){
            let date = new Date();
            let json = {
                type: type,
                date: date.toString(),
                moderator: moderatorId,
                reason: reason,
                duration: '',
                id: punishments[this.league].number
            };
            punishments[this.league][this.id].push(json)
            punishments[this.league].number++;
            fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), (err) => {
                if(err) console.log(err);
            })
            return json;
        }
        let date = new Date();
        let json = {
            type: type,
            date: date.toString(),
            moderator: moderatorId,
            reason: reason,
            duration: duration,
            id: punishments[this.league].number
        };
        punishments[this.league][this.id].push(json)
        punishments[this.league].number++;
        fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), (err) => {
            if(err) console.log(err);
        })
        return json;
    }

    removePunishment(type, moderatorId){
        if(!moderatorId){
            let filtered = punishments[this.league][this.id].filter((val) => val.type == type);
            if(filtered.length < 1) return false;
            let val = filtered.shift();
            punishments[this.league][this.id] = punishments[this.league][this.id].filter((v) => v != val)
            fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), (err) => {
                if(err) console.log(err);
            })
            return val;
        }
        let filtered = punishments[this.league][this.id].filter((val) => val.moderator == moderatorId && val.type == type);
        if(filtered.length > 1) return false;
        let val = filtered.shift();
        punishments[this.id] = punishments[this.id].filter((v) => v != val)
        fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), (err) => {
            if(err) console.log(err);
        })
        return val;
    }

    getPunishments(){
        return punishments[this.league][this.id];
    }

    getPunishment(id){
        let punishment = punishments[this.league][this.id].filter((v) => v.id == id);
        return punishment.shift();
    }*/

    setCommandPerm(commandName, boolean){
        users[this.league].users[this.id].commands[commandName] = boolean;
        fs.writeFile('./storage/permissions.json', JSON.stringify(users), (err) => {
            if(err) console.log(err);
        })
    }

    hasPermission(prop){
        return prop.help.permission <= this.getGroup || this.hasCommadPerm(prop.help.name);
    }

    static users(league){ return users[league]}
    
    static getEconomyMap(){
        return new Map(Object.entries(economy));
    }

}
