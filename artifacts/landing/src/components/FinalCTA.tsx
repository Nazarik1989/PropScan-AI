import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export default function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-900">
      {/* Abstract background shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full" />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to upgrade your practice?
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
            Join hundreds of forward-thinking conveyancers and property lawyers who are cutting review times by 80% while reducing risk.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="http://88.218.169.93:3000" target="_blank" rel="noreferrer">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-white text-slate-900 hover:bg-slate-100 hover:text-blue-700 transition-colors">
                Start Analyzing Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a href="mailto:sales@propertyinsight.ai">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-slate-700 text-white hover:bg-slate-800">
                Contact Sales
              </Button>
            </a>
          </div>
          
          <p className="mt-8 text-sm text-slate-500">
            No credit card required for the free tier. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
