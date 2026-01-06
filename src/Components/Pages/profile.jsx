import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellerByUserId,
  createSeller,
  updateSeller,
} from "../Slice/sellersSlice";

const SellerProfile = ({ userId }) => {
  const dispatch = useDispatch();
  const { seller, status } = useSelector((state) => state.sellers);

  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    if (userId) {
      dispatch(fetchSellerByUserId(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (seller) {
      setFormData({
        name: seller.name,
        phoneNo: seller.phoneNo,
        category: seller.category,
        image: null,
      });
    }
  }, [seller]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (seller) {
      dispatch(
        updateSeller({
          id: seller._id,
          sellerData: { ...formData, userId },
        })
      );
    } else {
      dispatch(
        createSeller({
          ...formData,
          userId,
        })
      );
    }
  };

  return (
    <div className="seller-profile-container">
      <div className="page-header-row">
        <div className="page-icon" aria-hidden>📝</div>
        <div>
          <h3>Seller Profile</h3>
          <p className="muted">Manage your seller storefront and contact info.</p>
        </div>
      </div>
      <h2 className="seller-profile-title">
        {seller ? "Update Seller Profile" : "Create Seller Profile"}
      </h2>

      {seller?.image && (
        <img
          src={seller.image}
          alt="Seller"
          className="seller-profile-image"
        />
      )}

      <form className="seller-profile-form" onSubmit={handleSubmit}>
        <input
          className="seller-profile-input"
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          className="seller-profile-input"
          type="text"
          name="phoneNo"
          placeholder="Phone Number"
          value={formData.phoneNo}
          onChange={handleChange}
          required
        />

        <select
          className="seller-profile-input"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Freelancers">Freelancers</option>
          <option value="Items">Items</option>
          <option value="Laborers">Laborers</option>
          <option value="Services">Services</option>
          <option value="Jobs">Jobs</option>
        </select>

        <input
          className="seller-profile-input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <button
          className="seller-profile-btn"
          type="submit"
          disabled={status === "loading"}
        >
          {seller ? "Update Profile" : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default SellerProfile;
