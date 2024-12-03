import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        try {
            const results = await signInWithPopup(auth, provider);
            const response = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: results.user.displayName,
                    email: results.user.email,
                    googlePhotoUrl: results.user.photoURL,
                }),
            });

            const data = await response.json();

            if (data.success === false) {
                throw new Error(data.message);
            }

            dispatch(signInSuccess(data));
            navigate("/");
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Button
            type="button"
            outline
            gradientDuoTone="greenToBlue"
            onClick={handleClick}
        >
            <AiFillGoogleCircle className="w-6 h-5 mr-2" /> Continue with Google
        </Button>
    );
}
