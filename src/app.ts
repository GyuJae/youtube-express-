import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: any[], port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  private initializeControllers(controllers: any[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  // useNewUrlParser: true,
  // useUnifiedTopology: true,

  public listen() {
    mongoose
      .connect("mongodb://127.0.0.1:27017/youtube-express")
      .then(() => {
        this.app.listen(this.port, () => {
          console.log(
            `App listening on the port http://localhost:${this.port}`
          );
        });
      })
      .catch((e) => console.log(e));
  }
}

export default App;
