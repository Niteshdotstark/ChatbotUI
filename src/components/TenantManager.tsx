import React, { useState, useEffect } from 'react';

// Define interfaces for data structures (keeping original mock logic)
interface Tenant {
  id: number;
  name: string;
  created_at: string;
  fb_url?: string | null;
  insta_url?: string | null;
}

interface TenantFormData {
  name: string;
  fb_url: string;
  insta_url: string;
}

const TenantManager: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState<TenantFormData>({
    name: '',
    fb_url: '',
    insta_url: ''
  });

  // Mock API calls - keeping original logic structure
  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Simulate API call (retaining mock data for demonstration)
      // await fetch('/api/tenants'); 

      setTenants([
        {
          id: 1,
          name: 'Acme Corporation',
          created_at: '2024-03-15T10:30:00Z',
          fb_url: 'https://facebook.com/acme',
          insta_url: 'https://instagram.com/acme'
        },
        {
          id: 2,
          name: 'Tech Innovations Ltd',
          created_at: '2024-02-20T14:45:00Z',
          fb_url: null,
          insta_url: 'https://instagram.com/techinnovations'
        },
        {
          id: 3,
          name: 'Global Solutions',
          created_at: '2024-01-10T11:00:00Z',
          fb_url: null,
          insta_url: null
        }
      ]);
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError('Failed to load tenants (Using mock data).');
    } finally {
      setIsLoading(false);
    }
  };

  const createTenant = async (tenantData: TenantFormData) => {
    // Mocking POST request/creation logic
    return new Promise<void>((resolve) => {
      setError('');
      const newTenant: Tenant = {
        id: Math.max(...tenants.map(t => t.id), 0) + 1,
        name: tenantData.name,
        created_at: new Date().toISOString(),
        fb_url: tenantData.fb_url || null,
        insta_url: tenantData.insta_url || null
      };
      setTenants(prev => [...prev, newTenant]);
      resetForm();
      setShowCreateForm(false);
      alert('Tenant created (Mocked success)');
      resolve();
    });
  };

  const updateTenant = async (id: number, tenantData: TenantFormData) => {
    // Mocking PUT request/update logic
    return new Promise<void>((resolve) => {
      setError('');
      setTenants(prev => prev.map(t => t.id === id ? {
        ...t,
        name: tenantData.name,
        fb_url: tenantData.fb_url || null,
        insta_url: tenantData.insta_url || null
      } : t));
      setEditingTenant(null);
      resetForm();
      alert('Tenant updated (Mocked success)');
      resolve();
    });
  };

  const deleteTenant = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return;
    }

    // Mocking DELETE request/delete logic
    try {
      setError('');
      // Simulate successful deletion
      setTenants(prev => prev.filter(t => t.id !== id));
      alert('Tenant deleted (Mocked success)');
    } catch (err) {
      setError('Failed to delete tenant');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      fb_url: '',
      insta_url: ''
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Organization name is required');
      return;
    }

    if (editingTenant) {
      await updateTenant(editingTenant.id, formData);
    } else {
      await createTenant(formData);
    }
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      name: tenant.name,
      fb_url: tenant.fb_url || '',
      insta_url: tenant.insta_url || ''
    });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingTenant(null);
    resetForm();
    setError('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header - Styled to match new dashboard page header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-nunito font-bold text-gray-900 uppercase tracking-wide">ORGANIZATION MANAGEMENT</h1>
          <p className="text-gray-600 font-medium">Manage your organizations and their settings</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="dotstark-gradient text-white px-3 py-3 pill-button font-nunito font-bold flex items-center shadow-md"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          NEW ORGANIZATION
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-4 rounded-xl mb-3 dotstark-shadow" role="alert">
          {error}
        </div>
      )}

      {/* Tenants List - Using new card design */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="d-flex justify-content-center items-center py-5">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-dotstark-primary border-t-transparent"></div>
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-5 bg-white card-hover dotstark-shadow rounded-3xl">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No organizations yet</h3>
            <p className="text-gray-600 mb-3">Get started by creating your first organization</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="dotstark-gradient text-white px-3 py-3 pill-button font-nunito font-bold flex items-center shadow-md mx-auto"
            >
              <svg className="w-5 h-5 me-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
              Create Organization
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                className="bg-white card-hover dotstark-shadow p-3 rounded-3xl transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-nunito font-bold text-gray-900 mb-1">{tenant.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-medium">
                      <span className="text-xs">ID: {tenant.id} | Created: {formatDate(tenant.created_at)}</span>
                    </div>

                    {(tenant.fb_url || tenant.insta_url) && (
                      <div className="d-flex flex-wrap gap-3 mt-4">
                        {tenant.fb_url && (
                          <a
                            href={tenant.fb_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 font-medium"
                          >
                            Facebook
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        )}
                        {tenant.insta_url && (
                          <a
                            href={tenant.insta_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 text-sm d-flex alignitems-center gap-1 font-medium"
                          >
                            Instagram
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <span className="bg-green-100 text-green-800 text-xs font-nunito font-bold px-4 py-2 rounded-full uppercase tracking-wider">ACTIVE</span>
                </div>

                <div className="d-flex justify-contentbetween align-items-center border-top border-gray-100 pt-4">
                  <div className="text-sm text-gray-600 font-medium">
                    <p className="mb-0">{Math.floor(Math.random() * 5) + 1} knowledge sources</p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      onClick={() => handleEdit(tenant)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-3 pill-button font-nunito font-bold text-sm transition-all duration-300"
                      title="Edit organization"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => deleteTenant(tenant.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-full transition-colors"
                      title="Delete organization"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal - Styled to match dashboard modals */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl dotstark-shadow-lg p-4 w-full max-w-md">
            <h2 className="text-2xl font-nunito font-bold mb-3 text-gray-900 uppercase tracking-wide">
              {editingTenant ? 'EDIT ORGANIZATION' : 'CREATE NEW ORGANIZATION'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-nunito font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-dotstark-primary focus:border-dotstark-primary transition-colors"
                  placeholder="Enter organization name"
                  required
                />
              </div>

              <div className='pt-2'>
                <label className="block text-sm font-nunito font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.fb_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, fb_url: e.target.value }))}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-dotstark-primary focus:border-dotstark-primary transition-colors"
                  placeholder="https://facebook.com/your-org"
                />
              </div>

              <div className='pt-2'>
                <label className="block text-sm font-nunito font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.insta_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, insta_url: e.target.value }))}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-dotstark-primary focus:border-dotstark-primary transition-colors"
                  placeholder="https://instagram.com/your-org"
                />
              </div>

              <div className="d-flex justify-content-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-3 rounded-full text-sm font-nunito font-bold uppercase tracking-wide transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="dotstark-gradient text-white px-4 py-3 pill-button font-nunito font-bold text-sm shadow-md"
                >
                  {editingTenant ? 'Update' : 'Create'} Organization
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManager;