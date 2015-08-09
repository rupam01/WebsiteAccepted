var cp = require('child_process');
function processHook(req, res) {
    function puts(error, stdout, stderr) {
        res.send(JSON.stringify({ "stdout: ": stdout, "error: ": error, "stderr: ": stderr }));
    }
    cp.exec("~/website/githook.sh", { uid: 24714 }, puts);
}
exports.processHook = processHook;
//# sourceMappingURL=githook.js.map