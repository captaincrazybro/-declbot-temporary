const fs = require("fs");
const Discord = require("discord.js")
const _MinecaftAPI = require("../../util/Constructors/_MinecraftAPI")
// const {get} = require('lodash'); is this reallyy necesary?
const _League = require('./_League.js');

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

module.exports = class _Role {

    constructor(id, group, commands, league){

        this.id = id;
        this.league = league;
        this.group = group;
        this.commands = commands;
    
    }

    getCommands(){
        return JSON.parse(this.commands);
    }

    hasCommandPerm(commandName){
        if(this.getCommands()[commandName] == undefined || this.getCommands()[commandName] == null) return null;
        return this.getCommands()[commandName] != false;
    }


    async update(){
        await con.query(`UPDATE permissions SET thegroup = ${this.group}, commands = '${JSON.stringify(this.commands)}' WHERE id = "${this.id}"`);
    }

    hasPermission(prop){
        if(this.hasCommandPerm(prop.help.name) == false) return false;
        return prop.help.permission <= this.group || this.hasCommandPerm(prop.help.name);
    }

    static async getRole(id, league){

        let group;
        let commands;

        let rows = await con.query(`SELECT * FROM permissions WHERE id = "${id}" AND type = "role" AND league = "${league}"`);
        if(rows.lenght == 0) {
            await con.query(`INSERT INTO permissions (id, type, thegroup, commands, league) VALUES ("${id}", "role", 0, '{}', "${league}")`);
            group = 0;
            commands = {};
        } else {
            group = rows[0].thegroup;
            commands = rows[0].commands;
        }

        return new _Role(id, group, commands, league);

    }

    static async roles(league){
        let rows = await con.query(`SELECT * FROM permissions WHERE type = "role" AND league = "${league}" AND thegroup >= 1`);
        return rows;
    }

}