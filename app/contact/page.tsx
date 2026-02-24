"use client";

import { motion } from "framer-motion";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import AiChat from "@/components/contact/AiChat";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

export default function ContactPage() {
  return (
    <section className="pt-28 pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">
            Contact
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
            Let&apos;s connect
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Form + Info */}
          <motion.div
            custom={0}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Send a message
              </h2>
              <ContactForm />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Or find me here
              </h2>
              <ContactInfo />
            </div>
          </motion.div>

          {/* Right: AI Chat */}
          <motion.div
            custom={1}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Ask my AI assistant
            </h2>
            <AiChat />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
