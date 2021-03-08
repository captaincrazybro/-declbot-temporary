const fs = require("fs");
const Discord = require("discord.js")
const _MinecaftAPI = require("../../util/Constructors/_MinecraftAPI")
// const {get} = require('lodash'); is this reallyy necesary?
const _League = require('./_League.js');

const util = require('util')
var mysql = require('mysql');
const _Player = require("./_Player");

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

module.exports = class _Blacklist {

    constructor(val, league){

        this.uuid = val.uuid;
        this.referee = val.referee;
        this.reason = val.reason;
        this.start_date = val.start_date;
        this.notes = val.notes;
        this.type = val.type;
        this.alts = val.alts;
        this.end_date = val.end_date;
        this.league = league;

    }

    async update(){
        await con.query(`UPDATE blacklists SET referee = "${this.referee}", reason = "${this.reason}", start_date = "${this.start_date}", notes = "${this.notes}", type = "${this.type}", alts = "${this.alts}", end_date = "${this.end_date}" WHERE uuid = "${this.uuid}" AND league = "${this.league}"`);
    }

    async delete(){
        await con.query(`DELETE FROM blacklists WHERE uuid = "${this.uuid}" AND league = "${this.league}"`);
    }

    static async exists(uuid, league){
        let rows = await con.query(`SELECT * FROM blacklists WHERE uuid = "${uuid}" AND league = "${league}"`);
        if(rows.length == 0) return null;
        else return rows[0];
    }

    /**
     * @returns {_Blacklist}
     */

    static async getBlacklist(uuid, league){
        let blacklist = await this.exists(uuid, league);
        if(blacklist == null) return null;
        return new _Blacklist(blacklist, league);
    }

    /**
     * @returns {_Blacklist}
     */

    static async createBlacklist(val, league){
        let exists = await this.exists(val.uuid, league);
        if(exists != null) return null;
        await con.query(`INSERT INTO blacklists (uuid, referee, reason, start_date, notes, type, alts, end_date, league) VALUES ("${val.uuid}", "${val.referee}", "${val.reason}", "${val.start_date}", "${val.notes}", "${val.type}", "${val.alts}", "${val.end_date}", "${val.league}")`);
        return new _Player(val, league);
    }

    /**
     * @returns {Array}
     */

    static async getBlacklists(league){
        let rows = await con.query(`SELECT * FROM blacklists WHERE league = "${league}"`)
        return rows;
    }

}