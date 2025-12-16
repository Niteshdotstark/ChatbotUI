// src/app/dashboard/layout.tsx
'use client';

// Import all necessary React hooks and types
import React, {
    useState,
    useEffect,
    useMemo,
    JSX,
    useRef,
    createContext,
    useContext,
    ReactNode,
    Dispatch,
    SetStateAction,
} from 'react';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

// --- INTERFACES & TYPES ---
interface Tenant {
    id: number;
    name: string;
    created_at: string;
    fb_url?: string | null;
    insta_url?: string | null;
    fb_verify_token?: string | null;
    fb_access_token?: string | null;
    insta_access_token?: string | null;
    telegram_bot_token?: string | null;
    telegram_chat_id?: string | null;
    knowledge_item_count: number;
    conversation_count: number;
}

interface KnowledgeBaseItem {
    id: string;
    filename?: string;
    file_type?: string;
    url?: string;
    category?: string;
    tenant_id: number;
    uploaded_by: number;
    created_at: string;
}

interface ActivityItem {
    id: string;
    title: string;
    subtitle: string;
    created_at: string;
    type: 'info' | 'success' | 'warning' | string;
}

interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: string;
    sources?: string[];
}

interface ApiError {
    response?: {
        data?: {
            detail?: string;
        };
    };
    message?: string;
}

// --- CONFIGURATION ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.232.253.1/';
const APP_TITLE = 'RAG CHAT';

// --- CUSTOM STYLES ---
const customStyles = `
  .letter-spacing-wide {
    letter-spacing: 0.1em;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-slow-spin {
    animation: spin 3s linear infinite;
  }
  .nav-item.active {
    background-color: rgba(255, 107, 53, 0.1);
    border-left: 4px solid #1e99ff;
    color: white !important;
  }
  .nav-link-style {
    padding-top: 0.75rem; /* py-3 */
    padding-bottom: 0.75rem; /* py-3 */
    padding-left: 1rem; /* px-4 */
    padding-right: 1rem; /* px-4 */
    border-radius: 0.75rem; /* rounded-xl */
    text-align: left;
    width: 100%;
    display: flex;
    align-items: center;
    transition: background-color 0.2s, border-left 0.2s;
  }
  .nav-link-style.active {
    background-color: #2d3748; /* Darker gray for active state background */
    border-left: 4px solid #1e99ff; /* Orange border */
    color: white;
  }
  .nav-link-style:not(.active):hover {
    background-color: #1a202c; /* Slightly lighter dark on hover */
    color: white;
  }
  .nav-link-text {
    font-family: 'Nunito', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em; /* letter-spacing-wide */
    margin-left: 0.75rem; /* mr-3 */
  }
  .modal-close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: #f1f5f9; /* bg-gray-100 */
    color: #475569; /* text-gray-600 */
    border-radius: 9999px; /* rounded-full */
    width: 2rem; /* w-8 */
    height: 2rem; /* h-8 */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  .modal-close-btn:hover {
    background-color: #e2e8f0; /* bg-gray-200 */
    color: #1e293b; /* text-gray-800 */
    transform: rotate(90deg);
  }
  .modal-close-btn svg {
    width: 1rem; /* w-4 */
    height: 1rem; /* h-4 */
  }
`;

// --- HELPER COMPONENTS ---
const StatCard: React.FC<{
    title: string;
    value: string;
    icon: JSX.Element;
    bgColor: string;
}> = ({ title, value, icon, bgColor }) => (
    <div className="bg-white card-hover dotstark-shadow p-4  text-center rounded-3xl">
        <div
            className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
        >
            <div className="flex items-center justify-center w-full h-full">
                {icon}
            </div>
        </div>
        <h3 className="text-3xl font-nunito font-bold text-gray-900 mb-2">{value}</h3>
        <p className="text-gray-600 font-nunito font-semibold uppercase tracking-wide">
            {title}
        </p>
    </div>
);

// --- CONTEXT ---
interface DashboardContextType {
    tenants: Tenant[];
    setTenants: Dispatch<SetStateAction<Tenant[]>>;
    knowledgeBaseItems: KnowledgeBaseItem[];
    setKnowledgeBaseItems: Dispatch<SetStateAction<KnowledgeBaseItem[]>>;
    activeTenant: number | null;
    setActiveTenant: Dispatch<SetStateAction<number | null>>;
    activityLog: ActivityItem[];
    newTenantName: string;
    setNewTenantName: Dispatch<SetStateAction<string>>;
    newTenantFbUrl: string;
    setNewTenantFbUrl: Dispatch<SetStateAction<string>>;
    newTenantInstaUrl: string;
    setNewTenantInstaUrl: Dispatch<SetStateAction<string>>;
    newTenantFbVerifyToken: string;
    setNewTenantFbVerifyToken: Dispatch<SetStateAction<string>>;
    newTenantFbAccessToken: string;
    setNewTenantFbAccessToken: Dispatch<SetStateAction<string>>;
    newTenantInstaAccessToken: string;
    setNewTenantInstaAccessToken: Dispatch<SetStateAction<string>>;
    newTenantTelegramBotToken: string;
    setNewTenantTelegramBotToken: Dispatch<SetStateAction<string>>;
    newTenantTelegramChatId: string;
    setNewTenantTelegramChatId: Dispatch<SetStateAction<string>>;
    editingTenant: Tenant | null;
    setEditingTenant: Dispatch<SetStateAction<Tenant | null>>;
    updatedName: string;
    setUpdatedName: Dispatch<SetStateAction<string>>;
    updatedFbUrl: string;
    setUpdatedFbUrl: Dispatch<SetStateAction<string>>;
    updatedInstaUrl: string;
    setUpdatedInstaUrl: Dispatch<SetStateAction<string>>;
    updatedFbVerifyToken: string;
    setUpdatedFbVerifyToken: Dispatch<SetStateAction<string>>;
    updatedFbAccessToken: string;
    setUpdatedFbAccessToken: Dispatch<SetStateAction<string>>;
    updatedInstaAccessToken: string;
    setUpdatedInstaAccessToken: Dispatch<SetStateAction<string>>;
    updatedTelegramBotToken: string;
    setUpdatedTelegramBotToken: Dispatch<SetStateAction<string>>;
    updatedTelegramChatId: string;
    setUpdatedTelegramChatId: Dispatch<SetStateAction<string>>;
    newUrl: string;
    setNewUrl: Dispatch<SetStateAction<string>>;
    category: string;
    setCategory: Dispatch<SetStateAction<string>>;
    selectedFiles: File[]; // CHANGED: Multiple files
    setSelectedFiles: Dispatch<SetStateAction<File[]>>; // CHANGED
    handleRemoveFile: (index: number) => void; // NEW
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    error: string;
    setError: Dispatch<SetStateAction<string>>;
    showTenantCreationForm: boolean;
    setShowTenantCreationForm: Dispatch<SetStateAction<boolean>>;
    createStep: number;
    setCreateStep: Dispatch<SetStateAction<number>>;
    editStep: number;
    setEditStep: Dispatch<SetStateAction<number>>;
    tenantCount: number;
    conversationCount: number;
    globalKnowledgeCount: number;
    formatFileSize: (bytes: number) => string;
    formatTimeAgo: (isoDate: string) => string;
    handleLogout: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleOpenCreateTenantForm: () => void;
    handleCancelTenantCreation: () => void;
    handleCreateModalNext: () => void;
    handleCreateModalBack: () => void;
    handleFinalCreateTenant: () => Promise<void>;
    handleUpdateTenant: (tenantId: number) => Promise<void>;
    handleOpenEditTenantForm: (tenant: Tenant) => void;
    handleCancelEditTenant: () => void;
    handleEditModalNext: () => void;
    handleEditModalBack: () => void;
    handleAddItem: () => Promise<void>;
    handleDeleteItem: (itemId: string) => Promise<void>;
    getSourceIcon: (item: KnowledgeBaseItem) => JSX.Element;
    planType: 'free_trial' | 'standard' | 'expired' | null;
    StatCard: React.FC<{
        title: string;
        value: string;
        icon: JSX.Element;
        bgColor: string;
    }>;
    chatMessages: ChatMessage[];
    setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
    chatInputMessage: string;
    setChatInputMessage: Dispatch<SetStateAction<string>>;
    isChatLoading: boolean;
    setIsChatLoading: Dispatch<SetStateAction<boolean>>;
    chatError: string;
    setChatError: Dispatch<SetStateAction<string>>;
    chatMessagesEndRef: React.RefObject<HTMLDivElement | null>;
    handleSendChatMessage: () => Promise<void>;
    handleChatKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
    undefined,
);

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardLayout');
    }
    return context;
};

// --- MAIN DASHBOARD LAYOUT COMPONENT ---

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { userEmail, logout, planType, trialEndDate, isLoadingAuth } =
        useAuth();
    const router = useRouter();

    // NEW STATE: For mobile sidebar toggle
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- Dashboard State ---
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [knowledgeBaseItems, setKnowledgeBaseItems] = useState<
        KnowledgeBaseItem[]
    >([]);
    const [activeTenant, setActiveTenant] = useState<number | null>(null);
    const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);
    const [newTenantName, setNewTenantName] = useState('');
    const [newTenantFbUrl, setNewTenantFbUrl] = useState('');
    const [newTenantInstaUrl, setNewTenantInstaUrl] = useState('');
    const [newTenantFbVerifyToken, setNewTenantFbVerifyToken] = useState('');
    const [newTenantFbAccessToken, setNewTenantFbAccessToken] = useState('');
    const [newTenantInstaAccessToken, setNewTenantInstaAccessToken] = useState('');
    const [newTenantTelegramBotToken, setNewTenantTelegramBotToken] =
        useState('');
    const [newTenantTelegramChatId, setNewTenantTelegramChatId] = useState('');
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedFbUrl, setUpdatedFbUrl] = useState('');
    const [updatedInstaUrl, setUpdatedInstaUrl] = useState('');
    const [updatedFbVerifyToken, setUpdatedFbVerifyToken] = useState('');
    const [updatedFbAccessToken, setUpdatedFbAccessToken] = useState('');
    const [updatedInstaAccessToken, setUpdatedInstaAccessToken] = useState('');
    const [updatedTelegramBotToken, setUpdatedTelegramBotToken] = useState('');
    const [updatedTelegramChatId, setUpdatedTelegramChatId] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [category, setCategory] = useState('');

    // CHANGED: Use array for multiple files
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showTenantCreationForm, setShowTenantCreationForm] = useState(false);
    const [createStep, setCreateStep] = useState(1);
    const [editStep, setEditStep] = useState(1);

    // --- DERIVED STATE ---
    const tenantCount = tenants.length;
    const [conversationCount, setConversationCount] = useState<number>(0);
    const [globalKnowledgeCount, setGlobalKnowledgeCount] = useState<number>(0);

    // --- Chat State ---
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInputMessage, setChatInputMessage] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [chatError, setChatError] = useState('');
    const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);

    // --- Utility Functions (All remain the same) ---
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatTimeAgo = (isoDate: string): string => {
        const date = new Date(isoDate + 'Z');
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' years ago';
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' months ago';
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' days ago';
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' hours ago';
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' min ago';
        return Math.floor(seconds) + ' sec ago';
    };

    // --- EFFECTS ---
    useEffect(() => {
        if (category !== 'file' && category !== 'database') {
            setSelectedFiles([]);
        }
    }, [category]);

    useEffect(() => {
        if (category !== 'url') {
            setNewUrl('');
        }
    }, [category]);

    // Close sidebar on navigation for mobile
    const pathname = usePathname();
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                // if (!token) {
                //     setError('Authentication token not found. Redirecting to login.');
                //     router.push('/login');
                //     return;
                // }

                const [tenantsRes, countRes, knowledgeCountRes, activityRes] =
                    await Promise.all([
                        axios.get(`${API_URL}/tenants/`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get(`${API_URL}/users/me/conversation_count/`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get(`${API_URL}/users/me/knowledge_item_count/`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get(`${API_URL}/users/me/recent_activity/`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                    ]);

                setTenants(tenantsRes.data);
                setConversationCount(countRes.data.count);
                setGlobalKnowledgeCount(knowledgeCountRes.data.count);
                setActivityLog(activityRes.data);

                if (tenantsRes.data.length > 0) {
                    setActiveTenant(tenantsRes.data[0].id);
                }
            } catch (err) {
                const error = err as ApiError;
                setError(
                    'Failed to load data. ' +
                    (error.response?.data?.detail ||
                        'Please check your connection/authentication.'),
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    // Fetch Tenant-Specific Data
    useEffect(() => {
        if (activeTenant !== null) {
            const fetchTenantData = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        router.push('/login');
                        return;
                    }

                    const itemsRes = await axios.get(
                        `${API_URL}/tenants/${activeTenant}/knowledge_base_items/`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        },
                    );
                    setKnowledgeBaseItems(itemsRes.data);
                } catch (err: unknown) {
                    if (isAxiosError(err)) {
                        // Silent error handling for this effect
                    }
                }
            };

            fetchTenantData();
        } else {
            setKnowledgeBaseItems([]);
        }
    }, [activeTenant, router]);

    // Enforce Trial Expiry
    useEffect(() => {
        if (!isLoadingAuth) {
            if (planType === 'expired') {
                setError(
                    'Your free trial has expired. Please upgrade to continue using the service.',
                );
            }
        }
        return () => setError('');
    }, [planType, isLoadingAuth]);

    // Chat scroll effect
    useEffect(() => {
        chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // --- HANDLERS ---

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);


    const handleLogout = () => {
        logout();
    };

    // CHANGED: Handle multiple files
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const validFiles: File[] = [];

            files.forEach(file => {
                if (file.size > 10 * 1024 * 1024) {
                    alert(`File ${file.name} TOO LARGE. MAX SIZE: 10MB`);
                    return;
                }
                const allowedTypes = ['.pdf', '.txt', '.doc', '.docx', '.csv', '.xml'];
                const fileExtension =
                    '.' + file.name.split('.').pop()?.toLowerCase() || '';
                if (!allowedTypes.includes(fileExtension)) {
                    alert(`INVALID FILE TYPE for ${file.name}. USE PDF, TXT, DOC, DOCX, CSV, or XML`);
                    return;
                }
                validFiles.push(file);
            });

            // Append files, don't replace
            setSelectedFiles(prev => [...prev, ...validFiles]);

            // Reset input so same files can be added again if removed
            e.target.value = '';
        }
    };

    // NEW: Remove individual file
    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleOpenCreateTenantForm = () => {
        setNewTenantName('');
        // ... reset other fields ...
        setNewTenantFbUrl(''); setNewTenantInstaUrl(''); setNewTenantFbVerifyToken('');
        setNewTenantFbAccessToken(''); setNewTenantInstaAccessToken(''); setNewTenantTelegramBotToken('');
        setNewTenantTelegramChatId('');
        setError('');
        setCreateStep(1);
        setShowTenantCreationForm(true);
    };

    const handleCancelTenantCreation = () => {
        // ... reset fields ...
        setNewTenantName(''); setNewTenantFbUrl(''); setNewTenantInstaUrl('');
        setNewTenantFbVerifyToken(''); setNewTenantFbAccessToken(''); setNewTenantInstaAccessToken('');
        setNewTenantTelegramBotToken(''); setNewTenantTelegramChatId('');
        setError('');
        setCreateStep(1);
        setShowTenantCreationForm(false);
    };

    const handleCreateModalNext = () => {
        if (createStep === 1 && !newTenantName.trim()) {
            setError('Organization name cannot be empty.');
            return;
        }
        setError('');
        if (createStep < 4) {
            setCreateStep((prev) => prev + 1);
        }
    };

    const handleCreateModalBack = () => {
        setError('');
        if (createStep > 1) {
            setCreateStep((prev) => prev - 1);
        }
    };

    const handleFinalCreateTenant = async () => {
        if (createStep === 1 && !newTenantName.trim()) {
            setError('Organization name cannot be empty.');
            setCreateStep(1);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }
            const requestBody = {
                name: newTenantName,
                fb_url: newTenantFbUrl.trim() || null,
                insta_url: newTenantInstaUrl.trim() || null,
                fb_verify_token: newTenantFbVerifyToken.trim() || null,
                fb_access_token: newTenantFbAccessToken.trim() || null,
                insta_access_token: newTenantInstaAccessToken.trim() || null,
                telegram_bot_token: newTenantTelegramBotToken.trim() || null,
                telegram_chat_id: newTenantTelegramChatId.trim() || null,
            };
            const response = await axios.post(`${API_URL}/tenants/`, requestBody, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTenants([...tenants, response.data]);
            setActiveTenant(response.data.id);
            handleCancelTenantCreation();
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setError(
                    'Failed to create organization. ' +
                    (err.response?.data?.detail || 'Please try again.'),
                );
            } else {
                setError('Failed to create organization. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenEditTenantForm = (tenant: Tenant) => {
        setError('');
        setEditingTenant(tenant);
        setEditStep(1);
        setUpdatedName(tenant.name);
        setUpdatedFbUrl(tenant.fb_url || '');
        setUpdatedInstaUrl(tenant.insta_url || '');
        setUpdatedFbVerifyToken(tenant.fb_verify_token || '');
        setUpdatedFbAccessToken(tenant.fb_access_token || '');
        setUpdatedInstaAccessToken(tenant.insta_access_token || '');
        setUpdatedTelegramBotToken(tenant.telegram_bot_token || '');
        setUpdatedTelegramChatId(tenant.telegram_chat_id || '');
    };

    const handleCancelEditTenant = () => {
        setEditingTenant(null);
        // ... reset fields ...
        setUpdatedName(''); setUpdatedFbUrl(''); setUpdatedInstaUrl(''); setUpdatedFbVerifyToken('');
        setUpdatedFbAccessToken(''); setUpdatedInstaAccessToken(''); setUpdatedTelegramBotToken(''); setUpdatedTelegramChatId('');
        setError('');
        setEditStep(1);
    };

    const handleEditModalNext = () => {
        if (editStep === 1 && !updatedName.trim()) {
            setError('Organization name cannot be empty.');
            return;
        }
        setError('');
        if (editStep < 4) {
            setEditStep((prev) => prev + 1);
        }
    };

    const handleEditModalBack = () => {
        setError('');
        if (editStep > 1) {
            setEditStep((prev) => prev - 1);
        }
    };

    const handleUpdateTenant = async (tenantId: number) => {
        if (editStep === 1 && !updatedName.trim()) {
            setError('Organization name cannot be empty.');
            setEditStep(1);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }
            const updatedTenantData = {
                name: updatedName,
                fb_url: updatedFbUrl.trim() || null,
                insta_url: updatedInstaUrl.trim() || null,
                fb_verify_token: updatedFbVerifyToken.trim() || null,
                fb_access_token: updatedFbAccessToken.trim() || null,
                insta_access_token: updatedInstaAccessToken.trim() || null,
                telegram_bot_token: updatedTelegramBotToken.trim() || null,
                telegram_chat_id: updatedTelegramChatId.trim() || null,
            };
            await axios.put(
                `${API_URL}/tenants/${tenantId}/`,
                updatedTenantData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            // Refresh tenants list
            const tenantsRes = await axios.get(`${API_URL}/tenants`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTenants(tenantsRes.data);
            handleCancelEditTenant();
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setError(
                    'Failed to update organization. ' +
                    (err.response?.data?.detail || 'Please try again.'),
                );
            } else {
                setError('Failed to update organization. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // CHANGED: Handle Add Item with Loop for Multiple Files
    const handleAddItem = async () => {
        if (!category) {
            setError('Please select a type.');
            return;
        }
        if (category === 'url' && !newUrl.trim()) {
            setError('Please provide a URL.');
            return;
        }
        // Check selectedFiles array length instead of single object
        if (category === 'file' && selectedFiles.length === 0) {
            setError('Please select at least one file.');
            return;
        }
        if (activeTenant === null) {
            setError(
                'Please select an active organization before adding a source.',
            );
            return;
        }
        if (planType === 'expired') {
            setError(
                'Your plan is expired. Please upgrade to add new knowledge sources.',
            );
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            if (category === 'url') {
                const formData = new FormData();
                formData.append('url', newUrl);
                await axios.post(
                    `${API_URL}/tenants/${activeTenant}/knowledge_base_items/add_url/`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } },
                );
            } else if (category === 'file') {
                // LOOP through all selected files
                for (const file of selectedFiles) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('category', category);
                    await axios.post(
                        `${API_URL}/tenants/${activeTenant}/knowledge_base_items/`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        },
                    );
                }
            }

            // Refresh items
            const itemsRes = await axios.get(
                `${API_URL}/tenants/${activeTenant}/knowledge_base_items/`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            setKnowledgeBaseItems(itemsRes.data);
            setNewUrl('');
            setSelectedFiles([]); // Clear file selection
            setCategory('');
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setError(
                    'Failed to add item. ' +
                    (err.response?.data?.detail || 'Please try again.'),
                );
            } else {
                setError('Failed to add item. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (planType === 'expired') {
            setError(
                'Your plan is expired. Please upgrade to manage knowledge sources.',
            );
            return;
        }
        if (
            !window.confirm(
                'Are you sure you want to permanently delete this item? This cannot be undone.',
            )
        ) {
            return;
        }
        if (activeTenant === null) {
            setError('No active organization selected.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${API_URL}/tenants/${activeTenant}/knowledge_base_items/${itemId}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            setKnowledgeBaseItems((prevItems) =>
                prevItems.filter((item) => item.id !== itemId),
            );
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setError(
                    'Failed to delete item. ' +
                    (err.response?.data?.detail || 'Please try again.'),
                );
            } else {
                setError('Failed to delete item. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getSourceIcon = (item: KnowledgeBaseItem) => {
        if (item.url) {
            return (
                <svg className="w-7 h-7 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389.907.673 2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                </svg>
            );
        } else if (item.file_type?.toLowerCase().includes('pdf') || item.filename?.toLowerCase().endsWith('.pdf')) {
            return (
                <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
            );
        } else {
            return (
                <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
            );
        }
    };

    // --- Chat Handlers ---
    const handleSendChatMessage = async () => {
        if (!chatInputMessage.trim() || activeTenant === null) {
            setChatError(
                'Please ensure your organization is selected and enter a message.',
            );
            return;
        }

        const newMessage: ChatMessage = {
            id: Math.random().toString(36).substring(2),
            text: chatInputMessage,
            isUser: true,
            timestamp: new Date().toISOString(),
        };

        setChatMessages((prev) => [...prev, newMessage]);
        setChatInputMessage('');
        setIsChatLoading(true);
        setChatError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setChatError('Authentication token not found. Please log in.');
                setIsChatLoading(false);
                return;
            }

            const response = await axios.post(
                `${API_URL}/chatbot/ask?tenant_id=${activeTenant}`,
                { message: newMessage.text },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            const botReply: ChatMessage = {
                id: Math.random().toString(36).substring(2),
                text: response.data.response,
                isUser: false,
                timestamp: new Date().toISOString(),
                sources: response.data.sources,
            };

            setChatMessages((prev) => [...prev, botReply]);
        } catch (err: unknown) {
            const error = err as ApiError;
            setChatError(error.response?.data?.detail || 'Failed to send message.');
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleChatKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendChatMessage();
        }
    };

    // --- RENDER HELPERS ---

    const renderPlanStatus = () => {
        if (isLoadingAuth) {
            return <p className="text-gray-300 font-nunito font-semibold text-sm">Loading plan...</p>;
        }

        let statusText = 'No Active Plan';
        let subText = '';
        let statusClass = 'text-gray-400';

        if (planType === 'standard') {
            statusText = 'Standard Plan';
            statusClass = 'text-green-400';
        } else if (planType === 'free_trial' && trialEndDate) {
            const today = new Date();
            const endDate = new Date(trialEndDate);
            const diffTime = endDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                statusText = 'FREE TRIAL ACTIVE';
                subText = `${diffDays} days remaining`;
                statusClass = 'text-dotstark-primary';
            } else {
                statusText = 'TRIAL EXPIRED';
                subText = 'Please upgrade your plan';
                statusClass = 'text-red-500';
            }
        } else if (planType === 'expired') {
            statusText = 'TRIAL EXPIRED';
            subText = 'Please upgrade your plan';
            statusClass = 'text-red-500';
        }

        return (
            <div className="mt-auto pt-6 border-t border-gray-700 mx-3">
                <p className="text-gray-300 font-nunito font-semibold text-sm">
                    Welcome back, {userEmail || 'Admin'}
                </p>
                {/* <div className="mt-2">
                    <p className={`font-nunito font-bold text-base uppercase ${statusClass}`}>
                        {statusText}
                    </p>
                    {subText && (
                        <p className={`text-xs font-medium ${statusClass}`}>{subText}</p>
                    )}
                </div> */}
            </div>
        );
    };


    const currentPageTitle = useMemo(() => {
        if (pathname === '/dashboard') return 'DASHBOARD OVERVIEW';
        if (pathname === '/dashboard/organizations') return 'MANAGE ORGANIZATIONS';
        if (pathname === '/dashboard/knowledge') return 'KNOWLEDGE BASE SOURCES';
        if (pathname === '/dashboard/chat') return 'CHAT INTERFACE';
        return 'DASHBOARD';
    }, [pathname]);

    const createModalTitle = useMemo(() => {
        switch (createStep) {
            case 1: return 'Create New Organization';
            case 2: return 'Add Social Links (Optional)';
            case 3: return 'Configure Webhooks (Optional)';
            case 4: return 'Configure Telegram (Optional)';
            default: return 'Create Organization';
        }
    }, [createStep]);

    const editModalTitle = useMemo(() => {
        const name = editingTenant?.name || 'Organization';
        switch (editStep) {
            case 1: return `Edit: ${name}`;
            case 2: return 'Edit Social Links';
            case 3: return 'Edit Webhooks';
            case 4: return 'Edit Telegram';
            default: return 'Edit Organization';
        }
    }, [editStep, editingTenant]);

    const contextValue: DashboardContextType = {
        tenants, setTenants, knowledgeBaseItems, setKnowledgeBaseItems, activeTenant, setActiveTenant,
        activityLog, newTenantName, setNewTenantName, newTenantFbUrl, setNewTenantFbUrl,
        newTenantInstaUrl, setNewTenantInstaUrl, newTenantFbVerifyToken, setNewTenantFbVerifyToken,
        newTenantFbAccessToken, setNewTenantFbAccessToken, newTenantInstaAccessToken, setNewTenantInstaAccessToken,
        newTenantTelegramBotToken, setNewTenantTelegramBotToken, newTenantTelegramChatId, setNewTenantTelegramChatId,
        editingTenant, setEditingTenant, updatedName, setUpdatedName, updatedFbUrl, setUpdatedFbUrl,
        updatedInstaUrl, setUpdatedInstaUrl, updatedFbVerifyToken, setUpdatedFbVerifyToken,
        updatedFbAccessToken, setUpdatedFbAccessToken, updatedInstaAccessToken, setUpdatedInstaAccessToken,
        updatedTelegramBotToken, setUpdatedTelegramBotToken, updatedTelegramChatId, setUpdatedTelegramChatId,
        newUrl, setNewUrl, category, setCategory,
        selectedFiles, setSelectedFiles, handleRemoveFile, // NEW
        isLoading, setIsLoading, error, setError, showTenantCreationForm, setShowTenantCreationForm,
        createStep, setCreateStep, editStep, setEditStep, tenantCount, conversationCount, globalKnowledgeCount,
        formatFileSize, formatTimeAgo, handleLogout, handleFileChange, handleOpenCreateTenantForm,
        handleCancelTenantCreation, handleCreateModalNext, handleCreateModalBack, handleFinalCreateTenant,
        handleUpdateTenant, handleOpenEditTenantForm, handleCancelEditTenant, handleEditModalNext,
        handleEditModalBack, handleAddItem, handleDeleteItem, getSourceIcon, planType, StatCard,
        chatMessages, setChatMessages, chatInputMessage, setChatInputMessage, isChatLoading, setIsChatLoading,
        chatError, setChatError, chatMessagesEndRef, handleSendChatMessage, handleChatKeyPress,
    };

    return (
        <DashboardContext.Provider value={contextValue}>
            <div className=" flex bg-gray-50 font-roboto relative overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
                {/* NEW: Mobile Overlay for Sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0  z-40 lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}
                <style jsx global>{customStyles}</style>

                {/* Sidebar Navigation - MODIFIED: Fixed position and conditional visibility for mobile */}
                <nav className={`
                    w-72 bg-gray-900 h-full flex flex-col dotstark-shadow-lg z-20 flex-shrink-0 
                    transition-transform duration-300 ease-in-out
                    lg:relative lg:translate-x-0
                    fixed top-0 left-0
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `} style={{ height: '100%' }}>
                    <div className="p-6 flex-1 flex flex-col mt-5 mt-lg-0">
                        <div className="space-y-2 mt-4">
                            <Link href="/dashboard" onClick={toggleSidebar} className={`nav-link-style ${pathname === '/dashboard' ? 'active' : 'text-secondary hover:text-white'}`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>
                                <span className="nav-link-text">DASHBOARD</span>
                            </Link>
                            <Link href="/dashboard/chat" onClick={toggleSidebar} className={`nav-link-style ${pathname === '/dashboard/chat' ? 'active' : 'text-secondary hover:text-white'}`} style={planType === 'expired' ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /> <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" /></svg>
                                <span className="nav-link-text">CHAT</span>
                            </Link>
                            <Link href="/dashboard/organizations" onClick={toggleSidebar} className={`nav-link-style ${pathname === '/dashboard/organizations' ? 'active' : 'text-secondary hover:text-white'}`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" /> <path d="M6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" /></svg>
                                <span className="nav-link-text">ORGANIZATIONS</span>
                            </Link>
                            <Link href="/dashboard/knowledge" onClick={toggleSidebar} className={`nav-link-style ${pathname === '/dashboard/knowledge' ? 'active' : 'text-secondary hover:text-white'}`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                <span className="nav-link-text">KNOWLEDGE BASE</span>
                            </Link>
                        </div>
                        {renderPlanStatus()}
                    </div>
                </nav>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="bg-white dotstark-shadow border-b border-gray-200 px-4 sm:px-5 py-4">
                        <div className="flex justify-between items-center">
                            {/* NEW: Hamburger Button for Mobile */}
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                            >
                                {/* Hamburger Icon */}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl sm:text-2xl font-nunito font-bold text-secondary fw-900 uppercase tracking-wide">
                                    {currentPageTitle}
                                </h2>
                                <p className="text-gray-600 font-medium hidden sm:block">
                                    Manage your {APP_TITLE} system
                                </p>
                            </div>
                            {/* Replaced d-flex with flex and adjusted sizing for mobile */}
                            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                <span className="bg-orange-100 text-orange-800 font-nunito font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider hidden sm:inline-block">
                                    ONLINE
                                </span>
                                <Link href="/dashboard/chat" className="dotstark-gradient text-white px-3 py-2 pill-button font-nunito font-bold text-xs shadow-md flex items-center" style={planType === 'expired' ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /></svg>
                                    <span className='hidden sm:inline'>OPEN CHAT</span>
                                    <span className='inline sm:hidden'>CHAT</span>
                                </Link>
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto">
                        {/* Main Error Banner with responsive padding */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 sm:px-5 py-3 sm:py-4 rounded-xl mx-2 sm:mx-4 mt-2 dotstark-shadow text-sm" role="alert">
                                <button onClick={() => setError('')} className="float-right font-bold text-lg -mt-2">×</button>
                                {error}
                            </div>
                        )}
                        {children}
                    </div>
                </div>

                {/* Create Tenant Modal */}
                {showTenantCreationForm && (
                    <div className="modal-overlay active flex items-center justify-center z-50 p-4">
                        <div className="modal-content bg-white rounded-3xl dotstark-shadow-lg p-4 w-full max-w-lg mx-auto overflow-y-auto max-h-[90vh] relative">
                            <button onClick={handleCancelTenantCreation} className="modal-close-btn" title="Close">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <h2 className="text-2xl font-nunito font-bold mb-6 text-gray-900 uppercase tracking-wide">
                                {createModalTitle}
                            </h2>
                            <div className="space-y-6">
                                {createStep === 1 && (
                                    <div>
                                        <label htmlFor="newTenantName" className="block text-sm font-nunito font-bold text-gray-700 mb-2 uppercase tracking-wide">Organization Name</label>
                                        <input type="text" id="newTenantName" placeholder="e.g., My Company Inc." value={newTenantName} onChange={(e) => setNewTenantName(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" disabled={isLoading} />
                                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                                    </div>
                                )}
                                {createStep === 2 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-nunito font-bold text-gray-700 border-b pb-2">Social Links (Optional)</h3>
                                        <div>
                                            <label htmlFor="newTenantFbUrl" className="block text-sm font-nunito font-bold text-gray-700 mb-2  mt-2 uppercase tracking-wide">Facebook URL</label>
                                            <input type="text" id="newTenantFbUrl" placeholder="https://www.facebook.com/your-org" value={newTenantFbUrl} onChange={(e) => setNewTenantFbUrl(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" disabled={isLoading} />
                                        </div>
                                        <div>
                                            <label htmlFor="newTenantInstaUrl" className="block text-sm font-nunito font-bold text-gray-700 mb-2 mt-2 uppercase tracking-wide">Instagram URL</label>
                                            <input type="text" id="newTenantInstaUrl" placeholder="https://www.instagram.com/your-org" value={newTenantInstaUrl} onChange={(e) => setNewTenantInstaUrl(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" disabled={isLoading} />
                                        </div>
                                    </div>
                                )}
                                {createStep === 3 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-nunito font-bold text-gray-700 border-b pb-2">Webhook Credentials (Optional)</h3>
                                        <div><label htmlFor="newTenantFbVerifyToken" className="block text-sm font-nunito font-bold text-gray-700 mb-2  mt-2 uppercase tracking-wide">FB/Insta Verify Token</label><input type="text" id="newTenantFbVerifyToken" placeholder="Your webhook verification token" value={newTenantFbVerifyToken} onChange={(e) => setNewTenantFbVerifyToken(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" disabled={isLoading} /></div>
                                        <div><label htmlFor="newTenantFbAccessToken" className="block text-sm font-nunito font-bold text-gray-700 mb-2 mt-2  uppercase tracking-wide">Facebook Page Access Token</label><input type="text" id="newTenantFbAccessToken" placeholder="EAAKgyth..." value={newTenantFbAccessToken} onChange={(e) => setNewTenantFbAccessToken(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" disabled={isLoading} /></div>
                                        <div><label htmlFor="newTenantInstaAccessToken" className="block text-sm font-nunito font-bold text-gray-700 mb-2 mt-2 uppercase tracking-wide">Instagram Access Token</label><input type="text" id="newTenantInstaAccessToken" placeholder="IGAAbUo..." value={newTenantInstaAccessToken} onChange={(e) => setNewTenantInstaAccessToken(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" disabled={isLoading} /></div>
                                    </div>
                                )}
                                {createStep === 4 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-nunito font-bold text-gray-700 border-b pb-2">Telegram Setup (Optional)</h3>
                                        <div><label htmlFor="newTenantTelegramBotToken" className="block text-sm font-nunito font-bold text-gray-700 mb-2 mt-2 uppercase tracking-wide">Telegram Bot Token</label><input type="text" id="newTenantTelegramBotToken" placeholder="8351802422:AAH74q..." value={newTenantTelegramBotToken} onChange={(e) => setNewTenantTelegramBotToken(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" disabled={isLoading} /></div>
                                        <div><label htmlFor="newTenantTelegramChatId" className="block text-sm font-nunito font-bold text-gray-700 mb-2 mt-2uppercase tracking-wide">Telegram Chat ID (Internal Use)</label><input type="text" id="newTenantTelegramChatId" placeholder="Optional: 123456789" value={newTenantTelegramChatId} onChange={(e) => setNewTenantTelegramChatId(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" disabled={isLoading} /></div>
                                    </div>
                                )}
                            </div>
                            {/* Replaced d-flex with flex */}
                            <div className="mt-6 flex justify-between gap-3">
                                {createStep > 1 ? (<button onClick={handleCreateModalBack} className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-3 rounded-full text-sm font-nunito font-bold uppercase tracking-wide transition-colors" disabled={isLoading}>Back</button>) : (<button onClick={handleCancelTenantCreation} className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-3 rounded-full text-sm font-nunito font-bold uppercase tracking-wide transition-colors" disabled={isLoading}>Cancel</button>)}
                                {createStep < 4 ? (<button onClick={handleCreateModalNext} className="dotstark-gradient text-white px-4 py-3 mt-2 pill-button font-nunito font-bold text-sm shadow-md" disabled={isLoading || (createStep === 1 && !newTenantName.trim())}>Next</button>) : (<button onClick={handleFinalCreateTenant} className="dotstark-gradient text-white px-4 py-3 mt-2 pill-button font-nunito font-bold text-sm shadow-md" disabled={isLoading}>{isLoading ? 'Creating...' : 'Complete Creation'}</button>)}
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Tenant Modal */}
                {editingTenant && (
                    <div className="modal-overlay active flex items-center justify-center z-50 p-4">
                        <div className="modal-content bg-white rounded-3xl dotstark-shadow-lg p-4 w-full max-w-lg mx-auto overflow-y-auto max-h-[90vh] relative">
                            <button onClick={handleCancelEditTenant} className="modal-close-btn" title="Close"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                            <h2 className="text-2xl font-nunito font-bold mb-6 text-gray-900 uppercase tracking-wide">{editModalTitle}</h2>
                            <div className="space-y-6">
                                {editStep === 1 && (<div><h3 className="text-xl font-nunito font-bold text-gray-900 border-b pb-2">Basic Info</h3><label htmlFor="updatedName" className="block text-sm font-nunito font-bold text-gray-700 mb-2 mt-4 uppercase tracking-wide">Organization Name</label><input type="text" id="updatedName" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" disabled={isLoading} />{error && (<p className="text-red-500 text-sm mt-2">{error}</p>)}</div>)}
                                {editStep === 2 && (<div className="space-y-4"><h3 className="text-lg font-nunito font-bold text-gray-700 border-b pb-2">Social Links</h3><div><label htmlFor="updatedFbUrl" className="block text-sm font-nunito font-bold text-gray-700 mb-2  mt-2 uppercase tracking-wide">Facebook URL</label><input type="text" id="updatedFbUrl" placeholder="https://www.facebook.com/your-org" value={updatedFbUrl} onChange={(e) => setUpdatedFbUrl(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" disabled={isLoading} /></div><div><label htmlFor="updatedInstaUrl" className="block text-sm font-nunito font-bold text-gray-700 mb-2 mt-2 uppercase tracking-wide">Instagram URL</label><input type="text" id="updatedInstaUrl" placeholder="https://www.instagram.com/your-org" value={updatedInstaUrl} onChange={(e) => setUpdatedInstaUrl(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" disabled={isLoading} /></div></div>)}
                                {editStep === 3 && (<div className="space-y-4"><h3 className="text-lg font-nunito font-bold text-gray-700 border-b pb-2">Webhooks & Links</h3><div><label htmlFor="updatedFbVerifyToken" className="block text-sm font-nunito font-bold text-gray-700 mb-2 uppercase tracking-wide">FB/Insta Verify Token</label><input type="text" id="updatedFbVerifyToken" placeholder="Verification token" value={updatedFbVerifyToken} onChange={(e) => setUpdatedFbVerifyToken(e.target.value)} disabled={isLoading} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" /></div><div><label htmlFor="updatedFbAccessToken" className="block text-sm font-nunito font-bold text-gray-700 mb-2 uppercase tracking-wide">Facebook Page Access Token</label><input type="text" id="updatedFbAccessToken" placeholder="EAAKgyth..." value={updatedFbAccessToken} onChange={(e) => setUpdatedFbAccessToken(e.target.value)} disabled={isLoading} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" /></div><div><label htmlFor="updatedInstaAccessToken" className="block text-sm font-nunito font-bold text-gray-700 mb-2 uppercase tracking-wide">Instagram Access Token</label><input type="text" id="updatedInstaAccessToken" placeholder="IGAAbUo..." value={updatedInstaAccessToken} onChange={(e) => setUpdatedInstaAccessToken(e.target.value)} disabled={isLoading} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" /></div></div>)}
                                {editStep === 4 && (<div className="space-y-4"><h3 className="text-lg font-nunito font-bold text-gray-700 border-b pb-2">Telegram Setup</h3><div><label htmlFor="updatedTelegramBotToken" className="block text-sm font-nunito font-bold text-gray-700 mb-2 uppercase tracking-wide">Telegram Bot Token</label><input type="text" id="updatedTelegramBotToken" placeholder="8351802422:AAH74q..." value={updatedTelegramBotToken} onChange={(e) => setUpdatedTelegramBotToken(e.target.value)} disabled={isLoading} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" /></div><div><label htmlFor="updatedTelegramChatId" className="block text-sm font-nunito font-bold text-gray-700 mb-2 uppercase tracking-wide">Telegram Chat ID</label><input type="text" id="updatedTelegramChatId" placeholder="123456789" value={updatedTelegramChatId} onChange={(e) => setUpdatedTelegramChatId(e.target.value)} disabled={isLoading} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-colors text-lg" /></div></div>)}
                            </div>
                            {/* Replaced d-flex with flex */}
                            <div className="mt-6 flex justify-between gap-3">
                                {editStep > 1 ? (<button onClick={handleEditModalBack} className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-3 rounded-full text-sm font-nunito font-bold uppercase tracking-wide transition-colors" disabled={isLoading}>Back</button>) : (<button onClick={handleCancelEditTenant} className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-3 rounded-full text-sm font-nunito font-bold uppercase tracking-wide transition-colors" disabled={isLoading}>Cancel</button>)}
                                {editStep < 4 ? (<button onClick={handleEditModalNext} className="dotstark-gradient text-white px-4 py-3 mt-2 pill-button font-nunito font-bold text-sm shadow-md" disabled={isLoading || (editStep === 1 && !updatedName.trim())}>Next</button>) : (<button onClick={() => editingTenant && handleUpdateTenant(editingTenant.id)} className="dotstark-gradient text-white px-4 py-3 mt-2 pill-button font-nunito font-bold text-sm shadow-md" disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Organization'}</button>)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardContext.Provider>

    );
}