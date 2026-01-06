import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchChatsBySellerId } from "../Slice/chatSlice";

const Chat = ({ userId }) => {
  const dispatch = useDispatch();
  const { chats, status } = useSelector((state) => state.chats || { chats: [], status: 'idle' });

  useEffect(() => {
    if (userId) dispatch(fetchChatsBySellerId(userId));
  }, [dispatch, userId]);

  // dedupe by itemId + sellerId
  const seen = new Set();
  const unique = [];
  (chats || []).forEach((c) => {
    const key = `${c.itemId}_${c.sellerId}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(c);
    }
  });

  return (
    <div className="container">
      <div className="page-header-row">
        <div className="page-icon">💬</div>
        <div>
          <h3>Chats</h3>
          <p>Unique item conversations for your listings</p>
        </div>
      </div>

      {status === "loading" ? (
        <div>Loading chats...</div>
      ) : unique.length === 0 ? (
        <div>No chats yet.</div>
      ) : (
        <div className="chats-list">
          {unique.map((chat) => {
            const last = chat.messages && chat.messages.length ? chat.messages[chat.messages.length - 1] : null;
            return (
              <Link
                to={`/chats/${chat.itemId}/${chat.clientId}/${chat.sellerId}`}
                className="chat-item"
                key={chat._id}
              >
                <div className="chat-item-left">
                  <div className="chat-item-title">Item: {chat.itemId}</div>
                  <div className="chat-item-sub">Client: {chat.clientId}</div>
                </div>
                <div className="chat-item-right">
                  <div className="chat-item-last">{last ? last.text : "Start conversation"}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Chat;
