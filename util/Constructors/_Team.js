const fs = require("fs");
const Discord = require("discord.js")
const _Player = require('./_Player');
const _Match = require("./_Match");
const _League = require('./_League');

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

module.exports = class _Team {

    constructor(val, league){

        this.league = league;

        this.val = val;
        this.name = val.name;
        this.color = val.color;
        this.logo = val.logo;
        this.owner = val.owner;
        this.points = val.points;
        this.id = val.id;

    }

    // saves any new changes to the database
    async update(){
        await con.query(`UPDATE teams SET name = "${this.name}", color = "${this.color}", logo = "${this.logo}", owner = "${this.owner}", points = ${this.points} WHERE id = ${this.id}`)
    }

    // gets the members in the team
    async getMembers(){
        let players = await _Player.filterMembers(this.name, this.league);
        return players; 
    }

    // deletes the team
    async delete(){
        await con.query(`DELETE FROM teams WHERE name = "${this.name}" AND league = "${this.league}"`)
    }

    // checks to see if the team exists. if it doesn't return null
    static async exists(name, league){
        let result = await con.query(`SELECT * FROM teams WHERE name = "${name}" AND league = "${league}"`);
        if(result == undefined || result == null || result.length == 0) return null;
        else return result[0];
    }

    // if team does not exists, returns null. otherwise returns an instance of _Team
    /**
     * 
     * @param {String} name
     * @param {String} league 
     * @returns {_Team}
     */
    static async getTeam(name, league){
        let player = await this.exists(name, league);
        if(player == null || player == undefined) return null;
        else return new _Team(player, league);
    }

    // creates a new team, although, if team already exists doesn't create
    static async createTeam(name, league){
        let exists = await this.exists(name, league);
        if(exists != null) return null;
        await con.query(`INSERT INTO teams (name, color, logo, owner, points, league) VALUES ("${name}", "WHITE", "None", "None", ${0}, "${league}")`)
        let json = {
            "name": name,
            "color": "WHITE",
            "logo": "None",
            "owner": "None",
            "points": 0
        }
        return new _Team(json, league);
    }

    // gets the teams 
    static async getTeams(league){
        let result = await con.query(`SELECT * FROM teams WHERE league = "${league}"`);
        let teams = [];
        result.forEach(val => {
            let team = new _Team(val, league);
            teams.push(team);
        })
        return teams;
    }

}