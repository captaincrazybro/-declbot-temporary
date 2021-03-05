var players = require("../../storage/players.json");
const fs = require("fs");
const Discord = require("discord.js")
const _MinecaftAPI = require("./_MinecraftAPI")
// const {get} = require('lodash'); is this reallyy necesary?
const _League = require('./_League.js');

module.exports = class _Player {

    /**
     * 
     * @param {String} name 
     * @param {JSON} val 
     */

    constructor(val, league) {

        this.league = league

        players = require("../../storage/players.json");

        if (val.discordId == undefined) val.discordId = null;

        this.val = val;
        this.uuid = val.uuid;
        this.rank = val.rank;
        this.team = val.team;
        this.name = val.name;
        this.rank2 = val.rank2;
        this.discordId = val.discordId;

        if (val.rating == null) this.rating = { Shotgun: null, Rifle: null, Machinegun: null };
        else this.rating = val.rating

        if (val.deaths == undefined) val.deaths = 0;
        if (val.kill == undefined) val.kills = 0;
        this.deaths = val.deaths;
        this.kills = val.kills;

    }

    /**
     * @returns {Number}
     */

    getKDR() {
        return this.kills / this.deaths;
    }

    /**
     * 
     * @param {String} team 
     * @returns {Array<JSON>}
     */

    static filterMembers(team, league) {
        if (players[league].length > 0) var outcome = players[league].filter(val => val.team == team || val.nick == team);
        else return null;
        return outcome;
    }

    setDiscordId(id) {
        let index = players[this.league].indexOf(this.val);
        players[this.league][index].discordId = id;
        fs.writeFile('./storage/players.json', JSON.stringify(players), (err) => {
            if (err) console.log(err);
        })
        this.discordId = id;
        this.val.discordId = id;
        return this;
    }

    /**
     * 
     * @param {String} rank 
     * @returns {_Player}
     */

    setRank(rank) {
        let index = players[this.league].indexOf(this.val);
        players[this.league][index].rank = rank;
        fs.writeFile('./storage/players.json', JSON.stringify(players), (err) => {
            if (err) console.log(err);
        })
        this.rank = rank;
        this.val.rank = rank;
        return this;
    }

    /**
     * 
     * @param {String} rank 
     * @returns {_Player}
     */

    setRank2(rank) {
        let index = players[this.league].indexOf(this.val);
        players[this.league][index].rank2 = rank;
        fs.writeFile('./storage/players.json', JSON.stringify(players), (err) => {
            if (err) console.log(err);
        })
        this.rank2 = rank;
        this.val.rank2 = rank;
        return this;
    }

    /**
     * 
     * @param {Number} deaths 
     * @returns {_Player}
     */

    setKills(kills) {
        let index = players[this.league].indexOf(this.val);
        players[this.league][index].kills = kills;
        fs.writeFile('./storage/players.json', JSON.stringify(player), err => {
            if (err) console.log(err);
        })
        this.kills = kills;
        this.val.kills = kills;
        return this;
    }

    /**
     * 
     * @param {Number} deaths 
     * @returns {_Player}
     */

    setDeaths(deaths) {
        let index = players[this.league].indexOf(this.val);
        players[this.league][index].deaths = deaths;
        fs.writeFile('./storage/players.json', JSON.stringify(player), err => {
            if (err) console.log(err);
        })
        this.deaths = deaths;
        this.val.deaths = deaths;
        return this;
    }

    /**
     * 
     * @param {Number} kills 
     * @returns {_Player}
     */

    addKills(kills) {
        return this.setKills(this.kills + kills);
    }

    /**
     * 
     * @param {Number} deaths 
     * @returns {_Player}
     */

    addDeaths(deaths) {
        return this.setDeaths(this.deaths + deaths);
    }

    /**
     * 
     * @param {Number} kills 
     * @returns {_Player}
     */

    removeKills(kills) {
        return this.setKills(this.kills - kills);
    }

    /**
     * 
     * @param {Number} deaths 
     * @returns {_Player}
     */

    removeDeaths(deaths) {
        return this.setDeaths(this.deaths - deaths);
    }

    /**
     * @returns {_Player}
     */

    remRank() {
        return this.setRank("Member")
    }

    /**
     * 
     * @returns {_Player} 
     */

    remRank2() {
        return this.setRank2(undefined);
    }

    /**
     * 
     * @param {String} team 
     * @returns {_Player}
     */

    setTeam(team) {
        let index = players[this.league].indexOf(this.val);
        players[this.league][index].team = team;
        this.team = team;
        this.val.team = team
        fs.writeFile('./storage/players.json', JSON.stringify(players), (err) => {
            if (err) console.log(err);
        })
        return this;
    }

    /*setRating(rating, kit){
        let index = players.findIndex(val => val.uuid == this.uuid);
        if(!players[index].rating) players[index].rating = {};
        players[index].rating[kit] = rating;
        fs.writeFile('./storage/players.json', JSON.stringify(players), (err) => {
            if(err) console.log(err);
        })
        this.rating[kit] = rating;
        this.val.rating[kit] = rating;
    }

    addWin(theirRating, kit){
        if(this.rating[kit] == null) this.rating[kit] = 1000;
        this.setRating(this.getRating(this.rating[kit], 1, this.getExpectedScore(this.rating[kit], theirRating)), kit);
    }

    addLoss(theirRating, kit){
        if(this.rating[kit] == null) this.rating[kit] = 1000;
        this.setRating(this.getRating(this.rating[kit], 0, this.getExpectedScore(this.rating[kit], theirRating)), kit);
    }

    getExpectedScore(yourRating, theirRating){
        return 1/(1 + Math.pow(10, (theirRating - yourRating)/400));
    }

    getRating(oldRating, score, expectedScore){
        return Math.round(oldRating + 32 * (score - expectedScore));
    }*/

    /**
     * @returns {_Player}
     */

    remTeam() {
        return this.setTeam("None");
    }

    /**
     * 
     * @param {String} name
     * @returns {JSON}
     */

    static exists(name, league) {
        // console.log("playr", players[league].filter(val => val.name == undefined));
        if (players[league].length > 0) var filtered = players[league].filter(val => val.name && val.name.toLowerCase() == name.toLowerCase());
        else return null;
        return filtered.pop();
    }

    static existsUuid(uuid, league) {
        if (players[league].length > 0) var filtered = players[league].filter(val => val.uuid == uuid);
        else return null;
        let pop = filtered.pop();
        if (filtered.length > 0)
            return pop;
        else
            return null//filtered
    }

    /**
     * 
     * @param {String} name
     * @param {String} uuid 
     */

    static addPlayer(name, uuid, league) {
        if (league == null) return;
        let pl = this.existsUuid(uuid, league);
        if (pl != null) return;
        let json = { "name": name, "uuid": uuid, "rank": "Member", team: "None", rank2: "None", rating: { "Rifle": null, "Shotgun": null, "Machinegun": null }, discordId: null }
        players[league].push(json);
        fs.writeFile('./storage/players.json', JSON.stringify(players), (err) => {
            if (err) console.log(err);
        })
        return new _Player(json, league);
    }

    static getPlayer(name, league) {
        if (league == null) return;
        let val = this.exists(name, league)
        if (val == null) return null;
        return new _Player(val, league);
    }

    static getPlayerUuid(uuid, league) {
        if (league == null) return;
        let val = this.existsUuid(uuid, league)
        if (val == null) return;
        return new _Player(val, league);
    }

    static getPlayerObj(league) {
        return players[league];
    }

    static updateNames(league) {
        players[league].forEach(json => {
            _MinecaftAPI.getUuid(json.name).then(val2 => {
                if (val2 != undefined && (val2.id == json.uuid || val2.error != undefined)) {
                    return;
                } else { 
            _MinecaftAPI.getName(json.uuid).then(val => {
                if (!val || json.name == val) return;
                console.log(`${json.name} -> ${val}`);
                var json2 = json;
                json2.name = val;
                players[league] = players[league].filter(it => it.name != json.name)
                players[league].push(json2);
                fs.writeFile('./storage/players.json', JSON.stringify(players), (err) => {
                    if (err) console.log(err);
                })
            })

            }
            })
        })
    }

}
