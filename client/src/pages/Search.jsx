import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        sort: "desc",
        category: "Uncategorized",
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromURL = urlParams.get("searchTerm");
        const sortFromURL = urlParams.get("sort");
        const categoryFromURL = urlParams.get("category");

        if (searchTermFromURL || sortFromURL || categoryFromURL) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromURL,
                sort: sortFromURL,
                category: categoryFromURL,
            });
        }

        const fetchPosts = async () => {
            try {
                setLoading(true);
                const searchQuery = urlParams.toString();
                const response = await fetch(
                    `/api/post/get-posts?${searchQuery}`
                );
                const data = await response.json();

                if (data.success === false) {
                    setLoading(false);
                    console.error(data.message);
                    return;
                }
                setPosts(data.posts);
                setLoading(false);

                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            } catch (error) {
                setLoading(false);
                console.error(error.message);
            }
        };
        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === "searchTerm") {
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value,
            });
        }

        if (e.target.id === "sort") {
            const order = e.target.value || "desc";
            setSidebarData({
                ...sidebarData,
                sort: order,
            });
        }

        if (e.target.id === "category") {
            const category = e.target.value || "Uncategorized";
            setSidebarData({
                ...sidebarData,
                category,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("sort", sidebarData.sort);
        urlParams.set("category", sidebarData.category);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const handleClick = async () => {
        const numberOfPost = posts.length;
        const startIndex = posts.length;

        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);

        const searchQuery = urlParams.toString();
        try {
            const response = await fetch(`/api/post/get-posts?${searchQuery}`);
            const data = await response.json();

            if (data.success === false) {
                console.error(data.message);
                setShowMore(false);
                return;
            }

            setPosts([...posts, ...data.posts]);

            if (data.posts.length < 9) {
                setShowMore(false);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2 whitespace-nowrap font-semibold">
                        <label>Search Term:</label>
                        <TextInput
                            placeholder="Search"
                            id="searchTerm"
                            type="text"
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <label className="font-semibold">Sort:</label>
                        <Select
                            id="sort"
                            value={sidebarData.sort}
                            onChange={handleChange}
                        >
                            <option value="desc">Newest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <label className="font-semibold">Category:</label>
                        <Select
                            id="category"
                            value={sidebarData.category}
                            onChange={handleChange}
                        >
                            <option value="Uncategorized">
                                Select a category
                            </option>
                            <option value="Javascript">Java Script</option>
                            <option value="React.js">React.js</option>
                            <option value="Next.js">Next.js</option>
                        </Select>
                    </div>
                    <Button
                        type="submit"
                        outline
                        gradientDuoTone="purpleToBlue"
                    >
                        Search
                    </Button>
                </form>
            </div>

            <div className="w-full">
                <h1 className="text-3xl font-semibold p-7 md:border-b border-gray-500 ">
                    Post Results
                </h1>
                <div className="flex flex-wrap p-7 gap-4">
                    {!loading && posts.length === 0 && (
                        <p className="text-xl font-semibold text-gray-400 ">
                            No posts found
                        </p>
                    )}

                    {loading && (
                        <p className="text-xl font-semibold text-gray-400 ">
                            Loading...
                        </p>
                    )}

                    {!loading &&
                        posts &&
                        posts.length > 0 &&
                        posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}

                    {showMore && (
                        <button
                            onClick={handleClick}
                            className=" text-teal-500 font-semibold w-full p-7 hover:text-red-600 transition-all"
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
