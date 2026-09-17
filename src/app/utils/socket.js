import io from "socket.io-client";
import { BASE_URL } from "../utils/constants";

const createSocketConnection = () => {
  return io(BASE_URL, { withCredentials: true });
};

export default createSocketConnection;
