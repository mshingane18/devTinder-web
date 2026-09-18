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
    status: message.readAt
      ? "read"
      : message.deliveredAt
        ? "delivered"
        : "sent",
  };
};

const formatLastSeen = (lastSeenAt) => {
  const lastSeenDate = new Date(lastSeenAt);
  if (Number.isNaN(lastSeenDate.getTime())) return "Offline";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const seenDay = new Date(
    lastSeenDate.getFullYear(),
    lastSeenDate.getMonth(),
    lastSeenDate.getDate(),
  );
  const daysAgo = Math.round((today - seenDay) / 86400000);
  const time = lastSeenDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (daysAgo === 0) return `today at ${time}`;
  if (daysAgo === 1) return `yesterday at ${time}`;
  if (daysAgo > 1 && daysAgo < 7) {
    return `${lastSeenDate.toLocaleDateString([], { weekday: "long" })} at ${time}`;
  }

  return `${lastSeenDate.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} at ${time}`;
};

const Chat = () => {
  const navigate = useNavigate();
  const { connectionId } = useParams();
  const { state } = useLocation();
  const connection = state?.connection;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeenAt, setLastSeenAt] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const shouldScrollRef = useRef(true);

  const fullName = connection
    ? `${connection.firstName} ${connection.lastName}`
    : "Developer";

  const handleMessagesScroll = async (event) => {
    const container = event.currentTarget;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    shouldScrollRef.current = distanceFromBottom < 120;

    if (!hasMoreMessages || isLoadingOlder || container.scrollTop > 10) return;

    const oldestMessage = messages[0];
    if (!oldestMessage?.createdAt) return;

    setIsLoadingOlder(true);
    const previousHeight = container.scrollHeight;
    try {
      const res = await axios.get(
        `${BASE_URL}/chat/${connectionId}?limit=30&before=${encodeURIComponent(oldestMessage.createdAt)}`,
        { withCredentials: true },
      );
      const olderMessages = (res.data?.messages ?? []).map(normalizeMessage);
      setMessages((currentMessages) => {
        const currentIds = new Set(currentMessages.map(({ id }) => id));
        return [
          ...olderMessages.filter(({ id }) => !currentIds.has(id)),
          ...currentMessages,
        ];
      });
      setHasMoreMessages(Boolean(res.data?.pagination?.hasMore));
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight - previousHeight;
      });
    } catch (error) {
      console.error("Error loading older messages:", error);
    } finally {
      setIsLoadingOlder(false);
    }
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !socketRef.current) return;
    const clientMessageId = `client-${Date.now()}`;

    shouldScrollRef.current = true;
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: clientMessageId,
        clientMessageId,
        firstName: user?.firstName,
        senderId: userId,
        text: trimmedMessage,
        createdAt: new Date().toISOString(),
        status: "sending",
      },
    ]);

    socketRef.current.emit("sendMessage", {
      connectionId,
      text: trimmedMessage,
      clientMessageId,
    });

    setMessage("");
    socketRef.current.emit("stopTyping", { connectionId });
  };

  const handleMessageChange = (event) => {
    const nextMessage = event.target.value;
    setMessage(nextMessage);
    if (!socketRef.current?.connected) return;

    socketRef.current.emit("typing", { connectionId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stopTyping", { connectionId });
    }, 1200);
  };

  useEffect(() => {
    if (!userId || !connectionId) {
      return;
    }

    let isActive = true;
    const socket = createSocketConnection();
    socketRef.current = socket;
    const joinChat = () => {
      setIsSocketConnected(true);
      socket.emit("joinChat", { connectionId });
      if (!document.hidden) {
        socket.emit("markRead", { connectionId });
      }
    };

    socket.on("connect", joinChat);
    socket.on("disconnect", () => setIsSocketConnected(false));
    socket.on("presence", ({ userId: presentUserId, online, lastSeenAt }) => {
      if (String(presentUserId) !== String(connectionId)) return;
      setIsOnline(online);
      setLastSeenAt(lastSeenAt);
    });
    socket.on("typing", ({ userId: typingUserId, firstName }) => {
      if (String(typingUserId) === String(connectionId)) {
        setIsOnline(true);
        setLastSeenAt(null);
        setTypingUser(firstName);
      }
    });
    socket.on("stopTyping", ({ userId: typingUserId }) => {
      if (String(typingUserId) === String(connectionId)) setTypingUser("");
    });

    socket.on(
      "receiveMessage",
      ({
        firstName,
        userId: senderId,
        text,
        messageId,
        clientMessageId,
        createdAt,
        status,
      }) => {
        const isOwnMessage = String(senderId) === String(userId);
        const container = messagesContainerRef.current;
        const isNearBottom = container
          ? container.scrollHeight -
              container.scrollTop -
              container.clientHeight <
            120
          : true;
        if (isNearBottom) shouldScrollRef.current = true;
        if (!isOwnMessage && !document.hidden) {
          socket.emit("markRead", { connectionId });
        } else if (!isOwnMessage) {
          setUnreadCount((count) => count + 1);
        }

        setMessages((currentMessages) => {
          const existingIndex = currentMessages.findIndex(
            (currentMessage) =>
              currentMessage.id === messageId ||
              (clientMessageId &&
                currentMessage.clientMessageId === clientMessageId),
          );
          const receivedMessage = {
            id: messageId ?? clientMessageId ?? `${Date.now()}`,
            clientMessageId,
            firstName,
            senderId,
            text,
            createdAt,
            status: status ?? "delivered",
          };
          if (existingIndex < 0) return [...currentMessages, receivedMessage];
          return currentMessages.map((currentMessage, index) =>
            index === existingIndex ? receivedMessage : currentMessage,
          );
        });
      },
    );
    socket.on("messageStatus", ({ messageIds, status }) => {
      const ids = new Set(messageIds);
      setMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          ids.has(currentMessage.id)
            ? { ...currentMessage, status }
            : currentMessage,
        ),
      );
    });

    const fetchChatHistory = async () => {
      try {
        const res = await axios.get(BASE_URL + `/chat/${connectionId}`, {
          withCredentials: true,
        });
        if (!isActive) return;

        const history = (res.data?.messages ?? []).map(normalizeMessage);
        shouldScrollRef.current = true;
        setMessages((currentMessages) => {
          const historyIds = new Set(history.map(({ id }) => id));
          const liveMessages = currentMessages.filter(
            ({ id }) => !historyIds.has(id),
          );
          return [...history, ...liveMessages];
        });
        setHasMoreMessages(Boolean(res.data?.pagination?.hasMore));
        setUnreadCount(res.data?.unreadCount ?? 0);
      } catch (error) {
        if (isActive) console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();

    return () => {
      isActive = false;
      clearTimeout(typingTimeoutRef.current);
      socket.off();
      socketRef.current = null;
      socket.disconnect();
    };
  }, [userId, connectionId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && socketRef.current?.connected) {
        socketRef.current.emit("markRead", { connectionId });
        setUnreadCount(0);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [connectionId]);

  useEffect(() => {
    if (!shouldScrollRef.current && !typingUser) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    shouldScrollRef.current = false;
  }, [messages, typingUser]);

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
            <p
              className={`text-xs ${isOnline ? "text-success" : "text-base-content/50"}`}
            >
              {isSocketConnected
                ? isOnline
                  ? "Online"
                  : lastSeenAt
                    ? `Last seen ${formatLastSeen(lastSeenAt)}`
                    : "Offline"
                : "Reconnecting..."}
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="badge badge-primary ml-auto">
              {unreadCount} unread
            </span>
          )}
        </header>

        <section
          className="min-h-0 flex-1 overflow-y-auto bg-base-200/40 p-4 sm:p-6"
          aria-live="polite"
          onScroll={handleMessagesScroll}
          ref={messagesContainerRef}
        >
          <div className="flex min-h-full flex-col justify-end gap-4">
            {isLoadingOlder && (
              <div className="text-center text-xs text-base-content/50">
                Loading older messages...
              </div>
            )}
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
              messages.map(
                ({ id, firstName, senderId, text, createdAt, status }) => {
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
                        {isOwnMessage
                          ? status === "read"
                            ? "Read"
                            : status === "delivered"
                              ? "Delivered"
                              : status === "sending"
                                ? "Sending..."
                                : "Sent"
                          : "Received"}
                      </div>
                    </div>
                  );
                },
              )
            )}
            {typingUser && (
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-neutral">
                  {typingUser} is typing...
                </div>
              </div>
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
            onChange={handleMessageChange}
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
