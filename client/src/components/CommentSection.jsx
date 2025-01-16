import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector((state) => state.user);
    const [commentContent, setCommentContent] = useState("");
    const [commentError, setCommentError] = useState(null);
    const [postComments, setPostComments] = useState([]);

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
                        />
                    ))}
                </>
            ) : (
                <p>No comments yet!</p>
            )}
        </div>
    );
}
