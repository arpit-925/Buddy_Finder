const Message = ({ message }) => {
  return (
    <div className="mb-2 bg-blue-500 text-white px-4 py-2 rounded w-fit">
      {message.message}
    </div>
  );
};

export default Message;
