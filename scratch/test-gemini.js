require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Hi');
    console.log(result.response.text());
  } catch (err) {
    console.error('ERROR 2.0:', err.message);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent('Hi');
      console.log('1.5 works!', result.response.text());
    } catch (err2) {
      console.error('ERROR 1.5:', err2.message);
    }
  }
}
test();
