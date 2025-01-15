import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import { useState } from "react";

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
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
                    content: comment,
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
            setComment("");
        } catch (error) {
            setCommentError(error.message);
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
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className="flex text-gray-400 justify-between items-center">
                        {/* 200 is the maximum character limit for the comment */}
                        <p>{200 - comment.length} characters remaining</p>
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
        </div>
    );
}
