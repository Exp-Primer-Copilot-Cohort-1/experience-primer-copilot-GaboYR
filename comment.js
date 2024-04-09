// Create web server
// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var path = require('path');
var root = __dirname;
var comment = [];
var server = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true);
    var pathname = urlObj.pathname;
    var query = urlObj.query;
    var method = req.method;
    if (pathname == '/') {
        fs.readFile('./index.html', function (err, data) {
            if (err) {
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                });
                res.end('<h1>404 Not Found</h1>');
            }
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(data);
        });
    } else if (pathname == '/comment') {
        if (method.toUpperCase() == 'GET') {
            var commentData = query.comment;
            comment.push(commentData);
            res.end(JSON.stringify(comment));
        } else if (method.toUpperCase() == 'POST') {
            var str = '';
            req.on('data', function (data) {
                str += data;
            });
            req.on('end', function () {
                var postComment = querystring.parse(str).comment;
                comment.push(postComment);
                res.end(JSON.stringify(comment));
            });
        }
    } else {
        var filePath = path.join(root, pathname);
        fs.exists(filePath, function (exists) {
            if (!exists) {
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                });
                res.end('<h1>404 Not Found</h1>');
            } else {
                fs.readFile(filePath, function (err, data) {
                    if (err) {
                        res.writeHead(500, {
                            'Content-Type': 'text/html'
                        });
                        res.end('<h1>500 Server Error</h1>');
                    }
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.end(data);
                });
            }
        });
    }
});
server.listen(3000, function () {
    console.log('Server is running on port 3000');
});