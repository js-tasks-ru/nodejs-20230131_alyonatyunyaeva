const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
	constructor(options) {
		super(options);
		this.stringPart = '';
	}

	_transform(chunk, encoding, callback) {
		const chunkStr = chunk.toString();
		const lines = chunkStr.split(os.EOL);
		lines[0] = this.stringPart + lines[0];
		if (chunkStr.endsWith(`${os.EOL}`)) {
			this.stringPart = '';
			lines.forEach((line) => {
				this.push(line);
			});
		} else {
			this.stringPart = lines.at(-1);
			lines.slice(0, -1).forEach((line) => {
				this.push(line);
			});
		}
		callback();
	}

	_flush(callback) {
		if (this.stringPart) {
			this.push(this.stringPart);
		}
		callback();
	}
}

module.exports = LineSplitStream;
