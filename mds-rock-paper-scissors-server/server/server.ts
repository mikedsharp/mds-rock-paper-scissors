import * as express from "express";
import {Server, Path, GET, PathParam} from "typescript-rest";
import {SomethingController} from './controllers/something.controller';
 
@Path("/hello")
class HelloService {
  @Path(":name")
  @GET
  sayHello( @PathParam('name') name: string): string {
    return "Hello " + name;
  }
}
 
let app: express.Application = express();
Server.buildServices(app, SomethingController);
 
app.listen(3000, function() {
  console.log('Rest Server listening on port 3000!');
});
 