import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Similarity.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Similarity = () => {
  const { classroom } = useParams(); // Get classroom from URL
  const [plagiarismResults, setPlagiarismResults] = useState([]);
  const [classificationResults, setClassificationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({ file1: "", file2: "" });
  

  const fetchPlagiarismResults = async () => {
    if (!classroom) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/check-plagiarism/${classroom}`);
      const data = await response.json();
      setPlagiarismResults(data.results);
    } catch (error) {
      console.error("Error fetching plagiarism results:", error);
      alert("Failed to check plagiarism.");
    }
    setLoading(false);
  };

  const classifyFiles = async () => {
    if (!classroom) return;
    setClassifying(true);
    try {
      const response = await fetch(`http://localhost:5000/classify-text/${classroom}`);
      const data = await response.json();
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        setClassificationResults(data.results);
      }
    } catch (error) {
      console.error("Error classifying files:", error);
      alert("Failed to classify files.");
    }
    setClassifying(false);
  };


  const openModal = async (file1, file2) => {
    try {
      const res1 = await fetch(`http://localhost:5000/get-file-content?filename=${file1}`);
      const text1 = await res1.text();

      const res2 = await fetch(`http://localhost:5000/get-file-content?filename=${file2}`);
      const text2 = await res2.text();

      setSelectedFiles({ file1: text1, file2: text2 });
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching file content:", error);
      alert("Failed to load file contents.");
    }
  };

  return (
    <div className="similarity-bdy">
      <nav className="similarity-nav">
        <div className="plg">Plagiarism Checker</div>
        <div className="create">Create</div>
        <div className="help">Help</div>
      </nav>

      <div className="details">
        <div className="clas-name">{classroom || "No Classroom Selected"}</div>
        <div className="status">Status: {loading ? "Checking..." : "Ready"}</div>
      </div>

      <button className="check-btn" onClick={fetchPlagiarismResults} disabled={loading}>
        {loading ? "Checking..." : "Check Similarity"}
      </button>

      <button className="classify-btn" onClick={classifyFiles} disabled={classifying}>
        {classifying ? "Classifying..." : "Classify Files"}
      </button>

      <div className="plagiarism-results">
        {plagiarismResults.length > 0 ? (
          plagiarismResults.map((result, index) => (
            <div key={index} className="plagiarism-card" onClick={() => openModal(result.file1, result.file2)}>
              <div className="file-names">
                <p>{result.file1}</p>
                <p>{result.file2}</p>
              </div>
              <div className="progress-circle">
                <CircularProgressbar
                  value={result.similarity * 100}
                  text={`${(result.similarity * 100).toFixed(1)}%`}
                  styles={buildStyles({
                    textSize: "14px",
                    pathColor: "orange",
                    textColor: "black",
                    trailColor: "#ddd",
                  })}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No plagiarism results yet.</p>
        )}
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="file-modal">
        <h2>Plagiarism Comparison</h2>
        <div className="file-content">
          <pre className="file-box">{selectedFiles.file1 || "Loading file 1..."}</pre>
          <pre className="file-box">{selectedFiles.file2 || "Loading file 2..."}</pre>
        </div>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>

      <div className="classification-results">
        <h2>Classification Report</h2>
        {classificationResults?.length > 0 ? (
          <table className="classification-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Percentage</th>
                <th>Classification</th>
              </tr>
            </thead>
            <tbody>
              {classificationResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.filename}</td>
                  <td>{result.percentage}</td>
                  <td>{result.classification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No classification results yet.</p>
        )}
      </div>
    </div>
  );
};

export default Similarity;


