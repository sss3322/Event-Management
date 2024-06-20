import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { BiLike } from "react-icons/bi";
import { UserContext } from "../UserContext";

export default function UserAccountPage() {
  const { user, setUser } = useContext(UserContext);
  const [userEvents, setUserEvents] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (!user) return;

    console.log("User data:", user); // Debugging log

    setProfileData({ name: user.name || '', email: user.email || '' });

    axios
      .get(`/eventsByOwner/${user.name}`)
      .then((response) => {
        setUserEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user events:", error);
      });
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleProfileUpdate = () => {
    axios
      .put(`/profile`, profileData)
      .then((response) => {
        console.log("Profile updated successfully:", response.data); 
        setUser(response.data);
        setEditingProfile(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const handleDelete = (eventId) => {
    axios
      .delete(`/event/${eventId}`)
      .then((response) => {
        setUserEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
      })
      .catch((error) => {
        console.error("Error deleting event", error);
      });
  };

  if (!user) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Your Account Information</h2>
        <div className="mt-4">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              disabled={!editingProfile}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              disabled={!editingProfile}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          {editingProfile ? (
            <div className="flex space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleProfileUpdate}
              >
                Save
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setEditingProfile(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setEditingProfile(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8">Your Events</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
        {userEvents.length > 0 ? (
          userEvents.map((event) => (
            <div key={event._id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="aspect-w-16 aspect-h-9">
                {event.image && (
                  <img
                    className="object-cover"
                    src={`http://localhost:4000/api/${event.image}`}
                    alt={event.title}
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-gray-500 mb-2">{event.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <BiLike className="mr-1" /> {event.likes}
                  </div>
                  <div>
                    {event.eventDate.split("T")[0]}, {event.eventTime}
                  </div>
                  <div className="text-right">
                    {event.ticketPrice === 0 ? "Free" : `Rs. ${event.ticketPrice}`}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link to={`/events/update/${event._id}`}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                      Update
                    </button>
                  </Link>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-500">You have not created any events yet.</p>
        )}
      </div>
    </div>
  );
}
