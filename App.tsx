import * as React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ConfigProvider } from "@/components/providers/config-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { useAuthStore } from "@/stores/auth-store";
import { registerMessagingServiceWorker, onForegroundMessage, showFCMNotification } from "@/lib/firebase";
import { isCapacitor } from "@/lib/capacitor";
import { initNativePushNotifications, setupPushNotificationListeners } from "@/lib/push-notifications";
import { initNativeBackButton } from "@/lib/back-button";
import { toast } from "sonner";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Auth Pages
import SplashPage from "@/pages/SplashPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import VerifyOtpPage from "@/pages/auth/VerifyOtpPage";
import SetupPinPage from "@/pages/auth/SetupPinPage";

// Main Pages - Root Level
import DashboardPage from "@/pages/main/DashboardPage";
import HistoryPage from "@/pages/main/HistoryPage";
import MyAccountPage from "@/pages/main/MyAccountPage";
import HelpPage from "@/pages/main/HelpPage";
import ReportPage from "@/pages/main/ReportPage";
import PrinterPage from "@/pages/main/PrinterPage";
import OmniChannelPage from "@/pages/main/OmniChannelPage";
import ContactUsPage from "@/pages/main/ContactUsPage";

// Transaction Pages
import PrabayarPage from "@/pages/main/transaction/prabayar/PrabayarPage";
import PascabayarPage from "@/pages/main/transaction/pascabayar/PascabayarPage";
import TransferMemberPage from "@/pages/main/transaction/transfer/TransferMemberPage";
import TransferBankPage from "@/pages/main/transaction/transfer/TransferBankPage";
import TransactionDetailPage from "@/pages/main/transaction/TransactionDetailPage";
import PinTransactionPage from "@/pages/main/transaction/PinTransactionPage";
import CheckoutPage from "@/pages/main/transaction/CheckoutPage";

// Deposit Pages
import DepositPage from "@/pages/main/deposit/DepositPage";
import DepositDetailPage from "@/pages/main/deposit/DepositDetailPage";

// Downline Pages
import DownlinePage from "@/pages/main/downline/DownlinePage";
import AddMemberPage from "@/pages/main/downline/AddMemberPage";
import DownlineWithdrawPage from "@/pages/main/downline/DownlineWithdrawPage";

// Information Pages
import InformationPage from "@/pages/main/information/InformationPage";
import InformationDetailPage from "@/pages/main/information/InformationDetailPage";

// Contacts Pages
import ContactsPage from "@/pages/main/contacts/ContactsPage";

// Content Pages (Legal & Static)
import TermsOfServicePage from "@/pages/main/content/TermsOfServicePage";
import PrivacyPolicyPage from "@/pages/main/content/PrivacyPolicyPage";
import FaqContentPage from "@/pages/main/content/FaqContentPage";
import AboutAppPage from "@/pages/main/content/AboutAppPage";

// Account Sub-Pages
import AccountPasswordPage from "@/pages/main/account/AccountPasswordPage";

import AccountUpgradePage from "@/pages/main/account/AccountUpgradePage";
import AccountQuestionPage from "@/pages/main/account/AccountQuestionPage";
import PersonalDataPage from "@/pages/main/account/PersonalDataPage";
import BalanceMutationPage from "@/pages/main/account/BalanceMutationPage";
import DeleteAccountPage from "@/pages/main/account/DeleteAccountPage";
import VerificationPage from "@/pages/main/account/VerificationPage";
import PhotoInstructionPage from "@/pages/main/account/PhotoInstructionPage";
import OutletDataPage from "@/pages/main/account/OutletDataPage";
import ReferralMarkupPage from "@/pages/main/account/ReferralMarkupPage";
import TransactionPinPage from "@/pages/main/account/TransactionPinPage";
import AccountChangePinPage from "@/pages/main/account/AccountChangePinPage";


// Error Page
import ErrorPage, { NotFoundErrorPage } from "@/pages/ErrorPage";

// Demo Guard - Redirects demo account away from restricted pages
function DemoGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isDemoAccount = user?.phone === "08900913";
  
  React.useEffect(() => {
    if (isDemoAccount) {
      navigate('/dashboard', { replace: true });
    }
  }, [isDemoAccount, navigate]);
  
  if (isDemoAccount) return null;
  return <>{children}</>;
}

function App() {
  // Register Firebase Messaging Service Worker on app load (no token sync yet)
  React.useEffect(() => {
    registerMessagingServiceWorker();
  }, []);

  // Setup foreground message handler (always active, regardless of current page)
  React.useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      console.log('[App] Foreground message received:', payload);
      const { title, body } = payload.notification || {};

      // Play notification sound
      try {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => { /* Ignore autoplay errors */ });
      } catch { /* Audio not critical */ }

      // Show toast notification
      toast.info(title || 'Notifikasi Serpul', {
        description: body || '',
        duration: 5000,
      });

      // Try system notification
      try {
        showFCMNotification(payload);
      } catch (e) {
        console.log('[App] System notification blocked in foreground, toast shown instead');
      }
    });

    return unsubscribe;
  }, []);

  // Initialize native push notifications for Capacitor
  React.useEffect(() => {
    if (!isCapacitor()) return;
    
    initNativePushNotifications();
    const cleanup = setupPushNotificationListeners();
    return cleanup;
  }, []);

  // Initialize native plugins (status bar, keyboard) for Capacitor
  React.useEffect(() => {
    if (!isCapacitor()) return;
    
    const initNative = async () => {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        const { Keyboard } = await import('@capacitor/keyboard');
        
        // Set status bar style to light (white icons) since primary background is dark gradient
        await StatusBar.setStyle({ style: Style.Dark });
        
        // Keyboard: enable scroll to prevent input being hidden by keyboard
        await Keyboard.setScroll({ isDisabled: false });
        
        console.log('[App] Native plugins initialized');
      } catch (e) {
        console.log('[App] Native plugins init skipped:', e);
      }
    };
    
    initNative();
    initNativeBackButton();
  }, []);

  return (
    <ThemeProvider defaultTheme="light">
    <ConfigProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Splash */}
          <Route path="/" element={<SplashPage />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/setup-pin" element={<SetupPinPage />} />
          </Route>

          {/* Standalone Pages (No Bottom Nav) */}
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />

          {/* Main Routes (Protected with Bottom Nav) */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:type" element={<HistoryPage />} />
            <Route path="/deposit" element={<DepositPage />} />
            <Route path="/deposit/:id" element={<DepositDetailPage />} />
            <Route path="/transfer" element={<TransferMemberPage />} />
            <Route path="/transfer/member" element={<TransferMemberPage />} />
            <Route path="/transfer/bank" element={<TransferBankPage />} />

            <Route path="/downline" element={<DemoGuard><DownlinePage /></DemoGuard>} />

            <Route path="/downline/withdraw" element={<DemoGuard><DownlineWithdrawPage /></DemoGuard>} />
            <Route path="/downline/add" element={<DemoGuard><AddMemberPage /></DemoGuard>} />
            <Route path="/information" element={<InformationPage />} />
            <Route path="/information/:id" element={<InformationDetailPage />} />
            <Route path="/my-account" element={<MyAccountPage />} />
            <Route path="/my-account/account-password" element={<AccountPasswordPage />} />
            
            <Route path="/my-account/account-upgrade" element={<DemoGuard><AccountUpgradePage /></DemoGuard>} />
            <Route path="/my-account/account-question" element={<AccountQuestionPage />} />
            <Route path="/my-account/personal-data" element={<PersonalDataPage />} />
            <Route path="/my-account/balance-mutation" element={<BalanceMutationPage />} />
            <Route path="/my-account/delete-account" element={<DeleteAccountPage />} />
            <Route path="/my-account/verification" element={<VerificationPage />} />
            <Route path="/my-account/photo-instruction" element={<PhotoInstructionPage />} />
            
            <Route path="/my-account/outlet-data" element={<OutletDataPage />} />
            <Route path="/my-account/referral-markup" element={<ReferralMarkupPage />} />
            <Route path="/my-account/transaction-pin" element={<TransactionPinPage />} />
            <Route path="/my-account/change-pin" element={<AccountChangePinPage />} />
            {/* /contact removed - use /contact-us instead */}
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/help/faq" element={<FaqContentPage />} />
            <Route path="/about" element={<AboutAppPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/prabayar" element={<PrabayarPage />} />
            <Route path="/pascabayar" element={<PascabayarPage />} />
            <Route path="/omni" element={<OmniChannelPage />} />

            <Route path="/pin-transaction" element={<PinTransactionPage />} />
            <Route path="/transaction/:type/:id" element={<TransactionDetailPage />} />
            <Route path="/print/:type/:id" element={<PrinterPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFoundErrorPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;