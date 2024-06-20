import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { RiLogoutCircleLine } from 'react-icons/ri';
import { BsFillCaretDownFill } from 'react-icons/bs';

export default function Header() {
  const { user, setUser, isAdmin } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef();

  //! Fetch events from the server -------------------------------------------------
  useEffect(() => {
    axios.get("/events")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  //! Search bar functionality----------------------------------------------------
  useEffect(() => {
    const handleDocumentClick = (event) => {
      // Check if the clicked element is the search input or its descendant
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setSearchQuery("");
      }
    };

    // Listen for click events on the entire document
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []); 

  //! Logout Function --------------------------------------------------------
  const logout = async () => {
    try {
      await axios.post('/logout');
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  //! Search input ----------------------------------------------------------------
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <header className='flex py-2 px-6 sm:px-6 justify-between items-center relative z-10'>

        <Link to={'/'} className="flex items-center">
          LOGO
        </Link>

        <div className='flex bg-white rounded py-2.5 px-4 w-1/3 gap-4 items-center shadow-md shadow-gray-200'>

          <button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
          <div ref={searchInputRef}>
            <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearchInputChange} className='text-sm text-black outline-none w-full' />
          </div>
        </div>

        {/* Search Functionality */}
        {searchQuery && (
          <div className="p-2 w-144 z-10 absolute rounded left-[28.5%] top-14 md:w-[315px] md:left-[17%] md:top-16 lg:w-[540px] lg:left-[12%] lg:top-16 bg-white">
            {/* Filter events based on the search query */}
            {events
              .filter((event) =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((event) => (
                <div key={event._id} className="p-2">
                  {/* Display event details */}
                  <Link to={"/event/" + event._id}>
                    <div className="text-black text-lg w-full">{event.title}</div>
                  </Link>
                </div>
              ))}
          </div>
        )}

        {/* Conditional rendering for admin and regular user functionalities */}
        {!!user && (
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500">
              {user.name}
              <BsFillCaretDownFill className="h-5 w-5" />
            </button>

            {/* Dropdown menu for actions */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-50">
                {/* Regular user actions */}
                <Link to={'/useraccount'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">Profile</Link>

                {/* Admin-specific actions */}
                {isAdmin && (
                  <>
                    <Link to={'/viewUsers'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">All Users</Link>
                    <Link to={'/viewEvents'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">All Events</Link>
                  </>
                )}

                {/* Shared actions */}
                <Link to={'/calendar'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">Calendar</Link>
                <Link to={'/wallet'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">Wallet</Link>
                <Link to={'/dashboard'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">Dashboard</Link>
                <Link to={'/createEvent'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">Create Event</Link>
                {/* Logout action */}
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  <RiLogoutCircleLine className="inline-block h-5 w-5 mr-2" />
                  Log out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Conditional rendering for not logged in */}
        {!user && (
          <Link to={'/login'} className="text-sm">
            Sign In
          </Link>
        )}

      </header>
    </div>
  );
}
