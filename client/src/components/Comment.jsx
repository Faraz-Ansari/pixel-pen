import { Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import moment from "moment";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.content);

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(
                    `/api/user/get-comment-users/${comment.userId}`
                );

                const data = await response.json();
                if (data.success === false) {
                    console.error(data.message);
                    return;
                }

                setUser(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchUsers();
    }, [comment]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedComment(comment.content);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(
                `/api/comment/update-comment/${comment._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ content: editedComment }),
                }
            );

            const data = await response.json();
            if (data.success === false) {
                console.error(data.message);
                return;
            }

            setIsEditing(false);
            onEdit(comment, editedComment);
        } catch (error) {
            console.error(error.message);
        }
    };
    return (
        <div className="flex gap-4 border-b-2 dark:border-gray-700 border-gray-200">
            <div>
                <img
                    className="w-10 h-10 rounded-full flex-shrink-0"
                    src={user.profilePicture}
                    alt={user.username}
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-bold truncate">
                        {user ? `@${user.username}` : "Anonymous"}
                    </span>
                    <span>{moment(comment.createdAt).fromNow()}</span>
                </div>

                {isEditing ? (
                    <>
                        <Textarea
                            className="my-2"
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end mb-2">
                            <Button
                                type="button"
                                gradientDuoTone="purpleToBlue"
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <Button
                                type="button"
                                gradientDuoTone="greenToBlue"
                                outline
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-gray-400 mb-2">{comment.content}</p>

                        <div className="flex items-center max-w-fit gap-2 border-t-2 dark:border-gray-700 border-gray-200">
                            <button
                                type="button"
                                className={`hover:text-blue-600 my-2 transition-all ${
                                    currentUser &&
                                    comment.likes.includes(currentUser._id) &&
                                    "text-blue-600"
                                }`}
                                onClick={() => onLike(comment._id)}
                            >
                                <FaThumbsUp />
                            </button>
                            <p>
                                {comment.likes.length > 0 &&
                                    comment.numberOfLikes +
                                        " " +
                                        (comment.numberOfLikes === 1
                                            ? "like"
                                            : "likes")}
                            </p>

                            {currentUser &&
                                (currentUser._id === comment.userId ||
                                    currentUser.isAdmin) && (
                                    <>
                                        <button
                                            className="hover:text-blue-500 transition-all"
                                            onClick={handleEdit}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="hover:text-red-500 transition-all"
                                            onClick={() =>
                                                onDelete(comment._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
