const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const BASE_DIR = path.join(__dirname, "classrooms");

if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR);
}


app.post("/create-classroom", (req, res) => {
    const { groupName, password } = req.body;

    if (!groupName || !password) {
        return res.status(400).json({ message: "Group name and password are required." });
    }

    const classPath = path.join(BASE_DIR, groupName);

    if (!fs.existsSync(classPath)) {
        fs.mkdirSync(classPath);
        return res.json({ message: `Classroom '${groupName}' created successfully.` });
    } else {
        return res.status(400).json({ message: "Classroom already exists!" });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { classroom } = req.body;
        const uploadPath = path.join(BASE_DIR, classroom);

        if (!fs.existsSync(uploadPath)) {
            return cb(new Error("Classroom does not exist."), false);
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });


app.post("/upload-file", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "File upload failed!" });
    }
    res.json({ message: "File uploaded successfully!", file: req.file.filename });
});


app.get("/check-plagiarism/:classroom", (req, res) => {
    const { classroom } = req.params;
    const classPath = path.join(BASE_DIR, classroom);

    if (!fs.existsSync(classPath)) {
        return res.status(400).json({ message: "Classroom does not exist." });
    }

    exec(`python3 plagiarism_checker.py "${classPath}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ message: "Error running plagiarism checker", error });
        }
        res.json(JSON.parse(stdout));
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
