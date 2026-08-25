import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import ExpensesPage from "./pages/ExpensesPage";
import LoansPage from "./pages/LoansPage";
import ScholarshipsPage from "./pages/ScholarshipsPage";
import BudgetPage from "./pages/BudgetPage";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { onAuthChange, getProfile } from "./lib/firebase";
import { getCountryByCode } from "./lib/countries";

// Default profile for demo / quick testing
const DEFAULT_PROFILE = {
  country: "IN",
  countryData: getCountryByCode("IN"),
  name: "Aarav Sharma",
  university: "IIT Bombay",
  course: "Computer Science & Engineering",
  year: "2nd Year",
  income: 15000,
  currency: "INR",
  goals: ["Save for travel / laptop", "Build emergency fund"],
  onboarded: true,
};

const INITIAL_EXPENSES = [
  { id: "1", category: "Food", amount: 3200, date: "2026-08-20", note: "Weekly groceries & dining out" },
  { id: "2", category: "Transport", amount: 800, date: "2026-08-21", note: "Metro pass" },
  { id: "3", category: "Education", amount: 1500, date: "2026-08-22", note: "Textbooks & reference code" },
  { id: "4", category: "Entertainment", amount: 650, date: "2026-08-23", note: "Movie & snacks" },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [budget, setBudget] = useState({ total: 15000, allocations: { Needs: 50, Wants: 30, Savings: 20 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userProfile = await getProfile(currentUser.uid);
          if (userProfile) {
            setProfile({
              ...userProfile,
              countryData: getCountryByCode(userProfile.country || "IN"),
            });
          }
        } catch {
          // fallback to default profile if firestore read fails
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Main Layout for authenticated pages
  const AuthenticatedLayout = ({ children, title }) => (
    <div className="flex h-screen bg-bg text-textPrimary overflow-hidden">
      <Sidebar user={user} profile={profile} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopBar user={user} profile={profile} title={title} />
        <main className="flex-1 bg-bg">{children}</main>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-textPrimary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-textSecondary font-mono">Loading FinWise AI...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/auth" element={<AuthPage setUser={setUser} setProfile={setProfile} />} />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={<OnboardingPage user={user} setProfile={setProfile} />}
        />

        {/* App Pages */}
        <Route
          path="/dashboard"
          element={
            <AuthenticatedLayout title="Dashboard">
              <DashboardPage profile={profile} expenses={expenses} budget={budget} />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/chat"
          element={
            <AuthenticatedLayout title="FinBot AI Assistant">
              <ChatPage profile={profile} expenses={expenses} budget={budget} />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/expenses"
          element={
            <AuthenticatedLayout title="Expense Analyzer">
              <ExpensesPage profile={profile} expenses={expenses} setExpenses={setExpenses} />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/loans"
          element={
            <AuthenticatedLayout title="Student Loan Advisor">
              <LoansPage profile={profile} />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/scholarships"
          element={
            <AuthenticatedLayout title="Scholarship Finder">
              <ScholarshipsPage profile={profile} />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/budget"
          element={
            <AuthenticatedLayout title="Budget Planner">
              <BudgetPage profile={profile} budget={budget} setBudget={setBudget} />
            </AuthenticatedLayout>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
