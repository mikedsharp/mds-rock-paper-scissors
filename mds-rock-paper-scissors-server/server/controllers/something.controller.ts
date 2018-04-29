import {Path, GET} from "typescript-rest";
import {MyService} from '../services/MyService';
@Path("/something")
export class SomethingController {
  @GET
  async saySomething() {
    return await MyService.getSomething();
  }
}