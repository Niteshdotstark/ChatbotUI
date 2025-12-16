// src/app/dashboard/knowledge/page.tsx
'use client';

import React from 'react';
import { useDashboard } from '../layout';

export default function KnowledgePage() {
    const {
        activeTenant,
        tenants,
        newUrl,
        setNewUrl,
        setCategory,
        isLoading,
        planType,
        handleAddItem,
        handleDeleteItem,
        category,
        setError,
        selectedFiles,
        handleFileChange,
        handleRemoveFile,
        formatFileSize,
        knowledgeBaseItems,
        getSourceIcon,
    } = useDashboard();

    return (
        <div className="p-2 sm:p-4">

            {isLoading && (
                <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
                    <div className="animate-slow-spin rounded-full h-16 w-16 border-4 border-t-4 border-dotstark-primary border-t-transparent mb-4"></div>
                    <h3 className="text-2xl fw-bold text-dark mb-2 nunito-font uppercase">
                        Processing Upload...
                    </h3>
                    <p className="text-gray-600 font-medium">
                        Please wait while your knowledge sources are indexed.
                    </p>
                    {/* Optionally display file count */}
                    {selectedFiles.length > 0 && category === 'file' && (
                        <p className="text-sm text-dotstark-primary mt-2">
                            Uploading {selectedFiles.length} file(s)...
                        </p>
                    )}
                </div>
            )}

            <div className="bg-white card-hover dotstark-shadow p-3 sm:p-4 mb-4 rounded-3">
                <h3 className="fw-bold text-dark mb-4 text-lg sm:text-xl text-uppercase custom-tracking nunito-font">
                    ADD KNOWLEDGE SOURCE
                    {activeTenant && (
                        <span className="text-xs text-gray-500 font-normal ml-2">
                            (
                            {tenants.find((t) => t.id === activeTenant)?.name ||
                                'Selected Organization'}
                            )
                        </span>
                    )}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* URL Input */}
                    <div className="space-y-4">
                        <label className="block text-sm font-nunito font-bold text-gray-700 uppercase tracking-wide">
                            WEBSITE URL
                        </label>
                        <input
                            type="url"
                            id="url-input"
                            placeholder="https://example.com/docs"
                            value={newUrl}
                            onChange={(e) => {
                                setNewUrl(e.target.value);
                                setCategory('url');
                            }}
                            className="form-control w-full px-3 py-2 sm:px-4 sm:py-3 fs-6 fw-medium rounded-4 custom-focus-orange"
                            disabled={isLoading || planType === 'expired'}
                        />
                        <button
                            onClick={handleAddItem}
                            className="w-full dotstark-gradient text-white my-3 py-3 pill-button font-nunito font-bold text-sm shadow-md"
                            disabled={
                                isLoading ||
                                !activeTenant ||
                                !newUrl.trim() ||
                                category !== 'url' ||
                                planType === 'expired'
                            }
                        >
                            ADD URL
                        </button>
                        {category !== 'url' && <div className="h-[46px]"></div>}
                    </div>

                    {/* File Upload */}
                    <div className="space-y-4">
                        <label className="block text-sm font-nunito font-bold text-gray-700 uppercase tracking-wide">
                            UPLOAD FILES
                        </label>

                        {/* Dropzone */}
                        <div
                            className={`p-3 text-center cursor-pointer custom-dashed-border rounded-4 hover-orange-border transition ${category === 'file'
                                ? 'border-orange-500'
                                : 'hover:border-orange-500'
                                }`}
                            onClick={() => {
                                if (planType !== 'expired' && !isLoading) {
                                    document.getElementById('file-input')?.click();
                                    setCategory('file');
                                } else if (isLoading) {
                                    setError('Upload currently processing. Please wait.');
                                } else {
                                    setError(
                                        'Your plan is expired. Please upgrade to add new knowledge sources.',
                                    );
                                }
                            }}
                            style={{
                                cursor: (planType === 'expired' || isLoading) ? 'not-allowed' : 'pointer',
                                opacity: (planType === 'expired' || isLoading) ? 0.6 : 1,
                            }}
                        >
                            <svg
                                className="w-8 h-8 text-gray-400 mx-auto mb-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-sm text-gray-600 font-nunito font-semibold">
                                {selectedFiles && selectedFiles.length > 0
                                    ? 'Click to add more files'
                                    : 'Click to upload PDF, TXT, or DOC files'}
                            </p>
                            <p className="text-xs text-gray-400">Max file size: 10MB</p>
                        </div>

                        <input
                            type="file"
                            id="file-input"
                            accept=".pdf,.txt,.doc,.docx,.csv,.xml"
                            className="hidden"
                            onChange={handleFileChange}
                            multiple // Enabled multiple selection
                            disabled={planType === 'expired' || isLoading}
                        />

                        {/* Selected Files Stack (NotebookLM Style) - Matches your theme */}
                        {selectedFiles && selectedFiles.length > 0 && category === 'file' ? (
                            <div className="animate-slide-up">
                                {/* Header for the stack */}
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                        {selectedFiles.length} FILES SELECTED
                                    </span>
                                </div>

                                {/* Scrollable List */}
                                <div className="custom-scrollbar pr-2 mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            // Replaced d-flex with flex
                                            className="bg-gray-50 rounded-4 p-2 sm:p-3 mb-2 border border-gray-200 flex justify-between items-center"
                                        >
                                            {/* Replaced d-flex with flex */}
                                            <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-nunito font-semibold text-gray-900 text-sm text-truncate mb-0">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mb-0">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-200"
                                                title="Remove file"
                                                disabled={isLoading}
                                            >
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Upload All Button - Disabled when loading */}
                                <button
                                    onClick={handleAddItem}
                                    className="w-full dotstark-gradient text-white py-3 pill-button font-nunito font-bold text-sm shadow-md"
                                    disabled={isLoading || !activeTenant || selectedFiles.length === 0}
                                >
                                    {isLoading ? 'UPLOADING...' : `UPLOAD ${selectedFiles.length} FILES`}
                                </button>
                            </div>
                        ) : (
                            // Spacer to align with URL section when empty
                            category !== 'file' && <div className="h-[46px]"></div>
                        )}
                    </div>
                </div>
            </div>

            {/* Current Sources List - (Design Unchanged, added scrolling support) */}
            <h3 className="text-lg sm:text-xl font-nunito font-bold text-gray-900 mb-4 sm:mb-6 uppercase tracking-wide px-2 sm:px-4">
                CURRENT SOURCES ({knowledgeBaseItems.length})
            </h3>

            {/* Added max-height and overflow to prevent page growing indefinitely */}
            <div className="custom-scrollbar" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {isLoading && knowledgeBaseItems.length === 0 && activeTenant ? (
                    <div className="flex justify-center py-4">
                        <div className="animate-slow-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dotstark-primary"></div>
                    </div>
                ) : knowledgeBaseItems.length === 0 ? (
                    <div className="text-center py-5 bg-white card-hover dotstark-shadow rounded-3xl mx-2 sm:mx-4">
                        <p className="text-gray-500">
                            No knowledge sources found for this organization. Add one above!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4 px-2 sm:px-4 pb-4">
                        {knowledgeBaseItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white card-hover dotstark-shadow p-3 sm:p-5 my-2 flex items-center justify-between rounded-3xl"
                            >
                                {/* Replaced d-flex with flex */}
                                <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        {getSourceIcon(item)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-nunito font-bold text-gray-900 text-sm sm:text-lg text-truncate mb-0 sm:mb-1">
                                            {item.url || item.filename || 'Untitled Source'}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500 font-medium mb-0">
                                            Added: {new Date(item.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {/* Replaced d-flex with flex */}
                                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                    <span className="bg-green-100 text-green-800 text-xs font-nunito font-bold px-2 py-1 rounded-full uppercase tracking-wide hidden md:inline-block">
                                        SYNCED
                                    </span>
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-1 sm:p-2"
                                        disabled={isLoading || planType === 'expired'}
                                        title="Delete Item"
                                    >
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}