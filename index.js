'use strict';

const _ = require('lodash');

module.exports = (options) => {

    _.defaultsDeep(options, {
    });

    const IoC = require('electrolyte');
    const { Container } = IoC;
    const container = new Container();
    const path = require('path');
    container.use(IoC.dir(path.resolve(__dirname, 'components')));

    return container.create('config')
        .then((config) => {
            config.use(options);
            config.set('youtube:playlist:url', `https://www.youtube.com/playlist?list=${config.get('youtube:playlist:id')}`);
            config.set('storage', {
                'path': path.resolve(__dirname, 'storage')
            });
            return container.create('server');
        })
        .catch((err) => {
            console.log(err);
            process.exit(1);
        });

};
