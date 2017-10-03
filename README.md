# TubeCast

TubeCast is a daemon that makes it easy for you to create your own Podcast built around videos in a specified YouTube playlist.

Configure TubeCast with the ID of a YouTube playlist (typically one that you control), then launch the service. Immediately upon launch (and at a configurable interval), the service will automatically fetch any videos contained within the specified playlist, convert them to MP3 files, and add them to your podcast's feed.

## Getting Started

Clone this project, rename `.tubecast.conf.json` to `tubecast.conf.json`, then modify as appropriate:

```
{
    "api": {
        "port": 8000,
        "host": "mydomain.com"
    },
    "podcast": {
        "title": "My Custom Podcast",
        "description": "This is my custom podcast.",
        "owner": {
            "name": "Herp Derpson",
            "email": "herp.derpson@mydomain.com"
        }
    },
    "youtube": {
        "playlist": {
            "id": "ALzH37wb9mqGvTdvLaH2UnZGqoNyeEuyZjU"
        },
        "auto_update": {
            "enabled": false,
            "interval": 60 // How often to perform playlist updates (in minutes)
        }
    }
}
```

Build the Docker image:

    $ docker-compose build tubecast

Optionally, replace `/logo.jpg` with a logo of your choosing.

Launch the Docker image:

    $ docker-compose up -d tubecast

Point your podcast player to the feed at:

    http://mydomain.com:8000/rss.xml

## To-Do

- Determine why / fix issue wherein artwork is not being attached to individual episodes.
- Implement the ability to assign an optional username / password to your podcast.

## Related Resources

- [youtube-dl](https://rg3.github.io/youtube-dl/)
