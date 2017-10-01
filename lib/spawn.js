'use strict';

const { spawn } = require('child_process');
const Promise = require('bluebird');

module.exports = (cmd, args, options) => {

    return new Promise((resolve, reject) => {

        const proc = spawn(cmd, args, options);
        let stdOut = '';
        let stdErr = '';

        proc.stdout.on('data', (data) => {
            stdOut += data.toString('utf8');
        });

        proc.stderr.on('data', (data) => {
            stdErr += data.toString('utf8');
        });

        proc.on('close', (code) => {
            if (code === 0) {
                return resolve({
                    'out': stdOut,
                    'err': stdErr
                });
            } else {
                const err = new Error(stdErr);
                err.out = stdOut;
                err.err = stdErr;
                return reject(err);
            }
        });

    });

};
