import React, { useState } from 'react'
import { authRegister, createVisitor } from '../services/api'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cpassword, setCpassword] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [photo, setPhoto] = useState('')
  const [purposeOfVisit, setPurposeOfVisit] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (cpassword == password) {
        const response = await authRegister({ userName, email, password, role })
        if (role === 'visitor') {
          await createVisitor({ name: userName, email, phone, address, photo, purposeOfVisit })
        }
        navigate('/login')
      } else {
        setError("Passwords don't match")
      }
    } catch (err) {
      console.log('Error: ', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8">
      <div className="text-center mt-[-60px]">
        <h1 className="text-3xl font-bold text-blue-700 mb-1">Visitor Management System</h1>
        <p className="text-gray-500 text-sm">Secure access for all roles</p>
      </div>

      <div className="w-full max-w-md">
        {/* Tab label */}
        <div>
          <span className="inline-block bg-white border border-b-0 border-gray-200 rounded-t-lg px-4 py-2 text-sm font-medium text-gray-600">
            Create Account
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Username</label>
              <input
                value={userName} name="userName" type="text"
                placeholder="John Doe"
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
              <input
                value={email} name="email" type="email"
                placeholder="name@company.com"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</label>
              <select
                value={role} name="role"
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="security">Security</option>
                <option value="visitor">Visitor</option>
              </select>
            </div>

            {role === 'visitor' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                  <input
                    value={phone} name="phone" type="text"
                    placeholder="+1 234 567 8900"
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</label>
                  <input
                    value={address} name="address" type="text"
                    placeholder="123 Main St, City"
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Photo</label>
                  <input
                    name="photo" type="file" accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      const reader = new FileReader()
                      reader.onloadend = () => setPhoto(reader.result)
                      reader.readAsDataURL(file)
                    }}
                    className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Purpose of Visit</label>
                  <input
                    value={purposeOfVisit} name="purposeOfVisit" type="text"
                    placeholder="Business Meeting, Interview..."
                    onChange={(e) => setPurposeOfVisit(e.target.value)}
                    className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
              <input
                value={password} name="password" type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Confirm Password</label>
              <input
                value={cpassword} name="cpassword" type="password"
                placeholder="••••••••"
                onChange={(e) => setCpassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Register →
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
