"use client";
import Image from "next/image";
import { useDarkMode } from "../DarkModeContext";

export default function AboutPage() {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`px-6 md:px-20 lg:px-40 min-h-1 transition-colors duration-300 ${
        darkMode ? 'bg-gray-900': 'bg-green'
      }`}
    >
      <div>
        <h1
          className={`text-4xl font-bold pt-4 mb-2 text-center transition-colors duration-300 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          How it all Happened?
        </h1>

      </div>
        

        <p
          className={`text-lg mb-8 text-center transition-colors duration-300 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          The grand purpose of DailyBlogs <br /> Written by our Team
        </p>

        {/* Intro */}
        <h2
          className={`text-3xl font-semibold mb-4 text-center transition-colors duration-300 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Hey there! Welcome to DailyBlogs!
        </h2>

        <p
          className={`text-lg leading-relaxed mb-8 text-justify transition-colors duration-300 ${
            darkMode ? "text-gray-300" : "text-gray-900"
          }`}
        >
          We started this website as a group of students working on a school project.
          At first, it was just about passing a subject—but along the way, we realized it could be something bigger.
          Instead of being just our personal blog, DailyBlogs is designed as a space where anyone can share their thoughts, stories, and ideas.
          <br /><br />
          For us, this project is a way to explore coding, learn how real websites work, and experiment with building something useful for others.
          But for you, it&apos;s a platform to express yourself.
          Whether it&apos;s about your day, your passions, or something you&apos;re learning, DailyBlogs gives you a place to write, share, and connect.
          At the core, DailyBlogs is about learning, growing, and building a community through writing.
          We&apos;re still figuring things out, but that&apos;s part of the fun—improving little by little while giving people a space to blog freely.
          <br /><br />
          So, whether you&apos;re here to read, write, or just look around, we&apos;re glad you stopped by.
          Let&apos;s make this journey together, one blog at a time.
        </p>

        {/* Team Section */}
        <h2
          className={`text-3xl font-semibold mb-4 text-center transition-colors duration-300 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Meet Our Team
        </h2>

        <p
          className={`text-lg mb-8 text-center transition-colors duration-300 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          People who made this website into a reality
        </p>

        {/* Team Members */}
        <div className="space-y-12">
          {[
            {
              name: "Ivan Sambat",
              role: "Full Stack Developer",
              about:
                "I like both coding the front and back end, and I enjoy learning new things along the way. For me, this project is a chance to explore how everything fits together in building a website.",
              img: "/team/member1.jpg",
            },
            {
              name: "Paul Marasigan",
              role: "Frontend Developer",
              about:
                "I love working on layouts, colors, and everything that makes a site look good. I enjoy experimenting with designs and making sure the website feels smooth and easy to use.",
              img: "/team/member2.jpg",
            },
            {
              name: "Jhune Magdurulan",
              role: "Backend Developer",
              about:
                "I'm passionate about problem-solving and making sure everything works behind the scenes. I like figuring out how to connect features and keep things running efficiently.",
              img: "/team/member3.jpg",
            },
            {
              name: "Jhon Alonzo",
              role: "Project Manager",
              about:
                "I help organize tasks, keep the group on track, and make sure deadlines are met. I like planning things out and seeing ideas come to life through teamwork.",
              img: "/team/member4.jpg",
            },
            {
              name: "Nicolette Gonio",
              role: "Content Writer",
              about:
                "I enjoy writing and sharing ideas through words. I like exploring different topics, putting them into blogs, and giving our site personality through content.",
              img: "/team/member5.jpg",
            },
          ].map((member, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <Image
                  src={member.img}
                  alt={member.role}
                  width={192}
                  height={192}
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
              <div className="flex-1">
                <p
                  className={`text-xl font-semibold transition-colors duration-300 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {member.name}
                </p>
                <p
                  className={`text-lg mb-2 transition-colors duration-300 ${
                    darkMode ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  {member.role}
                </p>
                <p
                  className={`text-base transition-colors duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {member.about}
                </p>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
