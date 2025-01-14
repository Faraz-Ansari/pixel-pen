import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const handleClick = async () => {
        const startIndex = users.length;

        try {
            const response = await fetch(
                `/api/user/get-users?startIndex=${startIndex}`
            );
            const data = await response.json();

            if (data.success === false) {
                setShowMore(false);
                return;
            }

            setUsers((prev) => [...prev, ...data.users]);
            if (data.users.length < 9) {
                setShowMore(false);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/user/get-users`);
                const data = await response.json();
                if (response.ok) {
                    setUsers(data.users);
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        if (currentUser.isAdmin) {
            fetchUsers();
        }
    }, [currentUser._id]);

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.success === false) {
                console.error(data.message);
                return;
            } else {
                setUsers((prev) =>
                    prev.filter((user) => user._id !== userIdToDelete)
                );
                setShowModal(false);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3">
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>

                        {users.map((user) => (
                            <Table.Body
                                key={user._id}
                                className="text-black dark:text-white font-semibold divide-y"
                            >
                                <Table.Row className="dark:bg-slate-800 dark:border-gray-700">
                                    <Table.Cell>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString("in-IN")}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className="w-10 h-10 object-cover rounded-full bg-gray-500"
                                        />
                                    </Table.Cell>

                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>

                                    <Table.Cell>
                                        {user.isAdmin ? (
                                            <FaCheck className="text-green-500" />
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setUserIdToDelete(user._id);
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
                            Show more users
                        </button>
                    )}
                </>
            ) : (
                <h1>You have no users yet!</h1>
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
                            Are you sure you want to delete this user
                        </h3>
                        <div className="flex justify-between">
                            <Button color="failure" onClick={handleDeleteUser}>
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
