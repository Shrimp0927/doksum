const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const router = express.Router();
router.use(fileUpload());

router.post('/summarize/pdf', async (req, res) => {
	if (!req.files || Object.keys(req.files).length == 0) {
		return res.status(400).send('No files uploaded');
	};

	const pdfFile = req.files.pdfFile.data;
	if (!pdfFile) {
		return res.status(400).send('The file uploaded isn\'t a pdf');
	}

	try {
		let responseString = '';
		const {text} = await pdfParse(pdfFile);
		let temp = text;
		temp = temp.replace(/\n/g, '');
		let lines = [];
		while (temp != '') {
			lines.push(temp.slice(0, 5500));
			temp = temp.slice(5500);
		}
		for (let i = 0; i < lines.length; i++) {
			const completion = await openai.createCompletion({
				model: "text-davinci-003",
				prompt: generatePrompt(lines[i]),
				temperature: 0.8,
				max_tokens: 500,
			});
			responseString = responseString + ' ' + completion.data.choices[0].text;
		};
		res.status(200).json({ result: responseString });
	} catch(error) {
		console.log(`There is an error while calling gpt api: ${error}`);
		res.status(400).json({ message: `${error}` })
	}
});

function generatePrompt(text) {
	return `Summarize this document:
		${text}
	`;
};

module.exports = router;
