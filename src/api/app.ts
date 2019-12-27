import * as express from 'express';
import * as morgan from 'morgan';

import { Controller } from '../controllers/controller';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    const logger = morgan('tiny');
    this.app.use(logger);
    this.initializeControllers(controllers);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/api/v1', controller.router);
    });
  }
}

export default App;
