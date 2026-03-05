import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Mail, Linkedin, Github, Send, MapPin } from 'lucide-react';

const CONTACT = {
  email: 'mevinbenty507@gmail.com',
  github: 'https://github.com/Mevinb',
  linkedin: 'https://www.linkedin.com/in/mevin-benty-17305a322',
};

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Portfolio inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
    );
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;

    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <footer id="contact" className="py-20 px-6 relative border-t border-indigo-500/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#3730a3_0%,_transparent_50%)] opacity-5" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 text-indigo-400"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              Get In Touch
            </motion.h2>
            <motion.p
              className="text-slate-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              Have a project in mind or want to collaborate? Let's build something amazing together.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <div>
                <h3 className="text-2xl font-semibold text-slate-100 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <motion.a
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center gap-3 text-slate-300 hover:text-indigo-400 transition-colors group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="p-2 bg-slate-800/50 border border-indigo-500/10 rounded-lg group-hover:bg-indigo-600/20 group-hover:border-indigo-500/30 transition-all">
                      <Mail size={20} />
                    </div>
                    <span>{CONTACT.email}</span>
                  </motion.a>

                  <motion.a
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-300 hover:text-indigo-400 transition-colors group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="p-2 bg-slate-800/50 border border-indigo-500/10 rounded-lg group-hover:bg-indigo-600/20 group-hover:border-indigo-500/30 transition-all">
                      <Linkedin size={20} />
                    </div>
                    <span>www.linkedin.com/in/mevin-benty-17305a322</span>
                  </motion.a>

                  <motion.a
                    href={CONTACT.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-300 hover:text-indigo-400 transition-colors group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="p-2 bg-slate-800/50 border border-indigo-500/10 rounded-lg group-hover:bg-indigo-600/20 group-hover:border-indigo-500/30 transition-all">
                      <Github size={20} />
                    </div>
                    <span>github.com/Mevinb</span>
                  </motion.a>

                  <motion.div
                    className="flex items-center gap-3 text-slate-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="p-2 bg-slate-800/50 border border-indigo-500/10 rounded-lg">
                      <MapPin size={20} />
                    </div>
                    <span>Available for remote opportunities</span>
                  </motion.div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-100 mb-4">Let's Connect</h4>
                <p className="text-slate-400 leading-relaxed">
                  I'm always interested in hearing about new projects, opportunities, and collaborations. Whether you have a question or just want to say hi, feel free to reach out!
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-indigo-500/10 rounded-lg text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-indigo-500/10 rounded-lg text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-indigo-500/10 rounded-lg text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full px-8 py-4 bg-indigo-600 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02, boxShadow: '0 25px 50px rgba(99, 102, 241, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Send Message</span>
                  <Send size={18} />
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Footer Bottom */}
          <motion.div
            className="pt-8 border-t border-indigo-500/10 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
          >
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Mevin Benty. All rights reserved.
            </p>
            <p className="text-slate-600 text-xs mt-2">
              Built with React, Motion, and Tailwind CSS
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
