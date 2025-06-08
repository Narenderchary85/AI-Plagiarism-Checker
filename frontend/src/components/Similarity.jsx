// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import Modal from "react-modal";
// import { FiChevronLeft, FiAlertTriangle, FiCheckCircle, FiFileText, FiBarChart2, FiDownload } from "react-icons/fi";
// import './Similarity.css'

// Modal.setAppElement("#root");

// const Similarity = () => {
//   const { classroom } = useParams();
//   const navigate = useNavigate();
//   const [plagiarismResults, setPlagiarismResults] = useState([]);
//   const [classificationResults, setClassificationResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [classifying, setClassifying] = useState(false);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState({ file1: "", file2: "" });
//   const [activeTab, setActiveTab] = useState("similarity");
//   const [classroomInfo, setClassroomInfo] = useState(null);

//   useEffect(() => {
//     const fetchClassroomInfo = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/get-classroom-info/${classroom}`);
//         const data = await response.json();
//         setClassroomInfo(data);
//       } catch (error) {
//         console.error("Error fetching classroom info:", error);
//       }
//     };

//     fetchClassroomInfo();
//   }, [classroom]);

//   const fetchPlagiarismResults = async () => {
//     if (!classroom) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:5000/check-plagiarism/${classroom}`);
//       const data = await response.json();
//       setPlagiarismResults(data.results);
//     } catch (error) {
//       console.error("Error fetching plagiarism results:", error);
//     }
//     setLoading(false);
//   };

//   const classifyFiles = async () => {
//     if (!classroom) return;
//     setClassifying(true);
//     try {
//       const response = await fetch(`http://localhost:5000/classify-text/${classroom}`);
//       const data = await response.json();
//       setClassificationResults(data.results || []);
//     } catch (error) {
//       console.error("Error classifying files:", error);
//     }
//     setClassifying(false);
//   };

//   const openModal = async (file1, file2) => {
//     try {
//       const res1 = await fetch(`http://localhost:5000/get-file-content?filename=${file1}`);
//       const text1 = await res1.text();

//       const res2 = await fetch(`http://localhost:5000/get-file-content?filename=${file2}`);
//       const text2 = await res2.text();

//       setSelectedFiles({ file1: text1, file2: text2 });
//       setModalIsOpen(true);
//     } catch (error) {
//       console.error("Error fetching file content:", error);
//     }
//   };

//   const downloadReport = () => {
//     alert("Downloading report...");
//   };

//   const getSimilarityColor = (percentage) => {
//     if (percentage < 30) return "#10B981";
//     if (percentage < 70) return "#F59E0B"; 
//     return "#EF4444"; 
//   };

//   return (
//     <motion.div 
//       className="similarity-container"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.3 }}
//     >
//       <header className="similarity-header">
//         <motion.button 
//           className="back-button"
//           onClick={() => navigate(-1)}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <FiChevronLeft size={20} />
//           Back to Classroom
//         </motion.button>
        
//         <div className="classroom-info">
//           <h1>{classroom}</h1>
//           {classroomInfo && (
//             <div className="classroom-meta">
//               <span>Created: {new Date(classroomInfo.createdAt).toLocaleDateString()}</span>
//               <span>{classroomInfo.studentCount || 0} Students</span>
//               <span>{classroomInfo.assignmentCount || 0} Assignments</span>
//             </div>
//           )}
//         </div>

//         <motion.button 
//           className="download-report"
//           onClick={downloadReport}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <FiDownload size={18} />
//           Download Report
//         </motion.button>
//       </header>

//       <div className="similarity-tabs">
//         <button
//           className={`tab-button ${activeTab === "similarity" ? "active" : ""}`}
//           onClick={() => setActiveTab("similarity")}
//         >
//           <FiFileText size={18} />
//           Similarity Check
//         </button>
//         <button
//           className={`tab-button ${activeTab === "classification" ? "active" : ""}`}
//           onClick={() => setActiveTab("classification")}
//         >
//           <FiBarChart2 size={18} />
//           AI Classification
//         </button>
//       </div>

//       <div className="action-buttons">
//         {activeTab === "similarity" ? (
//           <motion.button
//             className="primary-button"
//             onClick={fetchPlagiarismResults}
//             disabled={loading}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             {loading ? (
//               <span className="button-loading">Checking Similarity...</span>
//             ) : (
//               "Check Similarity"
//             )}
//           </motion.button>
//         ) : (
//           <motion.button
//             className="primary-button"
//             onClick={classifyFiles}
//             disabled={classifying}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             {classifying ? (
//               <span className="button-loading">Classifying Files...</span>
//             ) : (
//               "Classify Submissions"
//             )}
//           </motion.button>
//         )}
//       </div>
//       <div className="results-container">
//         {activeTab === "similarity" ? (
//           <div className="similarity-results">
//             {plagiarismResults.length > 0 ? (
//               <div className="results-grid">
//                 {plagiarismResults.map((result, index) => (
//                   <motion.div
//                     key={index}
//                     className="result-card"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.05, duration: 0.3 }}
//                     onClick={() => openModal(result.file1, result.file2)}
//                     whileHover={{ y: -5 }}
//                   >
//                     <div className="file-pair">
//                       <div className="file-name">
//                         <FiFileText size={16} />
//                         <span title={result.file1}>{result.file1.split('/').pop()}</span>
//                       </div>
//                       <div className="file-name">
//                         <FiFileText size={16} />
//                         <span title={result.file2}>{result.file2.split('/').pop()}</span>
//                       </div>
//                     </div>
//                     <div className="similarity-score">
//                       <CircularProgressbar
//                         value={result.similarity * 100}
//                         text={`${(result.similarity * 100).toFixed(0)}%`}
//                         styles={buildStyles({
//                           pathColor: getSimilarityColor(result.similarity * 100),
//                           textColor: "#1F2937",
//                           trailColor: "#E5E7EB",
//                           textSize: "24px",
//                         })}
//                       />
//                       <div className="similarity-label">
//                         {result.similarity * 100 > 70 ? (
//                           <span className="high-similarity">
//                             <FiAlertTriangle /> High Similarity
//                           </span>
//                         ) : result.similarity * 100 > 30 ? (
//                           <span className="medium-similarity">
//                             Moderate Similarity
//                           </span>
//                         ) : (
//                           <span className="low-similarity">
//                             <FiCheckCircle /> Low Similarity
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             ) : (
//               <motion.div 
//                 className="empty-state"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <img src="/empty-results.svg" alt="No results" />
//                 <h3>No Similarity Results Yet</h3>
//                 <p>Click "Check Similarity" to analyze submissions</p>
//               </motion.div>
//             )}
//           </div>
//         ) : (
//           <div className="classification-results">
//             {classificationResults.length > 0 ? (
//               <>
//                 <div className="summary-cards">
//                   <motion.div 
//                     className="summary-card human-written"
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.4 }}
//                   >
//                     <h3>Human Written</h3>
//                     <p>
//                       {classificationResults.filter(r => r.classification === "human").length}/
//                       {classificationResults.length} submissions
//                     </p>
//                   </motion.div>
//                   <motion.div 
//                     className="summary-card ai-generated"
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.4, delay: 0.1 }}
//                   >
//                     <h3>AI Generated</h3>
//                     <p>
//                       {classificationResults.filter(r => r.classification === "AI").length}/
//                       {classificationResults.length} submissions
//                     </p>
//                   </motion.div>
//                 </div>

//                 <div className="classification-table-container">
//                   <table className="classification-table">
//                     <thead>
//                       <tr>
//                         <th>Filename</th>
//                         <th>Confidence</th>
//                         <th>Classification</th>
//                         <th>Details</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {classificationResults.map((result, index) => (
//                         <motion.tr
//                           key={index}
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: index * 0.05 }}
//                         >
//                           <td>{result.filename.split('/').pop()}</td>
//                           <td>
//                             <div className="confidence-bar">
//                               <div 
//                                 className="confidence-fill"
//                                 style={{
//                                   width: `${result.percentage}%`,
//                                   backgroundColor: result.classification === "AI" ? "#EF4444" : "#10B981"
//                                 }}
//                               />
//                               <span>{result.percentage}%</span>
//                             </div>
//                           </td>
//                           <td>
//                             <span className={`classification-tag ${result.classification === "AI" ? "ai" : "human"}`}>
//                               {result.classification === "AI" ? "AI Generated" : "Human Written"}
//                             </span>
//                           </td>
//                           <td>
//                             <button 
//                               className="view-details"
//                               onClick={() => openModal(result.filename, "")}
//                             >
//                               View Content
//                             </button>
//                           </td>
//                         </motion.tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </>
//             ) : (
//               <motion.div 
//                 className="empty-state"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <img src="/empty-classification.svg" alt="No results" />
//                 <h3>No Classification Results Yet</h3>
//                 <p>Click "Classify Submissions" to analyze content</p>
//               </motion.div>
//             )}
//           </div>
//         )}
//       </div>

//       <Modal 
//         isOpen={modalIsOpen} 
//         onRequestClose={() => setModalIsOpen(false)}
//         className="comparison-modal"
//         overlayClassName="modal-overlay"
//       >
//         <motion.div
//           className="modal-content"
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.9, opacity: 0 }}
//         >
//           <div className="modal-header">
//             <h2>File Comparison</h2>
//             <button 
//               className="close-modal"
//               onClick={() => setModalIsOpen(false)}
//             >
//               &times;
//             </button>
//           </div>
          
//           <div className="file-comparison">
//             <div className="file-content">
//               <h3>File 1</h3>
//               <pre>{selectedFiles.file1 || "No content available"}</pre>
//             </div>
//             <div className="file-content">
//               <h3>File 2</h3>
//               <pre>{selectedFiles.file2 || "No content available"}</pre>
//             </div>
//           </div>
//         </motion.div>
//       </Modal>
//     </motion.div>
//   );
// };

// export default Similarity;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Modal from "react-modal";
import { FiChevronLeft, FiAlertTriangle, FiCheckCircle, FiFileText, FiBarChart2, FiDownload } from "react-icons/fi";
import './Similarity.css'

Modal.setAppElement("#root");

const Similarity = () => {
  const { classroom } = useParams();
  const navigate = useNavigate();
  const [plagiarismResults, setPlagiarismResults] = useState([]);
  const [classificationResults, setClassificationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({ file1: "", file2: "" });
  const [activeTab, setActiveTab] = useState("similarity");
  const [classroomInfo, setClassroomInfo] = useState(null);
  const [similarityThreshold, setSimilarityThreshold] = useState(0);

  useEffect(() => {
    const fetchClassroomInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-classroom-info/${classroom}`);
        const data = await response.json();
        setClassroomInfo(data);
      } catch (error) {
        console.error("Error fetching classroom info:", error);
      }
    };

    fetchClassroomInfo();
  }, [classroom]);

  const fetchPlagiarismResults = async () => {
    if (!classroom) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/check-plagiarism/${classroom}`);
      const data = await response.json();
      setPlagiarismResults(data.results);
    } catch (error) {
      console.error("Error fetching plagiarism results:", error);
    }
    setLoading(false);
  };

  const classifyFiles = async () => {
    if (!classroom) return;
    setClassifying(true);
    try {
      const response = await fetch(`http://localhost:5000/classify-text/${classroom}`);
      const data = await response.json();
      setClassificationResults(data.results || []);
    } catch (error) {
      console.error("Error classifying files:", error);
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
    }
  };

  const downloadReport = () => {
    alert("Downloading report...");
  };

  const getSimilarityColor = (percentage) => {
    if (percentage < 30) return "#10B981";
    if (percentage < 70) return "#F59E0B"; 
    return "#EF4444"; 
  };

  const filteredResults = similarityThreshold > 0 
    ? plagiarismResults.filter(result => 
        Math.floor(result.similarity * 100) >= similarityThreshold
      )
    : plagiarismResults;

  return (
    <motion.div 
      className="similarity-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <header className="similarity-header">
        <motion.button 
          className="back-button"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiChevronLeft size={20} />
          Back to Classroom
        </motion.button>
        
        <div className="classroom-info">
          <h1>{classroom}</h1>
          {classroomInfo && (
            <div className="classroom-meta">
              <span>Created: {new Date(classroomInfo.createdAt).toLocaleDateString()}</span>
              <span>{classroomInfo.studentCount || 0} Students</span>
              <span>{classroomInfo.assignmentCount || 0} Assignments</span>
            </div>
          )}
        </div>

        <motion.button 
          className="download-report"
          onClick={downloadReport}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiDownload size={18} />
          Download Report
        </motion.button>
      </header>

      <div className="similarity-tabs">
        <button
          className={`tab-button ${activeTab === "similarity" ? "active" : ""}`}
          onClick={() => setActiveTab("similarity")}
        >
          <FiFileText size={18} />
          Similarity Check
        </button>
        <button
          className={`tab-button ${activeTab === "classification" ? "active" : ""}`}
          onClick={() => setActiveTab("classification")}
        >
          <FiBarChart2 size={18} />
          AI Classification
        </button>
      </div>

      <div className="action-buttons">
        {activeTab === "similarity" ? (
          <>
           {
            plagiarismResults.length > 0 ? (<>
            </>):(<>
              <motion.button
              className="primary-button"
              onClick={fetchPlagiarismResults}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="button-loading">Checking Similarity...</span>
              ) : (
                "Check Similarity"
              )}
            </motion.button></>)
           }
            
            {plagiarismResults.length > 0 && (
              <div className="similarity-filter-container">
                <div className="similarity-filter">
                  <label htmlFor="threshold">Filter by similarity (%):</label>
                  <input
                    id="threshold"
                    type="number"
                    min="0"
                    max="100"
                    value={similarityThreshold}
                    onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                    placeholder="Enter percentage (0-100)"
                  />
                  <button 
                    onClick={() => setSimilarityThreshold(0)}
                    className="reset-filter"
                  >
                    Reset
                  </button>
                </div>
                <div className="similarity-stats">
                  <p>
                    Showing {filteredResults.length} of {plagiarismResults.length} matches
                    {similarityThreshold > 0 && ` (≥ ${similarityThreshold}% similar)`}
                  </p>
                  {similarityThreshold > 0 && (
                    <p>
                      {Math.round((filteredResults.length / plagiarismResults.length) * 100)}%
                      of submissions meet this threshold
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <motion.button
            className="primary-button"
            onClick={classifyFiles}
            disabled={classifying}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {classifying ? (
              <span className="button-loading">Classifying Files...</span>
            ) : (
              "Classify Submissions"
            )}
          </motion.button>
        )}
      </div>
      <div className="results-container">
        {activeTab === "similarity" ? (
          <div className="similarity-results">
            {filteredResults.length > 0 ? (
              <div className="results-grid">
                {filteredResults.map((result, index) => (
                  <motion.div
                    key={index}
                    className="result-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    onClick={() => openModal(result.file1, result.file2)}
                    whileHover={{ y: -5 }}
                  >
                    <div className="file-pair">
                      <div className="file-name">
                        <FiFileText size={16} />
                        <span title={result.file1}>{result.file1.split('/').pop()}</span>
                      </div>
                      <div className="file-name">
                        <FiFileText size={16} />
                        <span title={result.file2}>{result.file2.split('/').pop()}</span>
                      </div>
                    </div>
                    <div className="similarity-score">
                      <CircularProgressbar
                        value={result.similarity * 100}
                        text={`${(result.similarity * 100).toFixed(0)}%`}
                        styles={buildStyles({
                          pathColor: getSimilarityColor(result.similarity * 100),
                          textColor: "#1F2937",
                          trailColor: "#E5E7EB",
                          textSize: "24px",
                        })}
                      />
                      <div className="similarity-label">
                        {result.similarity * 100 > 70 ? (
                          <span className="high-similarity">
                            <FiAlertTriangle /> High Similarity
                          </span>
                        ) : result.similarity * 100 > 30 ? (
                          <span className="medium-similarity">
                            Moderate Similarity
                          </span>
                        ) : (
                          <span className="low-similarity">
                            <FiCheckCircle /> Low Similarity
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {plagiarismResults.length === 0 ? (
                  <>
                    <h3>No Similarity Results Yet</h3>
                    <p>Click "Check Similarity" to analyze submissions</p>
                  </>
                ) : (
                  <>
                    <img src="/empty-filter.svg" alt="No matches" />
                    <h3>No matches found for {similarityThreshold}% or higher</h3>
                    <p>Try adjusting the filter threshold</p>
                  </>
                )}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="classification-results">
            {classificationResults.length > 0 ? (
              <>
                <div className="summary-cards">
                  <motion.div 
                    className="summary-card human-written"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3>Human Written</h3>
                    <p>
                      {classificationResults.filter(r => r.classification === "human").length}/
                      {classificationResults.length} submissions
                    </p>
                  </motion.div>
                  <motion.div 
                    className="summary-card ai-generated"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <h3>AI Generated</h3>
                    <p>
                      {classificationResults.filter(r => r.classification === "AI").length}/
                      {classificationResults.length} submissions
                    </p>
                  </motion.div>
                </div>

                <div className="classification-table-container">
                  <table className="classification-table">
                    <thead>
                      <tr>
                        <th>Filename</th>
                        <th>Confidence</th>
                        <th>Classification</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classificationResults.map((result, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td>{result.filename.split('/').pop()}</td>
                          <td>
                            <div className="confidence-bar">
                              <div 
                                className="confidence-fill"
                                style={{
                                  width: `${result.percentage}%`,
                                  backgroundColor: result.classification === "AI" ? "#EF4444" : "#10B981"
                                }}
                              />
                              <span>{result.percentage}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`classification-tag ${result.classification === "AI" ? "ai" : "human"}`}>
                              {result.classification === "AI" ? "AI Generated" : "Human Written"}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="view-details"
                              onClick={() => openModal(result.filename, "")}
                            >
                              View Content
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3>No Classification Results Yet</h3>
                <p>Click "Classify Submissions" to analyze content</p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)}
        className="comparison-modal"
        overlayClassName="modal-overlay"
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="modal-header">
            <h2>File Comparison</h2>
            <button 
              className="close-modal"
              onClick={() => setModalIsOpen(false)}
            >
              &times;
            </button>
          </div>
          
          <div className="file-comparison">
            <div className="file-content">
              <h3>File 1</h3>
              <pre>{selectedFiles.file1 || "No content available"}</pre>
            </div>
            <div className="file-content">
              <h3>File 2</h3>
              <pre>{selectedFiles.file2 || "No content available"}</pre>
            </div>
          </div>
        </motion.div>
      </Modal>
    </motion.div>
  );
};

export default Similarity;