import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getPassbyVisitorId, getVisitorByUserEmail } from '../../services/api'
import { jsPDF } from 'jspdf'

const thCls = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600'
const tdCls = 'px-4 py-3 text-sm text-gray-700'

const Dashboard = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('pass')
  const [visitor, setVisitor] = useState(null)
  const [pass, setPass] = useState(null)

  const fetchData = async () => {
    try {
      const visitorData = await getVisitorByUserEmail(user.email)
      setVisitor(visitorData.data)
      const passesData = await getPassbyVisitorId(visitorData.data._id)
      setPass(passesData.data)
    } catch (err) { console.log('error:', err) }
  }

  useEffect(() => { fetchData() }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const handleDownloadQR = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('Visitor Pass', 80, 20)
    doc.setFontSize(12)
    doc.text(`Name: ${visitor.name}`, 10, 40)
    doc.text(`Email: ${visitor.email}`, 10, 50)
    doc.text(`Purpose: ${visitor.purposeOfVisit}`, 10, 60)
    doc.text(`Valid From: ${new Date(pass.validFrom).toLocaleString()}`, 10, 70)
    doc.text(`Valid Until: ${new Date(pass.validUntil).toLocaleString()}`, 10, 80)
    doc.text(`Status: ${pass.status}`, 10, 90)
    doc.addImage(pass.qrcode, 'PNG', 70, 100, 70, 70)
    doc.save('visitor-pass.pdf')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visitor Dashboard</h1>
          <p className="text-sm text-gray-500">Visitor Management System</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition">Logout</button>
      </div>

      {/* Tab */}
      <div className="flex gap-1 items-end">
        <button name='pass'
          className="px-4 py-2 rounded-t-lg text-sm font-semibold border-t border-l border-r border-gray-200 bg-[#D8BFD8] text-purple-900 opacity-100 shadow-sm">
          My Pass
        </button>
      </div>

      {/* Content */}
      <div className="bg-[#D8BFD8] rounded-b-xl rounded-tr-xl shadow p-6">
        {!pass ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
            No pass issued yet. Please wait for your appointment to be approved.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-purple-50">
                <tr>{['S.No', 'Visitor Id', 'Appointment Id', 'QR Code', 'Valid From', 'Valid Until', 'Status', 'Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tdCls}>1</td>
                  <td className={tdCls}>{pass.visitorId}</td>
                  <td className={tdCls}>{pass.appointmentId}</td>
                  <td className={tdCls}><img src={pass.qrcode} alt="QR Code" width={100} /></td>
                  <td className={tdCls}>{new Date(pass.validFrom).toLocaleString()}</td>
                  <td className={tdCls}>{new Date(pass.validUntil).toLocaleString()}</td>
                  <td className={tdCls}>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${pass.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {pass.status}
                    </span>
                  </td>
                  <td className={tdCls}>
                    <button onClick={handleDownloadQR} className="px-3 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                      Download PDF
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
