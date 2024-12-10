import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    signOutStart,
    signOutSuccess,
    signOutFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState("");

    const dispatch = useDispatch();

    // Update the tab state when the URL changes
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromURL = urlParams.get("tab");
        if (tabFromURL) {
            setTab(urlParams.get("tab"));
        }
    }, [location.search]);

    const handleSignOut = async () => {
        try {
            dispatch(signOutStart());
            const response = await fetch("/api/user/sign-out");
            const data = await response.json();

            if (data.success === false) {
                dispatch(signOutFailure(data.message));
                return;
            }

            dispatch(signOutSuccess());
        } catch (error) {
            dispatch(signOutFailure(error.message));
        }
    };

    return (
        <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item
                            active={tab === "profile"}
                            icon={HiUser}
                            label={"User"}
                            labelColor="dark"
                            as="div"
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item
                        icon={HiArrowSmRight}
                        className="cursor-pointer"
                        onClick={() => handleSignOut()}
                    >
                        Sign out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
