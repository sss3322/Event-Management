import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditEventPage = () => {
  const { id } = useParams(); // Get event ID from URL params
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: '',
    description: '',
    organizedBy: '',
    eventDate: '',
    eventTime: '',
    location: '',
    ticketPrice: 0,
    image: '',
  });

  // Fetch event data by ID
  useEffect(() => {
    axios.get(`/event/${id}`)
      .then(response => {
        setEvent(response.data);
      })
      .catch(error => {
        console.error('Error fetching event:', error);
        // Handle error, e.g., redirect to error page or display error message
      });
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prevEvent => ({
      ...prevEvent,
      [name]: value
    }));
  };

  // Handle form submission (update event)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/event/${id}`, event);
      navigate(`/event/${id}`); // Redirect to event details page after update
    } catch (error) {
      console.error('Error updating event:', error);
      // Handle error, e.g., display error message to user
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg">
        {/* Form fields for editing event details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" id="title" name="title" value={event.title} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="organizedBy" className="block text-sm font-medium text-gray-700">Organized By</label>
            <input type="text" id="organizedBy" name="organizedBy" value={event.organizedBy} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" name="description" value={event.description} onChange={handleChange} rows="4" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" required></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Event Date</label>
            <input type="date" id="eventDate" name="eventDate" value={event.eventDate.split('T')[0]} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">Event Time</label>
            <input type="time" id="eventTime" name="eventTime" value={event.eventTime} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" id="location" name="location" value={event.location} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700">Ticket Price</label>
          <input type="number" id="ticketPrice" name="ticketPrice" value={event.ticketPrice} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Event Image</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Update Event</button>
      </form>
    </div>
  );
};

export default EditEventPage;
