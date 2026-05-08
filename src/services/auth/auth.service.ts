import { StatusCode } from "../../constants/statusCode.constant";
import ServerDataSource from "../../configs/db.config";
import { User } from "../../entities/user.entity";
import { Auth } from "../../entities/auth.entity";
import { hash, compare } from "../../utils/hash";

export class AuthService {
  private userRepository = ServerDataSource.getRepository(User);
  private authRepository = ServerDataSource.getRepository(Auth);


}