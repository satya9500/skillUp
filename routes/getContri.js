const sqlstring = require("sqlstring");
const axios = require('axios');
const cheerio = require('cheerio');
require("../config");

getContri();

function getContri() {
    let query = `select github_username from Registration;`;
    try {
        db.query(query, async (err, result) => {
            if (err) throw err;
            console.log(result.recordsets[0]);
        })
    } catch (err) {
        console.log(err);
    }
}