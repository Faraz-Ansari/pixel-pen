import { useEffect, useState } from "react";

export default function Comment({ comment }) {
    const [user, setUser] = useState({});
    console.log(user);

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
                <p className="text-gray-400">{comment.content}</p>
            </div>
        </div>
    );
}
