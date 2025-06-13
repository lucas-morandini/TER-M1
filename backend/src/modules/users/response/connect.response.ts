import { UserDto } from "../dto/user.dto";

export class ConnectResponse {
    access_token: string;
    user: UserDto;
}