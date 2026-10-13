import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Clock3 } from "lucide-react";

import Navbar from "../components/layout/Navbar";
import { getLatestNews } from "../services/newsService";

export default function Home() {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(page === 1);
                setFetchingMore(page > 1);

                const data = await getLatestNews(page);

                setNews(prev => [...prev, ...data]);

                if (data.data.length < 50) {
                    setHasMore(false);
                }

            } finally {
                setLoading(false);
                setFetchingMore(false);
            }
        };

        fetchNews();
    }, [page]);
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200 &&
                !loading &&
                !fetchingMore &&
                hasMore
            ) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loading, hasMore]);

    return (
        <>
            <Navbar />

            <main className="relative min-h-screen overflow-hidden bg-[#0B0F19] text-white">

                <div className="absolute left-1/2 top-[-150px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#3B82F6]/10 blur-[140px]" />

                <div className="relative mx-auto max-w-7xl px-6 py-14">

                    {/* Hero */}

                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl font-bold leading-tight">
                            Latest
                            <span className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">
                                {" "}NSE Corporate Announcements
                            </span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-3xl text-lg text-[#94A3B8]">
                            AI-powered summaries of corporate announcements,
                            financial results, board meetings and regulatory
                            disclosures from NSE-listed companies.
                        </p>

                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                                </span>

                                <span className="text-sm font-medium text-emerald-300">
                                    Live Updates
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Loading */}

                    {loading && (
                        <div className="mt-16 rounded-3xl border border-[#273244] bg-[#141A26] p-10 text-center text-[#94A3B8]">
                            Loading latest announcements...
                        </div>
                    )}

                    {/* Empty */}

                    {!loading && news.length === 0 && (
                        <div className="mt-16 rounded-3xl border border-[#273244] bg-[#141A26] p-10 text-center text-[#94A3B8]">
                            No announcements available.
                        </div>
                    )}

                    {/* Latest News */}

                    {!loading && news.length > 0 && (

                        <section className="mt-16">

                            <h2 className="mb-8 text-3xl font-bold">
                                Latest Announcements
                            </h2>

                            <div className="space-y-5">

                                {news.map((item) => (

                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35 }}
                                        className="rounded-2xl border border-[#273244] bg-[#141A26]/90 p-7 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#3B82F6] hover:shadow-2xl"
                                    >

                                        <span className="rounded-full bg-[#3B82F6]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#60A5FA]">
                                            {item.company}
                                        </span>

                                        <h3 className="mt-4 text-2xl font-semibold leading-snug">
                                            {item.headline}
                                        </h3>

                                        <p className="mt-4 line-clamp-3 text-[#94A3B8] leading-7">
                                            {item.fullText}
                                        </p>

                                        <div className="mt-6 flex items-center justify-between">

                                            <small className="flex items-center gap-2 text-[#94A3B8]">

                                                <Clock3 size={15} />

                                                {format(
                                                    new Date(item.publishedAt),
                                                    "dd MMM yyyy • hh:mm a"
                                                )}

                                            </small>

                                            <Link
                                                to={`/news/${item._id}`}
                                                className="font-medium text-[#3B82F6] transition hover:text-blue-400 hover:underline"
                                            >
                                                Read Full Analysis →
                                            </Link>

                                        </div>

                                    </motion.div>

                                ))}

                            </div>
                            {/* Loading More */}

                            {fetchingMore && (
                                <div className="py-8 text-center text-[#94A3B8]">
                                    Loading more announcements...
                                </div>
                            )}

                        </section>

                    )}

                </div>

            </main>
        </>
    );
}