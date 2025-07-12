import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({ users: 0, skills: 0, swaps: 0 });

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Graphic Designer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      quote: "I learned Python programming in exchange for teaching Photoshop. The community here is amazing!"
    },
    {
      name: "Marcus Johnson",
      role: "Software Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      quote: "SkillLink helped me find a cooking mentor while I taught web development. Win-win!"
    },
    {
      name: "Elena Rodriguez",
      role: "Marketing Specialist",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      quote: "From guitar lessons to digital marketing - I've grown so much through skill swapping!"
    }
  ];

  // Animate stats counter
  useEffect(() => {
    const animateStats = () => {
      const targetStats = { users: 1200, skills: 350, swaps: 890 };
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStats({
          users: Math.floor(targetStats.users * progress),
          skills: Math.floor(targetStats.skills * progress),
          swaps: Math.floor(targetStats.swaps * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setStats(targetStats);
        }
      }, stepDuration);
    };

    animateStats();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero section with enhanced visuals */}
      <div className="relative isolate">
        {/* Background decoration */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Announcement banner */}
              <div className="mb-8 flex">
                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 bg-gradient-to-r from-indigo-50 to-purple-50">
                  🎉 Join our growing community of skill swappers!{' '}
                  <Link to="/about" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Learn more <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Main heading with gradient */}
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Share Skills,
                </span>
                <br />
                <span className="text-gray-900">Grow Together</span>
              </h1>
              
              <p className="mt-6 text-xl leading-8 text-gray-600 max-w-lg">
                Transform your expertise into learning opportunities. Connect with passionate learners and skilled teachers in our vibrant community - 
                <span className="font-semibold text-indigo-600"> no money required!</span>
              </p>

              {/* Enhanced CTA buttons */}
              <div className="mt-10 flex items-center gap-x-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/signup"
                    className="rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    🚀 Start Your Journey
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link to="/how-it-works" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">
                    See how it works <span aria-hidden="true">→</span>
                  </Link>
                </motion.div>
              </div>

              {/* Live stats */}
              <motion.div 
                className="mt-12 grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{stats.users.toLocaleString()}+</div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.skills}+</div>
                  <div className="text-sm text-gray-500">Skills Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.swaps}+</div>
                  <div className="text-sm text-gray-500">Successful Swaps</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced hero image section */}
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative"
              >
                {/* Main image */}
                <div className="relative rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-2xl ring-1 ring-gray-900/10">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="People collaborating and learning together"
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                  />
                  
                  {/* Floating skill cards */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 border"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        💻
                      </div>
                      <div className="text-sm font-medium">Coding</div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 border"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        🎨
                      </div>
                      <div className="text-sm font-medium">Design</div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    className="absolute top-1/2 -right-6 bg-white rounded-lg shadow-lg p-3 border"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        🎵
                      </div>
                      <div className="text-sm font-medium">Music</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Skills Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trending Skills
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Discover what our community is sharing and learning right now
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4"
          >
            {[
              { icon: "💻", name: "Programming", count: "89 offers" },
              { icon: "🎨", name: "Design", count: "56 offers" },
              { icon: "📱", name: "Digital Marketing", count: "43 offers" },
              { icon: "🎵", name: "Music", count: "34 offers" },
              { icon: "📸", name: "Photography", count: "28 offers" },
              { icon: "🍳", name: "Cooking", count: "67 offers" },
              { icon: "💪", name: "Fitness", count: "22 offers" },
              { icon: "🌱", name: "Gardening", count: "19 offers" }
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{skill.count}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Features section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Simple & Effective</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                How SkillLink Works
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our platform makes skill exchange effortless, secure, and rewarding for everyone involved.
              </p>
            </motion.div>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {[
                {
                  step: "01",
                  title: "Create your profile",
                  description: "Sign up in minutes and showcase both the skills you can teach and the skills you want to learn.",
                  icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                },
                {
                  step: "02",
                  title: "Smart matching",
                  description: "Our algorithm finds perfect skill exchange partners based on complementary skills and preferences.",
                  icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                },
                {
                  step: "03",
                  title: "Connect & propose",
                  description: "Send swap proposals with clear expectations and schedules. Build trust through our rating system.",
                  icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                },
                {
                  step: "04",
                  title: "Learn & grow",
                  description: "Use our built-in tools to coordinate sessions, track progress, and rate your experience.",
                  icon: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative pl-16 group"
                >
                  <div className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg group-hover:shadow-xl transition-shadow">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                    </svg>
                  </div>
                  <div className="absolute left-1 top-1 h-3 w-3 rounded-full bg-white text-xs font-bold text-indigo-600 flex items-center justify-center">
                    {feature.step}
                  </div>
                  <dt className="text-base font-semibold leading-7 text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Community Says
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Real stories from real skill swappers
            </p>
          </motion.div>

          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-16 max-w-2xl"
          >
            <figure className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <img
                className="mx-auto h-16 w-16 rounded-full object-cover"
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
              />
              <blockquote className="mt-6 text-xl font-medium leading-8 text-gray-900">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              <figcaption className="mt-6">
                <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
              </figcaption>
            </figure>
          </motion.div>

          {/* Testimonial indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-indigo-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CTA section */}
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16"
          >
            {/* Background decoration */}
            <div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl">
              <div className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"></div>
            </div>

            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to transform your skills?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
              Join thousands of learners and teachers who are already sharing their expertise and discovering new passions.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="rounded-md bg-white px-8 py-4 text-base font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300"
                >
                  🚀 Start Learning Today
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link
                  to="/how-it-works"
                  className="rounded-md border-2 border-white px-8 py-4 text-base font-semibold text-white hover:bg-white hover:text-indigo-600 transition-all duration-300"
                >
                  See Demo 
                  <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Link>
              </motion.div>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex justify-center items-center space-x-8 text-indigo-200">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">100% Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Safe & Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Verified Users</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;