import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js"
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

const app = express();

// Proper CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Matches your frontend
    credentials: true,             // Enables cookies/auth
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.listen(8000, () => {
  console.log("server is running!");
});
