import React, { useEffect, useState } from 'react'
import { deleteAppointment, deleteUser, deleteVisitor, getAllAppointments, getAllCheckLogs, getAllPasses, getAllUsers, getAllVisitors, updateAppointment, updatePass, updateUser, updateVisitor } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const tabConfig = {
  users:        { label: 'Users',        bg: 'bg-[#FFD1DC]', text: 'text-pink-800',   hover: 'hover:bg-pink-200'   },
  visitors:     { label: 'Visitors',     bg: 'bg-[#CFDBC5]', text: 'text-green-900',  hover: 'hover:bg-green-200'  },
  appointments: { label: 'Appointments', bg: 'bg-[#FFE4E1]', text: 'text-orange-800', hover: 'hover:bg-orange-100' },
  passes:       { label: 'Passes',       bg: 'bg-[#D8BFD8]', text: 'text-purple-900', hover: 'hover:bg-purple-200' },
  checklogs:    { label: 'Check Logs',   bg: 'bg-[#E0F7FA]', text: 'text-teal-900',   hover: 'hover:bg-teal-100'   },
}

const actionBtn = 'px-3 py-1 rounded text-xs font-medium mr-1'
const thCls = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600'
const tdCls = 'px-4 py-3 text-sm text-gray-700'
const inputCls = 'px-3 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300'
const selectCls = 'px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300'

const Dashboard = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [visitors, setVisitors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [passes, setPasses] = useState([])
  const [checklogs, setCheckLogs] = useState([])
  const [activeTab, setActiveTab] = useState('users')
  const [editingId, setEditingId] = useState(null)
  const [newRole, setNewRole] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchUser, setSearchUser] = useState('')
  const [searchVisitor, setSearchVisitor] = useState('')
  const [filterVisitorStatus, setFilterVisitorStatus] = useState('all')
  const [filterPassStatus, setFilterPassStatus] = useState('all')

  const fetchData = async () => {
    try {
      const [u, v, a, p, c] = await Promise.all([getAllUsers(), getAllVisitors(), getAllAppointments(), getAllPasses(), getAllCheckLogs()])
      setUsers(u.data); setVisitors(v.data); setAppointments(a.data); setPasses(p.data); setCheckLogs(c.data)
    } catch (err) { console.log('error:', err) }
  }

  useEffect(() => { fetchData() }, [])

  const handleLogout = () => { logout(); navigate('/login') }
  const handleTabs = (e) => { setActiveTab(e.target.name); setEditingId(null) }
  const handleUserDelete = async (id) => { await deleteUser(id); fetchData() }
  const handleVisitorDelete = async (id) => { await deleteVisitor(id); fetchData() }
  const handleAppointmentDelete = async (id) => { await deleteAppointment(id); fetchData() }
  

  const handleRole = async (id) => {
    try { await updateUser(id, { role: newRole }); setEditingId(null); fetchData() }
    catch (err) { console.log('Error:', err) }
  }
  const handleAppointmentStatus = async (id) => {
    try { await updateAppointment(id, { status: newStatus }); setEditingId(null); fetchData() }
    catch (err) { console.log('Error:', err) }
  }
  const handleVisitorStatus = async (id) => {
    try { await updateVisitor(id, { status: newStatus }); setEditingId(null); fetchData() }
    catch (err) { console.log('Error:', err) }
  }
  const handlePassStatus = async (id) => {
    try { await updatePass(id, { status: newStatus }); setEditingId(null); fetchData() }
    catch (err) { console.log('Error:', err) }
  }

  const filteredAppointments = appointments.filter(a =>
    a.visitorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || a.status === filterStatus)
  )
  const searchUsers = users.filter(a =>
    a.userName?.toLowerCase().includes(searchUser.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchUser.toLowerCase()) ||
    a.role?.toLowerCase().includes(searchUser.toLowerCase())
  )
  const filteredVisitors = visitors.filter(a =>
    a.name?.toLowerCase().includes(searchVisitor.toLowerCase()) &&
    (filterVisitorStatus === 'all' || a.status === filterVisitorStatus)
  )
  const filteredPasses = passes.filter(a =>
    filterPassStatus === 'all' || a.status === filterPassStatus
  )

  const { bg, text } = tabConfig[activeTab]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Visitor Management System</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition">
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 items-end">
        {Object.entries(tabConfig).map(([key, cfg]) => (
          <button
            key={key} name={key} onClick={handleTabs}
            className={`px-4 py-2 rounded-t-lg text-sm font-semibold border-t border-l border-r border-gray-200 transition-all ${cfg.bg} ${cfg.text} ${activeTab === key ? 'opacity-100 shadow-sm' : 'opacity-50 hover:opacity-75'}`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <div className={`${bg} rounded-b-xl rounded-tr-xl shadow p-6`}>

        {/* USERS TAB */}
        {activeTab === 'users' && <>
          <div className="flex gap-3 mb-4">
            <input type='text' value={searchUser} placeholder="Search by name, email or role..." onChange={(e) => setSearchUser(e.target.value)} className={inputCls + ' flex-1'} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-pink-50">
                <tr>{['S.No', 'Name', 'Email', 'Role', 'Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {searchUsers.map((user, index) => editingId === user._id ? (
                  <tr key={user._id} className="bg-pink-50">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{user.userName}</td>
                    <td className={tdCls}>{user.email}</td>
                    <td className={tdCls}>
                      <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className={selectCls}>
                        {['admin', 'security', 'employee', 'visitor'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className={tdCls}>
                      <button onClick={() => handleRole(user._id)} className={actionBtn + ' bg-green-100 text-green-700 hover:bg-green-200'}>Save</button>
                      <button onClick={() => setEditingId(null)} className={actionBtn + ' bg-gray-100 text-gray-600 hover:bg-gray-200'}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={user._id} className="hover:bg-pink-50 transition">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{user.userName}</td>
                    <td className={tdCls}>{user.email}</td>
                    <td className={tdCls}><span className="px-2 py-0.5 bg-pink-100 text-pink-800 rounded-full text-xs">{user.role}</span></td>
                    <td className={tdCls}>
                      <button onClick={() => { setEditingId(user._id); setNewRole(user.role) }} className={actionBtn + ' bg-blue-100 text-blue-700 hover:bg-blue-200'}>Edit</button>
                      <button onClick={() => handleUserDelete(user._id)} className={actionBtn + ' bg-red-100 text-red-600 hover:bg-red-200'}>Delete</button>
                    </td>
                  </tr>
                ))}
                {searchUsers.length === 0 && <tr><td colSpan={5} className="text-center py-6 text-gray-400">No data available</td></tr>}
              </tbody>
            </table>
          </div>
        </>}

        {/* VISITORS TAB */}
        {activeTab === 'visitors' && <>
          <div className="flex gap-3 mb-4">
            <input type='text' value={searchVisitor} placeholder="Search by name..." onChange={(e) => setSearchVisitor(e.target.value)} className={inputCls + ' flex-1'} />
            <select value={filterVisitorStatus} onChange={(e) => setFilterVisitorStatus(e.target.value)} className={selectCls}>
              <option value='all'>All</option>
              <option value='pending'>Pending</option>
              <option value='checked-in'>Checked In</option>
              <option value='checked-out'>Checked Out</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-green-50">
                <tr>{['S.No', 'Name', 'Email', 'Phone', 'Address', 'Photo', 'Purpose', 'Status', 'Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVisitors.map((visitor, index) => editingId === visitor._id ? (
                  <tr key={visitor._id} className="bg-green-50">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{visitor.name}</td>
                    <td className={tdCls}>{visitor.email}</td>
                    <td className={tdCls}>{visitor.phone}</td>
                    <td className={tdCls}>{visitor.address}</td>
                    <td className={tdCls}><img src={visitor.photo} alt="photo" width={40} className="rounded" /></td>
                    <td className={tdCls}>{visitor.purposeOfVisit}</td>
                  
                    <td className={tdCls}>
                      <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className={selectCls}>
                        <option value='pending'>Pending</option>
                        <option value='checked-in'>Checked In</option>
                        <option value='checked-out'>Checked Out</option>
                      </select>
                    </td>
                    <td className={tdCls}>
                      <button onClick={() => handleVisitorStatus(visitor._id)} className={actionBtn + ' bg-green-100 text-green-700 hover:bg-green-200'}>Save</button>
                      <button onClick={() => setEditingId(null)} className={actionBtn + ' bg-gray-100 text-gray-600 hover:bg-gray-200'}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={visitor._id} className="hover:bg-green-50 transition">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{visitor.name}</td>
                    <td className={tdCls}>{visitor.email}</td>
                    <td className={tdCls}>{visitor.phone}</td>
                    <td className={tdCls}>{visitor.address}</td>
                    <td className={tdCls}><img src={visitor.photo} alt="photo" width={40} className="rounded" /></td>
                    <td className={tdCls}>{visitor.purposeOfVisit}</td>
                    <td className={tdCls}><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">{visitor.status}</span></td>
                    <td className={tdCls}>
                      <button onClick={() => { setEditingId(visitor._id); setNewStatus(visitor.status) }} className={actionBtn + ' bg-blue-100 text-blue-700 hover:bg-blue-200'}>Edit</button>
                      <button onClick={() => handleVisitorDelete(visitor._id)} className={actionBtn + ' bg-red-100 text-red-600 hover:bg-red-200'}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filteredVisitors.length === 0 && <tr><td colSpan={10} className="text-center py-6 text-gray-400">No data available</td></tr>}
              </tbody>
            </table>
          </div>
        </>}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && <>
          <div className="flex gap-3 mb-4">
            <input type='text' value={searchTerm} placeholder="Search by visitor name..." onChange={(e) => setSearchTerm(e.target.value)} className={inputCls + ' flex-1'} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectCls}>
              <option value='all'>All</option>
              <option value='pending'>Pending</option>
              <option value='approved'>Approved</option>
              <option value='rejected'>Rejected</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-orange-50">
                <tr>{['S.No', 'Visitor', 'Host', 'Date', 'Time', 'Purpose', 'Status', 'Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.map((appointment, index) => editingId === appointment._id ? (
                  <tr key={appointment._id} className="bg-orange-50">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{appointment.visitorId?.name}</td>
                    <td className={tdCls}>{appointment.hostId?.userName}</td>
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
                  <tr key={appointment._id} className="hover:bg-orange-50 transition">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{appointment.visitorId?.name}</td>
                    <td className={tdCls}>{appointment.hostId?.userName}</td>
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
                      <button onClick={() => handleAppointmentDelete(appointment._id)} className={actionBtn + ' bg-red-100 text-red-600 hover:bg-red-200'}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filteredAppointments.length === 0 && <tr><td colSpan={8} className="text-center py-6 text-gray-400">No data available</td></tr>}
              </tbody>
            </table>
          </div>
        </>}

        {/* PASSES TAB */}
        {activeTab === 'passes' && <>
          <div className="flex gap-3 mb-4">
            <select value={filterPassStatus} onChange={(e) => setFilterPassStatus(e.target.value)} className={selectCls}>
              <option value='all'>All</option>
              <option value='active'>Active</option>
              <option value='expired'>Expired</option>
              <option value='cancelled'>Cancelled</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-purple-50">
                <tr>{['S.No', 'Visitor Id', 'Appointment Id', 'QR Code', 'Valid From', 'Valid Until', 'Status', 'Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPasses.map((pass, index) => editingId === pass._id ? (
                  <tr key={pass._id} className="bg-purple-50">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{pass.visitorId}</td>
                    <td className={tdCls}>{pass.appointmentId}</td>
                    <td className={tdCls}><img src={pass.qrcode} alt="QR" width={60} /></td>
                    <td className={tdCls}>{new Date(pass.validFrom).toLocaleString()}</td>
                    <td className={tdCls}>{new Date(pass.validUntil).toLocaleString()}</td>
                    <td className={tdCls}>
                      <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className={selectCls}>
                        <option value='active'>Active</option>
                        <option value='expired'>Expired</option>
                        <option value='cancelled'>Cancelled</option>
                      </select>
                    </td>
                    <td className={tdCls}>
                      <button onClick={() => handlePassStatus(pass._id)} className={actionBtn + ' bg-green-100 text-green-700 hover:bg-green-200'}>Save</button>
                      <button onClick={() => setEditingId(null)} className={actionBtn + ' bg-gray-100 text-gray-600 hover:bg-gray-200'}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={pass._id} className="hover:bg-purple-50 transition">
                    <td className={tdCls}>{index + 1}</td>
                    <td className={tdCls}>{pass.visitorId}</td>
                    <td className={tdCls}>{pass.appointmentId}</td>
                    <td className={tdCls}><img src={pass.qrcode} alt="QR" width={60} /></td>
                    <td className={tdCls}>{new Date(pass.validFrom).toLocaleString()}</td>
                    <td className={tdCls}>{new Date(pass.validUntil).toLocaleString()}</td>
                    <td className={tdCls}>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${pass.status === 'active' ? 'bg-green-100 text-green-700' : pass.status === 'expired' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'}`}>
                        {pass.status}
                      </span>
                    </td>
                    <td className={tdCls}>
                      <button onClick={() => { setEditingId(pass._id); setNewStatus(pass.status) }} className={actionBtn + ' bg-blue-100 text-blue-700 hover:bg-blue-200'}>Edit</button>
                    </td>
                  </tr>
                ))}
                {filteredPasses.length === 0 && <tr><td colSpan={8} className="text-center py-6 text-gray-400">No data available</td></tr>}
              </tbody>
            </table>
          </div>
        </>}

        {/* CHECKLOGS TAB */}
        {activeTab === 'checklogs' &&
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-teal-50">
                <tr>{['S.No', 'Visitor Id', 'Pass Id', 'Check In', 'Check Out', 'Date', 'Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
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
                {checklogs.length === 0 && <tr><td colSpan={7} className="text-center py-6 text-gray-400">No data available</td></tr>}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  )
}

export default Dashboard
