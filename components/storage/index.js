'use strict';

exports = module.exports = function(config) {

    const Promise = require('bluebird');
    const path = require('path');
    const fs = require('../../lib/fs');
    const glob = require('../../lib/glob');

    const storage = new class {

        init() {

            return fs.ensureDirAsync(config.get('storage:path'))
                .return(this);

        }

        getItems() {

            return glob('*.json', {
                'cwd': config.get('storage:path'),
                'absolute': true
            })
                .map((item) => {
                    const file = path.basename(item, '.json');
                    return fs.readJsonAsync(item)
                        .then((meta) => {
                            return {
                                'meta': meta,
                                'file': path.resolve(config.get('storage:path'), `${file}.mp3`)
                            };
                        });
                });

        }

        has(id) {

            return Promise.join(
                fs.statAsync(this.getIdFilePath(id, 'mp3')),
                fs.statAsync(this.getIdFilePath(id, 'json')),
                fs.statAsync(this.getIdFilePath(id, 'jpg'))
            )
                .then(() => {
                    return true;
                })
                .catch(() => {
                    return false;
                });

        }

        getIdFilePath(id, ext) {

            if (!ext) {
                throw new Error(`'ext' is required`);
            }

            return path.resolve(config.get('storage:path'), id + `.${ext}`);

        }

    };

    return storage.init();

};

exports['@singleton'] = true;
exports['@require'] = ['config'];
