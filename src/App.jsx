import React from 'react'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/Dashboard'
import SecurityDashBoard from './pages/security/Dashboard'
import CheckIn from './pages/security/CheckIn'
import EmployeeDashboard from './pages/employee/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import VisitorDashboard from './pages/visitor/Dashboard'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/admin/dashboard' element={<ProtectedRoute element={<AdminDashboard/>} allowedRoles={['admin']} />} />
        <Route path='/security/dashboard' element={<ProtectedRoute element={<SecurityDashBoard/>} allowedRoles={['admin','security']} />} />
        <Route path='/security/checkin' element={<ProtectedRoute element={<CheckIn/>} allowedRoles={['admin','security']} />} />
        <Route path='/employee/dashboard' element={<ProtectedRoute element={<EmployeeDashboard/>} allowedRoles={['admin','employee']} />} />
        <Route path='/visitor/dashboard' element={<ProtectedRoute element={<VisitorDashboard/>} allowedRoles={['admin','visitor']} />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
