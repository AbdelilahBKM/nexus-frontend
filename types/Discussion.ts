import IUser from "./User";
import { IQuestion } from "./Post";
import { IJoining } from "./Joining";

export default interface IDiscussion {
    id: number;
    d_Name: string;
    d_Profile: string | null;
    number_of_members: number;
    number_of_active_members: number;
    number_of_posts: number;
    owner: IUser;
    questions: IQuestion[];
    joinings: IJoining[];
    created_at: Date;
    updated_at: Date;
}