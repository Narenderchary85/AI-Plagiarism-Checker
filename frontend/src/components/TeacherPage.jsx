import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './TeacherPage.css';
import { FiPlus, FiLogOut, FiHelpCircle, FiBook, FiUpload, FiUsers, FiSettings } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';

const TeacherPage = () => {
    const [ispop, setIsPop] = useState(false);
    const [classrooms, setClassrooms] = useState([]);
    const [activeTab, setActiveTab] = useState('classrooms');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

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
        const groupName = document.querySelector(".classroom-name-input").value;
        const token = localStorage.getItem("authToken");
    
        if (!groupName) {
            alert("Please enter a classroom name!");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/create-classroom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ classroom_name: groupName })
            });
    
            const data = await response.json();
            
            if (response.ok) {
                setClassrooms([...classrooms, { name: groupName}]);
                setIsPop(false);

            } else {
                alert(data.message || "Failed to create classroom");
            }
        } catch (error) {
            console.error("Error creating classroom:", error);
            alert("Failed to create classroom.");
        }
    };

    const handleClassroomClick = (classroom) => {
        navigate(`/similarity/${classroom}`);  
    };

    const handleAssignmentClick=(classroom)=>{
        navigate(`/assignment-view/${classroom}`)
    }


    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <motion.div 
            className='teacher-portal'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div 
                className="sidebar"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="sidebar-header">
                    <FaChalkboardTeacher className="teacher-icon" />
                    <h2>Educator Portal</h2>
                </div>

                <div className="sidebar-menu">
                    <motion.div 
                        className={`menu-item ${activeTab === 'classrooms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('classrooms')}
                        whileHover={{ scale: 1.02 }}
                    >
                        <FiBook className="menu-icon" />
                        <span>My Classrooms</span>
                    </motion.div>

                    <motion.div 
                        className={`menu-item ${activeTab === 'assignments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('assignments')}
                        whileHover={{ scale: 1.02 }}
                    >
                        <FiUpload className="menu-icon" />
                        <span>Assignments</span>
                    </motion.div>

                    

                    <motion.div 
                        className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                        whileHover={{ scale: 1.02 }}
                    >
                        <FiSettings className="menu-icon" />
                        <span>Settings</span>
                    </motion.div>
                </div>

                <motion.div 
                    className="logout-btn"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiLogOut className="logout-icon" />
                    <span>Logout</span>
                </motion.div>
            </motion.div>
            <div className="main-content">
                <div className="top-nav">
                    <h1 className="page-title">
                        {activeTab === 'classrooms' && 'My Classrooms'}
                        {activeTab === 'assignments' && 'Assignments'}
                        {activeTab === 'students' && 'Students'}
                        {activeTab === 'settings' && 'Settings'}
                    </h1>

                    <div className="nav-actions">
                        <div className="search-bar">
                            <input 
                                type="text" 
                                placeholder="Search classrooms..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <motion.button 
                            className="create-btn"
                            onClick={() => setIsPop(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiPlus className="plus-icon" />
                            <span>Create Classroom</span>
                        </motion.button>
                    </div>
                </div>
                <div className="content-area">
                    {activeTab === 'classrooms' && (
                        <div className="classrooms-grid">
                            {classrooms.length > 0 ? (
                                classrooms.map((classroom, index) => (
                                    <motion.div
                                        key={index}
                                        className="classroom-card"
                                        onClick={() => handleClassroomClick(classroom)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.3 }}
                                        whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                                    >
                                        <div className="classroom-icon">
                                            <FaChalkboardTeacher />
                                        </div>
                                        <h3>{classroom}</h3>
                                        <div className="students-count">Plagiarism Check</div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div 
                                    className="empty-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                
                                    <h3>No classrooms found</h3>
                                    <p>Create your first classroom to get started</p>
                                    <button 
                                        className="create-first-btn"
                                        onClick={() => setIsPop(true)}
                                    >
                                        Create Classroom
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {activeTab === 'assignments' && (
                        <div className="classrooms-grid">
                            {
                                classrooms.map((classroom, index) => (
                                    <motion.div
                                        key={index}
                                        className="classroom-card"
                                        onClick={() => handleAssignmentClick(classroom)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.3 }}
                                        whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                                    >
                                        <div className="classroom-icon">
                                            <FaChalkboardTeacher />
                                        </div>
                                        <h3>{classroom}</h3>
                                        <div className="students-count">Show Assignments</div>
                                    </motion.div>
                                ))
                            }
                        </div>
                    )}

                    {activeTab === 'students' && (
                        <div className="students-view">

                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="settings-view">
      
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {ispop && (
                    <motion.div 
                        className="popup-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsPop(false)}
                    >
                        <motion.div 
                            className="create-popup"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>Create New Classroom</h2>
                            <div className="form-group">
                                <label>Classroom Name</label>
                                <input 
                                    type="text" 
                                    className="classroom-name-input"
                                    placeholder="e.g. Computer Science 101"
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label>Description (Optional)</label>
                                <textarea 
                                    className="classroom-desc-input"
                                    placeholder="What's this classroom about?"
                                />
                            </div>
                            <div className="popup-actions">
                                <button 
                                    className="cancel-btn"
                                    onClick={() => setIsPop(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="create-classroom-btn"
                                    onClick={createClassroom}
                                >
                                    Create Classroom
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TeacherPage;