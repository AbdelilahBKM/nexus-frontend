import IUser from "./User";
import Vote from "./Vote";

interface IPost {
    Id: number;
    Title: string;
    Content: string;
    PostedAt: Date;
    UpdatedAt: Date;
    PostedBy: IUser;
    isClosed: boolean;
    Reputation: number;
    Votes: Vote[];
    Created_at: Date;
    Updated_at: Date;
}

export interface IQuestion extends IPost {
    DiscussionId: number;
    Answers: IAnswer[];
}

export interface IAnswer extends IPost {
    AnswerId: number | null;
    QuestionId: number | null;
    Question: IQuestion | null;
    AnswerTo: IAnswer | null;
    IsBestAnswer: boolean;
    Replies: IAnswer[];
}