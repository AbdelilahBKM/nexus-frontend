import IUser from "./User";
import { IQuestion } from "./Post";
export default interface IDiscussion {
    id: number;
    d_Name: string;
    d_Profile: string | null;
    number_of_members: number;
    number_of_active_members: number;
    number_of_posts: number;
    owner: IUser;
    questions: IQuestion[];
    created_at: Date;
    updated_at: Date;
}