import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './RoomInfo.css';

const RoomInfo = () => {
  const { roomId } = useParams();
  const [roomInfo, setRoomInfo] = useState(null);

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
    fetchRoomInfo();
  }, [roomId]);

  if (!roomInfo) return <div>Loading...</div>;

  return (
    <div className="room-info-container">
      <h2>{roomInfo.roomName}</h2>
      <p><strong>Description:</strong> {roomInfo.description}</p>
      <p><strong>Created By:</strong> {roomInfo.createdBy}</p>
      <p><strong>Created On:</strong> {roomInfo.createdOn.toDate().toLocaleString()}</p>
      <div className="room-members">
        <h3>Members</h3>
        <ul>
          {roomInfo.members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoomInfo;
