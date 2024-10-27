import React, { useState, useEffect, useRef } from 'react';
import './ChatRoom.css';
import { useParams } from 'react-router-dom';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, storage, auth } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import sendIcon from '../icons/send.svg'; // Import the send icon
import attachIcon from '../icons/attach.svg'; // Import the attach icon

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [roomName, setRoomName] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch room name
  useEffect(() => {
    const fetchRoomName = async () => {
      const roomDoc = await getDoc(doc(db, 'rooms', roomId));
      if (roomDoc.exists()) {
        setRoomName(roomDoc.data().roomName);
      }
    };
    fetchRoomName();
  }, [roomId]);

  // Fetch and listen to messages in real-time
  useEffect(() => {
    const messagesRef = collection(db, `rooms/${roomId}/messages`);
    const q = query(messagesRef, orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return unsubscribe;
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch uploaded files from Firebase Storage
  useEffect(() => {
    const fetchFiles = async () => {
      const filesRef = ref(storage, `rooms/${roomId}/files/`);
      const fileList = await listAll(filesRef);
      const urls = await Promise.all(
        fileList.items.map((item) => getDownloadURL(item))
      );
      setFiles(urls);
    };
    fetchFiles();
  }, [roomId]);

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
      const storageRef = ref(storage, `chatFiles/${uuidv4()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(snapshot.ref);
      setFile(null);
    }

    const messagesRef = collection(db, `rooms/${roomId}/messages`);
    await addDoc(messagesRef, {
      sender: user.uid, // Store the user ID
      username: user.displayName || 'User', // Use displayName from Firebase auth
      content: fileUrl ? `File: ${fileUrl}` : newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  return (
    <div className="chatroom-container">
      <header className="chatroom-header">
        <h2>{roomName}</h2>
      </header>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender === auth.currentUser.uid ? 'sent' : 'received'}`}>
            <strong>{msg.username || 'User'}</strong>:
            {msg.content.startsWith('File: ') ? (
              <div className="file-preview">
                <a
                  href={msg.content.replace('File: ', '')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              </div>
            ) : (
              msg.content
            )}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <form onSubmit={sendMessage} className="message-input">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
        />
        <label htmlFor="file-input">
          <img src={attachIcon} alt="Attach" style={{ cursor: 'pointer' }} />
        </label>
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">
          <img src={sendIcon} alt="Send" />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
