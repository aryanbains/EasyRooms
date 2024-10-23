import React, { useState, useEffect } from 'react';
import './ChatRoom.css';
import { useParams } from 'react-router-dom';
import FileUpload from './FileUpload';
import { listAll, ref } from 'firebase/storage';
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
import { uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary functions for file storage
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names
import { auth } from '../firebaseConfig';

const ChatRoom = () => {
  const { roomId } = useParams(); // Get room ID from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]); // State to hold uploaded files

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

  // Fetch uploaded files from Firebase Storage
  useEffect(() => {
    const fetchFiles = async () => {
      const filesRef = ref(storage, `rooms/${roomId}/files/`); // Reference to the folder containing files
      const fileList = await listAll(filesRef);
      const urls = await Promise.all(
        fileList.items.map((item) => getDownloadURL(item))
      );
      setFiles(urls); // Set the state with the list of file URLs
    };

    fetchFiles();
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
          required
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Send</button>
      </form>
      <FileUpload roomId={roomId} />
      <div className="file-list">
        <h3>Uploaded Files:</h3>
        <ul>
          {files.map((url, index) => (
            <li key={index}>
              <a href={url} target="_blank" rel="noopener noreferrer">File {index + 1}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatRoom;
