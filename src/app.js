const express = require('express');

const app = express();

const PORT = 7777;

app.get('/', (req, res) => {
    res.send('Hello, World! Hey jude');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});