import React, { useEffect, useState } from 'react';
import './dmpage.css';

const DMPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState({
    groups: [
      { id: 1, name: 'Group 1', latestMessage: 'Hello everyone!', timestamp: '2m ago' },
      { id: 2, name: 'Group 2', latestMessage: 'Meeting at 5', timestamp: '5m ago' },
    ],
    people: [
      { id: 1, name: 'Anil', latestMessage: 'Hi there!', timestamp: '1m ago', unread: 2 },
      { id: 2, name: 'John', latestMessage: 'See you soon.', timestamp: '10m ago' },
    ],
  });
  const [messages, setMessages] = useState({
    1: [
      { from: 'Anil', text: 'Hi there!', timestamp: '12:01 PM' },
      { from: 'You', text: 'Hello!', timestamp: '12:02 PM' },
    ],
  });

  const handleChatClick = (contact) => {
    setActiveChat(contact);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message) return;

    const newMessage = { from: 'You', text: message, timestamp: new Date().toLocaleTimeString() };
    setMessages({
      ...messages,
      [activeChat.id]: [...(messages[activeChat.id] || []), newMessage],
    });
    setMessage('');
  };

  return (
    <div className="dm-page">
      <div className="sidebar">
        <div className="search-bar">
          <input type="text" placeholder="Search" />
        </div>
        <div className="nav-icons">
          <i className="fas fa-home"></i>
          <i className="fas fa-comment"></i>
          <i className="fas fa-bell"></i>
          <i className="fas fa-cog"></i>
          <i className="fas fa-user"></i>
        </div>
      </div>

      <div className="contacts-list">
        <div className="section">
          <h3>Groups</h3>
          {chats.groups.map((group) => (
            <div key={group.id} className="contact-item" onClick={() => handleChatClick(group)}>
              <div className="contact-name">{group.name}</div>
              <div className="contact-preview">
                <span>{group.latestMessage}</span>
                <span className="timestamp">{group.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="section">
          <h3>People</h3>
          {chats.people.map((person) => (
            <div key={person.id} className="contact-item" onClick={() => handleChatClick(person)}>
              <div className="contact-name">
                {person.name} {person.unread > 0 && <span className="unread-badge">{person.unread}</span>}
              </div>
              <div className="contact-preview">
                <span>{person.latestMessage}</span>
                <span className="timestamp">{person.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-window">
        {activeChat ? (
          <>
            <div className="chat-header">
              <h2>{activeChat.name}</h2>
              <span className="status">Online</span>
            </div>
            <div className="chat-messages">
              {(messages[activeChat.id] || []).map((msg, index) => (
                <div key={index} className={`chat-message ${msg.from === 'You' ? 'sent' : 'received'}`}>
                  <div className="message-text">{msg.text}</div>
                  <div className="message-timestamp">{msg.timestamp}</div>
                </div>
              ))}
            </div>
            <form className="chat-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
};

export default DMPage;
