import React, { useState, useEffect, useRef } from 'react';
import './ChatRoom.css';
import { useParams, Link } from 'react-router-dom';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, storage, auth } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import sendIcon from '../icons/send.svg';
import attachIcon from '../icons/attach.svg';
import infoIcon from '../icons/info.svg'; // Import the info icon

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [roomName, setRoomName] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchRoomName = async () => {
      const roomDoc = await getDoc(doc(db, 'rooms', roomId));
      if (roomDoc.exists()) {
        setRoomName(roomDoc.data().roomName);
      }
    };
    fetchRoomName();
  }, [roomId]);

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

  const sendMessage = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert('Please login to send messages.');
      return;
    }
    let fileUrl = '';
    let fileType = '';
    if (file) {
      const storageRef = ref(storage, `chatFiles/${uuidv4()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2);
          setUploadProgress(progress);
        },
        (error) => {
          console.log('Upload error: ', error);
        },
        async () => {
          fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
          fileType = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'file';
          const messagesRef = collection(db, `rooms/${roomId}/messages`);
          await addDoc(messagesRef, {
            sender: user.uid,
            username: user.displayName || 'User',
            content: fileUrl,
            fileType: fileType,
            timestamp: serverTimestamp(),
          });
          setFile(null);
          setUploadProgress(0);
        }
      );
    } else {
      const messagesRef = collection(db, `rooms/${roomId}/messages`);
      await addDoc(messagesRef, {
        sender: user.uid,
        username: user.displayName || 'User',
        content: newMessage,
        fileType: 'text',
        timestamp: serverTimestamp(),
      });
    }
    setNewMessage('');
  };

  return (
    <div className="chatroom-container">
      <header className="chatroom-header">
        <h2>{roomName}</h2>
        <Link to={`/roominfo/${roomId}`} className="icon-button">
          <img src={infoIcon} alt="Room Info" />
        </Link>
      </header>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender === auth.currentUser.uid ? 'sent' : 'received'}`}>
            <strong>{msg.username || 'User'}</strong>:
            {msg.fileType === 'image' ? (
              <img src={msg.content} alt="sent" className="chat-image" />
            ) : msg.fileType === 'video' ? (
              <video controls className="chat-video">
                <source src={msg.content} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : msg.fileType === 'file' ? (
              <a href={msg.content} target="_blank" rel="noopener noreferrer">
                View File
              </a>
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
        />
        <label htmlFor="file-input" className="icon-button">
          <img src={attachIcon} alt="Attach" />
        </label>
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && <div className="upload-progress">Uploading: {uploadProgress}%</div>}
        <button type="submit" className="icon-button">
          <img src={sendIcon} alt="Send" />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
