const express = require('express');
const generateFFmpeg = require('./controller/ai');
const path = require("node:path")
const app = express();
const multer = require('multer');
const uploadPath = path.join(__dirname, 'controller');
app.use(express.json());
app.use('/outputs', express.static(uploadPath));
app.use(express.urlencoded({ extended: true }));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // <-- preserve original name
    }
})
const upload = multer({ storage });

app.post('/', upload.array('files', 5), async (req, res) => {
    try {

        const { prompt } = req.body;
        const fileNames = req.files.map(f => f.originalname);
        await Promise
        await generateFFmpeg(prompt, fileNames);
        return res.json({ url: 'http://localhost:3000/outputs/output.mp4' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }

}
)
app.listen(3000, () => { console.log('server is listening on port 3000') });