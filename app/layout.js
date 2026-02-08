import { Oswald } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientLayout from "@/components/ClientLayout";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import LanguageModal from "@/components/LanguageModal";
import CookieConsent from "@/components/CookieConsent";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "HITREX",
  description: "Explore the best trekking and adventure trips",
};

async function getMessages(locale) {
  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    return (await import(`../messages/en.json`)).default;
  }
}

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={`${oswald.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>

            {/* ✅ Navbar control happens here */}
            <ClientLayout>
              {children}
            </ClientLayout>

            <LanguageModal />

            <CookieConsent />

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              pauseOnHover
              draggable
              theme="colored"
            />
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
