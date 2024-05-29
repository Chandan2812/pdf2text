const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const app = express();
const port = 3000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve the static HTML file
app.use(express.static('public'));

app.post('/upload', upload.single('pdf'), async (req, res) => {
    const filePath = req.file.path;

    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        res.send({ text: data.text });
        // Optionally, delete the file after extraction
        fs.unlinkSync(filePath);
    } catch (error) {
        res.status(500).send({ error: `Error extracting text from PDF: ${error.message}` });
        fs.unlinkSync(filePath);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
