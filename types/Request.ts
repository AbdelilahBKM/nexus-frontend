import IUser from "./User";

export interface Request {
    Id: number;
    Topic: string;
    Description: string;
    User: IUser;
    IsApproved: boolean;
    IsClosed: boolean;
    Created_at: Date;
    Updated_at: Date;
}