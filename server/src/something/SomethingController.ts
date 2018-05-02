import {Path, GET} from "typescript-rest";
import {SomethingService} from '../something/services/SomethingService';
@Path("/something")
export class SomethingController {
  @GET
  async saySomething() {
    return await SomethingService.getSomething();
  }
}