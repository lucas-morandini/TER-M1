import { UserDto } from "../dto/user.dto";

export class RegisterResponse {
    access_token: string;
    user: UserDto;
}