import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createPass, getAllAppointments, getAllCheckLogs, getAllPasses } from '../../services/api'

const tabConfig = {
  appointments: { label: 'Appointments', bg: 'bg-[#FFD1DC]', text: 'text-pink-800'   },
  passes:       { label: 'Passes',       bg: 'bg-[#D8BFD8]', text: 'text-purple-900' },
  checklogs:    { label: 'Check Logs',   bg: 'bg-[#E0F7FA]', text: 'text-teal-900'   },
}

const thCls = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600'
const tdCls = 'px-4 py-3 text-sm text-gray-700'
const actionBtn = 'px-3 py-1 rounded text-xs font-medium mr-1'

const Dashboard = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('appointments')
  const [appointments, setAppointments] = useState([])
  const [passes, setPasses] = useState([])
  const [checklogs, setChecklogs] = useState([])

  const fetchData = async () => {
    const appointmentsData = await getAllAppointments()
    setAppointments(appointmentsData.data.filter(a => a.status === 'approved'))
    const passesData = await getAllPasses()
    setPasses(passesData.data)
    const checklogsData = await getAllCheckLogs()
    setChecklogs(checklogsData.data)
  }

  useEffect(() => { fetchData() }, [])

  const handleLogout = () => { logout(); navigate('/login') }
  const handleTabs = (e) => { setActiveTab(e.target.name) }

  const handleCreatePass = async (appointment) => {
    try {
      const validFrom = new Date(appointment.appointmentDate)
      const validUntil = new Date(validFrom)
      validUntil.setMinutes(validUntil.getMinutes() + 30)
      await createPass({ visitorId: appointment.visitorId._id, appointmentId: appointment._id, validFrom, validUntil })
      fetchData()
      setActiveTab('passes')
    } catch (err) { console.log('Error:', err) }
  }

  const { bg } = tabConfig[activeTab]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Security Dashboard</h1>
          <p className="text-sm text-gray-500">Visitor Management System</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/security/checkin')} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
            QR Scanner
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition">Logout</button>
        </div>
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

        {/* APPOINTMENTS */}
        {activeTab === 'appointments' &&
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-pink-50">
                <tr>{['S.No', 'Visitor Name', 'Host Name', 'Date', 'Time', 'Purpose', 'Status', 'Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appointment, index) => (
                  <tr key={appointment._id} className="hover:bg-pink-50 transition">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{appointment.visitorId?.name}</td>
                    <td className={tdCls}>{appointment.hostId?.userName}</td>
                    <td className={tdCls}>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td className={tdCls}>{appointment.appointmentTime}</td>
                    <td className={tdCls}>{appointment.purpose}</td>
                    <td className={tdCls}><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">{appointment.status}</span></td>
                    <td className={tdCls}>
                      <button onClick={() => handleCreatePass(appointment)} className={actionBtn + ' bg-blue-100 text-blue-700 hover:bg-blue-200'}>Create Pass</button>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && <tr><td colSpan={8} className="text-center py-6 text-gray-400">No approved appointments</td></tr>}
              </tbody>
            </table>
          </div>}

        {/* PASSES */}
        {activeTab === 'passes' &&
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-purple-50">
                <tr>{['S.No', 'Visitor Id', 'Appointment Id', 'QR Code', 'Valid From', 'Valid Until', 'Status'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {passes.map((pass, index) => (
                  <tr key={pass._id} className="hover:bg-purple-50 transition">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{pass.visitorId}</td>
                    <td className={tdCls}>{pass.appointmentId}</td>
                    <td className={tdCls}><img src={pass.qrcode} alt="QR Code" width={70} /></td>
                    <td className={tdCls}>{new Date(pass.validFrom).toLocaleString()}</td>
                    <td className={tdCls}>{new Date(pass.validUntil).toLocaleString()}</td>
                    <td className={tdCls}><span className={`px-2 py-0.5 rounded-full text-xs ${pass.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{pass.status}</span></td>
                  </tr>
                ))}
                {passes.length === 0 && <tr><td colSpan={7} className="text-center py-6 text-gray-400">No passes issued yet</td></tr>}
              </tbody>
            </table>
          </div>}

        {/* CHECKLOGS */}
        {activeTab === 'checklogs' &&
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-teal-50">
                <tr>{['S.No', 'Visitor Id', 'Pass Id', 'Check In', 'Check Out', 'Date'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {checklogs.map((checklog, index) => (
                  <tr key={checklog._id} className="hover:bg-teal-50 transition">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{checklog.visitorId}</td>
                    <td className={tdCls}>{checklog.passId}</td>
                    <td className={tdCls}>{new Date(checklog.checkInTime).toLocaleString()}</td>
                    <td className={tdCls}>{checklog.checkOutTime ? new Date(checklog.checkOutTime).toLocaleString() : '—'}</td>
                    <td className={tdCls}>{new Date(checklog.date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {checklogs.length === 0 && <tr><td colSpan={6} className="text-center py-6 text-gray-400">No check logs yet</td></tr>}
              </tbody>
            </table>
          </div>}
      </div>
    </div>
  )
}

export default Dashboard
