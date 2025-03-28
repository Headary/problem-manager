import express from 'express';

import getExporter from './exporters/getExporter';
import { TaskBuilder } from './taskBuilder';

const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.post('/build', async (req, res) => {
	const dirPath = req.body.path; // eslint-disable-line
	if (!dirPath) {
		res.status(400).send({ message: 'DirPath not provided' });
		return;
	}
	if (typeof dirPath !== 'string') {
		res.status(400).send({ message: 'DirPath must be a string' });
		return;
	}

	const file = req.body.file; // eslint-disable-line
	if (!file) {
		res.status(400).send({ message: 'File not provided' });
		return;
	}
	if (typeof file !== 'string') {
		res.status(400).send({ message: 'File must be a string' });
		return;
	}

	const builder = new TaskBuilder(dirPath);
	const log = await builder.build(file);

	console.log(req.body);
	res.send(log);
});

app.post('/export', async (req, res) => {
	console.log('export file');
	const filepath = req.body.filepath; // eslint-disable-line
	if (!filepath) {
		res.status(400).send({ message: 'Filepath not provided' });
		return;
	}
	if (typeof filepath !== 'string') {
		res.status(400).send({ message: 'Filepath must be a string' });
		return;
	}

	const targetDirectory = req.body.targetDirectory; // eslint-disable-line
	if (!targetDirectory) {
		res.status(400).send({ message: 'Target directory not provided' });
		return;
	}
	if (typeof targetDirectory !== 'string') {
		res.status(400).send({ message: 'Target directory must be a string' });
		return;
	}

	try {
		await getExporter(filepath, targetDirectory).export();
		res.sendStatus(200);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).send({
				message: error.message,
			});
		}
	}
});

app.listen(8080, () => {
	console.log(`Builder running`);
});
