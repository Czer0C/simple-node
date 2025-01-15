const postgres = require('pg')

const {
	PG_HOST,
	PG_PORT,
	PG_USER,
	PG_PASSWORD,
	PG_DATABASE
} = process.env

const connStr = `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`

console.log({ connStr });

const client = new postgres.Client(connStr)

client.connect().then(() => {
	console.log('Connected to Postgres')
}).catch(err => {
	console.log('Error connecting to Postgres', err)
})

const initPg = async () => {
	const createLogTable = `
		CREATE TABLE IF NOT EXISTS logs (
			id SERIAL PRIMARY KEY,
			method VARCHAR(10),
			url VARCHAR(255),
			statusCode INTEGER,
			elapsedTime VARCHAR(10),
			ip VARCHAR(30),
			timeStr VARCHAR(30),
			time BIGINT,
			headers JSONB
		)
	`
	await client.query(createLogTable)
}

const pgLastLog = (req, res) => {
	const query = `SELECT * FROM logs ORDER BY time DESC LIMIT 1;`

	client.query(query, (err, result) => {
		if (err) {
			console.log(err)
			res.status(500).send('Internal Server Error')
		} else {
			res.json(result.rows)
		}
	}
	)
}
const pgLog = (req, res) => {
	const ip = req.headers['x-forwarded-for'] || null;

	const time = new Date().toISOString().replace('T', ' ').replace('Z', '')

	const log = {
		ip, time,
	}

	res.json(log)
}

const pgWriteLog = async (req, res, next) => {
	const start = process.hrtime(); // High-resolution timer

	res.on('finish', () => {

		const diff = process.hrtime(start); // Get time difference

		const elapsedTime = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2); // Convert to milliseconds

		const now = new Date()

		const time = now.getTime()

		const timeStr = now.toISOString().replace('T', ' ').replace('Z', '')

		const insertLog = `
				INSERT INTO logs (method, url, statusCode, elapsedTime, ip, timeStr, time, headers)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			`

		const values = [
			req.method,
			req.originalUrl,
			res.statusCode,
			elapsedTime,
			req.headers['x-forwarded-for'] || null,
			timeStr,
			time,
			req.headers,
		]

		client.query(insertLog, values).then(() => {
			console.log(`${timeStr}, elapsed time: ${elapsedTime} ms`);
		}
		).catch(err => {
			console.error('Error saving log', err);
		});


	});

	next();
}

module.exports = { initPg, pgWriteLog, pgLastLog, pgLog }