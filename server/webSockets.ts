import { Server, Socket as SocketIO } from "socket.io";
import jwt, { VerifyErrors } from "jsonwebtoken";
import HttpServer from "http";

interface IRequest extends SocketIO {
  user_id?: string;
  username?: string;
  msg?: string;
  type?: string;
}
type User = IRequest;

interface JoinRoom {
  user_id: string;
  selectedUser: string;
  from: string;
  content: string;
  to: string;
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
    // this.io.use((socket: IRequest, next: (err?: VerifyErrors) => void) => {
    //     const token: any = socket.handshake.query.token;
    //     if (!token) {
    //         return next();
    //     }
    //     try {
    //         const payload: any = jwt.verify(token, process.env.SECRET || "");
    //         socket.user_id = payload.id;
    //         next();
    //     } catch (error: any) {
    //         next(error);
    //     }
    // });
  }

  private _OnIoConnection() {
    this.io.on("connection", (socket: User) => {
      console.log("socket connected successfully...")
      // joining users for sending and recieving messages
      socket.on("joinRoom", ({ user_id, selectedUser, from }: JoinRoom) => {
        console.log(
          `${from} opened | chat with ${selectedUser} | id: ${user_id}`
        );
        socket.join(user_id);
      });
      // createing a listner to recieve content and send to the desired address
      socket.on("sendMessage", (socket: JoinRoom) => {
        const { from, to, user_id, content } = socket;
        console.log(`${from} sending | sms to -> ${to} | id: ${user_id} | content -> ${content}`)
        this.io.to(user_id).emit('newMessage', {
            from,
            to,
            user_id,
            content
        });
    })
      socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.user_id);
      });
    });
  }
}

export default Io;
