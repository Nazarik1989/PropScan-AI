import { motion } from "framer-motion";
import { UploadCloud, Cpu, FileCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Upload Documents",
    description: "Drag and drop the contract of sale, vendor statement, strata report, and any other property attachments.",
    icon: UploadCloud,
  },
  {
    id: "02",
    title: "AI Analysis",
    description: "Our legal-trained model processes hundreds of pages in seconds, cross-referencing clauses against property law standards.",
    icon: Cpu,
  },
  {
    id: "03",
    title: "Review & Act",
    description: "Receive a structured risk report. High-priority issues are flagged immediately, allowing you to advise clients faster.",
    icon: FileCheck,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            How it works
          </h2>
          <p className="text-lg text-slate-600">
            From raw PDFs to actionable legal intelligence in under a minute.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-50 shadow-md flex items-center justify-center mb-6 relative z-10">
                  <step.icon className="w-7 h-7 text-blue-600" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center border-2 border-white shadow-sm">
                    {step.id}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-xs">
                  {step.description}
                </p>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 text-slate-300 -translate-y-1/2 z-20 bg-slate-50">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}