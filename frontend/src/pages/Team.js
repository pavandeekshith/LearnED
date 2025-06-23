import React from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Award, Users } from 'lucide-react';

const Team = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Mitchell",
      position: "Mathematics Head",
      experience: "15+ years",
      specialization: "Advanced Mathematics & Problem Solving",
      image: "https://images.pexels.com/photos/8926556/pexels-photo-8926556.jpeg",
      quote: "Mathematics is the language of logic and creativity combined."
    },
    {
      name: "Prof. Rajesh Kumar",
      position: "Science Department Lead",
      experience: "12+ years",
      specialization: "Physics & Chemistry Integration",
      image: "https://images.pexels.com/photos/5212340/pexels-photo-5212340.jpeg",
      quote: "Science is about understanding the why behind everything."
    },
    {
      name: "Ms. Emily Chen",
      position: "Primary Mathematics",
      experience: "8+ years",
      specialization: "Foundational Math Concepts",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
      quote: "Building strong foundations creates limitless possibilities."
    },
    {
      name: "Dr. Michael Johnson",
      position: "Advanced Science",
      experience: "18+ years",
      specialization: "Biology & Environmental Science",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754",
      quote: "Every student has the potential to become a scientist."
    },
    {
      name: "Ms. Priya Sharma",
      position: "Learning Coordinator",
      experience: "10+ years",
      specialization: "Student Development & Assessment",
      image: "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg",
      quote: "Personalized learning unlocks every child's unique potential."
    },
    {
      name: "Prof. David Wilson",
      position: "Curriculum Director",
      experience: "20+ years",
      specialization: "Educational Strategy & Innovation",
      image: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg",
      quote: "Innovation in education opens doors to the future."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passionate Teaching",
      description: "Our educators bring enthusiasm and dedication to every lesson, inspiring students to love learning."
    },
    {
      icon: BookOpen,
      title: "Traditional Excellence",
      description: "We believe in time-tested educational methods that have proven successful across generations."
    },
    {
      icon: Award,
      title: "Academic Achievement",
      description: "We strive for excellence and help every student reach their highest potential."
    },
    {
      icon: Users,
      title: "Student-Centered",
      description: "Every decision we make is focused on what's best for our students' growth and development."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-red-600 via-red-700 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Our <span className="text-red-200">Dedicated Team</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            "Empowering minds, one lesson at a time."
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-red-100 max-w-4xl mx-auto"
          >
            Meet the passionate educators who make learning an extraordinary journey through their 
            dedication, expertise, and unwavering commitment to student success.
          </motion.p>
        </div>
      </section>

      {/* Team Values */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Our <span className="text-gradient">Core Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide our teaching philosophy and shape every interaction with our students
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gray-50 card-hover"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                  <value.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Meet Our <span className="text-gradient">Expert Educators</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team of dedicated professionals brings decades of combined experience in mathematics 
              and science education, each committed to helping students achieve their academic goals.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 card-hover"
              >
                <div className="text-center mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-red-100"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-red-600 font-semibold mb-2">{member.position}</p>
                  <p className="text-sm text-gray-600 mb-3">{member.experience} Experience</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-4">{member.specialization}</p>
                  <blockquote className="text-gray-600 italic text-sm">
                    "{member.quote}"
                  </blockquote>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-8 text-gray-900"
            >
              Our <span className="text-gradient">Teaching Philosophy</span>
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 rounded-2xl p-8 md:p-12"
            >
              <div className="text-lg md:text-xl text-gray-700 leading-relaxed space-y-6">
                <p>
                  At LearnED, we believe that every student is unique, with their own learning style, 
                  pace, and potential. Our educators are not just teachers; they are mentors, guides, 
                  and cheerleaders who understand that education is about more than just transferring knowledge.
                </p>
                
                <p>
                  We combine <span className="font-semibold text-red-600">traditional teaching methods</span> that 
                  have stood the test of time with innovative approaches that engage today's learners. 
                  Our classrooms are spaces where curiosity is encouraged, questions are welcomed, 
                  and mistakes are seen as learning opportunities.
                </p>
                
                <p>
                  Every member of our team is committed to creating an environment where students feel 
                  supported, challenged, and inspired to reach their full potential. We measure our success 
                  not just in test scores, but in the confidence, critical thinking skills, and love of 
                  learning that our students develop.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Learn with the <span className="text-red-400">Best?</span>
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
              Experience the difference that dedicated, passionate educators can make in your academic journey.
            </p>
            <button className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors">
              Start Learning Today
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Team;