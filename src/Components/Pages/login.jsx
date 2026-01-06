import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearAuthError } from '../Slice/authSlice'

const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, status, error } = useSelector((state) => state.auth)

	const handleSubmit = (e) => {
		e.preventDefault()
		if (!email || !password) return
		dispatch(loginUser({ email, password }))
			.unwrap()
			.then((res) => {
				if (res?.user) navigate('/profile')
			})
			.catch(() => {})
	}

	useEffect(() => {
		if (user) navigate('/shop')
		return () => { dispatch(clearAuthError()) }
	}, [user, navigate, dispatch])

	return (
		<div className="auth-page">
			<div className="page-header-row">
				<div className="page-icon" aria-hidden>🔒</div>
				<div>
					<h3>Seller Login</h3>
					<p className="muted">Sign in to manage your items and chats.</p>
				</div>
			</div>
			<div className="auth-card">
				<h2 className="auth-title">Welcome back Seller</h2>
				<p className="auth-sub">Sign in to continue to your account</p>
				{error && <div className="alert alert-error">{error}</div>}
				<form className="auth-form" onSubmit={handleSubmit}>
					<input className="auth-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
					<input className="auth-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
					<button className="btn primary" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Signing in...' : 'Sign In'}</button>
				</form>
				<div className="auth-footer">
					<p>Don't have an account? <Link to="/register">Register</Link></p>
				</div>
			</div>
		</div>
	)
}

export default Login

