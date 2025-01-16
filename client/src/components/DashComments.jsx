import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user);

    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);

    const handleClick = async () => {
        const startIndex = comments.length;

        try {
            const response = await fetch(
                `/api/user/get-comments?startIndex=${startIndex}`
            );
            const data = await response.json();

            if (data.success === false) {
                setShowMore(false);
                return;
            }

            setComments((prev) => [...prev, ...data.comments]);
            if (data.comments.length < 9) {
                setShowMore(false);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(
                    `/api/comment/get-all-comments?startIndex=${comments.length}`
                );
                const data = await response.json();
                if (response.ok) {
                    setComments(data.comments);
                    if (data.comments.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        if (currentUser.isAdmin) {
            fetchComments();
        }
    }, [currentUser._id]);

    const handleDeleteComment = async () => {
        try {
            const response = await fetch(
                `/api/comment/delete-comment/${commentIdToDelete}`,
                {
                    method: "DELETE",
                }
            );
            const data = await response.json();

            if (data.success === false) {
                console.error(data.message);
                return;
            }

            setComments((prev) =>
                prev.filter((comment) => comment._id !== commentIdToDelete)
            );
            setShowModal(false);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3">
            {currentUser.isAdmin && comments.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>Number of likes</Table.HeadCell>
                            <Table.HeadCell>Post Id</Table.HeadCell>
                            <Table.HeadCell>User Id</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>

                        {comments.map((comment) => (
                            <Table.Body
                                key={comment._id}
                                className="text-black dark:text-white font-semibold divide-y"
                            >
                                <Table.Row className="dark:bg-slate-800 dark:border-gray-700">
                                    <Table.Cell>
                                        {new Date(
                                            comment.updatedAt
                                        ).toLocaleDateString("in-IN")}
                                    </Table.Cell>

                                    <Table.Cell>{comment.content}</Table.Cell>
                                    <Table.Cell>
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                    <Table.Cell>{comment.postId}</Table.Cell>
                                    <Table.Cell>{comment.userId}</Table.Cell>

                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setCommentIdToDelete(
                                                    comment._id
                                                );
                                            }}
                                            className="text-red-600 hover:underline cursor-pointer"
                                        >
                                            Delete
                                        </span>
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
                            Show more comments
                        </button>
                    )}
                </>
            ) : (
                <h1>You have no comments yet!</h1>
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
                            Are you sure you want to delete this comment
                        </h3>
                        <div className="flex justify-between">
                            <Button
                                color="failure"
                                onClick={handleDeleteComment}
                            >
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
