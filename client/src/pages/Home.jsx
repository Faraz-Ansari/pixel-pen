import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch("/api/post/get-posts?limit=3");
                const data = await response.json();

                if (data.success === false) {
                    console.error(data.message);
                    return;
                }

                setPosts(data.posts);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchPost();
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-4 p-6 md:p-20 ">
                <h1 className="text-3xl font-bold md:text-6xl">
                    Welcome to{" "}
                    <span className="text-blue-600 dark:text-blue-500">
                        Pixel
                    </span>
                    <span className="text-slate-800 dark:text-white">Pen</span>
                </h1>
                <p className="text-lg">
                    Pixel Pen is a platform for artists to showcase their work
                    and connect with other artists. <br /> Here you'll find a
                    variety of articles and tutorials on variety of topics.
                </p>

                <span>
                    <Link
                        to="/search"
                        className="text-lg text-blue-700 dark:text-red-600 hover:font-bold transition-all"
                    >
                        View all posts
                    </Link>
                </span>
            </div>

            <div className="p-3">
                <CallToAction />
            </div>

            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
                {posts && posts.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-semibold text-center">
                            Recent Posts
                        </h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    </div>
                )}
                <span className="text-center">
                    <Link
                        to="/search"
                        className="text-lg text-blue-700 dark:text-red-600 hover:font-bold transition-all"
                    >
                        View all posts
                    </Link>
                </span>
            </div>
        </div>
    );
}
