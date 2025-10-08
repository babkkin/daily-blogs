"use client";
import Image from 'next/image';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export default function AboutPage() {
  return (
    <div className="px-4 md:px-8 lg:mx-[44vh] py-8 md:py-12">

      {/* Public Header */}
      <PublicHeader />

      <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black mb-4 md:mb-6">
        How it all Happened?
      </h1>
      <p className="text-lg md:text-xl lg:text-2xl text-black mb-8 md:mb-12">
        The grand purpose of DailyBlogs <br />Written by our Team
      </p>
      
      <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-6 md:mb-8">
        Hey there! Welcome to DailyBlogs!
      </h1>
      
      <p className="text-lg md:text-xl lg:text-2xl text-black mb-8 md:mb-16 text-justify leading-relaxed">
        We started this website as a group of students working on a school project. At first, it was just about passing a subject—but along the way, we realized it could be something bigger.
        Instead of being just our personal blog, DailyBlogs is designed as a space where anyone can share their thoughts, stories, and ideas.<br /><br />
        For us, this project is a way to explore coding, learn how real websites work, and experiment with building something useful for others. But for you, it&apos;s a platform to express yourself.
        Whether it&apos;s about your day, your passions, or something you&apos;re learning, DailyBlogs gives you a place to write, share, and connect. At the core, DailyBlogs is about learning, growing, and building a community through writing. We&apos;re still figuring things out, but that&apos;s part of the fun—improving little by little while giving people a space to blog freely.<br /><br />
        So, whether you&apos;re here to read, write, or just look around, we&apos;re glad you stopped by. Let&apos;s make this journey together, one blog at a time.
      </p>

      <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-4 md:mb-6">
        Meet Our Team
      </h1>
      <p className="text-lg md:text-xl lg:text-2xl text-black mb-8 md:mb-16">
        People who made this website a reality
      </p>

      {/* Team Member 1 - Full Stack Developer */}
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 mb-12 md:mb-16">
        <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
          <Image 
            src="/team/member1.jpg" 
            alt="Full Stack Developer" 
            width={256}
            height={256}
            className="rounded-lg object-cover shadow-lg w-48 h-48 md:w-64 md:h-64"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-2xl md:text-3xl font-bold text-black">Ivan Sambat</p>
          <p className="text-lg md:text-xl lg:text-2xl text-black mb-4">Full Stack Developer</p>
          <p className="text-lg md:text-xl lg:text-2xl text-black text-justify">
            About me: I like both coding the front and back end, and I enjoy learning new things along the way. For me, this project is a chance to explore how everything fits together in building a website.
          </p>
        </div>
      </div>

      {/* Team Member 2 - Frontend Developer */}
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 mb-12 md:mb-16">
        <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
          <Image 
            src="/team/member2.jpg" 
            alt="Frontend Developer" 
            width={256}
            height={256}
            className="rounded-lg object-cover shadow-lg w-48 h-48 md:w-64 md:h-64"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-2xl md:text-3xl font-bold text-black">Paul Marasigan</p>
          <p className="text-lg md:text-xl lg:text-2xl text-black mb-4">Frontend Developer</p>
          <p className="text-lg md:text-xl lg:text-2xl text-black text-justify">
            About me: I love working on layouts, colors, and everything that makes a site look good. I enjoy experimenting with designs and making sure the website feels smooth and easy to use.
          </p>
        </div>
      </div>

      {/* Team Member 3 - Backend Developer */}
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 mb-12 md:mb-16">
        <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
          <Image 
            src="/team/member3.jpg" 
            alt="Backend Developer" 
            width={256}
            height={256}
            className="rounded-lg object-cover shadow-lg w-48 h-48 md:w-64 md:h-64"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-2xl md:text-3xl font-bold text-black">Jhune Magdurulan</p>
          <p className="text-lg md:text-xl lg:text-2xl text-black mb-4">Backend Developer</p>
          <p className="text-lg md:text-xl lg:text-2xl text-black text-justify">
            About me: I&apos;m passionate about problem-solving and making sure everything works behind the scenes. I like figuring out how to connect features and keep things running efficiently
          </p>
        </div>
      </div>

      {/* Team Member 4 - Project Manager */}
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 mb-12 md:mb-16">
        <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
          <Image 
            src="/team/member4.jpg" 
            alt="Project Manager" 
            width={256}
            height={256}
            className="rounded-lg object-cover shadow-lg w-48 h-48 md:w-64 md:h-64"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-2xl md:text-3xl font-bold text-black">Jhon Alonzo</p>
          <p className="text-lg md:text-xl lg:text-2xl text-black mb-4">Project Manager</p>
          <p className="text-lg md:text-xl lg:text-2xl text-black text-justify">
            About me: I help organize tasks, keep the group on track, and make sure deadlines are met. I like planning things out and seeing ideas come to life through teamwork.
          </p>
        </div>
      </div>

      {/* Team Member 5 - Content Writer */}
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 mb-12 md:mb-16">
        <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
          <Image 
            src="/team/member5.jpg" 
            alt="Content Writer" 
            width={256}
            height={256}
            className="rounded-lg object-cover shadow-lg w-48 h-48 md:w-64 md:h-64"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-2xl md:text-3xl font-bold text-black">Nicolette Gonio</p>
          <p className="text-lg md:text-xl lg:text-2xl text-black mb-4">Content Writer</p>
          <p className="text-lg md:text-xl lg:text-2xl text-black text-justify">
            About me: I enjoy writing and sharing ideas through words. I like exploring different topics, putting them into blogs, and giving our site personality through content.
          </p>
        </div>
      </div>

      {/* Public Footer */}
      <PublicFooter />

    </div>
  );
}
