import {Path, GET} from "typescript-rest";
 
@Path("/something")
export class SomethingController {
  @GET
  saySomething() {
    return "something...";
  }
}