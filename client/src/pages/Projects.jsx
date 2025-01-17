import CallToAction from "../components/CallToAction";

export default function Projects() {
    return (
        <div className="flex items-center justify-center my-2">
            <div className="max-w-3xl mx-auto p-3">
                <h1 className="text-3xl md:text-4xl font-semibold text-center my-5">
                    Projects
                </h1>
                <p className="text-lg">
                    Build fun and engaging projects while learning HTML, CSS,
                    and TypeScript! <br />
                    Follow the link below to view the projects.
                </p>
                <CallToAction />
            </div>
        </div>
    );
}
