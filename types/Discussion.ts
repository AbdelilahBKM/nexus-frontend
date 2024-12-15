import IUser from "./User";
import { IQuestion } from "./Post";
export default interface IDiscussion {
    Id: number;
    D_Name: string;
    D_Profile: string | null;
    Number_of_members: number;
    Number_of_active_members: number;
    Number_of_posts: number;
    Owner: IUser;
    Questions: IQuestion[];
    Created_at: Date;
    Updated_at: Date;
}