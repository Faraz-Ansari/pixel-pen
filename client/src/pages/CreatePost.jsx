import { Button, FileInput, Select, TextInput } from "flowbite-react";

export default function CreatePost() {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Create post
            </h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 md:flex-row justify-between">
                    <TextInput
                        type="text"
                        placeholder="Title"
                        id="title"
                        className="flex-1"
                        required
                    />
                    <Select>
                        <option value="uncategorized">Select a category</option>
                        <option value="javascript">Java Script</option>
                        <option value="reactjs">React.js</option>
                        <option value="nextjs">Next.js</option>
                    </Select>
                </div>

                <div className="p-3 flex gap-4 items-center justify-between border-4 border-teal-400 border-dotted">
                    <FileInput type="file" accept="image/*" />{" "}
                    <Button type="button" gradientDuoTone="greenToBlue" outline>
                        Upload image
                    </Button>
                </div>

                <TextInput
                    placeholder="Enter something..."
                    sizing="lg"
                    required
                />
                <Button type="submit" outline gradientDuoTone="purpleToBlue">
                    Publish
                </Button>
            </form>
        </div>
    );
}
