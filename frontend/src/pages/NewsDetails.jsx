import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
    Building2,
    CalendarDays,
    ExternalLink,
    ArrowLeft,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import { getNewsById } from "../services/newsService";

export default function NewsDetails() {
    const { id } = useParams();

    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getNewsById(id);
                setNews(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [id]);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#0B0F19] text-white">

                <div className="mx-auto max-w-5xl px-6 py-12">

                    {/* Back Button */}

                    <Link
                        to="/"
                        className="mb-8 inline-flex items-center gap-2 text-[#94A3B8] transition hover:text-[#3B82F6]"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>

                    {/* Loading */}

                    {loading && (
                        <div className="rounded-2xl border border-[#273244] bg-[#141A26] p-10 text-center text-[#94A3B8]">
                            Loading announcement...
                        </div>
                    )}

                    {/* Not Found */}

                    {!loading && !news && (
                        <div className="rounded-2xl border border-[#273244] bg-[#141A26] p-10 text-center text-[#94A3B8]">
                            Announcement not found.
                        </div>
                    )}

                    {/* Content */}

                    {!loading && news && (

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="rounded-3xl border border-[#273244] bg-[#141A26]/90 p-10 shadow-2xl backdrop-blur-xl"
                        >

                            {/* Company */}

                            <div className="flex items-center gap-2 text-[#60A5FA]">

                                <Building2 size={18} />

                                <span className="font-semibold uppercase tracking-wide">
                                    {news.company}
                                </span>

                            </div>

                            {/* Headline */}

                            <h1 className="mt-6 text-4xl font-bold leading-tight">
                                {news.headline}
                            </h1>

                            {/* Published */}

                            <div className="mt-6 flex items-center gap-2 text-[#94A3B8]">

                                <CalendarDays size={18} />

                                <span>
                                    {format(
                                        new Date(news.publishedAt),
                                        "dd MMM yyyy • hh:mm a"
                                    )}
                                </span>

                            </div>

                            <div className="my-10 border-t border-[#273244]" />

                            {/* Full Analysis */}

                            <h2 className="text-2xl font-semibold">
                                AI Analysis
                            </h2>

                            <div className="mt-6 whitespace-pre-line leading-8 text-[#CBD5E1]">
                                {news.fullText}
                            </div>

                            {/* Original Document */}

                            <div className="mt-12 border-t border-[#273244] pt-8">

                                <h3 className="text-xl font-semibold">
                                    Original NSE Announcement
                                </h3>

                                <p className="mt-2 text-[#94A3B8]">
                                    View the official announcement published by
                                    NSE.
                                </p>

                                <a
                                    href={news.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                                >
                                    <ExternalLink size={18} />
                                    View Original Announcement
                                </a>

                            </div>

                        </motion.div>

                    )}

                </div>

            </main>
        </>
    );
}