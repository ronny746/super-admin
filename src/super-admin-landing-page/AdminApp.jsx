import { Routes, Route } from "react-router-dom";
import "./index.css";
import TestAccessPage from "./pages/student/TestAccessPage";
import TestWindowPage from "./pages/student/TestWindowPage";
import { Toaster } from "react-hot-toast";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import InstituteList from "./pages/InstituteList";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ImportStudents from "./pages/ImportStudents";
import ImportTeachers from "./pages/ImportTeachers";
import React from "react";
import StudentListPage from "./pages/StudentListPage";
import TeacherListPage from "./pages/TeacherListPage";
import RosterPage from "./pages/RosterPage";
import StudentAttendancePage from "./components/StudentAttendancePage";
import AttendanceDashboard from "./pages/AttendanceDashboard";
import AdminLayout from "./layouts/AdminLayout";
import ClassListPage from "./pages/ClassListPage";
import SubjectListPage from "./pages/SubjectListPage";
import TestStudentPage from "./pages/TestStudentPage";
import QuestionImportPage from "./pages/QuestionImportPage";
import QuestionBankPage from "./pages/QuestionBankPage";
const PaperGenerator = React.lazy(() => import('./pages/paper-generator/PaperGenerator'));
import LiveMonitoringPage from "./pages/LiveMonitoringPage";
import ResultReviewPage from "./pages/ResultReviewPage";
import TestManagementPage from "./pages/TestManagementPage";
import ReportCardPage from "./pages/ReportCardPage";
import SettingsPage from "./pages/SettingsPage";
import StudentReportsPage from "./pages/StudentReportsPage";

import FormsList from "./pages/forms/FormsList";
import FormBuilder from "./pages/forms/FormBuilder";
import FormView from "./pages/forms/FormView";
import FormResponses from "./pages/forms/FormResponses";
import SubAdminManagement from "./pages/SubAdminManagement";
import ThankYou from "../landing-page/pages/ThankYou";
import LeadManagementLayout from "./pages/lead-management/LeadManagementLayout";
import LeadDashboard from "./pages/lead-management/LeadDashboard";
import AllLeadsPage from "./pages/lead-management/AllLeadsPage";
import StaffReportsPage from "./pages/lead-management/StaffReportsPage";
import OffersPage from "./pages/lead-management/OffersPage";
import StaffPage from "./pages/lead-management/StaffPage";
import TasksPage from "./pages/lead-management/TasksPage";
import MobileUsersPage from "./pages/lead-management/MobileUsersPage";
import PublicSlotBooking from "./pages/PublicSlotBooking";
import SlotBookingLayout from "./pages/slot-booking/SlotBookingLayout";
import SlotDashboard from "./pages/slot-booking/SlotDashboard";
import ExamsPage from "./pages/slot-booking/ExamsPage";
import ExamsCreatePage from "./pages/slot-booking/ExamsCreatePage";
import CentersPage from "./pages/slot-booking/CentersPage";
import CentersCreatePage from "./pages/slot-booking/CentersCreatePage";
import SlotsPage from "./pages/slot-booking/SlotsPage";
import SlotsCreatePage from "./pages/slot-booking/SlotsCreatePage";
import BookingsPage from "./pages/slot-booking/BookingsPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { AppProvider } from "./context/AppContext";

import ResultSearchPage from "./pages/ResultSearchPage";

export default function AdminApp() {
  return (
    <AppProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Login */}
        <Route index element={<AdminLogin />} />

        {/* Public Result Portal */}
        <Route path="result" element={<ResultSearchPage />} />

        {/* Student Test Routes (Public/Protected by OTP) */}
        <Route path="test/:testId" element={<TestAccessPage />} />
        <Route path="exam/:testId" element={<TestWindowPage />} />

        {/* Form Public View */}
        <Route path="forms/view/:id" element={<FormView />} />
        <Route path="forms/view/:id/thank-you" element={<ThankYou />} />
        <Route path="form/:slug" element={<FormView />} />
        <Route path="form/:slug/thank-you" element={<ThankYou />} />



        {/* Super Admin */}
        <Route path="super-admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="super-admin/dashboard/list" element={<InstituteList />} />

        {/* Admin */}
        {/* Admin layout wrapper */}
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Attendance System Routes */}
          <Route element={<ProtectedRoute permission="attendance_system" />}>
            <Route path="attendance-dashboard" element={<AttendanceDashboard />} />
            <Route path="import-students" element={<ImportStudents />} />
            <Route path="import-teachers" element={<ImportTeachers />} />
            <Route path="students" element={<StudentListPage />} />
            <Route path="teachers" element={<TeacherListPage />} />
            <Route path="roster" element={<RosterPage />} />
            <Route path="classes" element={<ClassListPage />} />
            <Route path="subjects" element={<SubjectListPage />} />
            <Route path="attendance/student/:studentId" element={<StudentAttendancePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="manage-sub-admins" element={<SubAdminManagement />} />
            <Route path="report-cards" element={<ReportCardPage />} />
          </Route>

          {/* Test System Routes */}
          <Route element={<ProtectedRoute permission="test_system" />}>
            <Route path="test-students" element={<TestStudentPage />} />
            <Route path="tests" element={<TestManagementPage />} />
            <Route path="questions-import" element={<QuestionImportPage />} />
            <Route path="question-bank" element={<QuestionBankPage />} />
            <Route path="paper-generator" element={
              <React.Suspense fallback={<div className="p-10 text-center">Loading Generator...</div>}>
                <PaperGenerator />
              </React.Suspense>
            } />
            <Route path="live-monitoring" element={<LiveMonitoringPage />} />
            <Route path="results-review" element={<ResultReviewPage />} />
            <Route path="student-reports" element={<StudentReportsPage />} />
          </Route>

          {/* Form Links */}
          <Route element={<ProtectedRoute permission="forms" />}>
            <Route path="forms" element={<FormsList />} />
            <Route path="forms/create" element={<FormBuilder />} />
            <Route path="forms/edit/:id" element={<FormBuilder />} />
            <Route path="forms/responses/:id" element={<FormResponses />} />
          </Route>

          {/* Lead Management Routes */}
          {/* <Route element={<ProtectedRoute permission="lead_management" />}> */}
          <Route path="lead-management" element={<LeadManagementLayout />}>
            <Route path="dashboard" element={<LeadDashboard />} />
            <Route index element={<LeadDashboard />} />
            <Route path="leads" element={<AllLeadsPage />} />
            <Route path="focus-today" element={<AllLeadsPage isFocusToday={true} />} />
            <Route path="staff-reports" element={<StaffReportsPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="rewards" element={<MobileUsersPage />} />
          </Route>

          {/* Slot Booking System */}
          <Route element={<ProtectedRoute permission="slot_booking" />}>
            <Route path="slot-booking" element={<SlotBookingLayout />}>
              <Route index element={<SlotDashboard />} />
              <Route path="dashboard" element={<SlotDashboard />} />
              <Route path="exams" element={<ExamsPage />} />
              <Route path="exams/create" element={<ExamsCreatePage />} />
              <Route path="exams/edit/:id" element={<ExamsCreatePage />} />

              <Route path="centers" element={<CentersPage />} />
              <Route path="centers/create" element={<CentersCreatePage />} />
              <Route path="centers/edit/:id" element={<CentersCreatePage />} />

              <Route path="slots" element={<SlotsPage />} />
              <Route path="slots/create" element={<SlotsCreatePage />} />
              <Route path="slots/edit/:id" element={<SlotsCreatePage />} />

              <Route path="bookings" element={<BookingsPage />} />
            </Route>
          </Route>
          {/* </Route> */}
        </Route>
      </Routes>
    </AppProvider>
  );
}
