import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);

    const handleClick = async () => {
        const startIndex = userPosts.length;

        try {
            const response = await fetch(
                `/api/post/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`
            );
            const data = await response.json();

            if (data.success === false) {
                setShowMore(false);
                return;
            }

            setUserPosts((prev) => [...prev, ...data.posts]);
            if(data.posts.length < 9) {
                setShowMore(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(
                    `/api/post/get-posts?userId=${currentUser._id}`
                );
                const data = await response.json();
                if (response.ok) {
                    setUserPosts(data.posts);
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        if (currentUser.isAdmin) {
            fetchPost();
        }
    }, [currentUser._id]);
    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3">
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>

                        {userPosts.map((post) => (
                            <Table.Body
                                key={post._id}
                                className="text-black dark:text-white font-semibold divide-y"
                            >
                                <Table.Row className="dark:bg-slate-800 dark:border-gray-700">
                                    <Table.Cell>
                                        {new Date(
                                            post.updatedAt
                                        ).toLocaleDateString("in-IN")}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-20 h-20 object-cover bg-gray-500"
                                            />
                                        </Link>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </Table.Cell>

                                    <Table.Cell className="dark:text-green-400 text-green-500">
                                        {post.category}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <span className="text-red-600 hover:underline cursor-pointer">
                                            Delete
                                        </span>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link to={`/update-post/${post._id}`}>
                                            <span className="text-blue-600 hover:underline">
                                                Edit
                                            </span>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleClick}
                            className="w-full text-teal-500 font-semibold self-center mt-5 hover:text-red-600 transition-all"
                        >
                            Show more posts
                        </button>
                    )}
                </>
            ) : (
                <h1>You have no posts yet!</h1>
            )}
        </div>
    );
}
