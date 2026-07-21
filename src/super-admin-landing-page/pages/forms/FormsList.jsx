import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, ExternalLink, Copy, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getForms } from '../../api/formApi';
import { useAppContext } from '../../context/AppContext';

export default function FormsList() {
    const { user } = useAppContext();
    const [forms, setForms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const canCreateForm = user?.role !== 'SUB_ADMIN' && user?.role !== 'COUNSELOR';

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const data = await getForms();
            if (data.success) {
                setForms(data.data);
            } else {
                toast.error('Failed to load forms');
            }
        } catch (error) {
            console.error('Error fetching forms:', error);
            toast.error('Error fetching forms');
        } finally {
            setLoading(false);
        }
    };



    const copyToClipboard = (form) => {
        const url = form.slug
            ? `${window.location.origin}/admin/form/${form.slug}`
            : `${window.location.origin}/admin/forms/view/${form._id}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Form link copied to clipboard!');
        }, (err) => {
            console.error('Could not copy text: ', err);
            toast.error('Failed to copy link');
        });
    };

    const getFormUrl = (form) => {
        return form.slug ? `/admin/form/${form.slug}` : `/admin/forms/view/${form._id}`;
    };

    return (
        <div className="space-y-6">

            <div className="flex justify-between items-center bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Forms Manager</h1>
                    <p className="text-blue-600 mt-2 font-medium">Create and manage your collection forms</p>
                </div>
                {canCreateForm && (
                    <Link
                        to="/admin/forms/create"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold"
                    >
                        <Plus size={20} />
                        Create New Form
                    </Link>
                )}
            </div>

            {/* Search Bar */}
            {!loading && forms.length > 0 && (
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search forms by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
                    />
                </div>
            )}


            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : forms.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No forms created yet.</p>
                    <Link to="/admin/forms/create" className="text-blue-600 font-medium hover:underline mt-2 inline-block">
                        Create your first form
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {forms.filter(form => 
                        form.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        form.description?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((form) => (
                        <div key={form._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200 flex flex-col h-full group">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{form.title}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${form.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {form.isActive ? 'Active' : 'Closed'}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{form.description || 'No description provided'}</p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{form.questions?.length || 0} Questions</span>
                                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md font-bold">{form.responseCount || 0} Responses</span>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">Created: {new Date(form.createdAt).toLocaleDateString()}</span>
                                    {form.slug && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-mono">/{form.slug}</span>
                                    )}
                                    {form.images && form.images.length > 0 && (
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md">📸 {form.images.length}</span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-xl flex justify-between items-center gap-2">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => window.open(getFormUrl(form), '_blank')}
                                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition font-medium"
                                        title="View Public Form"
                                    >
                                        <ExternalLink size={16} /> View
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(form)}
                                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition font-medium"
                                        title="Copy Public Link"
                                    >
                                        <Copy size={16} /> Copy
                                    </button>
                                </div>

                                <div className="flex gap-3">
                                    <Link to={`/admin/forms/edit/${form._id}`} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition" title="Edit">
                                        <Edit size={18} />
                                    </Link>
                                    <Link to={`/admin/forms/responses/${form._id}`} className="text-indigo-600 hover:text-indigo-800 p-1 hover:bg-indigo-50 rounded transition text-sm font-medium" title="Responses">
                                        Responses
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
