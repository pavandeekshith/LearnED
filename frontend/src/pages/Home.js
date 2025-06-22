import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Globe, Trophy, Users, BookOpen, Play, Star } from 'lucide-react';
import QuizComponent from '../components/QuizComponent';

const Home = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  const testimonials = [
    {
      name: "Sarah Johnson",
      class: "Class 8",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. LearnED has transformed my understanding of mathematics completely.",
      rating: 5,
      image: "https://images.pexels.com/photos/610500/pexels-photo-610500.jpeg"
    },
    {
      name: "Arjun Patel",
      class: "Class 10",
      text: "The science concepts are explained so clearly. I never thought learning could be this engaging and fun!",
      rating: 5,
      image: "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg"
    },
    {
      name: "Emily Chen",
      class: "Class 6",
      text: "The dedicated educators here really care about each student's progress. My grades have improved significantly.",
      rating: 5,
      image: "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg"
    },
    {
      name: "Michael Rodriguez",
      class: "Class 9",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The personalized learning approach works perfectly for me.",
      rating: 5,
      image: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg"
    },
    {
      name: "Priya Sharma",
      class: "Class 7",
      text: "Traditional methods with modern technology - exactly what I needed to excel in my studies.",
      rating: 5,
      image: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg"
    },
    {
      name: "David Kim",
      class: "Class 5",
      text: "The international learning experience has broadened my perspective on education. Highly recommended!",
      rating: 5,
      image: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg"
    }
  ];

  const countries = [
    { name: "India", flag: "🇮🇳", description: "Our home base with traditional values" },
    { name: "USA", flag: "🇺🇸", description: "Innovation in educational technology" },
    { name: "UK", flag: "🇬🇧", description: "Excellence in academic standards" },
    { name: "Japan", flag: "🇯🇵", description: "Precision and disciplined learning" },
    { name: "EU", flag: "🇪🇺", description: "Diverse educational methodologies" }
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
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Empowering Minds Through
            <span className="block text-red-300">Traditional Excellence</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            We believe in the timeless effectiveness of traditional learning methods, 
            where eager students engage with dedicated educators in an innovative yet classic approach.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={() => setShowQuiz(true)}
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
            >
              Take Quiz <Play size={20} />
            </button>
            <button className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
              Learn More <ChevronRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-8 text-gray-900"
            >
              Our <span className="text-gradient">Educational Philosophy</span>
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed space-y-6"
            >
              <p>
                We are a passionate team that believes in the timeless effectiveness of traditional learning 
                methods. We adhere to the classic model where eager students, driven by a thirst for knowledge, 
                engage with <span className="font-semibold text-red-600">dedicated educators</span>.
              </p>
              
              <p>
                At our core, we champion an <span className="font-semibold text-red-600">educational approach</span> that combines the wisdom of the past with 
                innovative techniques, producing holistic, effective, and enduring <span className="font-semibold text-red-600">learning experiences for the 
                students</span> we serve.
              </p>
              
              <p>
                Join us on this enriching journey, where education transcends the ordinary and opens the doors to 
                <span className="font-semibold text-red-600"> incredible achievements</span>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      {showQuiz && <QuizComponent onClose={() => setShowQuiz(false)} />}

      {/* Quick Stats */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: "500+", label: "Students Taught" },
              { icon: BookOpen, number: "9", label: "Classes (2-10)" },
              { icon: Trophy, number: "95%", label: "Success Rate" },
              { icon: Globe, number: "5", label: "Countries" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              What Our <span className="text-gradient">Students Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from our dedicated learners about their transformative educational journey
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 card-hover"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.class}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* International Experience */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Global <span className="text-red-400">Learning Experience</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our international presence brings diverse educational methodologies and global perspectives 
              to enhance your learning journey
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries.map((country, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 card-hover"
              >
                <div className="text-6xl mb-4">{country.flag}</div>
                <h3 className="text-2xl font-bold mb-2">{country.name}</h3>
                <p className="text-gray-300">{country.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Begin Your Learning Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their academic performance with our proven methods
            </p>
            <button 
              onClick={() => setShowQuiz(true)}
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Start Your Quiz Now
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;