import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './RoomInfo.css';

const RoomInfo = () => {
  const { roomId } = useParams();
  const [roomInfo, setRoomInfo] = useState(null);
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
    fetchRoomInfo();
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
          {roomInfo.members ? (
            roomInfo.members.map((member, index) => (
              <li key={index}>{member}</li>
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
