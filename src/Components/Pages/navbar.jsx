import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../Slice/authSlice'

const Navbar = ({ user, userId, status }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isAuthenticated = !!user && status === 'succeeded'

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <header className="app-navbar">
      <div className="page-header-row" style={{margin:0}}>
        <div>
          <h3 style={{margin:0}}>ALL IN ONE</h3>
        </div>
      </div>
      <div className="nav-brand">
        <Link to="/" data-item="Seller">Seller</Link>
      </div>

      <nav className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/Items" className="nav-btn" data-item="Items">Items</Link>
              <Link to="/chats" className="nav-btn" data-item="Chats">Chats</Link>
            <Link to="/profile" className="nav-btn" data-item="Profile">Profile</Link>
            <Link to="/CreateItems" className="nav-btn" data-item="CreateItmes">CreateItmes</Link>
          </>
        ) : null}
      </nav>

      <div className="nav-actions">
        {status === 'loading' ? (
          <div className="nav-loading nav-btn outline">Checking...</div>
        ) : !isAuthenticated ? (
          <>
            <Link to="/login" className="nav-btn outline" data-item="Login">Login</Link>
            <Link to="/register" className="nav-btn primary" data-item="Register">Register</Link>
          </>
        ) : (
          <>
            <div className="nav-user">
              <div className="nav-user-avatar">{user && user.email}</div>
            </div>
            <button onClick={handleLogout} className="nav-btn ghost" data-item="Logout">Logout</button>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
