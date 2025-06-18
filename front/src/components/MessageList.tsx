import React from "react";

interface Message {
  id: string; // Unique identifier for each message
  content: string; // The content of the message
  senderId: string; // ID of the user who sent the message
  timestamp?: string; // Timestamp for the message
}

interface MessageListProps {
  messages: Message[];
  currentUser: { id: string }; // Current user object with an ID
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  return (
    <div className=" h-96  mt-52">
      <div className="message-container flex-1 p-4 ">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat ${
              msg.senderId === currentUser.id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-bubble">{msg.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
