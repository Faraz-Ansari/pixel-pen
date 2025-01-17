import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    HiAnnotation,
    HiArrowNarrowUp,
    HiDocumentText,
    HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardComp() {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);

    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/user/get-users?limit=5");
                const data = await response.json();

                if (data.success === false) {
                    console.error(data.message);
                    return;
                }

                setUsers(data.users);
                setTotalUsers(data.totalUsers);
                setLastMonthUsers(data.lastMonthUsers);
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await fetch("/api/post/get-posts?limit=5");
                const data = await response.json();

                if (data.success === false) {
                    console.error(data.message);
                    return;
                }

                setPosts(data.posts);
                setTotalPosts(data.totalPosts);
                setLastMonthPosts(data.lastMonthPosts);
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await fetch(
                    "/api/comment/get-all-comments?limit=5"
                );
                const data = await response.json();

                if (data.success === false) {
                    console.error(data.message);
                    return;
                }

                setComments(data.comments);
                setTotalComments(data.totalComments);
                setLastMonthComments(data.lastMonthComments);
            } catch (error) {
                console.error(error.message);
            }
        };

        if (currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currentUser]);

    return (
        <div className="p-3 md:mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
                {/* Total users card */}
                <div className="flex flex-col p-3 gap-4 dark:bg-slate-800 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between ">
                        <div>
                            <h3 className="text-md uppercase">Total Users</h3>
                            <p className="text-2xl">{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className="bg-teal-500 text-white rounded-full p-3 shadow-lg text-5xl" />
                    </div>
                    <div className="flex gap-2">
                        <span
                            className={`flex items-center  ${
                                lastMonthUsers <= 0
                                    ? "text-red-500"
                                    : "text-green-500"
                            }`}
                        >
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <div>Last month</div>
                    </div>
                </div>

                {/* Total Comments card */}
                <div className="flex flex-col p-3 gap-4 dark:bg-slate-800 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between ">
                        <div>
                            <h3 className="text-md uppercase">
                                Total comments
                            </h3>
                            <p className="text-2xl">{totalComments}</p>
                        </div>
                        <HiAnnotation className="bg-indigo-600 text-white rounded-full p-3 shadow-lg text-5xl" />
                    </div>
                    <div className="flex gap-2">
                        <span
                            className={`flex items-center  ${
                                lastMonthComments <= 0
                                    ? "text-red-500"
                                    : "text-green-500"
                            }`}
                        >
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div>Last month</div>
                    </div>
                </div>

                {/* Total posts card */}
                <div className="flex flex-col p-3 gap-4 dark:bg-slate-800 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between ">
                        <div>
                            <h3 className="text-md uppercase">Total posts</h3>
                            <p className="text-2xl">{totalPosts}</p>
                        </div>
                        <HiDocumentText className="bg-lime-500 text-white rounded-full p-3 shadow-lg text-5xl" />
                    </div>
                    <div className="flex gap-2">
                        <span
                            className={`flex items-center  ${
                                lastMonthPosts <= 0
                                    ? "text-red-500"
                                    : "text-green-500"
                            }`}
                        >
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div>Last month</div>
                    </div>
                </div>
            </div>

            {/* Table starts here */}
            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                {/* User table */}
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex items-center justify-between p-3 font-semibold">
                        <h1 className="text-center p-2">Recent users</h1>
                        <Button gradientDuoTone="purpleToPink" outline>
                            <Link to="/dashboard?tab=users">See all</Link>
                        </Button>
                    </div>

                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                        </Table.Head>

                        {users &&
                            users.map((user) => (
                                <Table.Body key={user._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            <img
                                                src={user.profilePicture}
                                                alt={user.username}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        </Table.Cell>
                                        <Table.Cell className="text-black dark:text-white">
                                            {user.username}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>

                {/* Comment table */}
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex items-center justify-between p-3 font-semibold">
                        <h1 className="text-center p-2">Recent comments</h1>
                        <Button gradientDuoTone="purpleToBlue" outline>
                            <Link to="/dashboard?tab=comments">See all</Link>
                        </Button>
                    </div>

                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>likes</Table.HeadCell>
                        </Table.Head>

                        {comments &&
                            comments.map((comment) => (
                                <Table.Body
                                    key={comment._id}
                                    className="divide-y"
                                >
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="line-clamp-2 w-96 text-black dark:text-white">
                                            {comment.content}
                                        </Table.Cell>
                                        <Table.Cell className="text-black dark:text-white">
                                            {comment.numberOfLikes}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>

                {/* Post table */}
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex items-center justify-between p-3 font-semibold">
                        <h1 className="text-center p-2">Recent posts</h1>
                        <Button gradientDuoTone="greenToBlue" outline>
                            <Link to="/dashboard?tab=posts">See all</Link>
                        </Button>
                    </div>

                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell> Post title</Table.HeadCell>
                            <Table.HeadCell> Post category</Table.HeadCell>
                        </Table.Head>

                        {posts &&
                            posts.map((post) => (
                                <Table.Body key={post._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="h-10 w-14 rounded-md object-cover"
                                            />
                                        </Table.Cell>
                                        <Table.Cell className="text-black dark:text-white w-96">
                                            {post.title}
                                        </Table.Cell>
                                        <Table.Cell className="text-black dark:text-white w-5">
                                            {post.category}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>
            </div>
        </div>
    );
}
