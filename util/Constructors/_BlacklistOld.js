var blacklist = require("../../storage/blacklist.json");
const _MinecraftAPI = require("./_MinecraftAPI.js")
const fs = require('fs');

module.exports = class Blacklist {

  /**
   * 
   * @param {JSON} val
   */

  constructor(val, league) {

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

  /**
   *
   * @returns {Blacklist}
   */

  update() {

    let val = {};

    val.uuid = this.uuid;
    val.referee = this.referee;
    val.reason = this.reason;
    val.start_date = this.start_date;
    val.notes = this.notes;
    val.type = this.type;
    val.alts = this.alts;
    val.end_date = this.end_date;

    let filtered = blacklist[this.league].filter(val => val.uuid != this.uuid);
    filtered.push(val);

    blacklist[this.league] = filtered;

    fs.writeFile("./storage/blacklist.json", JSON.stringify(blacklist), err => {
      if (err) console.log(err);
    })

    return this;

  }

  delete() {
    blacklist[this.league] = blacklist[this.league].filter(val => val.uuid != this.uuid);
    fs.writeFile("./storage/blacklist.json", JSON.stringify(blacklist), (err) => {
      if (err) console.log(err)
    });
  }

  /**
   * 
   * @param {String} name
   */

  static exists(uuid, league) {
    //add empty array
    if (!blacklist[league]) {
      blacklist[league] = [];
      fs.writeFile("./storage/blacklist.json", JSON.stringify(blacklist), (err) => {
        if (err) console.log(err)
      });
    }


    if (blacklist[league].length == 0) return false;
    else {
      let filtered = blacklist[league].filter(val => val.uuid == uuid);
      if (filtered.length == 0) return null;
      else return filtered[0];
    }
  }

  static getBlacklist(uuid, league) {
    let val = this.exists(uuid, league);
    if (val == null || !val) return null;
    else {
      return new Blacklist(val, league);
    }
  }

  static createBlacklist(val, league) {
    if (this.exists(val.uuid, league) != null && this.exists(val.uuid, league) != false) return null;
    blacklist[league].push(val);
    fs.writeFile('./storage/blacklist.json', JSON.stringify(blacklist), (err) => {
      if (err) console.log(err);
    })
    console.log(require("../../storage/blacklist.json"));
    return new Blacklist(val, league);
  }

  static updateBlacklists(league) {
    blacklist[league].forEach((val, i) => {
      let date = new Date();
      let year = parseInt(val.end_date.split("-")[0]);
      let month = parseInt(val.end_date.split("-")[1]);
      let day = parseInt(val.end_date.split("-")[2]);
      if (date.getYear() == year && date.getMonth() == month && date.getDay() == day) {
        delete blacklist[i];
        fs.writeFile('./storage/blacklist.json', JSON.stringify(blacklist), (err) => {
          if (err) console.log(err);
        })
      }
    })
  }

  static blacklists(league) {
    if (blacklist[league])
      return blacklist[league];
    else return [];
  }

}
