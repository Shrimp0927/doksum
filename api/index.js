const express = require('express');
const pdfParse = require('pdf-parse');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const firebase = require('../firebase.js');
const requireLogin = require('../requireLogin.js');

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
	organization: process.env.ORGANIZATION_ID,
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const router = express.Router();

router.post('/upload', requireLogin, multer().single('pdfFile'), async (req, res) => {
	const file = req.file;

  try {
    const fileUpload = firebase.storage().bucket().file(req.user.id);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    stream.on('error', (err) => {
      console.error(err);
      res.sendStatus(500);
    });

    stream.on('finish', () => {
      res.sendStatus(200);
    });

    stream.end(file.buffer);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  };

});

router.post('/summarize', requireLogin, async (req, res) => {
	res.setHeader('Transfer-Encoding', 'chunked');
	res.setHeader('Content-Type', 'text/plain');

	const file = firebase.storage().bucket().file(req.user.id);
	const [url] = await file.getSignedUrl({
		action: 'read',
		expires: '03-01-2500', // Set an appropriate expiration date
	});
	res.write('');

	try {
		let {text} = await pdfParse(url);
		while (text != '') {
			res.write('');
			const completion = await openai.createChatCompletion({
				model: "gpt-3.5-turbo",
				messages: [
					{ role: "user", content: generatePrompt(text.slice(0, 5500)) },
				],
				temperature: 0.8,
			});
			const responseString = completion.data.choices[0].message.content + ' ';
			res.write(responseString);
			text = text.slice(4000);
		}
	} catch(error) {
		console.error(`There is an error while calling gpt api: ${error}`);
		res.status(400).json({ message: `${error}` })
	};
	await firebase.storage().bucket().file(req.user.id).delete();
	res.end();
});

function generatePrompt(text) {
	return `Summarize the following to bullet points:
		${text}
	`;
};

module.exports = router;
