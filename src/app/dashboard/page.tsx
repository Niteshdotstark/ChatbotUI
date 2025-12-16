// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import { useDashboard } from './layout'; // Import the hook from layout

export default function DashboardOverviewPage() {
    // Get all the state and components we need from the layout's context
    const {
        tenantCount,
        conversationCount,
        globalKnowledgeCount,
        StatCard,
        isLoading,
        activityLog,
        formatTimeAgo,
    } = useDashboard();

    return (
        <div className="p-4">
            {/* --- Grid of Stat Cards --- */}
            <div className="grid lg:grid-cols-3 gap-8 mb-5">
                <StatCard
                    title="ORGANIZATIONS"
                    value={tenantCount.toString()}
                    bgColor="dotstark-gradient"
                    icon={
                        <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                                clipRule="evenodd"
                            />
                        </svg>
                    }
                />
                <StatCard
                    title="CONVERSATIONS"
                    value={isLoading ? '...' : conversationCount.toString()}
                    bgColor="bg-blue-500"
                    icon={
                        <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 15 20"
                        >
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        </svg>
                    }
                />
                <StatCard
                    title="KNOWLEDGE SOURCES"
                    value={isLoading ? '...' : globalKnowledgeCount.toString()}
                    bgColor="bg-green-500"
                    icon={
                        <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    }
                />
            </div>

            {/* --- Recent Activity Card --- */}
            <div className="bg-white card-hover dotstark-shadow p-5 rounded-3xl">
                <h3 className="text-xl font-nunito font-bold text-gray-900 mb-6 uppercase tracking-wide">
                    RECENT ACTIVITY
                </h3>
                <div className="space-y-4">
                    {isLoading && activityLog.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                            Loading activity...
                        </div>
                    ) : activityLog.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                            No recent activity found.
                        </div>
                    ) : (
                        activityLog.map((activity, index) => (
                            <div
                                key={activity.id}
                                className={`flex items-center justify-between py-3 border-gray-100 ${index < activityLog.length - 1 ? 'border-b' : ''
                                    }`}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className={`w-8 h-8 ${activity.type === 'success'
                                            ? 'bg-green-100'
                                            : activity.type === 'info'
                                                ? 'bg-blue-100'
                                                : 'bg-orange-100'
                                            } rounded-full flex items-center justify-center`}
                                    >
                                        <svg
                                            className={`w-4 h-4 ${activity.type === 'success'
                                                ? 'text-green-600'
                                                : activity.type === 'info'
                                                    ? 'text-blue-600'
                                                    : 'text-orange-600'
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            {activity.type === 'success' && (
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            )}
                                            {activity.type === 'info' && (
                                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                            )}
                                            {activity.type === 'warning' && (
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                    clipRule="evenodd"
                                                />
                                            )}
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-nunito font-semibold text-gray-900">
                                            {activity.title}
                                        </p>
                                        <p className="text-sm text-gray-500">{activity.subtitle}</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-400">
                                    {formatTimeAgo(activity.created_at)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}