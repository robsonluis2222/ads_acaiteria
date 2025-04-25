import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar.jsx'
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default App
