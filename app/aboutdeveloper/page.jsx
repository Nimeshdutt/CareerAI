import React from "react";
import { FiGithub } from "react-icons/fi";
import Header from "../dashboard/_components/Header";
import Footer from "../dashboard/_components/Footer";

const page = () => {
  return (
    <>
      <Header />
      <div
        className="w-full h-screen"
        style={{
          background:
            "linear-gradient(90deg, rgba(238,231,248,1) 0%, rgba(239,239,239,1) 50%, rgba(238,231,248,1) 100%)",
        }}
      >
        <div className="flex items-center justify-center">
          <div className="w-[30%] mt-20">
            <article className="group">
              <img
                alt=""
                src="/mypic1.jpeg"
                className="object-cover w-full transition shadow-xl h-52 rounded-xl"
              />

              <div className="p-4">
                <a href="#">
                  <h3 className="text-lg font-medium text-gray-900">
                    About Me
                  </h3>
                </a>

                <p className="mt-2 font-semibold text-justify text-gray-700 text-sm/relaxed">
                  I am the creator of CareerAI, an AI-powered mock interview
                  platform that helps candidates practice with realistic
                  questions and targeted feedback. The project focuses on a
                  fast, clean UI with Next.js, Tailwind CSS, and Drizzle ORM,
                  with Gemini AI powering personalized interview flows.
                </p>
                <div className="flex items-center gap-3 my-5">
                  <a
                    target="_blank"
                    href="https://github.com/Nimeshdutt"
                    className="p-1 rounded-lg cursor-pointer hover:bg-slate-900 hover:text-white"
                  >
                    <FiGithub style={{ fontSize: "25px" }} />
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default page;
