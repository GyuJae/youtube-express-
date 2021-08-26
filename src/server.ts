import "dotenv/config";
import App from "./app";
import UserController from "./users/user.controller";
import VideoController from "./videos/video.controller";

const app = new App([new UserController(), new VideoController()], 3000);

app.listen();
