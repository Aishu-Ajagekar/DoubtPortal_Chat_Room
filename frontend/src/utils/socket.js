import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_API_URL, {
  
  autoConnect: false,
}); // Make sure backend is running
export default socket;
