const { infoBanner, infoLog, errorLog, successLog } = require("../utils/display");
const { spawn } = require("child_process");
const path = require("path");

async function execute() {

    infoBanner(`Installing ADB tool`);

    try {

        return new Promise((resolve, reject) => {
            const bat = spawn(path.resolve("./shell/installADB.sh"));

            bat.stdout.on('data', (data) => {
                successLog(data.toString());
            });

            bat.stderr.on('data', (data) => {
                infoLog(data.toString());
            });

            bat.on('exit', (code) => {
                //errorLog(`Child exited with code ${code}`);
            });


        });


    } catch (e) {

        error("", e);

        return false;
    }

}

module.exports = { execute }