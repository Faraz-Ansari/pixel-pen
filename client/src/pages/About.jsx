export default function About() {
    return (
        <div className="flex items-center justify-center my-2">
            <div className="max-w-3xl mx-auto p-3">
                <h1 className="text-3xl md:text-4xl font-semibold text-center my-5">
                    About Pixel Pen
                </h1>
                <div className="text-lg flex flex-col gap-4">
                    <p>
                        Welcome to Pixel Pen! This Project was created by the dynamic team of <span className="text-blue-500">Ahmad Faraz Ansari</span>, 
                        <span className="text-blue-500">Anjali Chaudhary</span> and <span className="text-blue-500">Shubham</span>   to share their thoughts
                        and ideas with the world. dynamic trio are passionate
                        developers who loves to write about technology, coding,
                        and everything in between.
                    </p>

                    <p>
                        On this blog project, you'll find weekly articles and tutorials
                        on topics such as web development, software engineering,
                        and programming languages. Trio is always learning and
                        exploring new technologies, so be sure to check back
                        often for new content!
                    </p>

                    <p>
                        We encourage you to leave comments on our posts and
                        engage with other readers. You can like other people's
                        comments and reply to them as well. We believe that a
                        community of learners can help each other grow and
                        improve.
                    </p>
                </div>
            </div>
        </div>
    );
}
