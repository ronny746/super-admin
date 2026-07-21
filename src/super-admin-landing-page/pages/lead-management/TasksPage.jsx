import React, { useState, useEffect } from "react";
import { LucidePlus, LucideCheckCircle, LucideClock, LucideAlertCircle, LucideTrash2, LucideCalendar, LucideImage } from "lucide-react";
import CreateTaskModal from "./CreateTaskModal";
import { getTasks, createTask, updateTaskStatus, deleteTask } from "../../api/leadApi";
import toast from "react-hot-toast";

const mockTasks = [
    { id: 1, title: "Call Rahul for IIT-JEE follow up", assignedTo: "Amit Sharma", priority: "High", dueDate: "2024-02-12", status: "Pending", type: "Call" },
    { id: 2, title: "Send brochure to Priya Singh", assignedTo: "Sneha Verma", priority: "Medium", dueDate: "2024-02-13", status: "In Progress", type: "Email" },
    { id: 3, title: "Home visit for Aditya Raj", assignedTo: "Amit Sharma", priority: "Low", dueDate: "2024-02-14", status: "Pending", type: "Visit" },
    { id: 4, title: "Fee negotiation with Neha", assignedTo: "Rohan Das", priority: "High", dueDate: "2024-02-10", status: "Completed", type: "Meeting" },
];

const priorityColors = {
    "High": "bg-red-100 text-red-700",
    "Medium": "bg-yellow-100 text-yellow-700",
    "Low": "bg-green-100 text-green-700",
};

const statusIcons = {
    "Pending": <LucideClock size={16} className="text-orange-500" />,
    "In Progress": <LucideAlertCircle size={16} className="text-blue-500" />,
    "Completed": <LucideCheckCircle size={16} className="text-green-500" />,
};

export default function TasksPage() {
    const [filter, setFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasksList, setTasksList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await getTasks();
            if (res.success) {
                setTasksList(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (formData) => {
        try {
            const res = await createTask(formData);
            if (res.success) {
                toast.success("Task created successfully!");
                fetchTasks();
                setIsModalOpen(false);
            }
        } catch (error) {
            toast.error("Failed to create task");
        }
    };

    const handleMarkComplete = async (taskId) => {
        try {
            const res = await updateTaskStatus(taskId, "Completed");
            if (res.success) {
                toast.success("Task marked as completed");
                fetchTasks();
            }
        } catch (error) {
            toast.error("Failed to update task");
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            const res = await deleteTask(taskId);
            if (res.success) {
                toast.success("Task deleted successfully");
                fetchTasks();
            }
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    const filteredTasks = filter === "All" ? tasksList : tasksList.filter(t => t.status === filter);

    return (
        <>
            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTask}
            />
            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Task Management</h2>
                        <p className="text-gray-500 text-sm">Assign and track tasks for your team</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All Tasks</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <LucidePlus size={18} />
                            Create Task
                        </button>
                    </div>
                </div>

                {/* Task List */}
                <div className="grid gap-4">
                    {filteredTasks.map((task) => (
                        <div key={task._id || task.id} className="bg-white border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow">

                            {/* Left: Icon & Details */}
                            <div className="flex items-start gap-4">
                                {task.image ? (
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border shrink-0">
                                        <img src={task.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className={`p-3 rounded-full shrink-0 ${task.status === 'Completed' ? 'bg-green-50' : 'bg-blue-50'}`}>
                                        {statusIcons[task.status] || <LucideClock size={20} />}
                                    </div>
                                )}
                                <div>
                                    <h3 className={`font-semibold text-gray-800 ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>
                                        {task.title}
                                        {task.image && (
                                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 ml-2 uppercase tracking-tight">
                                                <LucideImage size={10} /> Image
                                            </span>
                                        )}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1 text-[11px] md:text-sm">
                                            <LucideCalendar size={14} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}
                                        </span>
                                        <span>•</span>
                                        <span className="text-[11px] md:text-sm">Assigned: <span className="font-medium text-gray-700">{task.assignedTo?.name || (task.assignedTo?.firstName + ' ' + task.assignedTo?.lastName) || "N/A"}</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Priority & Actions */}
                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                                    {task.priority}
                                </span>

                                <div className="flex gap-2">
                                    {task.status !== 'Completed' && (
                                        <button 
                                            onClick={() => handleMarkComplete(task._id || task.id)}
                                            className="px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-50 border border-green-200 rounded-lg transition-colors"
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDeleteTask(task._id || task.id)}
                                        className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                                        title="Delete Task"
                                    >
                                        <LucideTrash2 size={18} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
