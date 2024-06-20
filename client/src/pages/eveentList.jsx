import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  // Fetch events from the server
  useEffect(() => {
    axios.get('/events')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setError('Failed to fetch events.');
      });
  }, []);

  // Delete an event
  const handleDelete = (eventId) => {
    axios.delete(`/events/${eventId}`)
      .then(response => {
        setEvents(events.filter(event => event._id !== eventId));
      })
      .catch(error => {
        console.error('Error deleting event:', error);
        setError('Failed to delete event.');
      });
  };

  // Render the component
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Event List</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {events.map(event => (
          <li key={event._id} className="border p-4 mb-2">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p>{event.description}</p>
            <div className="mt-2">
              {/* Update Button */}
              <Link to={`/events/update/${event._id}`} className="text-blue-500 hover:underline mr-4">
                Update
              </Link>
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(event._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
