import { Link } from "react-router-dom";
import { Label, TextInput, Button } from "flowbite-react";

export default function SignUp() {
    return (
        <div className="min-h-screen mt-20">
            <div className="flex flex-col md:flex-row gap-5 md:items-center p-3 max-w-3xl mx-auto">
                {/* left side */}
                <div className="flex-1">
                    <Link to="/" className="text-5xl font-bold dark:text-white">
                        <span className="text-blue-600">Pixel</span>
                        <span className="text-slate-800">Pen</span>
                    </Link>

                    <p className="mt-5">
                        The best blog app is here! Sign in to get started.
                    </p>
                </div>
                {/* right side */}
                <div className="flex-1">
                    <form className="flex flex-col gap-4">
                        <div>
                            <Label value="Your username" />
                            <TextInput
                                type="text"
                                placeholder="Username"
                                id="username"
                                required
                            />
                        </div>
                        <div>
                            <Label value="Your Email" />
                            <TextInput
                                type="email"
                                placeholder="Email"
                                id="email"
                                required
                            />
                        </div>
                        <div>
                            <Label value="Your Password" />
                            <TextInput
                                type="password"
                                placeholder="password"
                                id="password"
                                required
                            />
                        </div>

                        <Button
                            outline
                            gradientDuoTone="cyanToBlue"
                            type="submit"
                        >
                            Sign Up
                        </Button>
                    </form>

                    <div className="flex gap-2 mt-5">
                        <span>Already have an account?</span>
                        <Link
                            to="/sign-in"
                            className="text-blue-500 hover:font-semibold"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
