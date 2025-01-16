import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Comment({ comment, onLike }) {
    const [user, setUser] = useState({});

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
                    <span>
                        {new Date(comment.createdAt).toLocaleDateString(
                            "in-IN"
                        )}
                    </span>
                </div>
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
                </div>
            </div>
        </div>
    );
}
