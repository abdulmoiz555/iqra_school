import React, { useState } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudentsList } from './components/students/StudentsList';
import { StudentFormModal } from './components/students/StudentFormModal';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { StudentPromotionModal } from './components/students/StudentPromotionModal';
import { StudentIdCardModal } from './components/common/StudentIdCardModal';
import { ParentsList } from './components/parents/ParentsList';
import { TeachersList } from './components/teachers/TeachersList';
import { StaffList } from './components/staff/StaffList';
import { AcademicsHub } from './components/academics/AcademicsHub';
import { StudentAttendanceView } from './components/attendance/StudentAttendanceView';
import { FeesHub } from './components/fees/FeesHub';
import { FeeCollectionModal } from './components/fees/FeeCollectionModal';
import { PrintReceiptModal } from './components/common/PrintReceiptModal';
import { ExamsHub } from './components/examinations/ExamsHub';
import { LibraryView } from './components/library/LibraryView';
import { TransportView } from './components/transport/TransportView';
import { InventoryView } from './components/inventory/InventoryView';
import { HRHub } from './components/hr/HRHub';
import { NoticeBoardView } from './components/communication/NoticeBoardView';
import { ReportsHub } from './components/reports/ReportsHub';
import { SchoolSettingsView } from './components/settings/SchoolSettingsView';
import { RolesPermissionsView } from './components/settings/RolesPermissionsView';
import { IndexPage } from './components/public/IndexPage';
import { SignInPage } from './components/public/SignInPage';
import { Student, FeePayment } from './types';

export const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();
  const [portalMode, setPortalMode] = useState<'index' | 'signin' | 'portal'>('index');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Parent and Student strict redirection: Only have access to My Profile/Children, Attendance, Fees, and Exams
  React.useEffect(() => {
    if (
      (currentUser.role === 'Parent' || currentUser.role === 'Student') &&
      (activeTab === 'dashboard' || !['students', 'attendance', 'fees', 'examinations'].includes(activeTab))
    ) {
      setActiveTab('students');
    }
  }, [currentUser.role, activeTab, setActiveTab]);

  // Global modals
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [studentToView, setStudentToView] = useState<Student | null>(null);
  const [studentForIdCard, setStudentForIdCard] = useState<Student | null>(null);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);

  // Quick Action Fee Collection
  const [isQuickFeeOpen, setIsQuickFeeOpen] = useState(false);
  const [quickReceiptToPrint, setQuickReceiptToPrint] = useState<FeePayment | null>(null);

  const handleOpenQuickAction = (action: string) => {
    switch (action) {
      case 'add-student':
        setStudentToEdit(null);
        setIsAddStudentOpen(true);
        break;
      case 'collect-fee':
        setIsQuickFeeOpen(true);
        break;
      case 'take-attendance':
        setActiveTab('attendance');
        break;
      case 'add-teacher':
        setActiveTab('teachers');
        break;
      case 'enter-marks':
        setActiveTab('examinations');
        break;
      case 'add-notice':
        setActiveTab('communication');
        break;
      default:
        break;
    }
  };

  if (portalMode === 'index') {
    return (
      <IndexPage
        onNavigateToSignIn={() => setPortalMode('signin')}
        onEnterPortalDirectly={() => setPortalMode('portal')}
      />
    );
  }

  if (portalMode === 'signin') {
    return (
      <SignInPage
        onBackToIndex={() => setPortalMode('index')}
        onLoginSuccess={() => setPortalMode('portal')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100 flex flex-col transition-colors">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigateToPublic={() => setPortalMode('index')}
      />

      <div className="flex flex-1">
        {/* Responsive Collapsible Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 md:p-6 pb-16 overflow-x-hidden">
          <div className="mx-auto max-w-7xl">
            {activeTab === 'dashboard' && (
              <DashboardView onOpenQuickAction={handleOpenQuickAction} />
            )}

            {activeTab === 'students' && (
              <StudentsList
                onAddStudent={() => {
                  setStudentToEdit(null);
                  setIsAddStudentOpen(true);
                }}
                onEditStudent={(stu) => {
                  setStudentToEdit(stu);
                  setIsAddStudentOpen(true);
                }}
                onViewStudent={(stu) => setStudentToView(stu)}
                onGenerateIdCard={(stu) => setStudentForIdCard(stu)}
                onOpenPromotion={() => setIsPromotionOpen(true)}
              />
            )}

            {activeTab === 'parents' && <ParentsList />}
            {activeTab === 'teachers' && <TeachersList />}
            {activeTab === 'staff' && <StaffList />}
            {activeTab === 'academics' && <AcademicsHub />}
            {activeTab === 'attendance' && <StudentAttendanceView />}
            {activeTab === 'fees' && <FeesHub />}
            {activeTab === 'examinations' && <ExamsHub />}
            {activeTab === 'library' && <LibraryView />}
            {activeTab === 'transport' && <TransportView />}
            {activeTab === 'inventory' && <InventoryView />}
            {activeTab === 'hr' && <HRHub />}
            {activeTab === 'communication' && <NoticeBoardView />}
            {activeTab === 'reports' && <ReportsHub />}
            {activeTab === 'roles_permissions' && <RolesPermissionsView />}
            {activeTab === 'settings' && <SchoolSettingsView />}
          </div>
        </main>
      </div>

      {/* Global Student Modals */}
      <StudentFormModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        studentToEdit={studentToEdit}
      />

      <StudentProfileModal
        isOpen={Boolean(studentToView)}
        onClose={() => setStudentToView(null)}
        student={studentToView}
        onGenerateIdCard={(stu) => {
          setStudentToView(null);
          setStudentForIdCard(stu);
        }}
      />

      <StudentPromotionModal
        isOpen={isPromotionOpen}
        onClose={() => setIsPromotionOpen(false)}
      />

      <StudentIdCardModal
        isOpen={Boolean(studentForIdCard)}
        onClose={() => setStudentForIdCard(null)}
        student={studentForIdCard}
      />

      {/* Quick Collect Fee Modal */}
      {isQuickFeeOpen && (
        <FeeCollectionModal
          isOpen={isQuickFeeOpen}
          onClose={() => setIsQuickFeeOpen(false)}
          onFeeCollected={(p) => setQuickReceiptToPrint(p)}
        />
      )}

      {/* Quick Receipt Modal */}
      {quickReceiptToPrint && (
        <PrintReceiptModal
          isOpen={Boolean(quickReceiptToPrint)}
          onClose={() => setQuickReceiptToPrint(null)}
          payment={quickReceiptToPrint}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
