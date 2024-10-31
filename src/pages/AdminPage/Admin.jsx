import React, { useEffect, useState } from 'react';
import './Admin.css';
import { auth, db } from '../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, 'roles'), where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userRole = querySnapshot.docs[0].data().role;
          setIsAdmin(userRole === 'admin');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const querySnapshot = await getDocs(collection(db, 'rooms'));
      const roomsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsData);
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchContactMessages = async () => {
      const querySnapshot = await getDocs(collection(db, 'contacts'));
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContactMessages(messagesData);
    };
    fetchContactMessages();
  }, []);

  const deleteRoom = async (roomId) => {
    await deleteDoc(doc(db, 'rooms', roomId));
    setRooms(rooms.filter((room) => room.id !== roomId));
  };

  const startEditing = (room) => {
    setEditingRoomId(room.id);
    setNewRoomName(room.roomName);
  };

  const saveRoomName = async (roomId) => {
    const roomDoc = doc(db, 'rooms', roomId);
    await updateDoc(roomDoc, { roomName: newRoomName });
    setRooms(rooms.map((room) => (room.id === roomId ? { ...room, roomName: newRoomName } : room)));
    setEditingRoomId(null);
  };

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div>You are not authorized to access this page.</div>;

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <section>
        <h3>Rooms</h3>
        <ul>
          {rooms.map((room) => (
            <li className="admin-room" key={room.id}>
              {editingRoomId === room.id ? (
                <>
                  <input
                    className="admin-input"
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                  />
                  <button className="admin-button admin-button-edit" onClick={() => saveRoomName(room.id)}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  {room.roomName}
                  <button className="admin-button admin-button-edit" onClick={() => startEditing(room)}>
                    Edit
                  </button>
                </>
              )}
              <button className="admin-button admin-button-delete" onClick={() => deleteRoom(room.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Contact Messages</h3>
        <ul>
          {contactMessages.map((message) => (
            <li className="admin-message" key={message.id}>
              <p><strong>Name:</strong> {message.name}</p>
              <p><strong>Email:</strong> {message.email}</p>
              <p><strong>Message:</strong> {message.message}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Admin;
