var sys = require('sys');
var exec = require('child_process').exec;
function processHook(req, res) {
    function puts(error, stdout, stderr) { res.send(JSON.stringify({ "stdout: ": stdout, "error: ": error, "stderr: ": stderr })); }
    exec("~/website/githook.sh", puts);
}
exports.processHook = processHook;
//# sourceMappingURL=githook.js.map