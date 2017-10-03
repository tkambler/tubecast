'use strict';

const program = require('commander');
const pkg = require('./package.json');

program
  .version(pkg.version)
  .option('-c, --config <config file>', 'Configuration file')
  .parse(process.argv);

const fs = require('./lib/fs');
const conf = fs.readJsonSync(program.config);

require('.')(conf);
