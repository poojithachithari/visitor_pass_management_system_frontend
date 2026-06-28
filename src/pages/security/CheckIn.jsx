import React, { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { createCheckLog, getCheckLogByPassId, getOnePass, updateCheckLog } from '../../services/api'
import { useNavigate } from 'react-router-dom'

const CheckIn = () => {
  const [scanResult, setScanResult] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { qrbox: 250, fps: 10 })
    scanner.render(
      (result) => handleScan(result),
      (error) => console.log(error)
    )
  }, [])

  const handleScan = async (passId) => {
    try {
      setScanResult(passId)
      const passResponse = await getOnePass(passId)
      const pass = passResponse.data

      const logResponse = await getCheckLogByPassId(passId)
      const existingLog = logResponse.data

      if (!existingLog) {
        await createCheckLog({ visitorId: pass.visitorId, passId, checkInTime: new Date(), date: new Date() })
        setMessage({ type: 'checkin', text: 'Check-in successful!' })
      } else if (!existingLog.checkOutTime) {
        await updateCheckLog(existingLog._id, { checkOutTime: new Date() })
        setMessage({ type: 'checkout', text: 'Check-out successful!' })
      } else {
        setMessage({ type: 'info', text: 'This pass has already been checked in and out.' })
      }
    } catch (err) {
      console.log('Error:', err)
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">QR Check-In / Check-Out</h1>
          <p className="text-sm text-gray-500">Scan visitor pass QR code</p>
        </div>
        <button onClick={() => navigate('/security/dashboard')} className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition">
          ← Back to Dashboard
        </button>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Scanner Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div id='reader' className="rounded-lg overflow-hidden"></div>
        </div>

        {/* Result */}
        {message && (
          <div className={`rounded-xl p-4 text-center font-medium ${
            message.type === 'checkin'  ? 'bg-green-100 text-green-700' :
            message.type === 'checkout' ? 'bg-blue-100 text-blue-700' :
            message.type === 'error'    ? 'bg-red-100 text-red-700' :
                                          'bg-gray-100 text-gray-700'
          }`}>
            {message.text}
          </div>
        )}

        {scanResult && (
          <p className="text-center text-xs text-gray-400 mt-2">Pass ID: {scanResult}</p>
        )}
      </div>
    </div>
  )
}

export default CheckIn
