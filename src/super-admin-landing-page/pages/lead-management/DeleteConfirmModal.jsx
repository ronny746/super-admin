import React from "react";
import Modal from "../../components/Modal";
import { LucideAlertTriangle, LucideTrash2 } from "lucide-react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, staffName }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
            <div className="text-center py-4">
                {/* Warning Icon */}
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <LucideAlertTriangle className="text-red-600" size={32} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Delete Counselor?
                </h3>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    Are you sure you want to remove{" "}
                    <span className="font-semibold text-gray-800">{staffName}</span>?
                    <br />
                    <span className="text-sm text-gray-500">This action cannot be undone.</span>
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <LucideTrash2 size={18} />
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
}
