import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore';
import './RoomInfo.css';

const RoomInfo = () => {
  const { roomId } = useParams();
  const [roomInfo, setRoomInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [usernames, setUsernames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomInfo = async () => {
      const roomDoc = doc(db, 'rooms', roomId);
      const roomData = await getDoc(roomDoc);
      if (roomData.exists()) {
        setRoomInfo(roomData.data());
      } else {
        console.error('Room not found');
      }
    };

    const fetchMembers = async () => {
      const messagesRef = collection(db, `rooms/${roomId}/messages`);
      const q = query(messagesRef);
      const querySnapshot = await getDocs(q);
      const membersSet = new Set();
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        membersSet.add(messageData.sender);
      });
      const membersArray = Array.from(membersSet);
      setMembers(membersArray);
      await fetchUsernames(membersArray);
    };

    const fetchUsernames = async (members) => {
      const usernamesMap = {};
      for (const member of members) {
        const userDoc = doc(db, 'users', member);
        const userData = await getDoc(userDoc);
        if (userData.exists()) {
          usernamesMap[member] = userData.data().displayName || 'Unknown';
        } else {
          usernamesMap[member] = 'Unknown';
        }
      }
      setUsernames(usernamesMap);
    };

    fetchRoomInfo();
    fetchMembers();
  }, [roomId]);

  if (!roomInfo) return <div>Loading...</div>;

  return (
    <div className="room-info-container">
      <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
      <h2>{roomInfo.roomName}</h2>
      <p><strong>Description:</strong> {roomInfo.description}</p>
      <p><strong>Theme:</strong> {roomInfo.theme}</p>
      <p><strong>Created By:</strong> {roomInfo.createdBy}</p>
      <p><strong>Created On:</strong> {roomInfo.createdAt ? new Date(roomInfo.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
      <div className="room-members">
        <h3>Members</h3>
        <ul>
          {members.length > 0 ? (
            members.map((member, index) => (
              <li key={index}>{usernames[member] || 'Unknown'}</li>
            ))
          ) : (
            <li>No members available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RoomInfo;
