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

router.post('/summarize/pdf', requireLogin, async (req, res) => {
	res.setHeader('Transfer-Encoding', 'chunked');
	res.setHeader('Content-Type', 'text/plain');

	if (!req.files || Object.keys(req.files).length == 0) {
		res.write('No files uploaded');
		res.end();
	};

	const pdfFile = req.files.pdfFile.data;
	if (!pdfFile) {
		res.write('The file uploaded isn\'t a pdf');
		res.end();
	};

	try {
		let {text} = await pdfParse(pdfFile);
		res.write(text);

		//while (text != '') {
		//	res.write('');
		//	const completion = await openai.createChatCompletion({
		//		model: "gpt-3.5-turbo",
		//		messages: [
		//			{ role: "user", content: generatePrompt(text.slice(0, 5500)) },
		//		],
		//		temperature: 0.8,
		//		max_tokens: 100,
		//	});
		//	const responseString = completion.data.choices[0].message.content + ' ';
		//	res.write(responseString);
		//	text = text.slice(4000);
		//};
	} catch(error) {
		console.error(`There is an error while calling gpt api: ${error}`);
		res.status(400).json({ message: `${error}` })
	};
	res.end();
});

function generatePrompt(text) {
	return `Summarize the following:
		${text}
	`;
};

module.exports = router;
