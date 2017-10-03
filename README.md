# TubeCast

TubeCast is a daemon that makes it easy for you to create your own Podcast built around videos in one or more specified YouTube playlists.

Configure TubeCast with the IDs of one or more YouTube playlists, then launch the service. Immediately upon launch (and at a configurable interval), the service will automatically fetch any videos contained within the specified playlists, convert them to MP3 files, and add them to your podcast's feed.

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
            "ids": [
            	"ALzH37wb9mqGvTdvLaH2UnZGqoNyeEuyZjU",
                "PLIBtb_NuIJ1w6yO4w6l6uevneVX9qDh7_"
            ]
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
    
If automatic playlist updates have been disabled, you can manually trigger an update by visiting:

	http://mydomain.com:8000/refresh

## To-Do

- Determine why / fix issue wherein artwork is not being attached to individual episodes.
- Add support for pulling videos from YouTube channels.
- Implement the ability to assign an optional username / password to your podcast.

## Related Resources

- [youtube-dl](https://rg3.github.io/youtube-dl/)
