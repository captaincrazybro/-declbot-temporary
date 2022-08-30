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
  password: "password",
  database: "decl"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

con.query = util.promisify(con.query);

module.exports = class _Blacklist {

    constructor(val, league){

        this.val = val;
        this.league = league;
        this.name = val.name;
        this.img = val.img;

    }

    
}