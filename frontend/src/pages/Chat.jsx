import { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import api from "../services/api";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

const Chat = () => {
  const { tripId } = useParams();
  const { user } = useContext(AuthContext);
  const { socket } = useSocket();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  // 🔽 Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${tripId}`);
        setMessages(res.data);
      } catch {
        toast.error("Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [tripId]);

  // 🔹 Socket events
  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", { tripId });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, tripId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      tripId,
      senderId: user._id,
      message: text,
    });

    setText("");
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-100 flex justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow flex flex-col">

        {/* HEADER */}
        <div className="border-b p-4 font-semibold text-center">
          Trip Chat 💬
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => {
            const isMine = msg.senderId === user._id;

            return (
              <div
                key={index}
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                    isMine
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="border-t p-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
