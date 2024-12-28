export default interface INotification {
    id: number;
    userId: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}