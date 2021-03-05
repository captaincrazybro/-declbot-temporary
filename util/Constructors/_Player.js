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

module.exports = class _Player {

    constructor(val, league){

        // asign all variables        
        this.league = league

        this.val = val;
        this.uuid = val.uuid;
        this.rank1 = val.rank1;
        this.team = val.team;
        this.rank2 = val.rank2;
        this.discordId = val.discordId;

    }

    async update(){
        // updates any changes made to the variables above
        console.log(this.discordId);
        await con.query(`UPDATE players SET team = "${this.team}", rank1 = "${this.rank1}", rank2 = "${this.rank2}", discordId = ${this.discordId} WHERE uuid = "${this.uuid}" AND league = "${this.league}"`)
    }

    static async exists(uuid, league){
        // checks to see if the player exists
        let result = await con.query(`SELECT * FROM players WHERE uuid = "${uuid}" AND league = "${league}"`);
        // if no result returns null, else returns the player in object form
        if(result == null || result == undefined || result.length == 0) return null;
        else return result[0];
    }

    /**
     * 
     * @param {String} uuid 
     * @param {String} league 
     * @returns {_Player}
     */

    static async getPlayer(uuid, league){
        let player = await this.exists(uuid, league);
        if(player == null) return null;
        return new _Player(player, league)
    }

    static async addPlayer(uuid, league){
        let exists = await this.exists(uuid, league);
        if(exists != null) return null; 
        let result = await con.query(`INSERT INTO players (uuid, team, rank1, rank2, discordId, league) VALUES ("${uuid}", "None", "Member", "None", 0, "${league}")`);
        return new _Player({uuid:uuid,team:"None",rank1:"Member",rank2:"None",discordId:0}, league);
    }

    static async filterMembers(team, league){
        let result = await con.query(`SELECT * FROM players WHERE team = "${team}" AND league = "${league}"`);
        if(result.length == undefined || result.length == 0) return null;
        else return result; 
    }

}