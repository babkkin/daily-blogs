export default function AboutPage() {
  return (
<div>
  <h1 className="text-8xl font-bold text-black mt-50 mb-6 max-w-130 mx-[44vh] ">How it all Happened?</h1>
    <p className="text-4xl text-black mb-8 mx-[44vh]">
    The grand purpose of DailyBlogs <br />Written by our Team
  </p>
    <br/>
    <br/>
  <h1 className="text-8xl font-bold text-black mb-6 mx-[44vh]">Hey there! Welcome to DailyBlogs!</h1>
<br/>
<br/>
<p className="text-4xl text-black mb-8 mx-[44vh] text-justify">
  We started this website as a group of students working on a school project. At first, it was just about passing a subject—but along the way, we realized it could be something bigger.
  Instead of being just our personal blog, DailyBlogs is designed as a space where anyone can share their thoughts, stories, and ideas.<br /><br />
  For us, this project is a way to explore coding, learn how real websites work, and experiment with building something useful for others. But for you, it's a platform to express yourself.
  Whether it's about your day, your passions, or something you're learning, DailyBlogs gives you a place to write, share, and connect.  At the core, DailyBlogs is about learning, growing, and building a community through writing. We're still figuring things out, but that's part of the fun—improving little by little while giving people a space to blog freely.<br /><br />
  So, whether you're here to read, write, or just look around, we're glad you stopped by. Let's make this journey together, one blog at a time.
</p>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<h1 className="text-8xl font-bold text-black mb-6 mx-[44vh]">Meet Our Team</h1>
<p className="text-4xl text-black mb-8 mx-[44vh]">
    People who made this website a reality
</p>
<br/>
<br/>

{/* Team Member 1 - Full Stack Developer */}
<div className="flex items-start gap-8 mx-[44vh] mb-16">
  <div className="flex-shrink-0">
    <img 
      src="https://i.pinimg.com/736x/b9/77/aa/b977aa4db50caec17707ceb586412140.jpg" 
      alt="Full Stack Developer" 
      className="w-64 h-64 rounded-lg object-cover shadow-lg"
    />
  </div>
  <div className="flex-1">
    <p className="text-4xl font-bold text-black text-justify">Paul Azel Marasigan</p>
    <p className="text-4xl text-black mb-4 text-justify">Full Stack Developer</p>
    <br/>
    <p className="text-4xl text-black text-justify">About me: I like both coding the front and back end, and I enjoy learning new things along the way. For me, this project is a chance to explore how everything fits together in building a website.</p>
  </div>
</div>

{/* Team Member 2 - Frontend Developer */}
<div className="flex items-start gap-8 mx-[44vh] mb-16">
  <div className="flex-shrink-0">
    <img 
      src="https://i.pinimg.com/originals/5e/f2/ce/5ef2cef8aa32880df4f6fa891f3ef3b6.jpg" 
      alt="Frontend Developer" 
      className="w-64 h-64 rounded-lg object-cover shadow-lg"
    />
  </div>
  <div className="flex-1">
    <p className="text-4xl font-bold text-black text-justify">Jhune Rey Magdurulan</p>
    <p className="text-4xl text-black mb-4 text-justify">Frontend Developer</p>
    <br/>
    <p className="text-4xl text-black text-justify">About me: I love working on layouts, colors, and everything that makes a site look good. I enjoy experimenting with designs and making sure the website feels smooth and easy to use.</p>
  </div>
</div>

{/* Team Member 3 - Backend Developer */}
<div className="flex items-start gap-8 mx-[44vh] mb-16">
  <div className="flex-shrink-0">
    <img 
      src="https://i.pinimg.com/originals/1a/7a/20/1a7a203dcc7282d58f2f2b2c564a540c.jpg" 
      alt="Backend Developer" 
      className="w-64 h-64 rounded-lg object-cover shadow-lg"
    />
  </div>
  <div className="flex-1">
    <p className="text-4xl font-bold text-black text-justify">Ivan Kien Sambat</p>
    <p className="text-4xl text-black mb-4 text-justify">Backend Developer</p>
    <br/>
    <p className="text-4xl text-black text-justify">About me: I'm passionate about problem-solving and making sure everything works behind the scenes. I like figuring out how to connect features and keep things running efficiently</p>
  </div>
</div>

{/* Team Member 4 - Project Manager */}
<div className="flex items-start gap-8 mx-[44vh] mb-16">
  <div className="flex-shrink-0">
    <img 
      src="https://d.wattpad.com/story_parts/830383355/images/15ec6c9550547d2f135020464133.jpg" 
      alt="Project Manager" 
      className="w-64 h-64 rounded-lg object-cover shadow-lg"
    />
  </div>
  <div className="flex-1">
    <p className="text-4xl font-bold text-black text-justify">Jhon Llyod Alonzo</p>
    <p className="text-4xl text-black mb-4 text-justify">Project Manager</p>
    <br/>
    <p className="text-4xl text-black text-justify">About me: I help organize tasks, keep the group on track, and make sure deadlines are met. I like planning things out and seeing ideas come to life through teamwork.</p>
  </div>
</div>

{/* Team Member 5 - Content Writer */}
<div className="flex items-start gap-8 mx-[44vh] mb-16">
  <div className="flex-shrink-0">
    <img 
      src="https://64.media.tumblr.com/6a227da8e4f9015281cf279d2f084865/e2edc3cea2f1f5db-ab/s1280x1920/754f83df308046c83084fa009ecd7607fca394c6.jpg" 
      alt="Content Writer" 
      className="w-64 h-64 rounded-lg object-cover shadow-lg"
    />
  </div>
  <div className="flex-1">
    <p className="text-4xl font-bold text-black text-justify">Nicolette Sairyelle Gonio</p>
    <p className="text-4xl text-black mb-4 text-justify">Content Writer</p>
    <br/>
    <p className="text-4xl text-black text-justify">About me: I enjoy writing and sharing ideas through words. I like exploring different topics, putting them into blogs, and giving our site personality through content.</p>
  </div>
</div>

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

</div>
  )
}