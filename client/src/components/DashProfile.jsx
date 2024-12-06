import { useSelector } from "react-redux";
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

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);

    const imageInputRef = useRef();

    const [imageFile, setImageFile] = useState(null);
    const [imageFileURL, setImageFileURL] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] =
        useState(null);

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
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileURL(downloadURL);
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
            <form className="flex flex-col gap-4 ">
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
                />
                <TextInput
                    type="text"
                    id="email"
                    placeholder="Email"
                    defaultValue={currentUser.email}
                />
                <TextInput type="text" id="password" placeholder="Password" />

                <Button type="submit" outline gradientDuoTone="purpleToPink">
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
        </div>
    );
}
