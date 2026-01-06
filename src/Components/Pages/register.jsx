import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearAuthError } from '../Slice/authSlice'

const Register = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { user, status, error } = useSelector((state) => state.auth)

	const handleSubmit = (e) => {
		e.preventDefault()
		if (!name || !email || !password) return
		if (password !== confirm) return
		dispatch(registerUser({ name, email, password }))
	}

	useEffect(() => {
		if (user) navigate('/profile')
		return () => { dispatch(clearAuthError()) }
	}, [user, navigate, dispatch])

	return (
		<div className="auth-page">
			<div className="page-header-row">
				<div className="page-icon" aria-hidden>📝</div>
				<div>
					<h3>Create Account</h3>
					<p className="muted">Join as a seller and start listing items.</p>
				</div>
			</div>
			<div className="auth-card">
				<h2 className="auth-title">Create an account</h2>
				<p className="auth-sub">Join now and start shopping</p>
				{error && <div className="alert alert-error">{error}</div>}
				<form className="auth-form" onSubmit={handleSubmit}>
					<input className="auth-input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
					<input className="auth-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
					<input className="auth-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
					<input className="auth-input" type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
					<button className="btn primary" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Creating...' : 'Create Account'}</button>
				</form>
				<div className="auth-footer">
					<p>Already have an account? <Link to="/login">Sign in</Link></p>
				</div>
			</div>
		</div>
	)
}

export default Register

