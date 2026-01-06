import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createItem } from "../Slice/itemSlice";

const CreateItems = ({ userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm((s) => ({ ...s, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    if (!userId) return setError("Seller ID missing. Please sign in again.");
    if (!form.name || !form.price || !form.category) return setError("Name, price, and category are required");

    setSubmitting(true);

    try {
      await dispatch(
        createItem({
          name: form.name,
          sellerId: userId, // ✅ ALWAYS from props
          category: form.category,
          description: form.description,
          price: Number(form.price),
          status: "active",
          image: form.image,
        })
      ).unwrap();

      setForm({
        name: "",
        category: "",
        description: "",
        price: "",
        image: null,
      });
      setPreview(null);

      navigate("/Items");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || "Failed to create item";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="seller-profile-container">
        <div className="page-header-row">
          <div className="page-icon" aria-hidden>➕</div>
          <div>
            <h3>Create Item</h3>
            <p className="muted">Add a new item to your storefront.</p>
          </div>
        </div>
        <h2 className="seller-profile-title">Create Item</h2>
        {error && <div className="alert alert-error" style={{ marginBottom: 10 }}>{error}</div>}

        <form className="seller-profile-form" onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Item name"
            className="seller-profile-input"
          />

          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="seller-profile-input"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="seller-profile-input"
          >
            <option value="">Select category</option>
            <option value="Items">Items</option>
            <option value="Services">Services</option>
            <option value="Freelancers">Freelancers</option>
            <option value="Laborers">Laborers</option>
            <option value="Jobs">Jobs</option>
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="seller-profile-input"
            rows={4}
          />

          <input
            type="file"
            onChange={handleFile}
            className="seller-profile-input"
          />

          {preview && (
            <img src={preview} alt="preview" style={{ width: 120, borderRadius: 8 }} />
          )}

          <button type="submit" disabled={submitting} className="seller-profile-btn">
            {submitting ? "Creating..." : "Create Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateItems;
