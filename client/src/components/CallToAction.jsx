import { Button } from "flowbite-react";

export default function CallToAction() {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className=" p-4  flex flex-col gap-2 font-semibold">
                <h2 className="text-lg md:text-2xl">
                    Want to learn more about TypeScript?
                </h2>
                <p className="text-md md:text-lg">
                    Checkout these resources with 100 TypeScript projects
                </p>
                <Button outline gradientDuoTone="purpleToBlue" className="mt-2">
                    <a
                        href="https://github.com/EvanLi/Github-Ranking/blob/master/Top100/TypeScript.md"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Learn more
                    </a>
                </Button>
            </div>
            <div className="order-first md:order-last md:w-1/2 p-4">
                <img
                    className=" rounded-lg hover:scale-105 overflow-hidden transition-transform"
                    src="https://miro.medium.com/v2/resize:fit:1200/1*VTW6T-7KkQHPjf4mtfQ0Zg.png"
                />
            </div>
        </div>
    );
}
