import React, { useState } from "react";
import { LucideTag, LucidePlus, LucideCalendarClock, LucideTrash2, LucideEdit, LucideImage } from "lucide-react";
import CreateOfferModal from "./CreateOfferModal";

import { createOffer, getOffers } from "../../api/offerApi";
import toast from "react-hot-toast";

export default function OffersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const res = await getOffers();
            if (res.success) {
                setOffers(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch offers:", error);
            // toast.error("Failed to load offers");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOffer = async (formData) => {
        try {
            const res = await createOffer(formData);
            if (res.success) {
                toast.success("Offer created successfully!");
                fetchOffers(); // Refresh list
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Create offer error:", error);
            toast.error(error.response?.data?.message || "Failed to create offer");
        }
    };

    return (
        <>
            <CreateOfferModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateOffer}
            />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Active Offers</h2>
                        <p className="text-gray-500 text-sm">Manage offers visible to counselors and students</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <LucidePlus size={18} />
                        Create Offer
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-gray-500 col-span-3 text-center py-10">Loading offers...</p>
                    ) : offers.length === 0 ? (
                        <div className="col-span-3 text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <LucideTag size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No active offers found</p>
                            <p className="text-sm text-gray-400 mt-1">Create a new offer to get started</p>
                        </div>
                    ) : (
                        offers.map((offer) => (
                            <div key={offer._id} className="relative overflow-hidden bg-white border rounded-xl shadow-sm hover:shadow-md transition-all group">
                                {/* Banner Strip - using style for dynamic color */}
                                {offer.image ? (
                                    <div className="h-40 w-full overflow-hidden">
                                        <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                ) : (
                                    <div
                                        className="h-2 w-full"
                                        style={{ backgroundColor: offer.bannerColor || '#00C853' }}
                                    ></div>
                                )}

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-2 items-center">
                                            <div
                                                className="w-10 h-10 rounded-lg bg-opacity-10 flex items-center justify-center"
                                                style={{
                                                    backgroundColor: `${offer.bannerColor}10`, // 10% opacity
                                                    color: offer.bannerColor
                                                }}
                                            >
                                                <LucideTag size={20} />
                                            </div>
                                            {offer.image && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                                    <LucideImage size={12} /> BANNER
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600 uppercase tracking-wider">
                                            {offer.offerType || offer.type}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{offer.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{offer.description}</p>

                                    {/* Target Roles Badge */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {(offer.targetRoles || []).map((role, idx) => (
                                            <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 uppercase font-medium">
                                                {role === 'all' ? 'Everyone' : role.replace('_', ' ')}
                                            </span>
                                        ))}
                                        {(!offer.targetRoles || offer.targetRoles.length === 0) && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200 uppercase font-medium">
                                                General
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center text-xs text-gray-500 mb-6">
                                        <LucideCalendarClock size={14} className="mr-1" />
                                        Valid till: <span className="font-medium ml-1">
                                            {offer.validTill ? new Date(offer.validTill).toLocaleDateString() : 'No Expiry'}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 border-t pt-4">
                                        {/* Edit/Delete can be implemented later */}
                                        <button className="flex-1 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2 opacity-50 cursor-not-allowed" title="Coming Soon">
                                            <LucideTrash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
