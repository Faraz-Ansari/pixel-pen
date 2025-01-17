import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({
        title: "", // Default to an empty string
        content: "", // Default to an empty string
    });
    const [publishError, setPublishError] = useState(null);

    const navigate = useNavigate();

    const { postId } = useParams();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(
                    `/api/post/get-posts?postId=${postId}`
                );
                const data = await response.json();
                if (data.success === false) {
                    setPublishError(data.message);
                    return;
                }

                setPublishError(null);
                setFormData(data.posts[0]);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchPost();
    }, [postId]);

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError("Please select an image to upload");
                return;
            }

            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + "-" + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError(
                        "Something went wrong during upload..."
                    );
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            setImageUploadError(null);
                            setImageUploadProgress(null);
                            setFormData((prev) => ({
                                ...prev,
                                image: downloadURL,
                            }));
                        }
                    );
                }
            );
        } catch (error) {
            setImageUploadError("Image upload failed");
            setImageUploadProgress(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `/api/post/update-post/${postId}/${currentUser._id}`,
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
                setPublishError(data.message);
                return;
            } else {
                setPublishError(null);

                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPublishError("Something went wrong during publishing...");
        }
    };

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Update post
            </h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 md:flex-row justify-between">
                    <TextInput
                        type="text"
                        placeholder="Title"
                        id="title"
                        className="flex-1"
                        required
                        value={formData.title}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }))
                        }
                    />
                    <Select
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                category: e.target.value,
                            })
                        }
                        value={formData.category}
                    >
                        <option value="Uncategorized">Select a category</option>
                        <option value="Javascript">Java Script</option>
                        <option value="React.js">React.js</option>
                        <option value="Next.js">Next.js</option>
                    </Select>
                </div>

                <div className=" flex gap-4 items-center justify-between">
                    <FileInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                        type="button"
                        gradientDuoTone="greenToBlue"
                        outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {imageUploadProgress ? (
                            <div className="w-10 h-10">
                                <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0}%`}
                                />
                            </div>
                        ) : (
                            "Upload image"
                        )}
                    </Button>
                </div>
                {imageUploadError && (
                    <Alert color="failure">{imageUploadError}</Alert>
                )}

                {formData.image && (
                    <img
                        src={formData.image}
                        alt="upload"
                        className="w-full h-72 object-cover rounded-lg"
                    />
                )}
                <ReactQuill
                    theme="snow"
                    value={formData.content}
                    placeholder="Write something..."
                    className="h-72 mb-12"
                    required
                    onChange={(value) => {
                        setFormData({ ...formData, content: value });
                    }}
                />
                <Button
                    type="submit"
                    outline
                    gradientDuoTone="purpleToBlue"
                    disabled={imageUploadProgress}
                >
                    Update
                </Button>

                {publishError && (
                    <Alert color="failure" className="mt-5">
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    );
}
