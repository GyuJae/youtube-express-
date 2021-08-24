import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

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
  }

  private initializeControllers(controllers: any[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    mongoose
      .connect("mongodb://127.0.0.1:27017/youtube-express", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
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
