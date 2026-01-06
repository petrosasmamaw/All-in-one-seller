import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItemsBySellerId, deleteItem } from '../Slice/itemSlice'

const Items = ({ userId }) => {
	const dispatch = useDispatch()
	const items = useSelector((state) => state.items.items || [])
	const status = useSelector((state) => state.items.status)

	useEffect(() => {
		if (userId) dispatch(fetchItemsBySellerId(userId))
	}, [dispatch, userId])

	const handleDelete = (id) => {
		if (window.confirm('Delete this item?')) dispatch(deleteItem(id))
	}

	return (
		<div className="container">
			<div className="page-header-row">
				<div className="page-icon" aria-hidden>📦</div>
				<div>
					<h3 style={{margin:0}}>My Items</h3>
					<p className="muted" style={{margin:0}}>Items you have listed for sale.</p>
				</div>
			</div>
			<h2>My Items</h2>

			{status === 'loading' && <div className="nav-loading">Loading...</div>}

			<div className="items-grid">
				{items.length === 0 && <div>No items found</div>}

				{items.map((it) => (
					<div className="item-card" key={it._id}>
						<div className="item-thumb">
							{it.image ? (
								<img src={it.image} alt={it.name} />
							) : (
								<div className="item-placeholder">{it.name?.charAt(0)}</div>
							)}
						</div>
						<div className="item-body">
							<div className="item-title">{it.name}</div>
							<div className="item-desc">{it.description || 'No description'}</div>
							<div className="item-meta">{it.category} • ${it.price}</div>
							<div className="item-actions">
								<button className="nav-btn ghost" onClick={() => handleDelete(it._id)}>Delete</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Items

