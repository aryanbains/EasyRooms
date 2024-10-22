import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Change 'firestore' to 'db'

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');

  // Fetch all rooms from Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      const q = query(collection(db, 'rooms')); // Use 'db' here
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
      await addDoc(collection(db, 'rooms'), { // Use 'db' here
        roomName,
        createdAt: serverTimestamp(),
      });
      setRoomName('');
      alert('Room created successfully!');
    } catch (error) {
      console.error('Error creating room: ', error);
    }
  };

  return (
    <div className="rooms-container">
      <h2>Discover Rooms</h2>
      <form onSubmit={createRoom}>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <button type="submit">Create Room</button>
      </form>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <a href={`/room/${room.id}`}>{room.roomName}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rooms;
