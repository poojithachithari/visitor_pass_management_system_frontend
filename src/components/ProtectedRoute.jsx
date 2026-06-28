import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({element,allowedRoles}) => {
    const {user} = useAuth()
    if(!user) return <Navigate to='/login' />
    if (!allowedRoles.includes(user.role)) return <Navigate to='/login' />
  return element
}

export default ProtectedRoute
