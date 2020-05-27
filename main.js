#!/usr/bin/env node

/* eslint-disable global-require */
/* eslint no-console: 0 */
/**
 * Copyright (c) 2018-present, Kaios, Inc.
 */

const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const { infoBanner, successLog, errorLog, warningLog, infoLog } = require("./utils/display");
const os = require("os");
const plataform = os.platform();

// Scripts
const ADBDownloadScript = require("./scripts/adbDownload");
const adbDebug = require("./scripts/adbDebug");

const commander = require("commander");
const program = new commander.Command();
program.version('0.0.1');


// Aux
const b2gGlobal = path.resolve(__dirname, "..", "b2g-cli-tool");
const b2gLocal = path.resolve(__dirname, "node_modules/b2g-cli-tool");
let b2gcli = fs.existsSync(b2gGlobal) ? b2gGlobal : b2gLocal;
b2gcli += "/b2g.js"


program
    .option('-i, --install <path>', 'Install KaiOS App from path')
    .option('-u, --uninstall <name>', 'Uninstall KaiOS app using the Manifest Name')
    .option('-n, --name <name> ', 'Pass the manifest name of the app to commands')
    .option('-srt, --start <name>', 'Start a KaiOS App using Manifest Name')
    .option('-stp, --stop <name>', 'Stop a KaiOS App using Manifest Name')
    .option('-d, --debug [port]', 'Enable forward debug on port (default 6000)')
    .option('--process', 'Show all process on device')
    .option('--info', 'Show resource information from device')
    .option('--init', 'Setup your environment and install latest adb plataform tools');

program.parse(process.argv);


/** Prepare  ( Install ADB  tools) */

async function start() {




    // Prepare
    if (program.init) {
        await ADBDownloadScript.execute();
    }

    // Debug on port
    if (program.debug) {
        await adbDebug.execute(program.debug || 6000);
    }

    /** Start KaiOS app */
    if (program.start) {
        infoLog(`Starting ${program.start}...`);
        const launchCmd = `'${b2gcli}' launch '${program.start}'`;
        try {
            const startResult = execSync(launchCmd).toString("utf8");
            startResult === '' && successLog(`${program.start} started!`);
        } catch (error) {
            warningLog(`[${program.start}] is not installed!`);
        }
    }

    /** Stop KaiOS App */
    if (program.stop) {
        infoLog(`Stopping ${program.stop}...`);
        const launchCmd = `'${b2gcli}' stop '${program.stop}'`;
        const startResult = execSync(launchCmd).toString("utf8");
        startResult === '' && successLog(`${program.stop} stopped!`);
    }

    /** Install KaiOS App */
    if (program.install) {
        const appPath = path.resolve(program.install);
        const manifestFile = path.resolve(`${appPath}/manifest.webapp`);

        if (!fs.existsSync(manifestFile)) {
            errorLog("Your app should have a [manifest.webapp] file", "");
            process.exit();
        }

        const manifestString = fs.readFileSync(manifestFile);
        const manifestObject = JSON.parse(manifestString);
        infoBanner(`Installing [${manifestObject.name}]...`);
        const installCommand = `'${b2gcli}' install '${appPath}'`;
        const installResult = execSync(installCommand).toString("utf8");
        installResult === '' && successLog(`[${manifestObject.name}] successfuly installed!\n`);
    }


    /** Uninstall KaiOS App */
    if (program.uninstall) {


        infoBanner(`Uninstalling [${program.uninstall}]`);
        const stopCommand = `'${b2gcli}' stop '${program.uninstall}'`;
        const uninstallCommand = `'${b2gcli}' uninstall '${program.uninstall}'`;
        try {
            const stopResult = execSync(stopCommand).toString("utf8");
            const uninstallResult = execSync(uninstallCommand).toString("utf8");
            uninstallResult === '' && successLog(`[${program.uninstall}] successfuly removed!`);

        } catch (error) {
            warningLog(`[${program.uninstall}] is not installed!`);
        }


    }

    /** Show b2g info */
    if (program.info) {
        const infoResult = execSync(`adb shell b2g-info`).toString("utf8");
        successLog(infoResult);
    }
    /** Show b2g running process */
    if (program.process) {
        const processResult = execSync(`adb shell b2g-ps`).toString("utf8");
        successLog(processResult);
    }


    const adbInstalled = execSync("echo $(which adb)").toString("utf8").replace("\n", "");
    if (!adbInstalled) {
        warningLog("\n Please run 'kdeploy --init' to install latest adb plataform tools\n");
        process.exit();
    }

    process.exit();
}




// async function _start() {

//     console.log({ args: process.argv });
//     console.log("\n\n");

//     if (process.argv.includes("--adb-install")) {

//         if (plataform.toLowerCase().indexOf("windows") !== -1) {

//             warningLog("Sorry, Windows is not supported!");
//             process.exit();
//         }

//         await adbInstall();

//         process.exit();
//     }


//     if (process.argv.includes("--adb-debug")) {
//         runADB();
//         process.exit();
//     }

//     const distName = process.argv[2];
//     const action = process.argv[3] || 'install';

//     if (!distName) {
//         console.log("You must pass the app folder as the first argument");
//         process.exit();
//     }




//     const distFolder = path.resolve(distName);
//     const manifestFile = path.resolve(`${distFolder}/manifest.webapp`);

//     if (!fs.existsSync(manifestFile)) {
//         error("Your app should have a manifest.webapp file", "");
//         process.exit();
//     }

//     const manifestString = fs.readFileSync(manifestFile);
//     const manifestObject = JSON.parse(manifestString);

//     infoBanner(`Deploy ${action} `);

//     function success(msg) {
//         successLog(`Success \t${msg}\t\t ==> OK`);
//     }

//     function error(msg, error) {
//         errorLog(`\nError \t${msg}\t\t ==> ERROR`);
//         errorLog(`\t ${error}`);
//     }

//     // TODO check if app is running
//     function stopApp() {
//         const task = `Stopping [${manifestObject.name}]`;
//         const stopCmd = `'${b2gcli}' stop '${manifestObject.name}'`;

//         try {
//             execSync(stopCmd);
//             success(task);
//             return true;
//         } catch (e) {
//             success(">>> The app is not running!");
//             return true;
//         }
//     }

//     function startApp() {
//         const task = `Starting [${manifestObject.name}]`;
//         const launchCmd = `'${b2gcli}' launch '${manifestObject.name}'`;

//         try {
//             execSync(launchCmd);
//             success(task);
//             return true;
//         } catch (e) {
//             error(task, e);
//             return false;
//         }
//     }

//     function uninstallApp() {
//         const task = `Uninstalling [${manifestObject.name}]`;
//         const launchCmd = `'${b2gcli}' uninstall '${manifestObject.name}'`;

//         try {
//             execSync(launchCmd);
//             success(task);
//             return true;
//         } catch (e) {
//             success("The app isn't installed yet");
//             return true;
//         }
//     }

//     function updateApp() {
//         const task = `Updating [${manifestObject.name}]`;
//         try {
//             const cmd = `'${b2gcli}' update '${distFolder}' '${
//                 manifestObject.name
//                 }'`;
//             execSync(cmd);
//             success(task);
//             return true;
//         } catch (ignored) {
//             return false;
//         }
//     }

//     function runADB() {
//         const task = "Running [adb forward]";

//         const adbRoot = `adb root`;
//         const adbCmd = `adb forward tcp:6000 localfilesystem:/data/local/debugger-socket`;

//         try {
//             execSync(adbRoot);
//             execSync(adbCmd);
//             success(task);
//             return true;
//         } catch (e) {
//             error(task, e);
//             return false;
//         }
//     }



//     function parseManifest() {

//         const task = "Manifest";
//         try {
//             if (manifestObject.name) {
//                 success(`${task} [${manifestObject.name}]`);
//                 return true;
//             } else {
//                 error(
//                     task,
//                     "[manifest.webapp.json] file not found. Please make sure it exists and contains the app name"
//                 );
//                 return false;
//             }
//         } catch (e) {
//             error(
//                 task,
//                 "Manifest file not found. Please make sure it exists and contains the app name"
//             );
//             return false;
//         }
//     }

//     function checkDist() {

//         const task = "Check [dist] folder";

//         if (!fs.existsSync(distFolder)) {
//             error(task, "You must build your app first!");
//             return false;
//         }

//         success(task);

//         return true;
//     }

//     const installInstructions = [
//         () => checkDist(),
//         () => parseManifest(),
//         () => runADB(),
//         () => updateApp(),
//         () => stopApp(),
//         () => startApp()
//     ];

//     // Possible Actions
//     switch (action) {
//         case "stop":
//             runADB();
//             parseManifest();
//             stopApp();

//             break;

//         case "start": ''
//             runADB();
//             parseManifest();
//             startApp();

//             break;

//         case "install":
//             installInstructions.forEach((instruction, index) => {
//                 const successOnExit = instruction(index);
//                 if (!successOnExit) process.exit(1);
//             });

//             break;

//         case "uninstall":
//             runADB();
//             parseManifest();
//             uninstallApp();

//             break;

//         case "update":
//             runADB();
//             parseManifest();
//             checkDist();
//             updateApp();
//             stopApp();
//             startApp();

//             break;


//         default:
//             error(
//                 "",
//                 `No action found with name ${action}

//             Possible arguments:

//                 start    \t Start the app on the device (if installed)
//                 stop     \t Stop the App and return to the launcher
//                 install  \t install the app on the current attached device
//                 uninstall\t Uninstall the app
//                 update   \t Update the current app

//                 adb:install \t Install/update adb to latest version
//                 adb:debug   \t Run adb forward to debugger-socket

//                 With no argument default to [install] \n`
//             );
//             break;
//     }


// }


start();

