export interface historyentry {
    id: number;
    action: string;
    time : Date;
    user: string;
    details?: string;
}