import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import './AssignmentsView.css'; // Import the CSS file

const AssignmentsView = () => {
  const { classroom } = useParams();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/get-classroom-files/${classroom}`);
        setFiles(response.data.files || []);
        setLoading(false);
      } catch (err) {
        setError('Error fetching files. Please check if the classroom exists.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchFiles();
  }, [classroom]);

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch(extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'zip':
      case 'rar':
        return '🗄️';
      default:
        return '📁';
    }
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch(extension) {
      case 'pdf':
        return 'PDF Document';
      case 'doc':
      case 'docx':
        return 'Word Document';
      case 'xls':
      case 'xlsx':
        return 'Excel Spreadsheet';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'Image File';
      case 'zip':
      case 'rar':
        return 'Compressed Archive';
      default:
        return 'File';
    }
  };

  const formatFileSize = (size) => {
    if (size < 1024) return size + ' bytes';
    else if (size < 1048576) return (size/1024).toFixed(1) + ' KB';
    else return (size/1048576).toFixed(1) + ' MB';
  };

  const filteredFiles = files
    .filter(file => file.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.localeCompare(b) 
          : b.localeCompare(a);
      }
      // Add more sorting options if needed
      return 0;
    });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const downloadFile = (fileName, e) => {
    e.preventDefault();
    window.open(`http://localhost:5000/uploads/${classroom}/${fileName}`, '_blank');
  };

  return (
    <div className="assignments-container">
      <header className="assignments-header">
        <h1>Classroom Assignments</h1>
        <div className="classroom-info">
          <span>Classroom: {classroom}</span>
          <span>Total Assignments: {files.length}</span>
        </div>
      </header>

      <div className="assignments-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="sort-options">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
            <option value="name">File Name</option>
            <option value="type">File Type</option>
          </select>
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className={`sort-direction ${sortOrder}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner"></div>
      ) : filteredFiles.length > 0 ? (
        <div className="assignments-grid">
          {filteredFiles.map((file, index) => (
            <div 
              key={index} 
              className="assignment-card"
              onClick={(e) => downloadFile(file, e)}
            >
              <div className="file-icon">{getFileIcon(file)}</div>
              <div className="file-info">
                <h3 className="file-name">{file}</h3>
                <span className="file-type">{getFileType(file)}</span>
              </div>
              <div className="file-actions">
                <button 
                  className="download-btn"
                  onClick={(e) => downloadFile(file, e)}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-files">
          <p>No assignments found in this classroom.</p>
          {searchTerm && <p>Try a different search term.</p>}
        </div>
      )}
    </div>
  );
};

export default AssignmentsView;