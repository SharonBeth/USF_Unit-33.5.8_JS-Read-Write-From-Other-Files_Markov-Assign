/** Command-line tool to generate Markov text. */
const fs = require('fs');
const process = require('process');
const markov = require('./markov');
const axios = require('axios');

let path = process.argv[3];  //File to pull the texxt from
let out = process.argv[4];  //Location put next text set into

makeText(path)

//In Ubuntu-shell command line, in desired folder:
//      node makeText.js eggs.txt 

function sendText(data, out) {
    let mm = new markov.MarkovMachine(data)
    let newText = (mm.makeText())
    console.log(newText)
    fs.writeFile(out, newText, 'utf8', function (err) {
        if (err) {
            console.err(err);
            process.exit(1);
        }
    })
};

function makeText(path) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${path}: ${err}`);
            process.exit(1);
        } else {
            sendText(data, out)
        }
    })
}

async function makeURL(path, out) {
    try {
        let resp = await axios.get(path);
        sendText(resp.data, out);
    } catch (err) {
        console.log(`Error fetching the URL${path}: ${err}`);
        process.exit(1);
    }
}


if (process.argv[2] == "file") {
    makeText(path, out)
} else if (process.argv[2] == "url") {
    makeURL(path, out)
}