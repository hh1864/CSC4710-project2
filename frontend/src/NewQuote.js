import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const NewQuote = () => {
    const [address, setAddress] = useState('');
    const [drivewaySize, setDrivewaySize] = useState('');
    const [price, setPrice] = useState('');
    const [pictures, setPictures] = useState([]);
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePictures = (event) => {
        setPictures([...event.target.files]);
    };

    // Handle form 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Indicate loading state

        const formData = new FormData();
        formData.append('address', address);
        formData.append('drivewaysize', drivewaySize);
        formData.append('price', price);
        pictures.forEach(picture => formData.append('pictures', picture));
        formData.append('note', note);

        try {
            // Send POST request to backend
            const res = await axios.post('http://localhost:5000/newrequest', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (res.status === 201) {
                navigate('/dashboard'); // Redirect after successful submission
            } else {
                setError('Request submission failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.log('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="request-quote-container">
            <h2>Request a Quote</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Square Feet of Driveway:</label>
                    <input
                        type="number"
                        value={drivewaySize}
                        onChange={e => setDrivewaySize(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Proposed Price for Work:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Upload 5 Pictures:</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePictures}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Note/Additional Information:</label>
                    <textarea
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="form-textarea"
                    />
                </div>
                <button type="submit" disabled={loading} className="form-button">
                    {loading ? 'Submitting...' : 'Submit Quote Request'}
                </button>
            </form>
        </div>
    );
};

export default NewQuote;

