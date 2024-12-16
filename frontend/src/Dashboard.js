import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    squareFeet: '',
    price: '',
    note: '',
  });
  const [picture, setPicture] = useState(null);
  const [quotes, setQuotes] = useState([
    { id: 1, address: '123 Main St', status: 'pending', currentPrice: 1000 },
    { id: 2, address: '456 Oak Ave', status: 'agreed', currentPrice: 1200 },
  ]);
  const [orders, setOrders] = useState([
    { id: 1, status: 'completed', agreedPrice: 1500.0 },
  ]);
  const [bills, setBills] = useState([
    { id: 1, amount: 1500.0, status: 'pending', notes: '' },
    { id: 2, amount: 2000.0, status: 'agreed', notes: '' },
  ]);

  const [negotiation, setNegotiation] = useState(null);
  const [dispute, setDispute] = useState(null);
  const [paymentConfirmation, setPaymentConfirmation] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNegotiationToggle = (id) => {
    setNegotiation(negotiation === id ? null : id);
  };

  const handleDisputeToggle = (id) => {
    setDispute(dispute === id ? null : id);
  };

  const handlePaymentToggle = (id) => {
    setPaymentConfirmation(paymentConfirmation === id ? null : id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setPicture(e.target.files[0]);
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
  
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to submit a request.');
      navigate('/login');
      return;
    }
  
    const formDataToSend = {
      address: formData.address,
      drivewaysize: formData.squareFeet, // Match backend field names
      price: formData.price,
      note: formData.note,
    };
  
    try {
      const res = await axios.post('http://localhost:5000/submit-quote', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request.');
    }
  };
  
  
  

  const sectionStyle = {
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '1.5rem',
    color: '#007bff',
    marginBottom: '10px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  };

  const buttonStyle = {
    fontSize: '1.2rem',
    color: '#fff',
    backgroundColor: '#007bff',
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    width: 'auto',
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <h2 style={{ fontSize: '2rem', color: '#007bff', textAlign: 'center', marginBottom: '30px' }}>User Dashboard</h2>

      <nav style={{ textAlign: 'center', marginBottom: '30px' }}>
        <ul style={{ listStyleType: 'none', padding: '0', display: 'flex', justifyContent: 'center', gap: '40px', alignItems: 'center' }}>
          <li><Link to="/" style={{ textDecoration: 'none', fontSize: '1.2rem', color: '#007bff' }}>Home</Link></li>
          <li><Link to="/profile" style={{ textDecoration: 'none', fontSize: '1.2rem', color: '#007bff' }}>Profile</Link></li>
          <li>
            <button
              onClick={handleLogout}
              style={{ textDecoration: 'none', fontSize: '1.2rem', color: '#007bff', border: 'none', cursor: 'pointer' }}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <section style={sectionStyle}>
        <h3 style={headingStyle}>Submit New Quote</h3>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Square Feet:</label>
            <input
              type="number"
              name="squareFeet"
              value={formData.drivewaysize}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Proposed Price:</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Notes:</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              style={{ display: 'block', width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            ></textarea>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Upload Driveway Picture:</label>
            <input
              type="file"
              name="picture"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'block', marginBottom: '10px' }}
            />
          </div>
          <button type="submit" style={buttonStyle}>Submit</button>
        </form>
      </section>


      <section style={sectionStyle}>
        <h3 style={headingStyle}>Bills</h3>
        <ul style={{ fontSize: '1.1rem', color: '#555' }}>
          {bills.length > 0 ? (
            bills.map(bill => (
              <li key={bill.id}>
                Bill ID: {bill.id} | Amount: ${bill.amount} | Status: {bill.status}
                <div style={buttonContainerStyle}>
                  <button onClick={() => handlePaymentToggle(bill.id)} style={buttonStyle}>Pay</button>
                  <button onClick={() => handleDisputeToggle(bill.id)} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>Dispute</button>
                </div>
                {paymentConfirmation === bill.id && (
                  <div style={{ marginTop: '10px' }}>
                    <p>Confirm payment?</p>
                    <button style={buttonStyle}>Yes</button>
                    <button onClick={() => handlePaymentToggle(null)} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>Cancel</button>
                  </div>
                )}
                {dispute === bill.id && (
                  <div style={{ marginTop: '10px' }}>
                    <textarea placeholder="Enter dispute notes" style={{ padding: '5px', width: '100%', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}></textarea>
                    <button style={buttonStyle}>Submit</button>
                    <button onClick={() => handleDisputeToggle(null)} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>Cancel</button>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li style={{ color: '#555' }}>None</li>
          )}
        </ul>
      </section>

      <section style={sectionStyle}>
        <h3 style={headingStyle}>Orders</h3>
        <ul style={{ fontSize: '1.1rem', color: '#555' }}>
          {orders.length > 0 ? (
            orders.map(order => (
              <li key={order.id}>
                Order ID: {order.id} | Status: {order.status} | Agreed Price: ${order.agreedPrice}
              </li>
            ))
          ) : (
            <li style={{ color: '#555' }}>None</li>
          )}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
