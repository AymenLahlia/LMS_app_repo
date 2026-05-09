import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Courses from './components/pages/courses'
import Login from './components/pages/Login'
import Register from './components/pages/Register';
import MyCourses from './components/pages/account/MyCourses'
import WatchCourse from './components/pages/account/WatchCourse'
import MyLearning from './components/pages/account/MyLearning'
import ChangePassword from './components/pages/ChangePassword';
import Detail from './components/pages/Detail'
import { RequireAuth, RequireAdmin, RequireStudent } from './components/common/RequireAuth'
import CreateCourse from './components/pages/account/courses/CreateCourse'
import Dashboard from './components/pages/account/Dashboard'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditCourse from './components/pages/account/courses/EditCourse';
import EditLesson from './components/pages/account/courses/EditLesson';
import Profile from './components/pages/account/Profile';
import ManageStudents from './components/pages/account/ManageStudents';
import StudentProgress from './components/pages/account/StudentProgress';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path='/' element={<Home />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/course/:id' element={<Detail />} />
          <Route path='/account/login' element={<Login />} />
          <Route path='/account/register' element={<Register />} />

          {/* Shared auth */}
          <Route path='/account/dashboard' element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path='/account/profile' element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path='/account/change-password' element={<RequireAuth><ChangePassword /></RequireAuth>} />

          {/* Admin only */}
          <Route path='/account/my-courses' element={<RequireAdmin><MyCourses /></RequireAdmin>} />
          <Route path='/account/courses/create' element={<RequireAdmin><CreateCourse /></RequireAdmin>} />
          <Route path='/account/courses/edit/:id' element={<RequireAdmin><EditCourse /></RequireAdmin>} />
          <Route path='/account/lessons/:lessonId/edit' element={<RequireAdmin><EditLesson /></RequireAdmin>} />
          <Route path='/account/manage-students' element={<RequireAdmin><ManageStudents /></RequireAdmin>} />
          <Route path='/account/student-progress/:userId' element={<RequireAdmin><StudentProgress /></RequireAdmin>} />

          {/* Student only */}
          <Route path='/account/my-learning' element={<RequireStudent><MyLearning /></RequireStudent>} />
          <Route path='/account/courses-enrolled' element={<RequireStudent><MyLearning /></RequireStudent>} />
          <Route path='/account/watch-course/:courseId' element={<RequireStudent><WatchCourse /></RequireStudent>} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App
