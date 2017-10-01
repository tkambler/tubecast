'use strict';

exports = module.exports = function(config, youtubeDl, log, storage) {

    const podcast = require('podcast2');
    const moment = require('moment');
    const express = require('express');
    const path = require('path');
    const fs = require('../../lib/fs');

    return new class {

        constructor() {

            log.info('Fetching videos.');

            this.update()
                .tap(() => {
                    log.info('Initializing API.');
                })
                .then(this.initApp.bind(this));

        }

        get items() {
            return this._items ? this._items : this._items = [];
        }

        get feed() {

            return this._feed ? this._feed : this._feed = {
                'title': config.get('podcast:title'),
                'description': config.get('podcast:description'),
                'generator': config.get('podcast:generator') || 'TubeCast',
                'feed_url': `http://${config.get('api:host')}/rss.xml`,
                'site_url': `http://${config.get('api:host')}`,
                'image_url': `http://${config.get('api:host')}/logo.jpg`,
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
                    }, 1800000); // 30 minutes

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
                        'url': `http://${config.get('api:host')}/media/${item.meta.id}.mp3`,
                        'categories': [
                            'Other'
                        ],
                        'enclosure': {
                            'url': `http://${config.get('api:host')}/media/${item.meta.id}.mp3`,
                            'file': item.file,
                            'mime': 'audio/mpeg'
                        },
                        'itunesImage': `http://${config.get('api:host')}/media/${item.meta.id}.jpg`
                    });
                })
                .then(() => {
                    this.xml = podcast(this.feed, this.items);
                });

        }

        fetchVideos() {

            return youtubeDl.update();

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
