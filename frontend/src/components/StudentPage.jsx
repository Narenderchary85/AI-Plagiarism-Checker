import React, { useState } from 'react';
import './StudentPage.css';

const StudentPage = () => {
  const [isPop, setIsPop] = useState(false);
  const [classroom, setClassroom] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [files, setFiles] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!classroom || !rollNo || !files) {
      alert("Please enter all fields and select at least one file.");
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
      } else {
        setMessage(data.error || "Error uploading files.");
      }
    } catch (error) {
      setMessage("Server error: Unable to upload files.");
    }
  };

  return (
    <div className='student-bdy'>
        <nav className='student-nav'>
        <div className="create">Plagiarism Checker</div>
        <div className="create">Create</div>
        <div className="help">Help</div>
        <div className="my-assig">My Assignments</div>
      </nav>
      <div className="sub-bdy">
        <div className="left-side">
          <div className="submisions">Submissions</div>
          <div className="assignts">Assignments</div>
          <div className="log-out">Logout</div>
        </div>
      {/* <button className='submit-btn' onClick={() => setIsPop(true)}>Submit Assignment</button> */}
      <div className="sub-ass" onClick={() => setIsPop(true)}>
          <div className="sub-ass2">Submit Assignment</div>
        </div>
      </div>
      {isPop && (
        <>
          <div className="overlay" onClick={() => setIsPop(false)}></div>
          <div className="popup">
            <div className="popup-content">
              <button className="close-btn" onClick={() => setIsPop(false)}>✖</button>
              
              <form onSubmit={handleSubmit}>
                <label className='grp'>Classroom Name:</label>
                <input
                  type="text"
                  placeholder="Enter Classroom Name"
                  value={classroom} className='inp-grp'
                  onChange={(e) => setClassroom(e.target.value)}
                />

                <label className='roll-stu'>Roll No:</label>
                <input
                  type="text"
                  placeholder="Enter Roll No"
                  value={rollNo} className='inp-grp'
                  onChange={(e) => setRollNo(e.target.value)}
                />

                <label className='file-stu'>Choose Files:</label>
                <input
                  type="file"
                  multiple
                  className='file-typ'
                  onChange={handleFileChange}
                />

                <button type="submit" className='btn-stu'>SUBMIT</button>
              </form>

              {message && <p className="message">{message}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentPage;
