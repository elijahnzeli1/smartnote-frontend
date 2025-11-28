/**
 * API client for chat operations.
 */
import client from './client';
import {
    Chat,
    ChatDetail,
    CreateChatData,
    AddMessageData,
    ChatAIRequest,
    ChatAIResponse,
    ChatMessage,
    ChatContext,
    ChatHistory,
    ChatStatistics,
    ChatSearchResult
} from '@/types';

export const chatApi = {
    /**
     * Get all chats for the current user
     */
    async getChats(search?: string): Promise<Chat[]> {
        const params = search ? { search } : {};
        const response = await client.get('/chats/', { params });
        return response.data;
    },

    /**
     * Create a new chat
     */
    async createChat(data: CreateChatData): Promise<Chat> {
        const response = await client.post('/chats/', data);
        return response.data;
    },

    /**
     * Get a specific chat with all messages
     */
    async getChat(id: number): Promise<ChatDetail> {
        const response = await client.get(`/chats/${id}/`);
        return response.data;
    },

    /**
     * Update chat title
     */
    async updateChat(id: number, data: Partial<CreateChatData>): Promise<Chat> {
        const response = await client.patch(`/chats/${id}/`, data);
        return response.data;
    },

    /**
     * Delete a chat
     */
    async deleteChat(id: number): Promise<void> {
        await client.delete(`/chats/${id}/`);
    },

    /**
     * Add a message to the chat (without AI response)
     */
    async addMessage(chatId: number, data: AddMessageData): Promise<ChatMessage> {
        const response = await client.post(`/chats/${chatId}/add_message/`, data);
        return response.data;
    },

    /**
     * Send a message and get AI response with full context
     * This is the main chat endpoint
     */
    async sendMessageAndGetAIResponse(
        chatId: number,
        data: ChatAIRequest
    ): Promise<ChatAIResponse> {
        const response = await client.post(`/chats/${chatId}/ai_response/`, data);
        return response.data;
    },

    /**
     * Generate/update the chat summary
     */
    async updateSummary(chatId: number): Promise<ChatDetail> {
        const response = await client.post(`/chats/${chatId}/update_summary/`);
        return response.data;
    },

    /**
     * Get the context that will be sent to AI
     */
    async getContext(chatId: number): Promise<ChatContext> {
        const response = await client.get(`/chats/${chatId}/context/`);
        return response.data;
    },

    /**
     * Get the complete chat history (all messages)
     */
    async getHistory(chatId: number): Promise<ChatHistory> {
        const response = await client.get(`/chats/${chatId}/history/`);
        return response.data;
    },

    /**
     * Get chat statistics
     */
    async getStatistics(chatId: number): Promise<ChatStatistics> {
        const response = await client.get(`/chats/${chatId}/statistics/`);
        return response.data;
    },

    /**
     * Search chats by content
     */
    async searchChats(query: string): Promise<ChatSearchResult> {
        const response = await client.get('/chats/search/', {
            params: { q: query }
        });
        return response.data;
    }
};

export default chatApi;
