
export enum Role {
    Administrator,
    Scholar
}

export default interface IUser {
    id: string;
    userName: string;
    email: string;
    userType: Role;
    profilePicture: string | null;
    bio: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}