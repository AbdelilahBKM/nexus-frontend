import IDiscussion from "./Discussion";
import IUser from "./User";
import Vote from "./Vote";

interface IPost {
    id: number;
    title: string;
    content: string;
    postedAt: Date;
    updatedAt: Date;
    postedBy: IUser;
    isClosed: boolean;
    reputation: number;
    votes: Vote[];
    created_at: Date;
    updated_at: Date;
}

export interface IQuestion extends IPost {
    discussionId: number;
    discussion: IDiscussion | null;
    answers: IAnswer[];
    isAnswered: boolean;
}

export interface IAnswer extends IPost {
    answerId: number | null;
    questionId: number | null;
    question: IQuestion | null;
    answerTo: IAnswer | null;
    isBestAnswer: boolean;
    replies: IAnswer[];
}