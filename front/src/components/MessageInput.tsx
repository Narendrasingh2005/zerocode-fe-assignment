import React, { useState } from "react";
interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    onSendMessage(message);
    setMessage("");
  };

  return (
    <div className="message-input p-4 flex px-10  ">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border rounded-2xl"
      />
      <button
        onClick={handleSend}
        className="ml-2 p-2 bg-blue-600 text-white rounded-lg"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
