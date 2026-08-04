import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'motion/react';
import { Mail, Linkedin, Github, MapPin, Copy, Check, Send } from 'lucide-react';

const CONTACT = {
  email: 'mevinbenty507@gmail.com',
  github: 'https://github.com/Mevinb',
  linkedin: 'https://www.linkedin.com/in/mevin-benty-17305a322',
  location: 'Thrissur, Kerala',
};

export function Footer() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormState('sending');

    // Build pre-filled mailto URI to ensure direct email delivery
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nSender Email: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoUrl = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;

    // Trigger user mail client after brief UI feedback
    setTimeout(() => {
      window.location.href = mailtoUrl;
      setFormState('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormState('idle'), 4000);
    }, 800);
  };

  return (
    <footer id="contact" ref={sectionRef} className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden border-t border-[#90B800]/15">
      
      {/* Background radial spotlight */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-radial from-[#90B800]/10 via-[#A8A492]/5 to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12 sm:mb-20">
          
          {/* Left Column: Title & Social details (Spans 5 cols) */}
          <div className="lg:col-span-5 text-left">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-widest text-[#90B800] light:text-[#90B800] mb-2 sm:mb-3"
            >
              Get In Touch
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-4xl font-extrabold text-[#FCF2E5] light:text-[#524646] tracking-tight leading-tight mb-4 sm:mb-6"
            >
              Let's build something secure & intelligent.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#A8A492] light:text-[#8A7B7B] text-xs sm:text-base leading-relaxed mb-6 sm:mb-10"
            >
              Whether you are looking to integrate generative image models, automate backend deployments, audit scripts, or just say hello—reach out and let's coordinate.
            </motion.p>

            {/* Contact Quick-cards */}
            <div className="space-y-3 sm:space-y-4">
              
              {/* Copy-to-clipboard Email Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={copyEmailToClipboard}
                className="group relative flex items-center justify-between p-3.5 sm:p-4 bg-[#5E5252]/80 light:bg-white/90 backdrop-blur-xl border border-[#90B800]/15 light:border-[#D9CEBB]/90 hover:border-[#90B800]/40 light:hover:border-[#C9BEAA] rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 shadow-md light:shadow-[0_4px_20px_rgba(0,0,0,0.04)] min-w-0"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 mr-2">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-[#524646] light:bg-[#F4E9D8] border border-[#90B800]/20 light:border-[#D9CEBB] text-[#90B800] light:text-[#90B800] group-hover:bg-[#90B800]/10 light:group-hover:bg-[#90B800]/10 transition-all shrink-0">
                    <Mail size={17} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] sm:text-[10px] text-[#A8A492] light:text-[#A8A492] uppercase font-semibold tracking-wider">Email Address</div>
                    <div className="text-xs sm:text-sm font-medium text-[#FCF2E5] light:text-[#524646] truncate">{CONTACT.email}</div>
                  </div>
                </div>
                
                {/* Copy Status Icon */}
                <div className="p-1.5 text-[#A8A492] light:text-[#A8A492] group-hover:text-[#90B800] light:group-hover:text-[#90B800] transition-colors shrink-0">
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="text-[#90B800] light:text-[#90B800]"
                      >
                        <Check size={16} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                      >
                        <Copy size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Social Channels Row */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                
                <motion.a
                  href={CONTACT.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="group flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-[#5E5252]/80 light:bg-white/90 backdrop-blur-xl border border-[#90B800]/15 light:border-[#D9CEBB]/90 hover:border-[#90B800]/40 light:hover:border-[#C9BEAA] rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer shadow-md light:shadow-[0_4px_20px_rgba(0,0,0,0.04)] min-w-0"
                >
                  <div className="p-2 sm:p-2.5 rounded-xl bg-[#524646] light:bg-[#F4E9D8] border border-[#90B800]/20 light:border-[#D9CEBB] text-[#A8A492] light:text-[#8A7B7B] group-hover:text-[#90B800] light:group-hover:text-[#90B800] transition-colors shrink-0">
                    <Github size={17} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] text-[#A8A492] light:text-[#A8A492] uppercase font-semibold tracking-wider">GitHub</div>
                    <div className="text-xs font-semibold text-[#FCF2E5] light:text-[#524646] group-hover:text-[#90B800] light:group-hover:text-[#90B800] transition-colors truncate">@Mevinb</div>
                  </div>
                </motion.a>

                <motion.a
                  href={CONTACT.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="group flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-[#5E5252]/80 light:bg-white/90 backdrop-blur-xl border border-[#90B800]/15 light:border-[#D9CEBB]/90 hover:border-[#90B800]/40 light:hover:border-[#C9BEAA] rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer shadow-md light:shadow-[0_4px_20px_rgba(0,0,0,0.04)] min-w-0"
                >
                  <div className="p-2 sm:p-2.5 rounded-xl bg-[#524646] light:bg-[#F4E9D8] border border-[#90B800]/20 light:border-[#D9CEBB] text-[#A8A492] light:text-[#8A7B7B] group-hover:text-[#90B800] light:group-hover:text-[#90B800] transition-colors shrink-0">
                    <Linkedin size={17} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] text-[#A8A492] light:text-[#A8A492] uppercase font-semibold tracking-wider">LinkedIn</div>
                    <div className="text-xs font-semibold text-[#FCF2E5] light:text-[#524646] group-hover:text-[#90B800] light:group-hover:text-[#90B800] transition-colors truncate">Mevin Benty</div>
                  </div>
                </motion.a>
              </div>

              {/* Location Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-[#5E5252]/80 light:bg-white/90 backdrop-blur-xl border border-[#90B800]/15 light:border-[#D9CEBB]/90 rounded-xl sm:rounded-2xl select-none shadow-md light:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
              >
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#524646] light:bg-[#F4E9D8] border border-[#90B800]/20 light:border-[#D9CEBB] text-[#A8A492] light:text-[#8A7B7B] shrink-0">
                  <MapPin size={17} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-[#A8A492] light:text-[#A8A492] uppercase font-semibold tracking-wider">Location</div>
                  <div className="text-xs font-semibold text-[#FCF2E5] light:text-[#524646]">{CONTACT.location}</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Interactive Glass Contact Form (Spans 7 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-[#5E5252]/60 light:bg-white/90 backdrop-blur-xl border border-[#90B800]/20 light:border-[#D9CEBB] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl light:shadow-[0_4px_25px_rgba(0,0,0,0.05)]"
          >
            <h3 className="text-base sm:text-lg font-bold text-[#FCF2E5] light:text-[#524646] mb-4 sm:mb-6 text-left">Send a Quick Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 text-left">
              
              <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label htmlFor="name" className="block text-[10px] uppercase font-bold tracking-wider text-[#A8A492] light:text-[#8A7B7B] mb-1 sm:mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={formState !== 'idle'}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#524646]/80 light:bg-[#F7EBDD] border border-[#90B800]/20 light:border-[#C9BEAA] focus:border-[#90B800] light:focus:border-[#90B800] focus:ring-1 focus:ring-[#90B800]/30 light:focus:ring-[#90B800]/20 rounded-xl text-[#FCF2E5] light:text-[#524646] placeholder-[#A8A492]/40 light:placeholder-[#A8A492] text-xs sm:text-sm font-medium outline-none transition-all disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[10px] uppercase font-bold tracking-wider text-[#A8A492] light:text-[#8A7B7B] mb-1 sm:mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={formState !== 'idle'}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#524646]/80 light:bg-[#F7EBDD] border border-[#90B800]/20 light:border-[#C9BEAA] focus:border-[#90B800] light:focus:border-[#90B800] focus:ring-1 focus:ring-[#90B800]/30 light:focus:ring-[#90B800]/20 rounded-xl text-[#FCF2E5] light:text-[#524646] placeholder-[#A8A492]/40 light:placeholder-[#A8A492] text-xs sm:text-sm font-medium outline-none transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] uppercase font-bold tracking-wider text-[#A8A492] light:text-[#8A7B7B] mb-1 sm:mb-1.5">
                  Message Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  disabled={formState !== 'idle'}
                  placeholder="Tell me about your project needs..."
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#524646]/80 light:bg-[#F7EBDD] border border-[#90B800]/20 light:border-[#C9BEAA] focus:border-[#90B800] light:focus:border-[#90B800] focus:ring-1 focus:ring-[#90B800]/30 light:focus:ring-[#90B800]/20 rounded-xl text-[#FCF2E5] light:text-[#524646] placeholder-[#A8A492]/40 light:placeholder-[#A8A492] text-xs sm:text-sm font-medium outline-none transition-all resize-none disabled:opacity-50"
                />
              </div>

              <motion.button
                type="submit"
                disabled={formState !== 'idle'}
                className="w-full py-3 sm:py-3.5 bg-[#90B800] light:bg-[#90B800] hover:bg-[#A8D500] light:hover:bg-[#789900] rounded-xl text-[#524646] light:text-[#FCF2E5] font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(144, 184, 0,0.3)] light:shadow-[0_4px_20px_rgba(144, 184, 0,0.25)] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                whileTap={{ scale: 0.98 }}
              >
                {formState === 'idle' && (
                  <>
                    <span>Send Message</span>
                    <Send size={14} />
                  </>
                )}
                {formState === 'sending' && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#524646] light:bg-white rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#524646] light:bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#524646] light:bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                  </span>
                )}
                {formState === 'success' && (
                  <span className="flex items-center gap-1.5 text-[#524646] light:text-[#FCF2E5]">
                    <Check size={14} />
                    <span>Message Dispatched</span>
                  </span>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Footer Base Details */}
        <div className="pt-8 border-t border-[#90B800]/10 light:border-[#D9CEBB] flex flex-col sm:flex-row items-center justify-between gap-4 text-center select-none">
          <p className="text-[10px] sm:text-xs text-[#A8A492] light:text-[#A8A492]">
            © {new Date().getFullYear()} Mevin Benty. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-[#A8A492]/70 light:text-[#A8A492]">
            <span>Powered by React</span>
            <span className="w-1 h-1 rounded-full bg-[#A8A492]/40 light:bg-[#C9C1AF]" />
            <span>Tailwind v4</span>
            <span className="w-1 h-1 rounded-full bg-[#A8A492]/40 light:bg-[#C9C1AF]" />
            <span>Framer Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
