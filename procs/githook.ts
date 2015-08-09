import cp = require('child_process');
import express = require('express');
import App = require('../app');
export function processHook(req: express.Request, res: express.Response) {
  function puts(error: any, stdout: any, stderr: any) {
    res.send(JSON.stringify({ "stdout: ": stdout, "error: ": error, "stderr: ": stderr }));
    App.server.close();
  }

  cp.exec('export HOME="/home/zharris/"', null);
  cp.exec('/home/zharris/website/githook.sh', { uid: 24714 }, puts);
  }

