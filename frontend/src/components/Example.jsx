import React, { useState } from "react";
import axios from "axios";

const Example = () => {
    const [files, setFiles] = useState([]);
  const [link, setLink] = useState("");
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleDriveCheck = async () => {
    const response = await axios.post("http://127.0.0.1:5000/check-drive", { drive_link: link });
    setResults(response.data.results);
  };

  const handleClassroomCheck = async () => {
    const response = await axios.post("http://127.0.0.1:5000/check-classroom", { classroom_link: link });
    setResults(response.data.results);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }
    const response = await axios.post("http://127.0.0.1:5000/upload-files", formData);
    setResults(response.data.results);
  };

  return (
    <div>
      <h2>Plagiarism Checker</h2>
      
      <input type="text" placeholder="Enter Drive/Classroom Link" onChange={(e) => setLink(e.target.value)} />
      <button onClick={handleDriveCheck}>Check Drive</button>
      <button onClick={handleClassroomCheck}>Check Classroom</button>

      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload & Check</button>

      <h3>Results:</h3>
      <pre>{results && JSON.stringify(results, null, 2)}</pre>
    </div>
  )
}

export default Example
