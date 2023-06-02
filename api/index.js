const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const requireLogin = require('../requireLogin.js');

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
	organization: process.env.ORGANIZATION_ID,
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const router = express.Router();
router.use(fileUpload());

router.post('/summarize/pdf', requireLogin,async (req, res) => {
	if (!req.files || Object.keys(req.files).length == 0) {
		return res.status(400).send('No files uploaded');
	};

	const pdfFile = req.files.pdfFile.data;
	if (!pdfFile) {
		return res.status(400).send('The file uploaded isn\'t a pdf');
	}

	try {
		let responseString = '';
		let {text} = await pdfParse(pdfFile);
		while (text != '') {
			const completion = await openai.createChatCompletion({
				model: "gpt-3.5-turbo",
				messages: [
					{ role: "user", content: generatePrompt(text.slice(0, 5500)) },
				],
				temperature: 0.8,
				max_tokens: 500,
			});
			responseString = responseString + ' ' + completion.data.choices[0].message.content;
			text = text.slice(5500);
		}
		res.status(200).json({ result: responseString });
	} catch(error) {
		console.error(`There is an error while calling gpt api: ${error}`);
		res.status(400).json({ message: `${error}` })
	}
});

function generatePrompt(text) {
	return `Summarize this document:
		${text}
	`;
};

module.exports = router;
