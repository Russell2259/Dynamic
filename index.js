import { createBareServer } from '@tomphttp/bare-server-node';
import nodeStatic from 'node-static';
import chalk from 'chalk';

import childProccess from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';

if (!fs.existsSync('./dist')) childProccess.spawn('node', ['esbuild.prod.js']);

const port = process.env.PORT || 3000;
const _v = process.env.npm_package_version;

const server = http.createServer();
const bare = createBareServer('/bare/');

server.on('request', (req, res) => {
  if (req.url === '/version') {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify({
      version: _v,
    }));
  }
  else if (bare.shouldRoute(req)) bare.routeRequest(req, res);
  else {
    if (new URL(`http://localhost${req.url}`).pathname.startsWith('/dynamic/')) {
      new nodeStatic.Server('./dist').serve(req, res, (err) => {
        if ((err && (err.status === 404))) res.end('Not Found');
      });
    } else {
      new nodeStatic.Server('./static').serve(req, res, (err) => {
        if (err && (err.status === 404)) res.end('Not Found');
      });
    }
  };
}).on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req)) bare.routeUpgrade(req, socket, head);
  else socket.end();
});

server.listen(port, (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.log(chalk.red.bold(`[Dynamic ${_v}] `) + 'Port is already in use! Please close any apps using port ' + chalk.bold.underline.red(port) + ' and try again.');
    process.exit(1);
  } else if (err) {
    console.log(chalk.bold.red(`[Dynamic ${_v}] `) + 'An error occurred while starting the server! \n' + err);
    process.exit(1);
  }
  
  console.log(chalk.bold('Thanks for using Dynamic!'), chalk.red(`Please notice that ${chalk.red.bold('dynamic is currently in public BETA')}. please report all issues to the GitHub page. `))
  console.log(chalk.green.bold(`Dynamic ${_v} `) + 'live at port ' + chalk.bold.green(port));
});