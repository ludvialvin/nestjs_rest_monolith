export class AuthResponse {
   statusCode: number;
   status: string;
   access_token: string;
   refresh_token: string;
}

export class AuthCredentials {
   username: string;
   password: string;
}

export class LoginDto {
   email: string;
   password: string;
}

export class LogTokenDto {
   user_id: number;
   access_token: string;
   refresh_token: string;
}
