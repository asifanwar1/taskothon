import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import { ServiceWorker } from "@/components/ServiceWorker/ServiceWorker";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Taskothon - Task Tracking App",
    description: "Track your daily engineering tasks",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Taskothon",
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        icon: "/icon-192x192.png",
        apple: "/icon-192x192.png",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
    themeColor: "#2563eb",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ServiceWorker />
                <ProtectedRoute>{children}</ProtectedRoute>
            </body>
        </html>
    );
}
