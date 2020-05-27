const { execSync } = require("child_process");
const { successLog } = require("../utils/display");
const path = require("path");

function execute(port) {

    const iPort = Number.isInteger(port) || 6000;
    //const adbForwardSocket = `adb ${selectDevice} forward tcp:8080 tcp:8080`;
    try {
        const findKaiOSScript = path.resolve("./shell/findKaios.sh");
        // Find KaiOS device Id
        const kaiOSId = execSync(`bash ${findKaiOSScript}`).toString('utf8').replace("\n", "");
        // select selectKaiOS
        const selectDevice = kaiOSId.length > 0 ? `-s ${kaiOSId}` : '';
        // run adb in root mode
        execSync(`adb ${selectDevice} root`);
        // Forward debug port on kaiOS
        const status = execSync(`adb ${selectDevice} forward tcp:${iPort} localfilesystem:/data/local/debugger-socket`).toString("utf8");
        status === '' && successLog(`Debug Socket is running on port ${iPort}`);

        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}


module.exports = { execute }