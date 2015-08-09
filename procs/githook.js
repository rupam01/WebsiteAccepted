var cp = require('child_process');
var App = require('../app');
function processHook(req, res) {
    function puts(error, stdout, stderr) {
        res.send(JSON.stringify({ "stdout: ": stdout, "error: ": error, "stderr: ": stderr }));
        App.server.close();
    }
    cp.exec('home/zharris/website/githook.sh', { uid: 24714 }, puts);
}
exports.processHook = processHook;
//# sourceMappingURL=githook.js.map