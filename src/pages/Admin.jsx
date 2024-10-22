import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(firestore, 'roles'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userRole = querySnapshot.docs[0].data().role;
        setIsAdmin(userRole === 'admin');
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'rooms'));
      const roomsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsData);
    };

    fetchRooms();
  }, []);

  const deleteRoom = async (roomId) => {
    await deleteDoc(doc(firestore, 'rooms', roomId));
    setRooms(rooms.filter((room) => room.id !== roomId));
  };

  if (!isAdmin) return <div>You are not authorized to access this page.</div>;

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.roomName}
            <button onClick={() => deleteRoom(room.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
