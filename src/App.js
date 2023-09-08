import React, { useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import SignUp from './pages/signup'
import CheckMail from './pages/check-mail'
import ValidateToken from './pages/validate-token'
import Profile from './pages/profile'
import AuthContext from './state/auth-context'
import SignUpCompleted from './pages/signup-completed'
import 'bootstrap/dist/css/bootstrap.min.css'


export default function App() {
  const [token, setToken] = useState()
  const authContextValue = { token, setToken }

  return (
    <AuthContext.Provider value={authContextValue}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignUp />} />
          <Route path='/check-mail' element={<CheckMail />} />
          <Route path='/validate-token' element={<ValidateToken />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/signup-completed' element={<SignUpCompleted />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );

};
