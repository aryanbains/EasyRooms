import React, { useEffect, useState } from 'react';
import './Admin.css';
import { auth, db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(db, 'roles'),
          where('email', '==', currentUser.email)
        );
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
    setRooms(
      rooms.map((room) =>
        room.id === roomId ? { ...room, roomName: newRoomName } : room
      )
    );
    setEditingRoomId(null);
  };

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div>You are not authorized to access this page.</div>;

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
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
                <button
                  className="admin-button admin-button-edit"
                  onClick={() => saveRoomName(room.id)}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {room.roomName}
                <button
                  className="admin-button admin-button-edit"
                  onClick={() => startEditing(room)}
                >
                  Edit
                </button>
              </>
            )}
            <button
              className="admin-button admin-button-delete"
              onClick={() => deleteRoom(room.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
