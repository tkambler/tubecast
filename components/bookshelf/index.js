'use strict';

exports = module.exports = function(knex) {

    const bookshelf = require('bookshelf');
    return bookshelf(knex);

};

exports['@singleton'] = true;
exports['@require'] = ['knex'];
