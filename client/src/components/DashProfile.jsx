import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { TextInput, Button, Alert } from "flowbite-react";

import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
    updateStart,
    updateSuccess,
    updateFailure,
} from "../redux/user/userSlice";

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const imageInputRef = useRef();

    const [formData, setFormData] = useState({});
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);

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
                    disabled={imageFileUploading}
                    outline
                    gradientDuoTone="purpleToPink"
                >
                    Update
                </Button>
            </form>
            <div className="flex justify-between mt-4">
                <span className="text-red-500 hover:font-semibold cursor-pointer">
                    Delete account
                </span>
                <span className="text-green-700 dark:text-green-500 hover:font-semibold cursor-pointer">
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
        </div>
    );
}
