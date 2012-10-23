var fs = require('fs')
,   mime = require('mime');

servers.Middleware.augment({
    initialize: function(parent, app) {
        this.use(middleware.sanitizeHost(app));
        this.use(middleware.bodyParser({
            keepExtensions: true
        }));
        this.use(middleware.cookieParser());
        this.use(middleware.session({
            store: new middleware.session.MemoryStore({reapInterval: -1}),
            secret: Bones.plugin.config.secret || require('crypto').createHash('sha1').digest('hex'),
            cookie: {path: '/', httpOnly: true}
        }));
        // Handle file upload and store in session
        this.post('/upload', function(req, res, next) {
            var data = _.first(_.values(req.files));
            nextFileName(Bones.plugin.config.uploadDir + '/' + data.name, function(filename) {
                // Save file with original name, if possible
                fs.rename(data.path, filename, function(err) {
                    if (err) {
                        var error = err instanceof Object ? err.message : err;
                        next(new Error.HTTP(error, err && err.status || 500));
                        return;
                    }
                    // Sanitize file data
                    data.path = filename;
                    data.name = filename.replace(Bones.plugin.config.uploadDir + '/', '');
                    data.id = data.name;
                    delete data._writeStream;
                    req.session.file = new models.File(data);
                    // @todo Redirect to a configurable path
                    res.redirect('/');
                });
            });
        });
        this.use(middleware.validateCSRFToken());
        this.use(middleware.fragmentRedirect());
        // Send requested file to client
        this.get('/download/:filename', function(req, res, next) {
            var filename = req.params.filename;
            // @todo Restrict filetypes from being downloaded
            fs.readFile(Bones.plugin.config.downloadDir + '/' + filename, 'utf8', function(err, data) {
                if (err) {
                    var error = err instanceof Object ? err.message : err;
                    next(new Error.HTTP(error, err && err.status || 500));
                    return;
                }
                // Send file to the client
                res.send(data, {
                    'Content-Type': mime.lookup(filename),
                    'Content-disposition': 'attachment; filename=' + filename
                });
            });
        });
    }
});

// Get the next available filename
// -------------------------------
var nextFileName = function(filename, callback, count) {
    count = count || 0;
    fs.exists(filename, function(exists) {
        if (exists) {
            var extension = _.last(filename.split('.'));
            // Get highest count
            if (count !== 0) {
                var number = Number(_.last(filename.split('_')).replace('.' + extension, ''));
                if (!_.isNaN(number)) {
                    count = number;
                    // Increment filename number
                    filename = filename.replace('_' + number + '.' + extension, '_' + (++number) + '.' + extension);
                }
            } else {
                filename = filename.replace('.' + extension, '_' + count + '.' + extension);
            }
            // Recursively call next possible filename
            nextFileName(filename, callback, ++count);
        } else {
            return callback(filename);
        }
    });
}
