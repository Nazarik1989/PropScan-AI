import { motion } from "framer-motion";
import { User, Users, Building2 } from "lucide-react";

export default function TargetAudience() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Built for modern real estate professionals
          </h2>
          <p className="text-lg text-slate-600">
            Whether you process three files a week or three hundred, our tools adapt to your volume and workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <User className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Solo Practitioners</h3>
            <p className="text-slate-600 mb-6">
              Compete with larger firms without hiring junior staff. Process documents instantly and deliver rapid, high-quality advice to your clients to win the instruction.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-indigo-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Conveyancing Firms</h3>
            <p className="text-slate-600 mb-6">
              Standardize your review process across the team. Reduce missed details, lower your professional indemnity risk, and increase the volume of files you can handle.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-6 h-6 text-sky-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Property Investors</h3>
            <p className="text-slate-600 mb-6">
              Screen potential acquisitions rapidly before sending them to your legal team. Discard properties with obvious red flags without incurring legal fees.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}