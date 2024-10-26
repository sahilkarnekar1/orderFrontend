import React, { useState } from 'react';
import axios from 'axios';
import "../styling/Signup.css"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    location: { latitude: '', longitude: '' },
    city: '',
    state: '',
    postalCode: '',
    contactNumber: '',
    emailShop: '',
    passwordShop: '',
    ownerName: '',
    ownerContact: '',
    ownerEmail: '',
    openingHours: {
      monday: { openTime: '', closeTime: '' },
      tuesday: { openTime: '', closeTime: '' },
      wednesday: { openTime: '', closeTime: '' },
      thursday: { openTime: '', closeTime: '' },
      friday: { openTime: '', closeTime: '' },
      saturday: { openTime: '', closeTime: '' },
      sunday: { openTime: '', closeTime: '' }
    },
    shopImages: '',
    drinkImages: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    paymentDetails: {
      bankName: '',
      accountNumber: '',
      ifscCode: ''
    }
  });

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Split the name by the dot (e.g., 'paymentDetails.bankName' -> ['paymentDetails', 'bankName'])
    const keys = name.split('.');
  
    // Check if it's a nested field (more than one key)
    if (keys.length > 1) {
      setFormData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      // If it's a normal field, just update as usual
      setFormData({ ...formData, [name]: value });
    }
  };
  

  // Handle opening/closing hours
  const handleOpeningHoursChange = (day, type, value) => {
    setFormData({
      ...formData,
      openingHours: {
        ...formData.openingHours,
        [day]: {
          ...formData.openingHours[day],
          [type]: value
        }
      }
    });
  };

  // Get current location
  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setFormData({
        ...formData,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      });
      toast.success(`Latitude : ${position.coords.latitude} And Longitude : ${position.coords.longitude}`);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://order-backend-olive.vercel.app/api/shopPartnerAuth/register-shop', formData);
      toast.success('Shop Registered:', res.data);
    
    } catch (err) {
      toast.error('Error registering shop:', err);
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>Register Shop</h2>

      {/* Shop Info */}
      <input
        type="text"
        name="shopName"
        placeholder="Shop Name"
        value={formData.shopName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Shop Address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="postalCode"
        placeholder="Postal Code"
        value={formData.postalCode}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="contactNumber"
        placeholder="Contact Number"
        value={formData.contactNumber}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="emailShop"
        placeholder="Shop Email"
        value={formData.emailShop}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="passwordShop"
        placeholder="Shop Password"
        value={formData.passwordShop}
        onChange={handleChange}
        required
      />

      {/* Owner Info */}
      <input
        type="text"
        name="ownerName"
        placeholder="Owner Name"
        value={formData.ownerName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="ownerContact"
        placeholder="Owner Contact"
        value={formData.ownerContact}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="ownerEmail"
        placeholder="Owner Email"
        value={formData.ownerEmail}
        onChange={handleChange}
        required
      />

      {/* Opening Hours */}
      <div className="opening-hours">
        <h3>Opening Hours</h3>
        {Object.keys(formData.openingHours).map((day) => (
          <div key={day}>
            <label>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
            <input
              type="time"
              value={formData.openingHours[day].openTime}
              onChange={(e) => handleOpeningHoursChange(day, 'openTime', e.target.value)}
            />
            <input
              type="time"
              value={formData.openingHours[day].closeTime}
              onChange={(e) => handleOpeningHoursChange(day, 'closeTime', e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Images and License Info */}
      <input
        type="text"
        name="shopImages"
        placeholder="Shop Images (URLs)"
        value={formData.shopImages}
        onChange={handleChange}
      />
      <input
        type="text"
        name="drinkImages"
        placeholder="Drink Images (URLs)"
        value={formData.drinkImages}
        onChange={handleChange}
      />
      <input
        type="text"
        name="licenseNumber"
        placeholder="License Number"
        value={formData.licenseNumber}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="licenseExpiryDate"
        value={formData.licenseExpiryDate}
        onChange={handleChange}
        required
      />

      {/* Payment Info */}
      <input
        type="text"
        name="paymentDetails.bankName"
        placeholder="Bank Name"
        value={formData.paymentDetails.bankName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="paymentDetails.accountNumber"
        placeholder="Account Number"
        value={formData.paymentDetails.accountNumber}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="paymentDetails.ifscCode"
        placeholder="IFSC Code"
        value={formData.paymentDetails.ifscCode}
        onChange={handleChange}
        required
      />

      {/* Location Button */}
      <button type="button" onClick={handleLocation}>
        Get Current Location
      </button>

      {/* Submit */}
      <button type="submit">Register Shop</button>
    </form>
  );
};

export default SignupForm;
