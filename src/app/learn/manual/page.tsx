
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { legalConfig } from '@/lib/legal';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import Head from 'next/head';

// Data types based on the specified model
interface ManualVersion {
    id: string;
    label: string;
    isCurrent: boolean;
}

interface ManualPage {
    id: string;
    slug: string;
    title: string;
    bodyMarkdown: string;
    updatedAt: Date;
    versionRef: any; // Firestore document reference
}

// Mock Markdown Renderer
const MarkdownRenderer = ({ content }: { content: string }) => {
    // In a real app, use a library like 'react-markdown'.
    // For this placeholder, we'll just display the text.
    return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />;
};

// Fetch logic
const fetchVersions = async (): Promise<ManualVersion[]> => {
    const versionsCol = collection(db, "manual_versions");
    const snapshot = await getDocs(versionsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ManualVersion));
};

const fetchPagesForVersion = async (versionId: string): Promise<ManualPage[]> => {
    const pagesCol = collection(db, "manual_pages");
    const versionRef = doc(db, "manual_versions", versionId);
    const q = query(pagesCol, where("versionRef", "==", versionRef), orderBy("order"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        slug: doc.data().slug,
        title: doc.data().title,
        bodyMarkdown: doc.data().bodyMarkdown,
        updatedAt: doc.data().updatedAt.toDate(),
        versionRef: doc.data().versionRef,
    }));
};

export default function ManualPage() {
    const [versions, setVersions] = useState<ManualVersion[]>([]);
    const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
    const [pages, setPages] = useState<ManualPage[]>([]);
    const [activePageSlug, setActivePageSlug] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const fetchedVersions = await fetchVersions();
                setVersions(fetchedVersions);

                const currentVersion = fetchedVersions.find(v => v.isCurrent) || fetchedVersions[0];
                if (currentVersion) {
                    setCurrentVersionId(currentVersion.id);
                    const fetchedPages = await fetchPagesForVersion(currentVersion.id);
                    setPages(fetchedPages);
                    if (fetchedPages.length > 0) {
                        setActivePageSlug(fetchedPages[0].slug);
                    }
                }
            } catch (error) {
                console.error("Error loading manual:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleVersionChange = async (versionId: string) => {
        if (versionId === currentVersionId) return;
        setIsLoading(true);
        setCurrentVersionId(versionId);
        try {
            const fetchedPages = await fetchPagesForVersion(versionId);
            setPages(fetchedPages);
            setActivePageSlug(fetchedPages.length > 0 ? fetchedPages[0].slug : null);
        } catch (error) {
            console.error("Error fetching pages for version:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPages = useMemo(() => {
        if (!searchTerm) return pages;
        return pages.filter(page =>
            page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            page.bodyMarkdown.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [pages, searchTerm]);

    const activePage = useMemo(() => {
        return pages.find(p => p.slug === activePageSlug);
    }, [pages, activePageSlug]);
    
    const pageTitle = `Manual • ${legalConfig.brandName}`;
    const pageDescription = "Run every shift like clockwork: live rotation, VIP timers, payouts, and reports in one console.";

    return (
        <div className="flex flex-col min-h-screen">
             <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
            </Head>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                     <h1 className="text-4xl font-bold tracking-tight mb-2">User Manual</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Your comprehensive guide to mastering Clockwork Venue.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <aside className="md:col-span-3">
                        <div className="sticky top-24 space-y-4">
                            <div className="flex gap-2">
                                <Select onValueChange={handleVersionChange} value={currentVersionId || ''} disabled={isLoading}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select version" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {versions.map(v => (
                                            <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="relative">
                                <Input
                                    placeholder="Search manual..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                    aria-label="Search manual"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            </div>
                            <nav className="space-y-1" aria-label="Manual Table of Contents">
                                {isLoading ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-3/4" />
                                    </div>
                                ) : (
                                    filteredPages.map(page => (
                                        <a
                                            key={page.slug}
                                            href={`#${page.slug}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setActivePageSlug(page.slug);
                                                // Smooth scroll could be added here
                                                document.getElementById('manual-content')?.scrollTo(0,0);
                                            }}
                                            className={cn(
                                                "block p-2 rounded-md text-sm font-medium transition-colors",
                                                activePageSlug === page.slug
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                            )}
                                            aria-current={activePageSlug === page.slug ? 'page' : undefined}
                                        >
                                            {page.title}
                                        </a>
                                    ))
                                )}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div id="manual-content" className="md:col-span-9 bg-card rounded-lg p-6 border border-border min-h-[60vh] max-h-[75vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ) : activePage ? (
                            <article id={activePage.slug}>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold tracking-tight">{activePage.title}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Last updated: {activePage.updatedAt.toLocaleDateString()}
                                    </p>
                                </div>
                                <MarkdownRenderer content={activePage.bodyMarkdown} />
                            </article>
                        ) : (
                            <div className="text-center text-muted-foreground py-16">
                                <p>Select a topic from the sidebar to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
