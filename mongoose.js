
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

console.log({ MONGO_URI });

const client = mongoose.connect(MONGO_URI);

client.then(() => {
	console.log('Connected to MongoDB');
}).catch((err) => {
	console.error('Error connecting to MongoDB', err);
});



const logSchema = new mongoose.Schema({
	method: String,
	url: String,
	statusCode: Number,
	elapsedTime: String,
	ip: String,
	timeStr: String,
	time: String,
	headers: Object,
	now: Date
});

const Log = mongoose.model('Log', logSchema);


const mongooseBase = async (req, res, next) => {
	const start = process.hrtime(); // High-resolution timer

	res.on('finish', () => {
		const diff = process.hrtime(start); // Get time difference

		const elapsedTime = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2); // Convert to milliseconds

		const now = new Date()

		const time = now.getTime()

		const timeStr = now.toISOString().replace('T', ' ').replace('Z', '')

		const processInfo = {
			method: req.method,
			url: req.originalUrl,
			statusCode: res.statusCode,
			elapsedTime: `${elapsedTime} ms`,
			ip: req.headers['x-forwarded-for'] || null,
			timeStr,
			time,
			headers: req.headers,
			now
		}

		Log.create(processInfo).then(log => {
			console.log(`${timeStr}, elapsed time: ${elapsedTime} ms`);
		}).catch(err => {
			console.error('Error saving log', err);
		});
	});

	next();
}

const mongooseLog = async (req, res) => {

	const ip = req.headers['x-forwarded-for'] || null;

	const time = new Date().toISOString().replace('T', ' ').replace('Z', '')

	const log = {
		ip, time,
	}

	res.json(log)
}

const mongoosePop = async (req, res) => {
	try {
		const lastItem = await Log.findOne().sort({ now: -1 }).exec();

		res.json(lastItem)
	} catch (error) {

		res.json({ error })
	}
}

module.exports = { mongooseLog, mongoosePop, mongooseBase }

