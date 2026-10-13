import Navbar from "./Navbar";

export default function Container({ children }) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#0B0F19]">
                {children}
            </main>
        </>
    );
}