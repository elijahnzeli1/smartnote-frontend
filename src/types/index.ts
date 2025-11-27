/**
 * TypeScript type definitions for the Smart Notes application.
 */

export interface User {
    id: number;
    username: string;
    email: string;
    created_at: string;
}

export interface Note {
    id: number;
    user: string;
    title: string;
    content: string;
    summary: string | null;
    created_at: string;
    updated_at: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
    user: User;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface CreateNoteData {
    title: string;
    content: string;
    auto_summarize?: boolean;
}

export interface UpdateNoteData {
    title?: string;
    content?: string;
}

export interface SummaryResponse {
    summary: string;
    model: string;
}

export interface ApiError {
    error: string;
    message: string;
    details?: any;
}
