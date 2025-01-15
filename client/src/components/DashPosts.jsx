import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);

    const handleDeletePost = async () => {
        setShowModal(false);

        try {
            const response = await fetch(
                `/api/post/delete-post/${postIdToDelete}/${currentUser._id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();
            if (data.success === false) {
                console.error(data.message);
                return;
            }

            setUserPosts((prev) => [
                ...prev.filter((post) => post._id !== postIdToDelete),
            ]);
        } catch (error) {
            console.error(error.message);
        }
    };

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
            if (data.posts.length < 9) {
                setShowMore(false);
            }
        } catch (error) {
            console.error(error.message);
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
                console.error(error.message);
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
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setPostIdToDelete(post._id);
                                            }}
                                            className="text-red-600 hover:underline cursor-pointer"
                                        >
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
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size="md"
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 mb-4 mx-auto text-red-500 text-5xl" />
                        <h3 className="mb-5 text-lg text-red-600">
                            Are you sure you want to delete this post
                        </h3>
                        <div className="flex justify-between">
                            <Button color="failure" onClick={handleDeletePost}>
                                Yes, I'm sure
                            </Button>

                            <Button
                                onClick={() => setShowModal(false)}
                                outline
                                gradientDuoTone="purpleToBlue"
                            >
                                No, take me back
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
