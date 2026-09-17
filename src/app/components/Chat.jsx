import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import createSocketConnection from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const normalizeMessage = (message) => {
  const sender = message.senderId;
  return {
    id: String(message._id ?? message.id),
    firstName: sender?.firstName ?? message.firstName,
    senderId: String(sender?._id ?? sender ?? message.senderId),
    text: message.text,
    createdAt: message.createdAt,
  };
};

const Chat = () => {
  const navigate = useNavigate();
  const { connectionId } = useParams();
  const { state } = useLocation();
  const connection = state?.connection;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const fullName = connection
    ? `${connection.firstName} ${connection.lastName}`
    : "Developer";

  const sendMessage = (event) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      connectionId,
      text: trimmedMessage,
    });

    setMessage("");
  };

  useEffect(() => {
    if (!userId || !connectionId) {
      return;
    }

    let isActive = true;
    const socket = createSocketConnection();
    socketRef.current = socket;
    socket.emit("joinChat", {
      connectionId,
    });

    socket.on(
      "receiveMessage",
      ({ firstName, userId: senderId, text, messageId, createdAt }) => {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: messageId ?? `${Date.now()}-${currentMessages.length}`,
            firstName,
            senderId,
            text,
            createdAt,
          },
        ]);
      },
    );

    const fetchChatHistory = async () => {
      try {
        const res = await axios.get(BASE_URL + `/chat/${connectionId}`, {
          withCredentials: true,
        });
        if (!isActive) return;

        const history = (res.data?.messages ?? []).map(normalizeMessage);
        setMessages((currentMessages) => {
          const historyIds = new Set(history.map(({ id }) => id));
          const liveMessages = currentMessages.filter(
            ({ id }) => !historyIds.has(id),
          );
          return [...history, ...liveMessages];
        });
      } catch (error) {
        if (isActive) console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();

    return () => {
      isActive = false;
      socketRef.current = null;
      socket.disconnect();
    };
  }, [userId, connectionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl flex-col px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex h-[calc(100dvh-10rem)] min-h-96 max-h-[70vh] flex-1 flex-col overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-xl shadow-base-content/5">
        <header className="flex items-center gap-3 border-b border-base-content/10 px-4 py-4 sm:px-6">
          <button
            type="button"
            className="btn btn-ghost btn-sm rounded-lg px-2 text-xl"
            aria-label="Back to connections"
            onClick={() => navigate("/connections")}
          >
            &#8592;
          </button>
          {connection?.photoUrl ? (
            <img
              src={connection.photoUrl}
              alt={fullName}
              className="h-11 w-11 rounded-full object-cover object-top"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {fullName.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-base-content">
              {fullName}
            </h1>
            <p className="text-xs text-success">Connected</p>
          </div>
        </header>

        <section
          className="min-h-0 flex-1 overflow-y-auto bg-base-200/40 p-4 sm:p-6"
          aria-live="polite"
        >
          <div className="flex min-h-full flex-col justify-end gap-4">
            {messages.length === 0 ? (
              <div className="m-auto max-w-sm text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
                  &#128172;
                </div>
                <h2 className="text-lg font-bold text-base-content">
                  Start a conversation
                </h2>
                <p className="mt-2 text-sm leading-6 text-base-content/60">
                  Say hello and start building something together.
                </p>
              </div>
            ) : (
              messages.map(({ id, firstName, senderId, text, createdAt }) => {
                const isOwnMessage = String(senderId) === String(userId);
                const senderName = isOwnMessage ? user?.firstName : firstName;
                const avatarUrl = isOwnMessage
                  ? user?.photoUrl
                  : connection?.photoUrl;

                return (
                  <div
                    className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
                    key={id}
                  >
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full bg-base-300">
                        {avatarUrl ? (
                          <img alt={senderName} src={avatarUrl} />
                        ) : (
                          <div className="flex h-10 items-center justify-center font-bold text-primary">
                            {senderName?.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="chat-header">
                      {senderName}
                      <time className="ml-1 text-xs opacity-50">
                        {new Date(createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    <div
                      className={`chat-bubble max-w-[85%] wrap-break-word ${
                        isOwnMessage ? "chat-bubble-primary" : ""
                      }`}
                    >
                      {text}
                    </div>
                    <div className="chat-footer opacity-50">
                      {isOwnMessage ? "Delivered" : "Received"}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </section>

        <form
          className="flex gap-2 border-t border-base-content/10 p-4 sm:p-5"
          onSubmit={sendMessage}
        >
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={`Message ${fullName}`}
            aria-label={`Message ${fullName}`}
            className="input input-bordered min-w-0 flex-1 rounded-xl"
          />
          <button type="submit" className="btn btn-primary rounded-xl px-5">
            Send
          </button>
        </form>
      </div>
      {!connection && (
        <p className="mt-3 text-center text-xs text-base-content/50">
          Conversation ID: {connectionId}
        </p>
      )}
    </main>
  );
};

export default Chat;
