import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Corrected import for Firestore
import { storage } from '../firebaseConfig'; // Import storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary functions for file storage
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names
import { auth } from '../firebaseConfig';

const ChatRoom = () => {
  const { roomId } = useParams(); // Get room ID from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);

  // Fetch and listen to messages in real-time
  useEffect(() => {
    const messagesRef = collection(db, `rooms/${roomId}/messages`); // Use 'db' for Firestore
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return unsubscribe; // Clean up listener on unmount
  }, [roomId]);

  // Upload file to Firebase Storage
  const uploadFile = async () => {
    if (!file) return;
    const storageRef = ref(storage, `chatFiles/${uuidv4()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref); // Return file URL
  };

  // Send a new message or file
  const sendMessage = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert('Please login to send messages.');
      return;
    }

    let fileUrl = '';
    if (file) {
      fileUrl = await uploadFile();
      setFile(null); // Reset file input after upload
    }

    const messagesRef = collection(db, `rooms/${roomId}/messages`); // Use 'db' for Firestore
    await addDoc(messagesRef, {
      sender: user.email,
      content: fileUrl ? `File: ${fileUrl}` : newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  return (
    <div className="chatroom-container">
      <h2>Chat Room</h2>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender}</strong>:
            {msg.content.startsWith('File: ') ? (
              <a
                href={msg.content.replace('File: ', '')}
                target="_blank"
                rel="noopener noreferrer"
              >
                View File
              </a>
            ) : (
              msg.content
            )}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
