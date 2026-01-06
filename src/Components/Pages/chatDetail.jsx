import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchChatByItemClientSeller, createChat } from "../Slice/chatSlice";

const ChatDetail = ({ userId }) => {
  const { itemId, clientId, sellerId } = useParams();
  const dispatch = useDispatch();
  const { chat, status } = useSelector((state) => state.chats || { chat: null, status: 'idle' });
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (itemId && clientId && sellerId) {
      dispatch(fetchChatByItemClientSeller({ itemId, clientId, sellerId }));
    }
  }, [dispatch, itemId, clientId, sellerId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await dispatch(createChat({ itemId, clientId, sellerId, message: message.trim(), senderId: userId }));
    setMessage("");
    // refetch to pick up appended messages
    dispatch(fetchChatByItemClientSeller({ itemId, clientId, sellerId }));
  };

  return (
    <div className="container">
      <div className="page-header-row">
        <div className="page-icon">💬</div>
        <div>
          <h3>Conversation</h3>
          <p>Item: {itemId} • Client: {clientId}</p>
        </div>
      </div>

      <div className="chat-detail">
        <div className="messages" ref={scrollRef}>
          {status === "loading" ? (
            <div>Loading...</div>
          ) : chat && chat.messages && chat.messages.length ? (
            chat.messages.map((m, idx) => (
              <div
                key={idx}
                className={`message ${m.senderId === userId ? "sent" : "received"}`}
              >
                <div className="message-text">{m.text}</div>
              </div>
            ))
          ) : (
            <div className="empty-chat">No messages yet. Start the conversation below.</div>
          )}
        </div>

        <div className="chat-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button className="btn primary" onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
