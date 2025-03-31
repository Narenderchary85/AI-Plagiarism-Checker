import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './TeacherPage.css';

const TeacherPage = () => {
    const [ispop, setIsPop] = useState(false);
    const [classrooms, setClassrooms] = useState([]);
    const navigate = useNavigate();  // Initialize navigate

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        const token = localStorage.getItem("authToken");
    
        if (!token) {
            alert("Unauthorized: No token found. Please log in again.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/get-classrooms", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setClassrooms(data.classrooms);
            } else {
                console.error("Unauthorized:", data.error);
                alert("Unauthorized access. Please log in again.");
            }
        } catch (error) {
            console.error("Error fetching classrooms:", error);
        }
    };
    

    const createClassroom = async () => {
        const groupName = document.querySelector(".inp-grp").value;
        const userRole = localStorage.getItem("role");
        const token = localStorage.getItem("authToken"); // Get JWT token
    
        if (!groupName) {
            alert("Please enter a classroom name!");
            return;
        }
    
        if (userRole !== "teacher") {
            alert("Only teachers can create classrooms!");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/create-classroom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Send token for authentication
                },
                body: JSON.stringify({ classroom_name: groupName }) // Only send classroom name
            });
    
            const data = await response.json();
            alert(data.message);
    
            if (response.ok) {
                setClassrooms([...classrooms, groupName]);
                setIsPop(false);
            }
        } catch (error) {
            console.error("Error creating classroom:", error);
            alert("Failed to create classroom.");
        }
    };
    

    const handleClassroomClick = (classroom) => {
        navigate(`/similarity/${classroom}`);  // Navigate to Similarity page with classroom name
    };

    return (
        <div className='teacher-bdy'>
            <nav className='teach-nav'>
                <div className="plg">Plagiarism Checker</div>
                <div className="create" onClick={() => setIsPop(true)}>Create</div>
                <div className="help">Help</div>
                <div className="my-assig">My Assignments</div>
            </nav>

            <div className="sub-bdy-t">
                <div className="left-side-t">
                    <div className="submisions">Submissions</div>
                    <div className="assignts">Assignments</div>
                    <div className="log-out" onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                    }}>Logout</div>
                </div>

                {classrooms.length > 0 ? (
                    classrooms.map((classroom, index) => (
                        <div 
                            key={index} 
                            className="sub-t" 
                            onClick={() => handleClassroomClick(classroom)} // Navigate on click
                            style={{ cursor: "pointer" }}  // Indicate clickable element
                        >
                            <div className="sub-class">{classroom}</div>
                        </div>
                    ))
                ) : (
                    <div>No classrooms created yet.</div>
                )}
            </div>

            {ispop && (
                <>
                    <div className="overlay" onClick={() => setIsPop(false)}></div>
                    <div className='popup'>
                        <div className="popup-content">
                            <button className="close-btn" onClick={() => setIsPop(false)}>X</button>
                            <div className="grp">Group Name:</div>
                            <input type="text" placeholder='Group Name' className='inp-grp'/>
                            <button className='btn-stu' onClick={createClassroom}>CREATE</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TeacherPage;
