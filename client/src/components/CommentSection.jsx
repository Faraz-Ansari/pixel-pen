import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { set } from "mongoose";

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector((state) => state.user);
    const [commentContent, setCommentContent] = useState("");
    const [commentError, setCommentError] = useState(null);
    const [postComments, setPostComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);

    const navigate = useNavigate();

    const handleLike = async (commentId) => {
        if (!currentUser) {
            navigate("/sign-in");
            return;
        }

        try {
            const response = await fetch(
                `/api/comment/like-comment/${commentId}`,
                {
                    method: "PUT",
                }
            );

            const data = await response.json();
            if (data.success === false) {
                console.error(data.message);
                return;
            }

            setPostComments(
                postComments.map((comment) =>
                    comment._id === commentId
                        ? {
                              ...comment,
                              likes: data.likes,
                              numberOfLikes: data.numberOfLikes,
                          }
                        : comment
                )
            );
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(
                    `/api/comment/get-post-comments/${postId}`
                );
                const data = await response.json();

                if (data.success === false) {
                    console.error(data.message);
                    return;
                }

                setPostComments(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (commentContent.length > 200) {
            setCommentError("Comment must be less than 200 characters");
            return;
        }

        try {
            setCommentError(null);

            const response = await fetch("/api/comment/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: commentContent,
                    postId,
                    userId: currentUser._id,
                }),
            });

            const data = await response.json();

            if (data.success === false) {
                setCommentError(data.message);
                return;
            }
            setCommentError(null);
            setCommentContent("");
            setPostComments([data, ...postComments]);
        } catch (error) {
            setCommentError(error.message);
        }
    };

    const handleEdit = async (comment, editedComment) => {
        setPostComments(
            postComments.map((postComment) =>
                postComment._id === comment._id
                    ? { ...postComment, content: editedComment }
                    : postComment
            )
        );
    };

    const handleDelete = async (commentId) => {
        try {
            if (!currentUser) {
                navigate("/sign-in");
                return;
            }

            const response = await fetch(
                `/api/comment/delete-comment/${commentId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();
            if (data.success === false) {
                console.error(data.message);
                return;
            }

            setPostComments(
                postComments.filter((comment) => comment._id !== commentId)
            );

            setShowModal(false);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {currentUser ? (
                <div className="flex items-center gap-2">
                    <p>Signed in as: </p>
                    <img
                        className="h-5 w-5 object-cover rounded-full"
                        src={currentUser.profilePicture}
                        alt="profile picture"
                    />
                    <Link
                        to="/dashboard?tab=profile"
                        className="text-blue-600 hover:underline transition-all"
                    >
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div>
                    You must be signed in to comment
                    <Link
                        to="/sign-in"
                        className="text-blue-600 ml-2 hover:underline"
                    >
                        Sign in
                    </Link>
                </div>
            )}

            {currentUser && (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 justify-center"
                >
                    <Textarea
                        placeholder="Add a comment..."
                        rows="3"
                        maxLength="200"
                        onChange={(e) => setCommentContent(e.target.value)}
                        value={commentContent}
                    />
                    <div className="flex text-gray-400 justify-between items-center">
                        {/* 200 is the maximum character limit for the comment */}
                        <p>
                            {200 - commentContent.length} characters remaining
                        </p>
                        <Button
                            gradientDuoTone="cyanToBlue"
                            type="submit"
                            outline
                        >
                            Submit
                        </Button>
                    </div>
                    {commentError && (
                        <Alert color="failure" className="mt-2">
                            {commentError}
                        </Alert>
                    )}
                </form>
            )}

            {postComments.length > 0 ? (
                <>
                    <div className="flex items-center gap-1">
                        <p>Comments</p>
                        <div className="border py-1 px-2">
                            <p>{postComments.length}</p>
                        </div>
                    </div>
                    {postComments.map((postComment) => (
                        <Comment
                            key={postComment._id}
                            comment={postComment}
                            onLike={handleLike}
                            onEdit={handleEdit}
                            onDelete={(commentId) => {
                                setShowModal(true);
                                setCommentIdToDelete(commentId);
                            }}
                        />
                    ))}
                </>
            ) : (
                <p>No comments yet!</p>
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
                                onClick={() => handleDelete(commentIdToDelete)}
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
