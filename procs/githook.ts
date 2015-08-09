var sys = require('sys');
var exec = require('child_process').exec;
import express = require('express');

export function processHook(req: express.Request, res: express.Response) {
  function puts(error, stdout, stderr) { res.send(JSON.stringify({ "stdout: ": stdout, "error: ": error, "stderr: ": stderr })) }
  exec("~/website/githook.sh", puts);
}
