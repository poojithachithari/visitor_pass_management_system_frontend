//this has all the API Calls 
import axios from 'axios'
const API = import.meta.env.VITE_API_URL

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const authRegister = (data) => axios.post(`${API}/auth/register`,data)
export const authLogin = (data) => axios.post(`${API}/auth/login`,data)
//users
export const getAllUsers = ()=> axios.get(`${API}/users`)
export const deleteUser = (id)=> axios.delete(`${API}/users/${id}`)
export const updateUser = (id, data) => axios.put(`${API}/users/${id}`,data)
//visitors
export const getAllVisitors = ()=> axios.get(`${API}/visitors`)
export const deleteVisitor = (id)=>axios.delete(`${API}/visitors/${id}`)
export const updateVisitor = (id,data)=>axios.put(`${API}/visitors/${id}`,data)
export const createVisitor = (data)=>axios.post(`${API}/visitors`,data)
export const getVisitorByUserEmail = (email)=>axios.get(`${API}/visitors/email/${email}`)
//appointments
export const getAllAppointments = ()=> axios.get(`${API}/appointments`)
export const deleteAppointment = (id)=>axios.delete(`${API}/appointments/${id}`)
export const updateAppointment = (id,data)=> axios.put(`${API}/appointments/${id}`,data)
export const getEmpAppointments = (hostId)=>axios.get(`${API}/appointments/host/${hostId}`)
export const createAppointment = (data)=>axios.post(`${API}/appointments`,data)
//passes
export const getAllPasses = ()=>axios.get(`${API}/passes`)
export const getOnePass = (id)=>axios.get(`${API}/passes/${id}`)
export const getPassbyVisitorId = (visitorId)=>axios.get(`${API}/passes/id/${visitorId}`)
export const deletePass = (id)=>axios.delete(`${API}/passes/${id}`)
export const updatePass = (id,data)=>axios.put(`${API}/passes/${id}`,data)
export const createPass = (data)=>axios.post(`${API}/passes`,data)
//checklogs
export const getAllCheckLogs = ()=> axios.get(`${API}/checklogs`)
export const deleteCheckLog = (id)=>axios.delete(`${API}/checklogs/${id}`)
export const updateCheckLog = (id,data)=>axios.put(`${API}/checklogs/${id}`,data)
export const createCheckLog = (data) => axios.post(`${API}/checklogs`, data)
export const getCheckLogByPassId = (passId) => axios.get(`${API}/checklogs/pass/${passId}`)