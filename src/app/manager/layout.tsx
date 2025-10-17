
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AccessDenied = () => (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
                <Button asChild>
                    <Link href="/">Go to Homepage</Link>
                </Button>
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
);


export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This is a client-side check. A server-side check would be needed for true security.
    if (!loading && (!user || (user.role !== 'Manager' && user.role !== 'Admin'))) {
      // Instead of router.push, we render an explicit "Access Denied" component
      // to avoid flashing content and to provide a better user experience.
    }
  }, [user, loading, router]);

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen">
          <Header />
            <div className="flex-grow container mx-auto px-4 py-8">
                <Skeleton className="h-12 w-1/4 mb-8" />
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
          <Footer />
        </div>
    );
  }

  if (!user || (user.role !== 'Manager' && user.role !== 'Admin')) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
