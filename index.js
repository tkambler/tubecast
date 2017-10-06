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

            if (!_.get(options, 'youtube.playlist.ids')) {
                throw new Error(`youtube.playlist.ids setting is required`);
            }

            options.youtube.playlist.ids = _.isArray(options.youtube.playlist.ids) ? options.youtube.playlist.ids : [options.youtube.playlist.ids];

            _.defaultsDeep(options, {
                'youtube': {
                    'auto_update': {
                        'enabled': true,
                        'interval': 15
                    }
                }
            });

            _.set(options, 'youtube.auto_update.interval', parseInt(_.get(options, 'youtube.auto_update.interval', 10)));
            _.set(options, 'storage.path', path.resolve(__dirname, 'storage'));

            options.youtube.playlist.urls = options.youtube.playlist.ids.map((id) => {
                return `https://www.youtube.com/playlist?list=${id}`
            });

            config.use(options);

            return container.create('server');

        })
        .then((server) => {

            process.on('SIGTERM', () => {
                return server.shutdown()
                    .then(() => {
                        process.exit(0);
                    });
            });

        })
        .catch((err) => {

            console.log(err);
            process.exit(1);

        });

};
