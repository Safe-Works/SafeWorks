export interface HelpRequest {
    title: string;
    description: string;
    contractId?: string;
    user?: {
        email: string;
        name: string;
        id: string;
    }
}