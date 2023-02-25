const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
	const url = new URL(req.url, `http://${req.headers.host}`);
	const pathname = url.pathname.slice(1);

	const filepath = path.join(__dirname, 'files', pathname);

	switch (req.method) {
		case 'POST':
			if (pathname.split('/').length > 1) {
				res.statusCode = 400;
				res.end('wrong path');
				return;
			}
			if (fs.existsSync(filepath)) {
				res.statusCode = 409;
				res.end('file alredy exists');
				return;
			}
			const writeFile = fs.createWriteStream(filepath);
			const limitedStream = new LimitSizeStream({
				limit: 1000000,
			});
			const destroyAll = () => {
				writeFile.destroy();
				limitedStream.destroy();
				fs.unlink(filepath, (err) => {
					if (err) {
						res.statusCode = 500;
						res.end('Something went wrong');
						return;
					}
				});
			};
			limitedStream.on('error', (err) => {
				if (err.code === 'LIMIT_EXCEEDED') {
					destroyAll();
					res.statusCode = 413;
					res.end('file is too large');
					return;
				}
			});

			req.pipe(limitedStream).pipe(writeFile);
			writeFile.on('finish', () => {
				res.statusCode = 201;
				res.end('Success!');
				return;
			});

			req.on('aborted', () => {
				destroyAll();
			});
			break;

		default:
			res.statusCode = 501;
			res.end('Not implemented');
	}
});

module.exports = server;
