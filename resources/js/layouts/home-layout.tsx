import { Link } from "@inertiajs/react";
import { ReactNode } from "react";
import { TextEffect } from "@/components/custom/animated-text";
import AppLogo from "@/components/app-logo";
import { TiBookmark } from "react-icons/ti";
import { MdBookmarkAdded } from "react-icons/md";
import { Toaster } from "sonner";
export default function HomeLayout({ children }: { children: ReactNode }) {
    const words = [" Fast & Easy", "Patient-Friendly", "On-Time Service", "Book Anytime", "Hassle-Free",]
    return (
        <div className="min-h-screen bg-white flex flex-col scroll-smooth">
            <Toaster />
            <header className="flex justify-between items-center md:px-8 px-4 py-4 bg-white shadow-sm border-b">
                <h1 className="text-2xl font-bold text-sky-600 flex items-center">
                    <AppLogo className="w-30"></AppLogo>

                </h1>
                <a
                    href="#BookNow"
                    className="bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700 transition shadow-md flex items-center gap-2 flex-row"
                >
                    <TiBookmark /> Book Now
                </a>
            </header>
            <main className="flex flex-1 items-center justify-center px-4 sm:px-6 md:bg-white bg-sky-50">
                <div className="max-w-4xl text-center w-full lg:min-h-[60vh] min-h-[50vh] flex flex-col justify-center">

                    <h2 className="text-4xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight flex items-center justify-center gap-1 flex-col md:flex-row">
                        <span className="block">
                            <TextEffect
                                words={words}
                                className="inline-block "
                                textClassName="font-bold md:text-5xl text-4xl"
                                effect={"flip"}
                                duration={5000}
                            />
                        </span>

                        <span className="block text-sky-600 mb-1">
                            Clinic Appointment
                        </span>
                    </h2>

                    <p className="mt-4 sm:mt-6 text-gray-600 text-base sm:text-lg px-2">
                        Book your medical consultation in just a few clicks.
                        Choose your preferred date and time — no waiting,
                        no long queues.
                    </p>

                    <div className="mt-6 sm:mt-8 flex justify-center">
                        <a
                            href="#BookNow"
                            className="flex items-center gap-2 bg-sky-600 text-white px-6 sm:px-8 py-3 rounded-xl text-base sm:text-lg font-medium hover:bg-sky-700 transition shadow-md  "
                        >
                            <MdBookmarkAdded /> Book an Appointment
                        </a>
                    </div>

                </div>
            </main>

            {/* Info Section */}
            <section className="bg-sky-700 py-12 px-6 hidden md:block">
                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">

                    <div>
                        <h3 className="text-xl font-semibold text-sky-200">Easy Scheduling</h3>
                        <p className="mt-3 text-gray-50">
                            Select your preferred date and time instantly.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-sky-200">Quick Confirmation</h3>
                        <p className="mt-3 text-gray-50">
                            Get immediate confirmation of your appointment.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-sky-200">Trusted Care</h3>
                        <p className="mt-3 text-gray-50">
                            Professional healthcare service you can rely on.
                        </p>
                    </div>
                </div>
            </section>
            <section className="flex w-full justify-center items-center p-2 md:px-10 border-t">
                {children}
            </section>
        </div>
    );
}