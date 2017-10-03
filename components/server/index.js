'use strict';

exports = module.exports = function(config, youtubeDl, log, storage) {

    const podcast = require('podcast2');
    const moment = require('moment');
    const express = require('express');
    const path = require('path');
    const fs = require('../../lib/fs');

    return new class {

        constructor() {

            log.info(`Fetching videos. Future refreshes are configured to occur every ${config.get('youtube:update_interval')} minutes.`);

            this.update()
                .tap(() => {
                    log.info('Initializing API.');
                })
                .then(this.initApp.bind(this));

        }

        get baseUrl() {
            if (config.get('api:port') === 80) {
                return `http://${config.get('api:host')}`;
            } else {
                return `http://${config.get('api:host')}:${config.get('api:port')}`;
            }
        }

        get items() {
            return this._items ? this._items : this._items = [];
        }

        get updateInterval() {
            return config.get('youtube:update_interval') * 60 * 1000;
        }

        get feed() {

            return this._feed ? this._feed : this._feed = {
                'title': config.get('podcast:title'),
                'description': config.get('podcast:description'),
                'generator': config.get('podcast:generator') || 'TubeCast',
                'feed_url': `http://${config.get('api:host')}/rss.xml`,
                'site_url': `http://${config.get('api:host')}`,
                'image_url': `${this.baseUrl}/logo.jpg`,
                'language': 'en',
                'ttl': 45,
                'date': moment().format('MMMM DD, YYYY HH:MM:SS Z'),
                'itunesOwner': {
                    'name': config.get('podcast:owner:name'),
                    'email': config.get('podcast:owner:email')
                },
                'itunesCategory': [
                    { 'text': 'Other' }
                ],
                'categories': [
                    'Misc'
                ]
            };

        }

        update() {

            return this.fetchVideos()
                .tap(() => {
                    log.info('Generating XML feed.');
                })
                .then(this.generateFeed.bind(this))
                .finally(() => {

                    setTimeout(() => {
                        this.update();
                    }, this.updateInterval);

                });

        }

        generateFeed() {

            return storage.getItems()
                .tap((items) => {
                    log.info(`${items.length} feed item(s) are available.`);
                })
                .each((item) => {
                    return this.items.push({
                        'title': item.meta.title,
                        'description': item.meta.description,
                        'author': 'Foo Bar',
                        'date': moment(item.meta.upload_date, 'YYYYMMDD').toDate(),
                        'url': this.getMediaUrl(item.meta.id, 'mp3'),
                        'categories': [
                            'Other'
                        ],
                        'enclosure': {
                            'url': this.getMediaUrl(item.meta.id, 'mp3'),
                            'file': item.file,
                            'mime': 'audio/mpeg'
                        },
                        'itunesImage': this.getMediaUrl(item.meta.id, 'jpg')
                    });
                })
                .then(() => {
                    this.xml = podcast(this.feed, this.items);
                });

        }

        fetchVideos() {

            return youtubeDl.update();

        }

        getMediaUrl(id, ext) {
            if (config.get('api:port') === 80) {
                return `http://${config.get('api:host')}/media/${id}.${ext}`;
            } else {
                return `http://${config.get('api:host')}:${config.get('api:port')}/media/${id}.${ext}`;
            }
        }

        initApp() {

            this.app = express();
            this.app.use(require('morgan')('combined', {
                'immediate': true
            }));

            this.app.route('/rss.xml')
                .get((req, res, next) => {
                    res.set('content-type', 'text/xml');
                    return res.send(this.xml);
                });

            this.app.route('/logo.jpg')
                .get((req, res, next) => {
                    return fs.createReadStream('/opt/app/logo.jpg').pipe(res);
                });

            this.app.route('/media/:id.mp3')
                .head((req, res, next) => {
                    res.set('content-type', 'audio/mpeg');
                    const srcFile = path.resolve(config.get('storage:path'), `${req.params.id}.mp3`);
                    return fs.statAsync(srcFile)
                        .then((stats) => {
                            res.set('content-length', stats.size);
                            return res.status(200).end();
                        })
                        .catch(next);
                })
                .get((req, res, next) => {
                    res.set('content-type', 'audio/mpeg');
                    const srcFile = path.resolve(config.get('storage:path'), `${req.params.id}.mp3`);
                    return fs.statAsync(srcFile)
                        .then((stats) => {
                            res.set('content-length', stats.size);
                            return fs.createReadStream(srcFile).pipe(res);
                        })
                        .catch(next);
                });

            this.app.route('/media/:id.jpg')
                .head((req, res, next) => {
                    res.set('content-type', 'image/jpeg');
                    const srcFile = path.resolve(config.get('storage:path'), `${req.params.id}.jpg`);
                    return fs.statAsync(srcFile)
                        .then((stats) => {
                            res.set('content-length', stats.size);
                            return res.status(200).end();
                        })
                        .catch(next);
                })
                .get((req, res, next) => {
                    res.set('content-type', 'image/jpeg');
                    const srcFile = path.resolve(config.get('storage:path'), `${req.params.id}.jpg`);
                    return fs.statAsync(srcFile)
                        .then((stats) => {
                            res.set('content-length', stats.size);
                            return fs.createReadStream(srcFile).pipe(res);
                        })
                        .catch(next);
                });

            this.app.listen(config.get('api:port'), () => {
                log.info(`Server is listening on port: ${config.get('api:port')}`);
            });

        }

    };

};

exports['@singleton'] = true;
exports['@require'] = ['config', 'youtube-dl', 'log', 'storage'];
