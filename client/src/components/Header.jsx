import { Link, useLocation } from "react-router-dom";
import {
    Navbar,
    TextInput,
    Button,
    Dropdown,
    Avatar,
    DropdownDivider,
} from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Header() {
    const path = useLocation().pathname;

    const { currentUser } = useSelector((state) => state.user);

    return (
        <Navbar className="border-b-2">
            <Link
                to="/"
                className="self-center p-2 text-xl md:text-2xl whitespace-nowrap font-semibold dark:text-white"
            >
                <span className="text-blue-600">Pixel</span>
                <span className="text-slate-800">Pen</span>
            </Link>

            <form>
                <TextInput
                    type="text"
                    placeholder="Search..."
                    rightIcon={AiOutlineSearch}
                    className="hidden md:inline"
                />
            </form>

            <Button className="h-10 md:hidden" color="gray" pill>
                <AiOutlineSearch />
            </Button>

            <div className="flex justify-center items-center gap-4 md:order-2">
                <Button className="hidden md:inline" color="gray" pill>
                    <FaMoon />
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
                        <Dropdown.Item>Sign out</Dropdown.Item>
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
