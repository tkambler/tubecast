# TubeCast

TubeCast makes it easy for you to create your own Podcast built around videos in a specified YouTube playlist.

Configure TubeCast with the ID of a YouTube playlist (typically one that you control), then launch the app. Immediately upon launch (and every thirty minutes thereafter), the app will automatically fetch any videos contained within the specified playlist, convert them to MP3 files, and add them to your podcast's feed.

## Getting Started

Clone this repo, then modify `./bin/index.js` as appropriate:

```
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
```

Build the Docker image:

    $ docker-compose build tubecast

Launch the Docker image:

    $ docker-compose up -d tubecast

Point your podcast player to the feed at:

    http://yourhost.com:8000/rss.xml

## To-Do

    - Implement the ability to assign an optional username / password to your podcast.

## Related Resources

- [youtube-dl](https://rg3.github.io/youtube-dl/)
