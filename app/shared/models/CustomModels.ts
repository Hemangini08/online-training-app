export interface User {
    CityId :number;
    FullName:string;
    UserName :string;
    UserId:number;
    Token: string;
    RefreshToken:string;
    TokenExpirationTime:Date;
    LoginTimeSpan:number;
}