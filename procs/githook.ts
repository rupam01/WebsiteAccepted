import http = require('http');
import cp = require('child_process');
import express = require('express');

export function processHook(req: express.Request, res: express.Response) {
  function puts(error, stdout, stderr) {
    res.send(JSON.stringify({ "stdout: ": stdout, "error: ": error, "stderr: ": stderr }));
    
  }
  cp.exec("~/website/githook.sh", { uid: 24714 }, puts);
}
