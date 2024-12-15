import IDiscussion from "./Discussion";
import IUser from "./User";

export interface IJoining {
    Id: number;
    UserId: string;
    User: IUser;
    DiscussionId: number;
    Discussion: IDiscussion;
    Joined_at: Date;
}