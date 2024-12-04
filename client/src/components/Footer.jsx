import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsGithub, BsTwitter, BsInstagram } from "react-icons/bs";

export default function FooterComponent() {
    return (
        <Footer container className="border-t-8 border-teal-500">
            <div className="max-w-7xl mx-auto w-full">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link
                            to="/"
                            className="self-center text-xl md:text-2xl whitespace-nowrap font-semibold dark:text-white"
                        >
                            <span className="text-blue-600 dark:text-blue-500">Pixel</span>
                            <span className="text-slate-800 dark:text-white">Pen</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-4">
                        <div>
                            <Footer.Title title="About" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="https://www.100jsprojects.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    100 js projects
                                </Footer.Link>

                                <Footer.Link
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Pixel Pen
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div>
                            <Footer.Title title="Follow us" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="https://www.github.com/Faraz-Ansari"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub
                                </Footer.Link>

                                <Footer.Link
                                    href="https://www.linkedin.com/in/frzansari20"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    LinkedIn
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div>
                            <Footer.Title title="Legal" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">
                                    Privacy policy
                                </Footer.Link>

                                <Footer.Link href="#">
                                    Terms and conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>

                <Footer.Divider />
                <div className="flex gap-4 items-center justify-between w-full">
                    <Footer.Copyright
                        href="/"
                        by="Pixel Pen"
                        year={new Date().getFullYear()}
                    />
                    <div className="flex items-center gap-6 ">
                        <Footer.Icon href="#" icon={BsFacebook} />
                        <Footer.Icon href="#" icon={BsInstagram} />
                        <Footer.Icon href="#" icon={BsTwitter} />
                        <Footer.Icon href="https://www.github.com/Faraz-Ansari" icon={BsGithub} />
                    </div>
                </div>
            </div>
        </Footer>
    );
}
