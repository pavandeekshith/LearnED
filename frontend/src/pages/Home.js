import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Globe, Trophy, Users, BookOpen, Play, Star, GraduationCap } from 'lucide-react';
import QuizComponent from '../components/QuizComponent';

const Home = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  const testimonials = [
    {
      name: "Bivabasu Nagesh",
      student: "Jyotiraditya",
      text: "We have benefited a lot from LearnED classes. The way concepts are taught is amazing. Jyotiraditya's scores improved from the 60s to over 90% in one year. Despite online learning, he pays attention and the teachers are approachable and open to concerns.",
      rating: 5,
      image: "https://images.pexels.com/photos/610500/pexels-photo-610500.jpeg"
    },
    {
      name: "Dolly Asha",
      student: "Manan",
      text: "We got to know about LearnED from someone. Manan joined in 2021 and loves the teachers and classes. The way they handle young kids is commendable. We're in Australia and appreciate that they teach according to the Australian curriculum.",
      rating: 5,
      image: "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg"
    },
    {
      name: "Rajnish",
      student: "Rudra",
      text: "Rudra has been studying with LearnED for 3 years. He struggled in Maths and Science, but LearnED helped him overcome those issues and complete the syllabus on time. They ensured he scored well in NAPLAN.",
      rating: 5,
      image: "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg"
    },
    {
      name: "Sangeetha",
      student: "My Child",
      text: "Thank you to the amazing teachers at LearnED for supporting, educating, and inspiring my child. Your knowledge and care are shaping my kid's future. It's great talking to the tutors.",
      rating: 5,
      image: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg"
    },
    {
      name: "Smitha's Parent",
      student: "Smitha",
      text: "Really happy to see the hard work of LearnED tutors in making Smitha a more confident child every day. I am absolutely satisfied with Smitha's learning through LearnED.",
      rating: 5,
      image: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg"
    }
  ];

  const globalCommunity = [
    { name: "United Arab Emirates", location: "Dubai", flag: "🇦🇪" },
    { name: "Australia", location: "Multiple Cities", flag: "🇦🇺" },
    { name: "Thailand", location: "Bangkok", flag: "🇹🇭" },
    { name: "Canada", location: "Various Provinces", flag: "🇨🇦" },
    { name: "Brazil", location: "São Paulo", flag: "🇧🇷" },
    { name: "India", location: "All Regions", flag: "🇮🇳" }
  ];

  const usps = [
    {
      title: "Structured Weekly Classes",
      description: "Two focused sessions per subject every week (1.5 hours each) ensure consistent progress and ample time for in-depth exploration of every topic.",
      icon: "📅"
    },
    {
      title: "Expert Tutor Guidance",
      description: "Students learn directly from passionate educators who adapt teaching methods to each learner's needs, ensuring clarity and genuine understanding.",
      icon: "👨‍🏫"
    },
    {
      title: "Conceptual Mastery",
      description: "Emphasis on building strong conceptual foundations empowers students to solve problems independently and apply knowledge across subjects.",
      icon: "🧠"
    },
    {
      title: "Retention-First Approach",
      description: "Visualization, regular practice, and personalized encouragement help improve memory and long-term recall of lessons.",
      icon: "💡"
    },
    {
      title: "Instant Doubt Clearance",
      description: "Dedicated time for live question-answer sessions guarantees that no student gets left behind and all doubts are addressed promptly.",
      icon: "❓"
    },
    {
      title: "Interactive & Critical Learning",
      description: "Interactive activities and one-to-one engagement foster curiosity, critical thinking, and holistic cognitive development.",
      icon: "🎯"
    },
    {
      title: "Daily Assessments and Feedback",
      description: "Short, daily quizzes and tasks provide immediate performance insights, reinforcing learning and enabling timely support.",
      icon: "📊"
    },
    {
      title: "Personalized & Affordable",
      description: "Each tutor invests in understanding students personally while offering quality education at accessible, sensible fees for every family.",
      icon: "💰"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/32668035/pexels-photo-32668035.jpeg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/90 via-red-700/80 to-black/70"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Empowering Every Student to
            <span className="block text-red-200">Think, Analyze, and Learn</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Blending the best of traditional teaching methods with interactive, conceptual learning. 
            We nurture critical thinking, encourage curiosity, and create a supportive environment 
            where students thrive.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={() => setShowQuiz(true)}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              Take Quiz <Play size={20} />
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center gap-2">
              Learn More <ChevronRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section-padding bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-8 text-gray-900"
            >
              Our <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Mission & Vision</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border border-red-200"
            >
              <h3 className="text-2xl font-bold text-red-800 mb-4">Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To empower every student to confidently think, analyze, and learn by blending the best of traditional teaching methods with interactive, conceptual learning. We strive to nurture critical thinking, encourage curiosity, and create a supportive environment where students are comfortable asking questions and exploring ideas, no matter the challenges they face.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200"
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To redefine education by making learning truly meaningful and student-centered. Our vision is to build an inclusive community where students are encouraged to write, reflect, and visualize, fostering lifelong learners who are prepared to break boundaries and succeed in a rapidly changing world.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      {showQuiz && <QuizComponent onClose={() => setShowQuiz(false)} />}

      {/* Quick Stats */}
      <section className="section-padding bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: "1000+", label: "Students Worldwide" },
              { icon: BookOpen, number: "9", label: "Classes (2-10)" },
              { icon: Trophy, number: "95%", label: "Success Rate" },
              { icon: Globe, number: "6", label: "Countries" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.number}</h3>
                <p className="text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* USPs Section */}
      <section className="section-padding bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">LearnED?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our unique approach combines traditional excellence with modern innovation to deliver exceptional learning experiences
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usps.map((usp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{usp.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{usp.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {usp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              What Our <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Parents Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real feedback from parents who have seen their children transform through our educational approach
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">Parent of {testimonial.student}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed text-sm">{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Student Community */}
      <section className="section-padding bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Global <span className="text-red-400">Student Community</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              LearnED proudly serves students across continents, adapting to local curricula while maintaining our high standards of education
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {globalCommunity.map((country, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-6xl mb-4">{country.flag}</div>
                <h3 className="text-2xl font-bold mb-2">{country.name}</h3>
                <p className="text-gray-300">{country.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Learning Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-red-100">
              Join thousands of students worldwide who have discovered the joy of meaningful learning with LearnED
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowQuiz(true)}
                className="bg-white text-red-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Take Assessment Quiz
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors">
                Book Free Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;