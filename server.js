const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
  const { url } = req.query;
  const urls = Array.isArray(url) ? url : [url];

  try {
    const numberPromises = urls.map(async (url) => {
      const response = await axios.get(url);
      return response.data.numbers;
    });

    const numbersArrays = await Promise.allSettled(numberPromises);
    const mergedNumbers = numbersArrays.reduce((result, numbersArray) => {
      if (numbersArray.status === 'fulfilled') {
        const numbers = numbersArray.value;
        result.push(...numbers.filter((number) => !result.includes(number)));
      }
      return result;
    }, []);

    const sortedNumbers = mergedNumbers.sort((a, b) => a - b);
    res.json({ numbers: sortedNumbers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
