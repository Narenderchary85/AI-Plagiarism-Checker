

import React, { useState } from 'react';
import './StudentPage.css';

const StudentPage = () => {
  const [isPop, setIsPop] = useState(false);
  const [classroom, setClassroom] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [files, setFiles] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!classroom || !rollNo || !files) {
      setMessage("Please fill all fields and select files");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("classroom", classroom);
    formData.append("roll_no", rollNo);
    
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await fetch("http://localhost:5000/upload-files", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
          setIsPop(false);
          setMessage("");
          setClassroom("");
          setRollNo("");
          setFiles(null);
        }, 2000);
      } else {
        setMessage(data.error || "Error uploading files");
      }
    } catch (error) {
      setMessage("Server error: Unable to upload files");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='student-page'>
      <nav className='navbar'>
        <div className="navbar-brand">PlagiarismCheck</div>
        <div className="navbar-links">
          <a href="#" className="nav-link active">Create</a>
          <a href="#" className="nav-link">Help</a>
          <a href="#" className="nav-link">My Assignments</a>
        </div>
      </nav>

      <div className="dashboard">
        <div className="sidebar">
          <div className="sidebar-header">Menu</div>
          <ul className="sidebar-menu">
            <li className="menu-item active">
              <i className="fas fa-upload"></i> Submissions
            </li>
            <li className="menu-item">
              <i className="fas fa-tasks"></i> Assignments
            </li>
            <li className="menu-item">
              <i className="fas fa-sign-out-alt"></i> Logout
            </li>
          </ul>
        </div>


        <div className="content-area">
          <div className="welcome-card">
            <h1>Welcome to Your Assignment Portal</h1>
            <p>Submit your assignments securely and track your submission history</p>
          </div>

          <div className="assignment-card" onClick={() => setIsPop(true)}>
            <div className="assignment-icon">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <h2>Submit New Assignment</h2>
            <p>Click here to upload your assignment files</p>
          </div>

          <div className="recent-submissions">
            <h3>Recent Submissions</h3>
            <div className="submission-list">
              <div className="empty-state">
                <i className="fas fa-folder-open"></i>
                <p>No recent submissions found</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPop && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Submit Assignment</h2>
              <button className="close-btn" onClick={() => setIsPop(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="submission-form">
              <div className="form-group">
                <label htmlFor="classroom">Classroom ID</label>
                <input
                  type="text"
                  id="classroom"
                  placeholder="Enter classroom ID (e.g. CS-101)"
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="rollNo">Student Roll Number</label>
                <input
                  type="text"
                  id="rollNo"
                  placeholder="Enter your roll number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                />
              </div>

              <div className="form-group file-upload">
                <label htmlFor="files">Assignment Files</label>
                <div className="upload-area">
                  <input
                    type="file"
                    id="files"
                    multiple
                    onChange={handleFileChange}
                  />
                  <div className="upload-prompt">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Click to browse or drag and drop files</p>
                    {files && (
                      <div className="file-preview">
                        {Array.from(files).map((file, index) => (
                          <div key={index} className="file-item">
                            <i className="fas fa-file-alt"></i>
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Submit Assignment
                  </>
                )}
              </button>

              {message && (
                <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPage;