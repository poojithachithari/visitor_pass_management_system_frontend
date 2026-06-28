import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { createAppointment, getAllVisitors, getEmpAppointments, updateAppointment } from '../../services/api'

const tabConfig = {
  create:       { label: 'Create Appointment', bg: 'bg-[#FFD1DC]', text: 'text-pink-800'   },
  appointments: { label: 'Appointments',        bg: 'bg-[#CFDBC5]', text: 'text-green-900'  },
  visitors:     { label: 'Visitors',            bg: 'bg-[#FFE4E1]', text: 'text-orange-800' },
}

const actionBtn = 'px-3 py-1 rounded text-xs font-medium mr-1'
const thCls = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600'
const tdCls = 'px-4 py-3 text-sm text-gray-700'
const inputCls = 'w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
const selectCls = 'px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300'
const labelCls = 'text-xs font-semibold text-gray-500 uppercase tracking-wide'

const Dashboard = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('create')
  const [visitors, setVisitors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [visitorId, setVisitorId] = useState(null)
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [purpose, setPurpose] = useState('')
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  const handleTabs = (e) => { setActiveTab(e.target.name); setEditingId(null) }
  const handleLogout = () => { logout(); navigate('/login') }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      await createAppointment({ visitorId, hostId: user._id, appointmentDate, appointmentTime, purpose })
      fetchData()
      setActiveTab('appointments')
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  const fetchData = async () => {
    try {
      const visitorsData = await getAllVisitors()
      setVisitors(visitorsData.data)
      setVisitorId(visitorsData.data[0]?._id)
      const appointmentsData = await getEmpAppointments(user._id)
      setAppointments(appointmentsData.data)
    } catch (err) { console.log('error:', err) }
  }

  useEffect(() => { fetchData() }, [])

  const handleAppointmentStatus = async (id) => {
    try { await updateAppointment(id, { status: newStatus }); setEditingId(null); fetchData() }
    catch (err) { console.log('error:', err) }
  }

  const { bg } = tabConfig[activeTab]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
          <p className="text-sm text-gray-500">Visitor Management System</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition">Logout</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 items-end">
        {Object.entries(tabConfig).map(([key, cfg]) => (
          <button key={key} name={key} onClick={handleTabs}
            className={`px-4 py-2 rounded-t-lg text-sm font-semibold border-t border-l border-r border-gray-200 transition-all ${cfg.bg} ${cfg.text} ${activeTab === key ? 'opacity-100 shadow-sm' : 'opacity-50 hover:opacity-75'}`}>
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`${bg} rounded-b-xl rounded-tr-xl shadow p-6`}>

        {/* CREATE APPOINTMENT */}
        {activeTab === 'create' &&
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">New Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>Visitor</label>
                <select value={visitorId} onChange={(e) => setVisitorId(e.target.value)} className={inputCls + ' mt-1'}>
                  {visitors.map((visitor) => (
                    <option key={visitor._id} value={visitor._id}>{visitor.name} — {visitor.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Date</label>
                <input type='date' value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className={inputCls + ' mt-1'} />
              </div>
              <div>
                <label className={labelCls}>Time</label>
                <input type='time' value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} className={inputCls + ' mt-1'} />
              </div>
              <div>
                <label className={labelCls}>Purpose</label>
                <input type='text' value={purpose} placeholder="Meeting, Interview..." onChange={(e) => setPurpose(e.target.value)} className={inputCls + ' mt-1'} />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type='submit' className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition">
                Create Appointment →
              </button>
            </form>
          </div>}

        {/* APPOINTMENTS */}
        {activeTab === 'appointments' &&
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-green-50">
                <tr>{['S.No', 'Visitor', 'Host', 'Date', 'Time', 'Purpose', 'Status', 'Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appointment, index) => editingId === appointment._id ? (
                  <tr key={appointment._id} className="bg-green-50">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{appointment.visitorId?.name || appointment.visitorId}</td>
                    <td className={tdCls}>{appointment.hostId?.userName || appointment.hostId}</td>
                    <td className={tdCls}>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td className={tdCls}>{appointment.appointmentTime}</td>
                    <td className={tdCls}>{appointment.purpose}</td>
                    <td className={tdCls}>
                      <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className={selectCls}>
                        <option value='pending'>Pending</option>
                        <option value='approved'>Approved</option>
                        <option value='rejected'>Rejected</option>
                      </select>
                    </td>
                    <td className={tdCls}>
                      <button onClick={() => handleAppointmentStatus(appointment._id)} className={actionBtn + ' bg-green-100 text-green-700 hover:bg-green-200'}>Save</button>
                      <button onClick={() => setEditingId(null)} className={actionBtn + ' bg-gray-100 text-gray-600 hover:bg-gray-200'}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={appointment._id} className="hover:bg-green-50 transition">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{appointment.visitorId?.name || appointment.visitorId}</td>
                    <td className={tdCls}>{appointment.hostId?.userName || appointment.hostId}</td>
                    <td className={tdCls}>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td className={tdCls}>{appointment.appointmentTime}</td>
                    <td className={tdCls}>{appointment.purpose}</td>
                    <td className={tdCls}>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${appointment.status === 'approved' ? 'bg-green-100 text-green-700' : appointment.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className={tdCls}>
                      <button onClick={() => { setEditingId(appointment._id); setNewStatus(appointment.status) }} className={actionBtn + ' bg-blue-100 text-blue-700 hover:bg-blue-200'}>Edit</button>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && <tr><td colSpan={8} className="text-center py-6 text-gray-400">No appointments yet</td></tr>}
              </tbody>
            </table>
          </div>}

        {/* VISITORS */}
        {activeTab === 'visitors' &&
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-orange-50">
                <tr>{['S.No', 'Name', 'Email', 'Phone', 'Address', 'Photo', 'Purpose', 'Status'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visitors.map((visitor, index) => (
                  <tr key={visitor._id} className="hover:bg-orange-50 transition">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{visitor.name}</td>
                    <td className={tdCls}>{visitor.email}</td>
                    <td className={tdCls}>{visitor.phone}</td>
                    <td className={tdCls}>{visitor.address}</td>
                    <td className={tdCls}><img src={visitor.photo} alt="photo" width={40} className="rounded" /></td>
                    <td className={tdCls}>{visitor.purposeOfVisit}</td>
                    <td className={tdCls}><span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs">{visitor.status}</span></td>
                  </tr>
                ))}
                {visitors.length === 0 && <tr><td colSpan={8} className="text-center py-6 text-gray-400">No visitors found</td></tr>}
              </tbody>
            </table>
          </div>}
      </div>
    </div>
  )
}

export default Dashboard
