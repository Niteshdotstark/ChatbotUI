// src/app/dashboard/chat/page.tsx
'use client';

import React from 'react';
import { useDashboard } from '../layout';

export default function ChatPage() {
    const {
        chatError,
        tenants,
        activeTenant,
        chatMessages,
        chatMessagesEndRef,
        chatInputMessage,
        setChatInputMessage,
        handleChatKeyPress,
        isChatLoading,
        handleSendChatMessage,
    } = useDashboard();

    // Find the currently active tenant object from the list
    const currentTenant = tenants.find((t) => t.id === activeTenant);

    return (
        // Changed to a full-height flex column
        <div className="p-2 sm:p-4 flex flex-col h-full">
            {/* Display chat-specific errors */}
            {chatError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
                    {chatError}
                </div>
            )}

            {/* Display active tenant name - MODIFIED: Cleaner Look */}
            <div className="mb-3 sm:mb-4">
                <p className="text-sm font-nunito font-bold text-gray-700 uppercase tracking-wide">
                    Chatting with:
                    <span className="ml-2 font-bold text-dotstark-primary">
                        {currentTenant ? currentTenant.name : 'Please Select Organization'}
                    </span>
                </p>
            </div>

            <div className="bg-white rounded-3xl dotstark-shadow p-3 sm:p-4 flex flex-col flex-1 min-h-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
                    {chatMessages.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10 sm:mt-20 text-sm">
                            {activeTenant
                                ? 'Start a conversation by typing a message below'
                                : 'Please select an organization to start chatting.'}
                        </div>
                    ) : (
                        chatMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start' 
                                    } my-5`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-lg ${message.isUser
                                        ? 'dotstark-gradient text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    <p style={{ whiteSpace: 'pre-wrap' }} className="text-sm sm:text-base">{message.text}</p>
                                    {message.sources && message.sources.length > 0 && (
                                        <div className="mt-2 text-xs sm:text-sm">
                                            <p className="font-semibold">Sources:</p>
                                            <ul className="list-disc pl-4">
                                                {message.sources.map((source, index) => (
                                                    <li key={index}>
                                                        <a
                                                            href={source}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 hover:underline"
                                                        >
                                                            {source}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <p className="text-xs mt-1 opacity-75">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={chatMessagesEndRef} />
                </div>

                {/* Input Area - MODIFIED: Interactive Design with button inside */}
                <div className="border-top pt-3 sm:pt-4">
                    {/* Replaced d-flex with flex and updated button position/size */}
                    <div className="relative w-full flex items-end gap-2 align-items-center">
                        <textarea
                            value={chatInputMessage}
                            onChange={(e) => setChatInputMessage(e.target.value)}
                            onKeyPress={handleChatKeyPress}
                            placeholder={
                                activeTenant
                                    ? 'Type your message...'
                                    : 'Select an organization'
                            }
                            className="form-control flex-grow w-full pl-4 pr-12 sm:pr-20 py-3 fs-6 fw-medium rounded-4 custom-focus-orange"
                            rows={1}
                            style={{ minHeight: '50px', resize: 'none' }}
                            disabled={isChatLoading || activeTenant === null}
                        />
                        <button
                            onClick={handleSendChatMessage}
                            className="dotstark-gradient  text-white h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-transform hover:scale-105 flex-shrink-0"
                            disabled={
                                isChatLoading ||
                                !chatInputMessage.trim() ||
                                activeTenant === null
                            }
                        >
                            {isChatLoading ? (
                                <div className="animate-slow-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}