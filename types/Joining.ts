import IDiscussion from "./Discussion";
import IUser from "./User";

export interface IJoining {
    id: number;
    userId: string;
    user: IUser;
    discussionId: number;
    discussion: IDiscussion;
    joined_at: Date;
}