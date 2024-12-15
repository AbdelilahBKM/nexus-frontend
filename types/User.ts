export enum Role {
    Administrator,
    Scholar
}

export default interface IUser {
    Id: string;
    Username: string;
    Email: string;
    UserType: Role;
    ProfilePicture: string | null;
    Bio: string | null;
    IsActive: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}