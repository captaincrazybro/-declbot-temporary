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
  password: "password",
  database: "decl"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

con.query = util.promisify(con.query);

module.exports = class _User {

    constructor(id, group, commands, league){

        this.id = id;
        this.league = league;
        this.group = group;
        this.commands = commands;

    }

    async hasCommadPerm(commandName){
        return this.commands[commandName] && this.commands[commandName] != false;
    }

    async update(){
        await con.query(`UPDATE permissions SET thegroup = ${this.group} && commands = ${this.commands}`);
    }

    async hasPermission(prop){
        return prop.help.permission <= this.group || this.hasCommadPerm(prop.help.name);
    }

    static async getUser(id, league){

        let group;
        let commands;

        let rows = await con.query(`SELECT * FROM permissions WHERE id = ${this.id} AND type = "user" AND league = "${this.league}"`);
        if(rows.lenght == 0) {
            await con.query(`INSERT INTO permissions (userId, type, thegroup, commands, league) VALUES (${this.id}, "user", 0, {}, "${this.league}")`);
            group = 0;
            commands = {};
        } else {
            group = rows[0].thegroup;
            commands = rows[0].commands;
        }

        return new _User(id, group, commands, league);

    }

    static async exists(id, league){
        let rows = await con.query(`SELECT * FROM permissions WHERE id = ${this.id} AND type = "user" AND league = "${this.league}"`);
        if(rows.length == 0) return null;
        else return rows[0];
    }

    static async users(league){
        let rows = await con.query(`SELECT * FROM permissions WHERE type = "user" AND league = "${league}"`);
        return rows;
    }

}