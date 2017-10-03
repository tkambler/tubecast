'use strict';

const _ = require('lodash');

module.exports = (options) => {

    const IoC = require('electrolyte');
    const { Container } = IoC;
    const container = new Container();
    const path = require('path');
    container.use(IoC.dir(path.resolve(__dirname, 'components')));

    return container.create('config')
        .then((config) => {

            if (!_.get(options, 'youtube.playlist.id')) {
                throw new Error(`youtube.playlist.id setting is required`);
            }

            _.defaultsDeep(options, {
                'youtube': {
                    'auto_update': {
                        'enabled': true,
                        'interval': 15
                    }
                }
            });

            _.set(options, 'youtube.auto_update.interval', parseInt(_.get(options, 'youtube.auto_update.interval', 10)));
            _.set(options, 'youtube.playlist.url', `https://www.youtube.com/playlist?list=${_.get(options, 'youtube.playlist.id')}`);
            _.set(options, 'storage.path', path.resolve(__dirname, 'storage'));

            config.use(options);

            return container.create('server');

        })
        .catch((err) => {

            console.log(err);
            process.exit(1);

        });

};
