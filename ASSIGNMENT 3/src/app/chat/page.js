'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';

// We won't import ChatWindow or MessageBubble, 
// we'll build a simple version right here.

let socket;

// --- Define Styles Inline ---
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    backgroundColor: '#f0f2f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  },
  welcomeMessage: {
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#f44336',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    maxWidth: '800px',
    width: '100%',
    margin: '1rem auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  recipientInput: {
    width: 'calc(100% - 2rem)',
    padding: '1rem',
    margin: '1rem 1rem 0 1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    color: 'Black',
  },
  messagesWindow: {
    flexGrow: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  // --- Message Bubble Styles ---
  messageBubble: {
    maxWidth: '70%',
    padding: '0.6rem 1rem',
    borderRadius: '18px',
    wordWrap: 'break-word',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0070f3',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e4e6eb',
    color: '#050505',
    borderBottomLeftRadius: '4px',
  },
  messageSender: {
    fontWeight: 'bold',
    fontSize: '0.8rem',
    marginBottom: '0.25rem',
    color: '#65676b',
  },
  // --- Input Area Styles ---
  inputArea: {
    display: 'flex',
    padding: '1rem',
    borderTop: '1px solid #ddd',
  },
  textInput: {
    flexGrow: 1,
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '18px',
    marginRight: '0.5rem',
    fontSize: '1rem',
    color: 'Black',
  },
  sendButton: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '18px',
    backgroundColor: '#0070f3',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
  }
};
// ----------------------------


export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  
  const usernameRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref to auto-scroll

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // 1. Handle session
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }
    if (session && session.user.username) {
      usernameRef.current = session.user.username;
    }

    // 3. Initialize Socket.io
    const initSocket = () => { // No longer needs to be async
      if (!usernameRef.current) return;
      if (!socket) {
        
        // --- THIS LINE HAS BEEN REMOVED ---
        // await fetch('/api/socket', { method: 'POST' }); 
        
        // The server is already running, so we just connect.
        socket = io({
          auth: {
            username: usernameRef.current,
          },
          path: '/api/socket_io', // This must match the server's path
        });
        // -----------------------------------------------------

        socket.on('connect', () => {
          console.log(`Connected with socket ID: ${socket.id}`);
        });

        socket.on('receive_message', (message) => {
          // Only add message if it's part of the current conversation
          if (message.sender === recipient) {
             setMessages((prev) => [...prev, message]);
          }
        });
        
        socket.on('connect_error', (err) => {
          console.error('Socket connection error:', err.message);
        });
      }
    };

    initSocket();
    
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [status, session, router, recipient]); // Re-run if recipient changes

  // 4. Fetch chat history when recipient changes
  useEffect(() => {
    if (recipient && usernameRef.current) {
      const fetchHistory = async () => {
        try {
          const res = await fetch(
            `/api/messages?user1=${usernameRef.current}&user2=${recipient}`
          );
          if (!res.ok) {
            // Log error if history fetch fails
            console.error(`Error fetching history: ${res.status}`);
            setMessages([]); // Clear messages on error
            return;
          }
          const history = await res.json();
          setMessages(history);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
      };
      fetchHistory();
    } else {
      setMessages([]); // Clear messages if no recipient
    }
  }, [recipient, usernameRef.current]); // Add usernameRef.current as dependency

  // 5. Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const sendMessage = () => {
    if (!newMessage.trim() || !recipient.trim()) return;

    const message = {
      sender: usernameRef.current,
      receiver: recipient,
      text: newMessage,
      timestamp: new Date().toISOString(), // Add timestamp for UI
    };

    socket.emit('send_message', message);
    
    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  if (status === 'loading') {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={styles.welcomeMessage}>
          Welcome, <strong>{session?.user?.username}</strong>
        </div>
        <button style={styles.logoutButton} onClick={() => signOut()}>
          Logout
        </button>
      </header>
      
      <main style={styles.chatContainer}>
        <input
          style={styles.recipientInput}
          type="text"
          placeholder="Enter recipient's username..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        
        <div style={styles.messagesWindow}>
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              style={{
                ...styles.messageBubble, 
                ...(msg.sender === usernameRef.current ? styles.myMessage : styles.theirMessage)
              }}
            >
              {/* Only show sender name if it's not you */}
              {msg.sender !== usernameRef.current && (
                 <div style={styles.messageSender}>{msg.sender}</div>
              )}
              {msg.text}
            </div>
          ))}
          {/* Empty div to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            style={styles.textInput}
            type="text"
            placeholder={recipient ? `Message ${recipient}...` : "Select a recipient"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={!recipient} // Disable if no recipient
          />
          <button 
            style={styles.sendButton} 
            onClick={sendMessage}
            disabled={!recipient} // Disable if no recipient
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}