import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Home, Upload, Users, Calendar, LogOut, BookOpen, FileText, GraduationCap, FileSpreadsheet, Monitor, CheckSquare, Settings, ChevronLeft, ChevronRight, Shield, LayoutDashboard, Flame } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import React from "react";
export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(window.innerWidth > 1024);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAppContext();

  const hasAccess = (permission) => {
    if (!user) return false;
    // If not a SUB_ADMIN, assume full access (e.g. Institute Admin)
    if (user.role !== 'SUB_ADMIN') return true;
    return user.permissions?.[permission];
  };

  return (
    <div className="flex min-h-screen ">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-50
          bg-linear-to-br from-blue-600 to-indigo-600
          text-white shadow-xl
          transition-all duration-300
          flex flex-col
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
          ${open ? "lg:w-64" : "lg:w-20"}
        `}
      >
        {/* Header with expand/collapse button */}
        <div
          className={`flex items-center px-5 py-5 border-b border-white/20 relative transition-all duration-200 ${open ? "justify-between" : "justify-center"
            }`}
        >
          <h1
            className={`text-xl font-semibold transition-all duration-200 ${open ? "opacity-100" : "opacity-0 w-0 overflow-hidden absolute"
              }`}
          >
            {user?.role === 'COUNSELOR' ? 'Counselor Panel' : 'Admin Panel'}
          </h1>
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileOpen(false);
              } else {
                setOpen(!open);
              }
            }}
            className="z-10 bg-white/10 hover:bg-white/20 rounded-full p-1 transition"
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {/* <X size={26} /> */}
            {open ? <ChevronLeft size={26} /> : <ChevronRight size={26} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-3 flex-1 overflow-y-auto">
          {user?.role === 'COUNSELOR' ? (
            <>
              <div className="text-xs text-white/60 font-semibold mt-4 mb-2 px-3">COUNSELOR SPACE</div>
              <Link
                to="/admin/lead-management/dashboard"
                className={`flex items-center gap-4 p-3 rounded-lg transition ${
                  location.pathname === '/admin/lead-management/dashboard' || location.pathname === '/admin/lead-management'
                    ? 'bg-white/30 text-white font-bold shadow-sm'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Monitor size={22} />
                {open && "My Dashboard"}
              </Link>

              <Link
                to="/admin/lead-management/leads"
                className={`flex items-center gap-4 p-3 rounded-lg transition ${
                  location.pathname === '/admin/lead-management/leads'
                    ? 'bg-white/30 text-white font-bold shadow-sm'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Users size={22} />
                {open && "My Leads"}
              </Link>
              <Link
                to="/admin/lead-management/tasks"
                className={`flex items-center gap-4 p-3 rounded-lg transition ${
                  location.pathname === '/admin/lead-management/tasks'
                    ? 'bg-white/30 text-white font-bold shadow-sm'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <CheckSquare size={22} />
                {open && "My Tasks"}
              </Link>
            </>
          ) : (
            <>
              {hasAccess('attendance_system') && (
                <>
                  {open && <div className="text-xs text-white/60 font-semibold mt-4 mb-2 px-3 uppercase text-nowrap">Attendance</div>}
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Home size={22} />
                    {open && "Dashboard"}
                  </Link>
                  <Link
                    to="/admin/attendance-dashboard"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <LayoutDashboard size={22} />
                    {open && "Attendance Dashboard"}
                  </Link>
                  <Link
                    to="/admin/import-students"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Upload size={22} />
                    {open && "Import Students"}
                  </Link>
                  <Link
                    to="/admin/import-teachers"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Users size={22} />
                    {open && "Import Teachers"}
                  </Link>
                  <Link
                    to="/admin/students"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Users size={22} />
                    {open && "Students List"}
                  </Link>
                  <Link
                    to="/admin/teachers"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Users size={22} />
                    {open && "Teachers List"}
                  </Link>
                  <Link
                    to="/admin/roster"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Calendar size={22} />
                    {open && "Class Roster"}
                  </Link>
                  <Link
                    to="/admin/classes"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <BookOpen size={22} />
                    {open && "Classes"}
                  </Link>
                  <Link
                    to="/admin/subjects"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <FileText size={22} />
                    {open && "Subjects"}
                  </Link>
                  <Link
                    to="/admin/report-cards"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <FileText size={22} />
                    {open && "Report Cards"}
                  </Link>
                </>
              )}


              {/* Test System Section */}
              {hasAccess('test_system') && (
                <>
                  {open && <div className="text-xs text-white/60 font-semibold mt-4 mb-2 px-3 uppercase text-nowrap">Test System</div>}
                  <Link
                    to="/admin/test-students"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <GraduationCap size={22} />
                    {open && "Test Students"}
                  </Link>
                  <Link
                    to="/admin/tests"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <FileText size={22} />
                    {open && "Tests"}
                  </Link>
                  <Link
                    to="/admin/questions-import"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <FileSpreadsheet size={22} />
                    {open && "Import Questions"}
                  </Link>
                  <Link
                    to="/admin/question-bank"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <BookOpen size={22} />
                    {open && "Question Bank"}
                  </Link>
                  <Link
                    to="/admin/paper-generator"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <FileText size={22} />
                    {open && "Paper Generator"}
                  </Link>
                  <Link
                    to="/admin/live-monitoring"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Monitor size={22} />
                    {open && "Live Monitoring"}
                  </Link>
                  <Link
                    to="/admin/results-review"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <CheckSquare size={22} />
                    {open && "Results Review"}
                  </Link>
                  <Link
                    to="/admin/student-reports"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <FileText size={22} />
                    {open && "Student Reports"}
                  </Link>
                </>
              )}

              {hasAccess('forms') && (
                <>
                  {open && <div className="text-xs text-white/60 font-semibold mt-4 mb-2 px-3 uppercase text-nowrap">Forms</div>}
                  <Link
                    to="/admin/forms"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <FileText size={22} />
                    {open && "Manage Forms"}
                  </Link>
                </>
              )}

              {/* Lead Management Section */}
              {hasAccess('academic_management') && (
                <>
                  {open && <div className="text-xs text-white/60 font-semibold mt-4 mb-2 px-3 uppercase">Lead Management</div>}
                  <Link
                    to="/admin/lead-management/dashboard"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Users size={22} />
                    {open && "Leads Dashboard"}
                  </Link>

                </>
              )}

              {/* Slot Booking Section */}
              {hasAccess('slot_booking') && (
                <>
                  {open && <div className="text-xs text-white/60 font-semibold mt-4 mb-2 px-3 uppercase">Slot Booking</div>}
                  <Link
                    to="/admin/slot-booking/dashboard"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Calendar size={22} />
                    {open && "Slot Booking"}
                  </Link>
                </>
              )}

              {/* Administration Section - Only for Admin */}
              {user?.role !== 'SUB_ADMIN' && (
                <>
                  {open && <div className="text-xs text-white/60 font-semibold mt-4 mb-2 px-3 uppercase text-nowrap">Administration</div>}
                  <Link
                    to="/admin/manage-sub-admins"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Shield size={22} />
                    {open && "Sub-Admins"}
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Settings size={22} />
                    {open && "Settings"}
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Logout button at bottom */}
        <div className="p-4 mt-auto">
          <button
            onClick={() => {
              logout();
              navigate("/admin");
            }}
            className="flex items-center gap-4 w-full p-3 rounded-lg bg-white/10 hover:bg-white/20 transition text-left"
          >
            <LogOut size={22} />
            {open && "Logout"}
          </button>
        </div>
      </div>

      {/* Main Page */}
      <div className={`flex-1 transition-all min-h-screen ${open ? "lg:ml-64" : "lg:ml-20"} ml-0`}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-20">
          <h1 className="text-xl font-bold text-gray-800">{user?.role === 'COUNSELOR' ? 'Counselor Panel' : 'Admin Panel'}</h1>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="bg-white shadow-lg rounded-2xl p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div >
  );
}
