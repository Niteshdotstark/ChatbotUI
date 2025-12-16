// src/app/dashboard/organizations/page.tsx
'use client';

import React from 'react';
import { useDashboard } from '../layout'; // Import from the new layout

export default function OrganizationsPage() {
    const {
        tenants,
        handleOpenCreateTenantForm,
        isLoading,
        planType,
        activeTenant,
        setActiveTenant,
        handleOpenEditTenantForm,
    } = useDashboard();

    return (
        <div className="p-2 sm:p-4">
            {/* Replaced d-flex with flex and adjusted alignment for mobile */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-xl sm:text-2xl font-nunito font-bold text-gray-900 uppercase tracking-wide mb-2 sm:mb-0">
                    YOUR ORGANIZATIONS
                </h3>
                <button
                    onClick={handleOpenCreateTenantForm}
                    // Replaced d-flex with flex
                    className="dotstark-gradient text-white px-3 py-2 sm:py-3 pill-button font-nunito font-bold flex items-center shadow-md text-sm"
                    disabled={isLoading || planType === 'expired'}
                >
                    <svg className="w-4 h-4 me-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    NEW ORGANIZATION
                </button>
            </div>

            {isLoading && tenants.length === 0 ? (
                <div className="flex justify-center py-4">
                    <div className="animate-slow-spin rounded-full h-8 w-8 border-top-2 border-bottom-2 border-dotstark-primary"></div>
                </div>
            ) : tenants.length === 0 ? (
                <div className="text-center py-5 bg-white card-hover dotstark-shadow rounded-3">
                    <p className="text-gray-500">
                        Create your first organization to begin managing knowledge bases.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                    {tenants.map((tenant) => (
                        <div
                            key={tenant.id}
                            className={`bg-white card-hover dotstark-shadow p-3 sm:p-4 rounded-3 cursor-pointer transition-all ${activeTenant === tenant.id
                                ? 'border-2 border-dotstark-primary'
                                : 'border border-gray-100'
                                }`}
                            onClick={() => setActiveTenant(tenant.id)}
                        >
                            {/* Replaced d-flex with flex */}
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <div>
                                    <h3
                                        className={`text-lg sm:text-xl font-nunito font-bold ${activeTenant === tenant.id
                                            ? 'text-dotstark-primary'
                                            : 'text-gray-900'
                                            } mb-1 sm:mb-2`}
                                    >
                                        {tenant.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                                        Created: {new Date(tenant.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                {activeTenant === tenant.id ? (
                                    <span className="bg-green-100 text-green-800 text-xs font-nunito font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-full uppercase tracking-wider">
                                        ACTIVE
                                    </span>
                                ) : (
                                    <span className="bg-gray-100 text-gray-500 text-xs font-nunito font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-full uppercase tracking-wider">
                                        INACTIVE
                                    </span>
                                )}
                            </div>
                            {/* Replaced d-flex with flex and adjusted layout for mobile stacking */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-100 pt-3 sm:pt-4">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium mb-2 sm:mb-0">
                                    <p className="mb-0">
                                        ID: {tenant.id} • {tenant.knowledge_item_count} sources •{' '}
                                        {tenant.conversation_count} conversations
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEditTenantForm(tenant);
                                    }}
                                    className="dotstark-gradient text-white px-3 py-2 mt-0 sm:mt-0 pill-button font-nunito font-bold text-xs sm:text-sm shadow-md"
                                    disabled={planType === 'expired'}
                                >
                                    EDIT
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}