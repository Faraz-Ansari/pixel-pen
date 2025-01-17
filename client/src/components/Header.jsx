import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Navbar,
    TextInput,
    Button,
    Dropdown,
    Avatar,
    DropdownDivider,
} from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import {
    signOutStart,
    signOutSuccess,
    signOutFailure,
} from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {
    const path = useLocation().pathname;
    const location = useLocation();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    const { currentUser } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromURL = urlParams.get("searchTerm");

        if (searchTermFromURL) {
            setSearchTerm(searchTermFromURL);
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", searchTerm);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <Navbar className="border-b-2">
            <Link
                to="/"
                className="self-center p-2 text-xl md:text-2xl whitespace-nowrap font-semibold dark:text-white"
            >
                <span className="text-blue-600 dark:text-blue-500">Pixel</span>
                <span className="text-slate-800 dark:text-white">Pen</span>
            </Link>

            <form onSubmit={handleSubmit}>
                <TextInput
                    type="text"
                    placeholder="Search..."
                    rightIcon={AiOutlineSearch}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="hidden md:inline"
                />
            </form>

            <Button className="h-10 md:hidden" color="gray" pill>
                <AiOutlineSearch />
            </Button>

            <div className="flex justify-center items-center gap-4 md:order-2">
                <Button
                    className="hidden md:inline"
                    color="gray"
                    pill
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                </Button>
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt="user avatar"
                                img={currentUser.profilePicture}
                                rounded
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block font-medium">
                                @{currentUser.username}
                            </span>
                            <span className="block font-medium truncate">
                                {currentUser.email}
                            </span>
                        </Dropdown.Header>
                        <Link to="/dashboard?tab=profile">
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <DropdownDivider />
                        <Dropdown.Item onClick={() => handleSignOut()}>
                            Sign out
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to="/sign-in">
                        <Button outline gradientDuoTone="purpleToBlue">
                            Sign In
                        </Button>
                    </Link>
                )}

                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={"div"}>
                    <Link to="/" className="md:text-lg ">
                        Home
                    </Link>
                </Navbar.Link>

                <Navbar.Link active={path === "/about"} as={"div"}>
                    <Link to="/about" className="md:text-lg">
                        About
                    </Link>
                </Navbar.Link>

                <Navbar.Link active={path === "/projects"} as={"div"}>
                    <Link to="/projects" className="md:text-lg">
                        Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
