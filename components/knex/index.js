'use strict';

exports = module.exports = function() {

    const path = require('path');

    return require('knex')({
        'client': 'sqlite3',
        'connection': {
            'filename': path.resolve(__dirname, '../../db.sqlite')
        }
    });

};

exports['@singleton'] = true;
exports['@require'] = [];
