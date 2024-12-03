import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { useState } from "react";

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            return setErrorMessage("Please fill in all fields");
        }

        try {
            setLoading(true);
            setErrorMessage(null);

            const response = await fetch("/api/auth/sign-in", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success === false) {
                setLoading(false);
                return setErrorMessage(data.message);
            }

            setLoading(false);
            navigate("/");
        } catch (error) {
            setLoading(false);
            setErrorMessage(error.message);
        }
    };

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
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <Label value="Your username" />
                            <TextInput
                                type="text"
                                placeholder="Username"
                                id="username"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value="Your Password" />
                            <TextInput
                                type="password"
                                placeholder="password"
                                id="password"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <Button
                            outline
                            gradientDuoTone="cyanToBlue"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="p-3">Loading...</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="flex gap-2 mt-5">
                        <span>Don&apos;t have an account?</span>
                        <Link
                            to="/sign-up"
                            className="text-blue-500 hover:font-semibold"
                        >
                            Sign up
                        </Link>
                    </div>

                    {errorMessage && (
                        <Alert className="mt-5" color="failure">
                            {errorMessage}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
