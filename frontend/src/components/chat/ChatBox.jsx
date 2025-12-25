// import { useEffect, useState, useContext } from "react";
// import { useSocket } from "../../context/SocketContext";
// import { AuthContext } from "../../context/AuthContext";
// import { fetchMessages } from "../../services/chatApi";
// import Message from "./Message";
// import MessageInput from "./MessageInput";

// const ChatBox = ({ tripId }) => {
//   const { socket } = useSocket();
//   const { user } = useContext(AuthContext);
//   const [messages, setMessages] = useState([]);

//   /* Load previous messages */
//   useEffect(() => {
//     const loadMessages = async () => {
//       const data = await fetchMessages(tripId);
//       setMessages(data);
//     };
//     loadMessages();
//   }, [tripId]);

//   /* Join room + listen */
//   useEffect(() => {
//     if (!socket) return;

//     socket.emit("joinRoom", { tripId });

//     socket.on("receiveMessage", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => socket.off("receiveMessage");
//   }, [socket, tripId]);

//   return (
//     <div className="w-3/4 flex flex-col">
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((msg) => (
//           <Message key={msg._id} message={msg} />
//         ))}
//       </div>

//       <MessageInput tripId={tripId} senderId={user._id} />
//     </div>
//   );
// };

// export default ChatBox;
