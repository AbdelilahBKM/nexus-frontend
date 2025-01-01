enum VoteType {
    Positive,
    Negative
}
export default interface IVote {
    id?: number;
    userId: string;
    postId: number;
    voteType: VoteType;
    createdAt?: Date;
    updatedAt?: Date;
}