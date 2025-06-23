import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calculator, Microscope, ChevronDown, ChevronRight, Download, Eye } from 'lucide-react';

const Academics = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const academicProgram = {
    '2': {
      name: 'Class 2',
      age: '7-8 years',
      subjects: {
        mathematics: {
          name: 'Mathematics',
          icon: Calculator,
          description: 'Building strong mathematical foundations with fun and interactive learning',
          topics: [
            'Number Recognition and Counting (1-100)',
            'Addition and Subtraction (Basic)',
            'Simple Multiplication Tables (2, 5, 10)',
            'Shapes and Patterns',
            'Time and Calendar',
            'Money Recognition',
            'Measurement (Length, Weight)',
            'Simple Word Problems'
          ],
          skills: [
            'Problem-solving thinking',
            'Logical reasoning',
            'Pattern recognition',
            'Basic arithmetic operations'
          ]
        }
      }
    },
    '5': {
      name: 'Class 5',
      age: '10-11 years',
      subjects: {
        mathematics: {
          name: 'Mathematics',
          icon: Calculator,
          description: 'Intermediate mathematics concepts with practical applications',
          topics: [
            'Large Numbers and Place Value',
            'Four Operations (Advanced)',
            'Fractions and Decimals',
            'Factors and Multiples',
            'Geometry - Lines, Angles, Triangles',
            'Perimeter and Area',
            'Data Handling and Graphs',
            'Percentage and Ratio (Introduction)',
            'Time, Distance, and Speed',
            'Algebra Basics'
          ],
          skills: [
            'Advanced problem-solving',
            'Mathematical reasoning',
            'Geometric visualization',
            'Data interpretation'
          ]
        },
        science: {
          name: 'Science',
          icon: Microscope,
          description: 'Exploring the wonders of natural sciences through experiments and discovery',
          topics: [
            'Plants - Structure, Growth, and Reproduction',
            'Animals - Classification and Adaptation',
            'Human Body Systems',
            'Matter and Materials',
            'Light, Sound, and Energy',
            'Motion and Forces',
            'Water Cycle and Weather',
            'Solar System and Space',
            'Environmental Conservation',
            'Simple Machines'
          ],
          skills: [
            'Scientific observation',
            'Hypothesis formation',
            'Experimental thinking',
            'Environmental awareness'
          ]
        }
      }
    }
  };

  const allClasses = [
    { number: '2', description: 'Foundation Building' },
    { number: '3', description: 'Skill Development' },
    { number: '4', description: 'Concept Strengthening' },
    { number: '5', description: 'Advanced Learning' },
    { number: '6', description: 'Middle School Prep' },
    { number: '7', description: 'Critical Thinking' },
    { number: '8', description: 'Analytical Skills' },
    { number: '9', description: 'Board Exam Prep' },
    { number: '10', description: 'Board Excellence' }
  ];

  const toggleClass = (classNum) => {
    setSelectedClass(selectedClass === classNum ? null : classNum);
    setSelectedSubject(null);
  };

  const toggleSubject = (subject) => {
    setSelectedSubject(selectedSubject === subject ? null : subject);
  };

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
            Academic <span className="text-red-200">Excellence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            Comprehensive Mathematics & Science Education from Class 2 to Class 10
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-red-100 max-w-4xl mx-auto"
          >
            Our carefully designed curriculum focuses on building strong foundations in mathematics and science, 
            preparing students for academic success and future challenges.
          </motion.p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Our <span className="text-gradient">Academic Focus</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We specialize in Mathematics and Science education, providing comprehensive learning 
              experiences that build confidence and competence in these essential subjects.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center p-8 rounded-2xl bg-red-50 border border-red-100"
            >
              <Calculator className="w-16 h-16 text-red-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mathematics</h3>
              <p className="text-gray-600 leading-relaxed">
                From basic arithmetic to advanced problem-solving, we build mathematical thinking 
                that empowers students to tackle complex challenges with confidence and precision.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center p-8 rounded-2xl bg-blue-50 border border-blue-100"
            >
              <Microscope className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Science</h3>
              <p className="text-gray-600 leading-relaxed">
                Through hands-on experiments and conceptual learning, we nurture scientific curiosity 
                and develop critical thinking skills that prepare students for future innovation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Class Selection */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Choose Your <span className="text-gradient">Class</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our grade-specific curriculum designed to meet students at their level 
              and guide them to the next stage of learning.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {allClasses.map((classInfo, index) => (
              <motion.button
                key={classInfo.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => toggleClass(classInfo.number)}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedClass === classInfo.number
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-25'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">Class {classInfo.number}</h3>
                  {selectedClass === classInfo.number ? (
                    <ChevronDown className="w-5 h-5 text-red-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <p className="text-gray-600">{classInfo.description}</p>
                {(classInfo.number === '2' || classInfo.number === '5') && (
                  <div className="mt-3">
                    <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      Detailed Syllabus Available
                    </span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Detailed Syllabus for Selected Class */}
          <AnimatePresence>
            {selectedClass && academicProgram[selectedClass] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {academicProgram[selectedClass].name} Curriculum
                    </h3>
                    <p className="text-gray-600">
                      Age Group: {academicProgram[selectedClass].age}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(academicProgram[selectedClass].subjects).map(([key, subject]) => (
                      <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleSubject(key)}
                          className="w-full p-6 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <subject.icon className="w-8 h-8 text-red-600" />
                            <div className="text-left">
                              <h4 className="text-xl font-semibold text-gray-900">{subject.name}</h4>
                              <p className="text-gray-600">{subject.description}</p>
                            </div>
                          </div>
                          {selectedSubject === key ? (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          )}
                        </button>

                        <AnimatePresence>
                          {selectedSubject === key && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t border-gray-200"
                            >
                              <div className="p-6 bg-white">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                  <div>
                                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Topics Covered</h5>
                                    <ul className="space-y-2">
                                      {subject.topics.map((topic, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                                          <span className="text-gray-700">{topic}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Skills Developed</h5>
                                    <ul className="space-y-2">
                                      {subject.skills.map((skill, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                          <span className="text-gray-700">{skill}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                                  <button className="btn-primary flex items-center gap-2">
                                    <Eye size={18} />
                                    View Complete Syllabus
                                  </button>
                                  <button className="btn-secondary flex items-center gap-2">
                                    <Download size={18} />
                                    Download PDF
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Why Choose Our Academics */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose Our <span className="text-gradient">Academic Program?</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Structured Learning Path",
                description: "Each class builds upon previous knowledge, ensuring smooth academic progression and deep understanding.",
                icon: "📚"
              },
              {
                title: "Practical Application",
                description: "We emphasize real-world applications of mathematical and scientific concepts for better comprehension.",
                icon: "🔬"
              },
              {
                title: "Individual Attention",
                description: "Small class sizes allow our educators to provide personalized guidance to every student.",
                icon: "👨‍🏫"
              },
              {
                title: "Regular Assessment",
                description: "Continuous evaluation helps track progress and identify areas for improvement.",
                icon: "📊"
              },
              {
                title: "Interactive Learning",
                description: "Engaging activities, experiments, and problem-solving sessions make learning enjoyable.",
                icon: "🎯"
              },
              {
                title: "Exam Preparation",
                description: "Comprehensive preparation for school exams and competitive assessments.",
                icon: "🏆"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gray-50 card-hover"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Excel in <span className="text-red-400">Math & Science?</span>
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
              Join our comprehensive academic program and build the strong foundation 
              you need for lifelong success in mathematics and science.
            </p>
            <button className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors">
              Enroll Now
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Academics;