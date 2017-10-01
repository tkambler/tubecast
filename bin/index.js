'use strict';

require('../')({
    'api': {
        'port': 8000,
        'host': 'podcast.ngrok.io'
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
            'id': 'youtube-playlist-id'
        }
    }
});
