const LimitExceededError = require('./LimitExceededError');
const stream = require('stream');

class LimitSizeStream extends stream.Transform {
	constructor(options) {
		super(options);

		this.limit = options.limit;
		this.currentSize = 0;
	}

	_transform(chunk, encoding, callback) {
		this.currentSize += Buffer.byteLength(chunk, encoding);
		const isExceeded = this.currentSize > this.limit;
		if (isExceeded) {
			this.emit('error', new LimitExceededError());
			return;
		}
		callback(null, chunk);
	}
}

module.exports = LimitSizeStream;
