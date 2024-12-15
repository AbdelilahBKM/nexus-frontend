enum VoteType {
    Positive,
    Negative
}
export default interface Vote {
    Id: number;
    UserId: string;
    PostId: number;
    VoteType: VoteType;
    CreatedAt: Date;
    UpdatedAt: Date;
}