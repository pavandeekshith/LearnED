import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';


const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-16">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-red-50 to-red-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <EditableText
              tag="h1"
              defaultText="Refund Policy"
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
              contentKey="refund_policy_title"
            />
            <EditableText
              tag="p"
              defaultText="At LearnED, we are committed to providing exceptional educational services. Please review our refund policy to understand your options."
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              contentKey="refund_policy_subtitle"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Refund Eligibility */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <EditableText
                  tag="h2"
                  defaultText="Refund Eligibility"
                  className="text-3xl font-bold text-gray-900"
                  contentKey="refund_eligibility_title"
                />
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <EditableText
                  tag="div"
                  defaultText="<p className='mb-4'>We offer refunds under the following circumstances:</p><ul className='space-y-2 text-gray-700'><li>• Technical issues preventing access to classes for more than 48 hours</li><li>• Dissatisfaction with our teaching methodology within the first 7 days</li><li>• Inability to attend classes due to unforeseen personal circumstances</li><li>• Course cancellation by LearnED administration</li></ul>"
                  className="text-gray-700"
                  contentKey="refund_eligibility_content"
                />
              </div>
            </motion.div>

            {/* Refund Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                <EditableText
                  tag="h2"
                  defaultText="Refund Timeline"
                  className="text-3xl font-bold text-gray-900"
                  contentKey="refund_timeline_title"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <EditableText
                    tag="h3"
                    defaultText="100% Refund"
                    className="text-xl font-bold text-blue-900 mb-2"
                    contentKey="refund_100_title"
                  />
                  <EditableText
                    tag="p"
                    defaultText="Within 7 days of enrollment"
                    className="text-blue-700"
                    contentKey="refund_100_description"
                  />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <EditableText
                    tag="h3"
                    defaultText="75% Refund"
                    className="text-xl font-bold text-yellow-900 mb-2"
                    contentKey="refund_75_title"
                  />
                  <EditableText
                    tag="p"
                    defaultText="Within 8-14 days of enrollment"
                    className="text-yellow-700"
                    contentKey="refund_75_description"
                  />
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                  <EditableText
                    tag="h3"
                    defaultText="50% Refund"
                    className="text-xl font-bold text-orange-900 mb-2"
                    contentKey="refund_50_title"
                  />
                  <EditableText
                    tag="p"
                    defaultText="Within 15-30 days of enrollment"
                    className="text-orange-700"
                    contentKey="refund_50_description"
                  />
                </div>
              </div>
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <EditableText
                    tag="p"
                    defaultText="No refunds are available after 30 days of enrollment, except in cases of technical issues caused by our platform."
                    className="text-red-700 text-sm"
                    contentKey="refund_no_refund_notice"
                  />
                </div>
              </div>
            </motion.div>

            {/* Refund Process */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <EditableText
                tag="h2"
                defaultText="How to Request a Refund"
                className="text-3xl font-bold text-gray-900 mb-6"
                contentKey="refund_process_title"
              />
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <EditableText
                  tag="div"
                  defaultText="<ol className='space-y-4 text-gray-700'><li className='flex items-start'><span className='bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0'>1</span><div><strong>Contact our support team</strong> at support@learned.education or call us at +91-XXXX-XXXX-XX</div></li><li className='flex items-start'><span className='bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0'>2</span><div><strong>Provide your enrollment details</strong> including student name, course, and reason for refund</div></li><li className='flex items-start'><span className='bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0'>3</span><div><strong>Submit required documentation</strong> if applicable (medical certificates, etc.)</div></li><li className='flex items-start'><span className='bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0'>4</span><div><strong>Await processing</strong> - Refunds are typically processed within 7-10 business days</div></li></ol>"
                  className=""
                  contentKey="refund_process_steps"
                />
              </div>
            </motion.div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <EditableText
                tag="h2"
                defaultText="Important Notes"
                className="text-3xl font-bold text-gray-900 mb-6"
                contentKey="important_notes_title"
              />
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <EditableText
                  tag="div"
                  defaultText="<ul className='space-y-3 text-gray-700'><li>• Refunds will be processed to the original payment method</li><li>• Bank charges or transaction fees are non-refundable</li><li>• Partial course completion may affect refund eligibility</li><li>• LearnED reserves the right to modify this policy with 30 days notice</li><li>• Disputes will be handled according to Indian consumer protection laws</li></ul>"
                  className=""
                  contentKey="important_notes_content"
                />
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8"
            >
              <EditableText
                tag="h2"
                defaultText="Questions About Our Refund Policy?"
                className="text-2xl font-bold text-gray-900 mb-4"
                contentKey="contact_questions_title"
              />
              <EditableText
                tag="p"
                defaultText="Our support team is here to help you understand your options and guide you through the refund process."
                className="text-gray-600 mb-6"
                contentKey="contact_questions_description"
              />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@learned.education"
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all"
                >
                  Email Support
                </a>
                <a
                  href="/contact"
                  className="bg-transparent border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all"
                >
                  Contact Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;