import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TextInput, Button, Alert, Modal } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutStart,
    signOutSuccess,
    signOutFailure,
} from "../redux/user/userSlice";

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const imageInputRef = useRef();

    const [formData, setFormData] = useState({});
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [imageFileURL, setImageFileURL] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] =
        useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setUpdateUserError(null);
        setUpdateUserSuccess(null);

        if (imageFileUploading) {
            setUpdateUserError("Please wait for the image to upload.");
            return;
        }

        try {
            dispatch(updateStart());
            const response = await fetch(
                `/api/user/update/${currentUser._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();
            if (data.success === false) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
                return;
            }

            dispatch(updateSuccess(data));
            setUpdateUserSuccess("Profile updated successfully!");
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const response = await fetch(
                `/api/user/delete/${currentUser._id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();
            if (data.success === false) {
                return dispatch(deleteUserFailure(data.message));
            }
            dispatch(deleteUserSuccess());
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (in bytes)
            const fileSizeInMB = file.size / 1024 / 1024; // Convert file size to MB

            // If file size exceeds the 2 MB limit, set error and return early
            if (fileSizeInMB > 2) {
                setImageFileUploadError(`File size must be less than 2MB.`);
                setImageFileUploadingProgress(null); // Reset progress bar
                return; // Prevent upload
            }

            setImageFile(e.target.files[0]);
            setImageFileURL(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutStart());
            const response = await fetch("/api/user/sign-out");
            const data = await response.json();

            if (data.success === false) {
                dispatch(signOutFailure(data.message));
                return;
            }

            dispatch(signOutSuccess());
        } catch (error) {
            dispatch(signOutFailure(error.message));
        }
    };

    // every time imageFile changes, upload the image
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        // reset the error when uploading a new image
        setImageFileUploadError(null);
        setImageFileUploading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        // reset the progress when uploading a new image
        setImageFileUploadingProgress(null);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadingProgress(progress.toFixed());
            },
            (error) => {
                setImageFileUploadError(
                    "Couldn't upload the image. (Image must be less than 2 MB)"
                );
                setImageFileUploadingProgress(null);
                setImageFile(null);
                setImageFileURL(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileURL(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL });
                    setImageFileUploading(false);
                });
            }
        );
    };

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center text-3xl font-semibold">Profile</h1>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={imageInputRef}
                hidden
            />
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div
                    className="relative h-32 w-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                    onClick={() => imageInputRef.current.click()}
                >
                    {imageFileUploadingProgress && (
                        <CircularProgressbar
                            value={imageFileUploadingProgress}
                            text={`${imageFileUploadingProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgb(62, 152, 199, ${
                                        imageFileUploadingProgress / 100
                                    })`,
                                },
                            }}
                        />
                    )}
                    <img
                        src={imageFileURL || currentUser.profilePicture}
                        className={`rounded-full w-full h-full object-cover  border-8 border-[lightgray]
                            ${
                                imageFileUploadingProgress &&
                                imageFileUploadingProgress < 100 &&
                                "opacity-60"
                            }`}
                        alt="profile picture"
                    />
                </div>
                {imageFileUploadError && (
                    <Alert color="failure">{imageFileUploadError}</Alert>
                )}
                <TextInput
                    type="text"
                    id="username"
                    placeholder="Username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput
                    type="text"
                    id="email"
                    placeholder="Email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput
                    type="text"
                    id="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <Button
                    type="submit"
                    disabled={loading || imageFileUploading}
                    gradientDuoTone="purpleToPink"
                    outline
                >
                    {loading ? "Loading..." : "Update"}
                </Button>

                {(
                    <Link to="/create-post">
                        <Button
                            type="button"
                            gradientDuoTone="purpleToBlue"
                            className="w-full"
                            outline
                        >
                            Create a post
                        </Button>
                    </Link>
                )}
            </form>
            <div className="flex justify-between mt-4">
                <span
                    onClick={() => setShowModal(true)}
                    className="text-red-500 hover:font-semibold cursor-pointer"
                >
                    Delete account
                </span>
                <span
                    onClick={() => handleSignOut()}
                    className="text-green-700 dark:text-green-500 hover:font-semibold cursor-pointer"
                >
                    Sign out
                </span>
            </div>

            {updateUserSuccess && (
                <Alert color="success" className="mt-5">
                    {updateUserSuccess}
                </Alert>
            )}

            {updateUserError && (
                <Alert color="failure" className="mt-5">
                    {updateUserError}
                </Alert>
            )}

            {error && (
                <Alert color="failure" className="mt-5">
                    {error}
                </Alert>
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
                            Are you sure you want to delete this account
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
