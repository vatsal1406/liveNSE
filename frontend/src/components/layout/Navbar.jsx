import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    Menu,
    X,
    Newspaper,
    Building2,
    TrendingUp,
    Search,
    ChevronRight,
} from "lucide-react";

const links = [
    {
        name: "Latest",
        path: "/",
        icon: Newspaper,
    },
    {
        name: "Companies",
        path: "/companies",
        icon: Building2,
    },
    {
        name: "Market",
        path: "/market",
        icon: TrendingUp,
    },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <motion.header
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-2xl"
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

                {/* Logo */}

                <Link
                    to="/"
                    className="group flex items-center gap-4"
                >
                    <motion.div
                        whileHover={{
                            scale: 1.08,
                            rotate: -8,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] shadow-lg shadow-blue-500/25"
                    >
                        <TrendingUp
                            size={22}
                            className="text-white"
                        />
                    </motion.div>

                    <div>
                        <h1 className="text-lg font-bold tracking-wide text-white">
                            NSE Pulse
                        </h1>

                        <p className="text-xs text-slate-400">
                            Corporate Announcements
                        </p>
                    </div>
                </Link>

                {/* Desktop Nav */}

                <nav className="hidden items-center gap-2 lg:flex">
                    {links.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `group relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                        isActive
                                            ? "text-white"
                                            : "text-slate-400 hover:text-white"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            size={18}
                                            className="transition-transform duration-300 group-hover:scale-110"
                                        />

                                        {item.name}

                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className="absolute inset-0 -z-10 rounded-xl border border-blue-500/30 bg-blue-500/10"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 350,
                                                    damping: 28,
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Right Side */}

                <div className="hidden items-center gap-4 lg:flex">

                    {/* Live */}

                    <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">

                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>

                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                        </span>

                        <span className="text-xs font-medium text-emerald-300">
                            Live
                        </span>

                    </div>

                    {/* Search */}

                    <button className="group flex items-center gap-3 rounded-xl border border-white/5 bg-[#141A26] px-4 py-2 text-sm text-slate-400 transition-all duration-300 hover:border-blue-500/30 hover:bg-[#1A2232] hover:text-white">

                        <Search
                            size={17}
                            className="transition-transform duration-300 group-hover:scale-110"
                        />

                        <span>Search companies...</span>

                        <kbd className="rounded-md border border-white/10 bg-[#0B0F19] px-2 py-0.5 text-[10px] text-slate-500">
                            Ctrl K
                        </kbd>

                    </button>

                </div>

                {/* Mobile */}

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="rounded-xl border border-white/5 bg-[#141A26] p-3 text-white transition hover:border-blue-500/40 lg:hidden"
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

            </div>

            {/* Mobile Drawer */}

            <AnimatePresence>

                {menuOpen && (

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -20,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                        className="border-t border-white/5 bg-[#0B0F19] lg:hidden"
                    >
                        <div className="space-y-2 p-5">

                            {links.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center justify-between rounded-xl px-4 py-3 transition ${
                                                isActive
                                                    ? "bg-blue-500/10 text-white"
                                                    : "text-slate-400 hover:bg-[#141A26] hover:text-white"
                                            }`
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} />
                                            {item.name}
                                        </div>

                                        <ChevronRight size={18} />
                                    </NavLink>
                                );
                            })}

                            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700">

                                <Search size={18} />

                                Search Companies

                            </button>

                        </div>
                    </motion.div>

                )}

            </AnimatePresence>

        </motion.header>
    );
}