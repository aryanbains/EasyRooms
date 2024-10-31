import React, { useState, useEffect } from 'react';
import './Rooms.css';
import { collection, addDoc, query, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig'; // Ensure auth is imported for user info
import Navbar from './Navbar';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      const q = query(collection(db, 'rooms'));
      const querySnapshot = await getDocs(q);
      const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsData);
    };
    fetchRooms();
  }, []);

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Please login to create a room.');
        return;
      }
      const docRef = await addDoc(collection(db, 'rooms'), {
        roomName,
        description,
        theme,
        createdAt: serverTimestamp(),
        createdBy: user.displayName || 'Anonymous', // Use the user's name or 'Anonymous'
      });
      setRooms((prevRooms) => [
        ...prevRooms,
        {
          id: docRef.id,
          roomName: roomName,
          description: description,
          theme: theme,
          createdAt: new Date(),
          createdBy: user.displayName || 'Anonymous'
        },
      ]);
      setRoomName('');
      setDescription('');
      setTheme('');
      setIsModalOpen(false);
      alert('Room created successfully!');
    } catch (error) {
      console.error('Error creating room: ', error);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="rooms-container">
        <h2>Discover Rooms</h2>
        <input
          type="text"
          placeholder="Search Rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button onClick={() => setIsModalOpen(true)} className="create-room-button">Create Room</button>
        <ul className="room-list">
          {filteredRooms.map((room) => (
            <li key={room.id} className="room-item">
              <a href={`/room/${room.id}`} className="room-link">{room.roomName}</a>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
            <form onSubmit={createRoom}>
              <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                className="room-input"
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="room-input"
              />
              <input
                type="text"
                placeholder="Theme (optional)"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="room-input"
              />
              <button type="submit" className="create-room-button">Create Room</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Rooms;
