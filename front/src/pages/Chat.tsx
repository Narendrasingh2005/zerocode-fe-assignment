import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchUser from "../components/SearchUser";
import UserDetails from "../components/UserDetails";
import MessageList from "../components/MessageList";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";

const socket = io("http://localhost:4000");

interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

const Chat: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .get("http://localhost:4000/current-user")
      .then((response) => setCurrentUser(response.data))
      .catch((error) => console.error("Error fetching current user:", error));

    socket.on("newMessage", (message: Message) => {
      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some(
          (m) => m.id === message.id && m.createdAt === message.createdAt
        );
        return isDuplicate ? prevMessages : [...prevMessages, message];
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [navigate]);

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    socket.emit("join", { userId: user.id });

    try {
      const response = await axios.get(
        `http://localhost:4000/messages/${user.id}`
      );

      const uniqueMessages = response.data.filter(
        (msg: Message, index: number, self: Message[]) =>
          index ===
          self.findIndex(
            (m) => m.id === msg.id && m.createdAt === msg.createdAt
          )
      );

      setMessages(uniqueMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedUser || !currentUser || content.trim() === "") return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:4000/messages", message);
      socket.emit("sendMessage", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <div className="px-10 mt-5 rounded-lg">
        <div className="flex items-center rounded-t-2xl px-10 gap-36 bg-gradient-to-r from-pink-300 to-purple-300">
          <SearchUser onUserSelect={handleUserSelect} />
          <UserDetails user={selectedUser} />
        </div>

        <ChatHeader user={selectedUser} />

        <div className="rounded-b-3xl bg-gradient-to-r from-purple-300 to-pink-300 overflow-auto h-[60vh]">
          {currentUser && (
            <MessageList messages={messages} currentUser={currentUser} />
          )}
        </div>
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
