// import React from 'react';
// import { Route,Routes } from 'react-router';
// import Homepage from './components/Homepage';
// import Example from './components/Example';
// import Register from './components/Register';
// import StudentPage from './components/StudentPage';
// import TeacherPage from './components/TeacherPage';
// import Similarity from './components/Similarity';

// function App() {

//   return (
//     <div>
//         <Routes>
//             <Route path='/' element={<Homepage/>}/>
//             <Route path='/Example' element={<Example/>}/>
//             <Route path='/register' element={<Register/>}/>
//             <Route path='/student' element={<StudentPage/>}/>
//             <Route path='/teacher' element={<TeacherPage/>}/>
//             <Route path='/similarity' element={<Similarity/>}/>
//         </Routes>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { Route, Routes } from "react-router";
import { ClassroomProvider } from "./components/ClassroomContext"; // Import context
import Homepage from "./components/Homepage";
import Example from "./components/Example";
import Register from "./components/Register";
import StudentPage from "./components/StudentPage";
import TeacherPage from "./components/TeacherPage";
import Similarity from "./components/Similarity";
import Login from "./components/Login";

function App() {
  return (
    <ClassroomProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/example" element={<Example />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/similarity/:classroom" element={<Similarity />} />
      </Routes>
    </ClassroomProvider>
  );
}

export default App;
