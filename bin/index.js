'use strict';

const server = require('../')({
    'api': {
        'port': 8000,
        'host': 'yourhost.com'
    },
    'podcast': {
        'title': `John's Podcast`,
        'description': `This is my podcast.`,
        'owner': {
            'name': 'John Doe',
            'email': 'john.doe@host.com'
        }
    },
    'youtube': {
        'playlist': {
            // The ID of your YouTube playlist
            'id': '...'
        },
        // How often should the app check your YouTube playlist for new videos (in minutes)?
        'update_interval': 15
    }
});
