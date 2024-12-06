import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";

export default function DashBoard() {
    const location = useLocation();
    const [tab, setTab] = useState("");

    // Update the tab state when the URL changes
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromURL = urlParams.get("tab");
        if (tabFromURL) {
            setTab(urlParams.get("tab"));
        }
    }, [location.search]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-56">
                <DashSidebar />
            </div>

            {/* Profile */}
            {tab === "profile" && <DashProfile />}
        </div>
    );
}
