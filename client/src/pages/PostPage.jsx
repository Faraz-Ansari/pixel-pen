import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";

export default function PostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/post/get-posts?slug=${postSlug}`
                );
                const data = await response.json();

                if (data.success === false) {
                    setError(error);
                    setLoading(false);
                    return;
                }

                setPost(data.posts[0]);
                setLoading(false);
                setError(null);
            } catch (error) {
                setError(error);
            }
        };

        fetchPost();
    }, [postSlug]);

    return (
        <div className="p-3 max-w-6xl mx-auto flex flex-col items-center gap-4 min-h-screen ">
            {/* Loading spinner */}
            <div
                className={`flex items-center justify-center ${
                    loading && "h-screen"
                }`}
            >
                {loading && <Spinner size="xl" />}
            </div>

            {post && (
                <>
                    <h1 className="font-serif font-semibold text-3xl md:text-4xl mt-10 ">
                        {post.title}
                    </h1>
                    <Link to={`/search?category=${post.category}`}>
                        <Button color="gray" pill size="xs">
                            {post.category}
                        </Button>
                    </Link>

                    <img
                        src={post.image}
                        alt={post.title}
                        className=" rounded-lg object-cover"
                    />

                    <div className="flex justify-between italic w-full border-b-2 dark:border-gray-600 border-gray-300">
                        <span>
                            {new Date(post.createdAt).toLocaleDateString(
                                "in-IN"
                            )}
                        </span>
                        <span>
                            {(post.content.length / 1000).toFixed()} mins read
                        </span>
                    </div>

                    {/* this method of rendering will also render html tags inside content the way there are meant to appear */}
                    <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        // post-content is a custom class inside index.css that we will use to style the content
                        className="post-content text-md"
                    ></div>

                    <div className="w-full mx-auto">
                        <CallToAction />
                    </div>
                </>
            )}
        </div>
    );
}
