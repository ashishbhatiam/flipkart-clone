import Dashboard from './pages/Dashboard/Dashboard'
import { Routes, Route } from 'react-router-dom'

import React from 'react'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import PageNotFound from './pages/PageNotFound/PageNotFound'

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  )
}

export default Router
