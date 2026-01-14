import { Oswald } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientLayout from "@/components/ClientLayout";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "HITREX",
  description: "Explore the best trekking and adventure trips",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${oswald.className} antialiased`}>
        <SessionProvider>
          
          {/* ✅ Navbar control happens here */}
          <ClientLayout>
            {children}
          </ClientLayout>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            pauseOnHover
            draggable
            theme="colored"
          />
        </SessionProvider>
      </body>
    </html>
  );
}
