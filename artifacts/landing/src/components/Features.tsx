import { motion } from "framer-motion";
import { FileSearch, ShieldAlert, FileMinus, Layers, Clock, Lock } from "lucide-react";

const features = [
  {
    title: "AI Document Analysis",
    description: "Upload lengthy property contracts, deeds, and strata reports. Our engine reads and comprehends legal jargon in seconds, not hours.",
    icon: FileSearch,
  },
  {
    title: "Instant Risk Detection",
    description: "Automatically flag onerous clauses, restrictive covenants, and non-standard terms that require immediate legal attention.",
    icon: ShieldAlert,
  },
  {
    title: "Missing Document Check",
    description: "Cross-reference uploaded files against standard conveyancing requirements. Know exactly what's missing before you begin review.",
    icon: FileMinus,
  },
  {
    title: "Property Summary Extraction",
    description: "Instantly pull out key dates, financial figures, party details, and property boundaries into a clean, exportable executive summary.",
    icon: Layers,
  },
  {
    title: "Lightning Fast Pre-check",
    description: "Reduce unbillable hours. Run a comprehensive pre-check to scope the complexity of a file before providing a fee estimate to clients.",
    icon: Clock,
  },
  {
    title: "Bank-Grade Security",
    description: "Your clients' data remains confidential. End-to-end encryption, automatic data purging, and strict compliance with legal privacy standards.",
    icon: Lock,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Automate the heavy lifting. <br />Focus on legal strategy.
          </h2>
          <p className="text-lg text-slate-600">
            Property Insight AI doesn't replace legal judgment—it accelerates it. 
            We handle the tedious extraction so you can focus on high-value advice.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}