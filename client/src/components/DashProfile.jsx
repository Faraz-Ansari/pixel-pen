import { useSelector } from "react-redux";
import { TextInput, Button } from "flowbite-react";

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center text-3xl font-semibold">Profile</h1>
            <form className="flex flex-col gap-4 ">
                <div className="h-32 w-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                    <img
                        src={currentUser.profilePicture}
                        className="rounded-full w-full h-full object-cover  border-8 border-[lightgray]"
                        alt="profile picture"
                    />
                </div>
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
                <span className="text-green-700 hover:font-semibold cursor-pointer">
                    Sign out
                </span>
            </div>
        </div>
    );
}
