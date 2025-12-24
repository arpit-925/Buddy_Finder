import { useState } from "react";
import { useSocket } from "../../context/SocketContext";

const MessageInput = ({ tripId, senderId }) => {
  const [text, setText] = useState("");
  const { socket } = useSocket();

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      tripId,
      senderId,
      message: text,
    });

    setText("");
  };

  return (
    <div className="p-4 border-t flex">
      <input
        className="flex-1 border px-3 py-2 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        onClick={sendMessage}
        className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
