import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import HttpServer from "http";

interface IRequest extends Socket {
  user_id?: string;
  username?: string;
  msg?: string;
  type?: string;
  selectedUser?: string;
  from?: string;
  touser?: string;
  content?: string;
}

interface JoinRoom {
  user_id: string;
  selectedUser: string;
  from: string;
}

class Io {
  private server: HttpServer.Server;
  private io: Server;
  private users: { [key: string]: any };

  constructor(server: HttpServer.Server) {
    this.server = server;
    this.io = new Server(this.server, {
      allowEIO3: false,
      cors: {
        origin: true,
        methods: ["GET", "POST"],
      },
    });
    this.users = {};

    this._initializeIo();
    this._OnIoConnection();
  }

  private _initializeIo() {
    // Setup any initialization logic here
  }

  private _OnIoConnection() {
    this.io.on("connection", (socket: IRequest) => {
      console.log("socket connected successfully...");

      socket.on("joinRoom", ({ user_id, selectedUser, from }: JoinRoom) => {
        console.log(
          `${from} opened | chat with ${selectedUser} | id: ${user_id}`
        );
        socket.join(user_id);
      });

      socket.on("sendMessage", ({ from, touser, user_id, content }) => {
        console.log(
          `${from} sending | sms to -> ${touser} | id: ${user_id} | content -> ${content}`
        );

        // Emit the message to the specified room
        this.io.emit("newMessage", {
          from,
          touser,
          user_id,
          msg: content,
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.user_id);
      });
    });
  }
}

export default Io;
