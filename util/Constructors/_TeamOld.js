var teams = require("../../storage/teams.json");
var players = require("../../storage/players.json");
const fs = require("fs");
const Discord = require("discord.js")
const _Player = require('./_PlayerOld');
const _Match = require("./_Match");
const _League = require('./_League');

module.exports = class _Team {

    /**
     * 
     * @param {String} name 
     * @param {JSON} val
     */

    constructor(name, val, league) {

        this.league = league;

        players = require("../../storage/players.json");

        this.val = val;
        this.name = name;
        this.color = val.color;
        this.logo = val.logo;
        this.nick = val.nick;
        this.owner = val.owner;
        this.losses = val.losses
        this.wins = val.wins

    }

    /**
     * @returns {Array<String>}
     */

    getMembers() {
        let filtered = _Player.filterMembers(this.name, this.league);
        if (filtered == null) return [];
        return filtered;
    }

    /**
 * 
 * @param {String} newName 
 * @returns {_Team}
 */

    setName(newName) {
        if (newName == this.name) return;
        let val = this.val;
        val.name = newName;
        teams[this.league] = teams[this.league].filter(it => it.name != this.val.name)
        teams[this.league].push(val);
        fs.writeFile('./storage/teams.json', JSON.stringify(teams), (err) => {
            if (err) console.log(err);
        })
        players[this.league].filter(val => val.team == this.name).forEach(val => val.team = newName);
        fs.writeFile('./storage/players.json', JSON.stringify(players), (err) => {
            if (err) console.log(err);
        })
        /*_Match.getMatchesObj().forEach(val => {
            if(val.team1 == this.name){
                val.team1 = newName;
            } else if(val.team2 == this.name){
                val.team2 = newName;
            }
        })*/
        fs.writeFile('./storage/matches.json', JSON.stringify(teams), err => {
            if (err) console.log(err);
        })
        this.name = newName;
        this.val = val
        return this;
    }

    /**
     * 
     * @param {String} color 
     * @returns {_Team}
     */

    setColor(color) {
        if (color == this.color) return;
        let val = this.val;
        val.color = color;
        teams[this.league] = teams[this.league].filter(it => it.name != this.val.name)
        teams[this.league].push(val);
        fs.writeFile('./storage/teams.json', JSON.stringify(teams), (err) => {
            if (err) console.log(err);
        })
        this.color = color;
        this.val = val
        return this;
    }

    /**
     * 
     * @param {String} logo 
     * @returns {_Team}
     */

    setLogo(logo) {
        if (logo == this.logo) return;
        let val = this.val;
        val.logo = logo;
        teams[this.league] = teams[this.league].filter(it => it.name != this.val.name)
        teams[this.league].push(val);
        fs.writeFile('./storage/teams.json', JSON.stringify(teams), (err) => {
            if (err) console.log(err);
        })
        this.logo = logo;
        this.val = val
        return this;
    }

    /**
     * 
     * @param {String} nick 
     * @returns {_Team}
     */

    setNick(nick) {
        if (nick == this.nick) return;
        let val = this.val;
        val.nick = nick;
        teams[this.league] = teams[this.league].filter(it => it.name != this.val.name)
        teams[this.league].push(val);
        fs.writeFile('./storage/teams.json', JSON.stringify(teams), (err) => {
            if (err) console.log(err);
        })
        this.nick = nick;
        this.val = val
        return this;
    }

    /**
     * 
     * @param {String} uuid 
     * @returns {_Team}
     */

    setOwner(uuid) {
        if (uuid == this.owner) return;
        let val = this.val;
        val.owner = uuid;
        teams[this.league] = teams[this.league].filter(it => it.name != this.val.name)
        teams[this.league].push(val);
        fs.writeFile('./storage/teams.json', JSON.stringify(teams), (err) => {
            if (err) console.log(err);
        })
        this.owner = uuid;
        this.val = val
        return this;
    }

    /**
     * 
     * @param {Number} color 
     * @returns {_Team}
     */

    setLosses(losses) {
        if (losses == this.losses) return;
        let val = this.val;
        val.losses = losses;
        teams[this.league] = teams[this.league].filter(it => it.name != this.val.name)
        teams[this.league].push(val);
        this.losses = losses;
        fs.writeFile('./storage/teams.json', JSON.stringify(teams), (err) => {
            if (err) console.log(err);
        })
        this.val = val
        return this;
    }

    /**
     * 
     * @param {Number} color 
     * @returns {_Team}
     */

    setWins(wins) {
        if (wins == this.wins) return;
        let val = this.val;
        val.wins = wins;
        teams[this.league] = teams[this.league].filter(it => it.name != this.val.name)
        teams[this.league].push(val);
        fs.writeFile('./storage/teams.json', JSON.stringify(teams), (err) => {
            if (err) console.log(err);
        })
        this.wins = wins;
        this.val = val
        return this;
    }

    /**
     * 
     * @param {Number} wins 
     * @returns {_Team}
     */

    addWins(wins) {
        this.setWins(this.wins + wins);
        return this;
    }

    /**
     * 
     * @param {Number} losses 
     * @returns {_Team}
     */

    addLosses(losses) {
        this.setLosses(this.losses + losses);
        return this;
    }

    /**
     * @returns {_Team}
     */

    delete() {
        teams[this.league] = teams[this.league].filter(v => v.name != this.val.name);
        fs.writeFile('./storage/teams.json', JSON.stringify(teams), (err) => {
            if (err) console.log(err);
        })
        players[this.league].forEach(val => {
            if (val.team == this.name) _Player.getPlayer(val.name, this.league).setTeam("None");
        })
        fs.writeFile('./storage/players.json', JSON.stringify(players), (err) => {
            if (err) console.log(err);
        })
        return this;
    }

    /**
     * 
     * @param {String} team 
     * @returns {JSON}
     */

    static exists(team, league) {
        if (!teams[league]) teams[league] = [];
        if (teams[league].length > 0) var filtered = teams[league].filter(val => val.name.toLowerCase() == team.toLowerCase());
        else return null;
        if (filtered.length == 0) {
            filtered = teams[league].filter(val => {
                if (val.nick != null) return val.nick != "NONE" && val.nick.toLowerCase() == team.toLowerCase();
            })
            if (filtered.length == 0) return null;
        }
        let pop = filtered.pop();
        return pop;
    }


    /**
     * 
     * @param {String} team 
     * @returns {_Team}
     */

    static getTeam(team, league) {
        let val = this.exists(team, league);
        if (val == null) return null;
        return new _Team(val.name, val, league);
    }

    /**
     * 
     * @param {String} team 
     * @return {_Team}
     */

    static createTeam(team, league) {
        let val = this.exists(team, league);
        if (val != null) return null;
        let json = {
            "name": team,
            "color": "WHITE",
            "logo": "None",
            "nick": "None",
            "owner": "None",
            "losses": 0,
            "wins": 0
        }
        teams[league].push(json);
        fs.writeFile('./storage/teams.json', JSON.stringify(teams), (err) => {
            if (err) console.log(err);
        })
        return new _Team(team, json, league);

    }

    /**
     * @returns {Array}
     */

    static getTeams(league) {
        let teamList = [];
        teams[league].forEach(val => {
            teamList.push(this.getTeam(val.name, league))
        })
        return teamList;
    }

    static getTeamObj(league) {
        return teams[league];
    }

}
