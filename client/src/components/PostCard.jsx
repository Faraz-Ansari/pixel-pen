import { Link } from "react-router-dom";

export default function PostCard({ post }) {
    return (
        <div className="group overflow-hidden transition-all relative w-full h-[400px] border rounded-lg border-teal-500">
            <Link to={`/post/${post.slug}`}>
                <img
                    className="h-[240px] rounded-lg w-full group-hover:h-[280px] transition-all duration-200 z-20 object-cover"
                    src={post.image}
                    alt={post.title}
                />
            </Link>

            <div className="flex flex-col gap-2 p-2">
                <p className="text-lg font-semibold font-serif line-clamp-2">
                    {post.title}
                </p>
                <span className="italic">{post.category}</span>
                <Link
                    to={`/post/${post.slug}`}
                    className="z-10 group-hover:bottom-0 absolute bottom-[-300px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white duration-200 text-center rounded-md py-2"
                >
                    Read more
                </Link>
            </div>
        </div>
    );
}
