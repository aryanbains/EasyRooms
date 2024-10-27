import React, { useState, useEffect } from 'react';
import './Rooms.css';
import { collection, addDoc, query, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Navbar from './Navbar'; // Import the Navbar component

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all rooms from Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      const q = query(collection(db, 'rooms'));
      const querySnapshot = await getDocs(q);
      const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsData);
    };
    fetchRooms();
  }, []);

  // Create a new room
  const createRoom = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        roomName,
        createdAt: serverTimestamp(),
      });
      // Update the rooms state with the new room
      setRooms((prevRooms) => [
        ...prevRooms,
        { id: docRef.id, roomName: roomName, createdAt: new Date() },
      ]);
      setRoomName('');
      alert('Room created successfully!');
    } catch (error) {
      console.error('Error creating room: ', error);
    }
  };

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room =>
    room.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar /> {/* Add the Navbar here */}
      <div className="rooms-container">
        <h2>Discover Rooms</h2>
        <input
          type="text"
          placeholder="Search Rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <form onSubmit={createRoom}>
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
            className="room-input"
          />
          <button type="submit" className="create-room-button">Create Room</button>
        </form>
        <ul className="room-list">
          {filteredRooms.map((room) => (
            <li key={room.id} className="room-item">
              <a href={`/room/${room.id}`} className="room-link">{room.roomName}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Rooms;
