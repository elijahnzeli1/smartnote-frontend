/**
 * TypeScript type definitions for the Smart Notes application.
 */

export interface User {
    id: number;
    username: string;
    email: string;
    created_at: string;
}

export interface Tag {
    id: number;
    name: string;
    user: number;
    created_at: string;
}

export interface Note {
    id: number;
    user: string;
    title: string;
    content: string;
    summary: string | null;
    tags: Tag[];
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
    tag_ids?: number[];
}

export interface UpdateNoteData {
    title?: string;
    content?: string;
    tag_ids?: number[];
}

export interface SummaryResponse {
    summary: string;
    model: string;
}

export interface ApiError {
    error: string;
    message: string;
    details?: Record<string, unknown>;
}

export type ExportFormat = 'json' | 'csv' | 'markdown';

// Chat types
export interface ChatMessage {
    id: number;
    role: 'user' | 'assistant' | 'system';
    content: string;
    summary?: string | null;
    tokens_used: number;
    created_at: string;
}

export interface Chat {
    id: number;
    user: string;
    title: string;
    summary?: string | null;
    context_summary?: string | null;
    message_count: number;
    created_at: string;
    updated_at: string;
    last_message_at?: string | null;
}

export interface ChatDetail extends Chat {
    messages: ChatMessage[];
}

export interface CreateChatData {
    title: string;
}

export interface AddMessageData {
    content: string;
    role?: 'user' | 'assistant' | 'system';
}

export interface ChatAIRequest {
    message: string;
    use_context?: boolean;
}

export interface ChatAIResponse {
    response: string;
    chat_id: number;
    message_count: number;
}

export interface ChatContext {
    chat_id: number;
    context: Array<{
        role: string;
        content: string;
    }>;
    summary?: string | null;
}

export interface ChatHistory {
    chat_id: number;
    title: string;
    message_count: number;
    messages: Array<{
        id: number;
        role: string;
        content: string;
        summary?: string | null;
        tokens_used: number;
        created_at: string;
    }>;
}

export interface ChatStatistics {
    total_messages: number;
    user_messages: number;
    assistant_messages: number;
    total_tokens: number;
    created_at: string;
    updated_at: string;
    last_message_at?: string | null;
}

export interface ChatSearchResult {
    query: string;
    count: number;
    results: Chat[];
}

