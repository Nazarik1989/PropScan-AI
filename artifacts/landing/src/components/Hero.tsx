import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, FileText, Zap } from "lucide-react";
import { Button } from "./ui/button";

function scrollToSampleReport(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById("sample-report")?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 bg-slate-900 -z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900 -z-10" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Trusted by 500+ Legal Professionals</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
              The intelligence layer for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">property documents.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload complex property PDFs. Get instant, AI-generated risk reports, missing document detection, and executive summaries. Stop reading, start advising.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="http://88.218.169.93:3000" target="_blank" rel="noreferrer">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12">
                  Start Analyzing <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a> 
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToSampleReport}
                className="w-full sm:w-auto text-base h-12 px-8 bg-transparent border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                View Sample Report
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 md:mt-24 max-w-5xl mx-auto"
        >
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-2 shadow-2xl shadow-blue-900/20">
            <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex flex-col">
              {/* Browser Header */}
              <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                </div>
                <div className="ml-4 flex-1 flex justify-center">
                  <div className="w-64 h-6 bg-slate-800 rounded-md flex items-center justify-center text-xs text-slate-500 font-mono">
                    app.propertyinsight.ai
                  </div>
                </div>
              </div>
              
              {/* App UI Mockup */}
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="h-8 w-48 bg-slate-800 rounded-md" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-800/50 rounded-md" />
                    <div className="h-4 w-5/6 bg-slate-800/50 rounded-md" />
                    <div className="h-4 w-4/6 bg-slate-800/50 rounded-md" />
                  </div>
                  <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className="h-24 bg-slate-800/30 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="h-3 w-20 bg-slate-700 rounded-md" />
                    </div>
                    <div className="h-24 bg-slate-800/30 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded bg-amber-500/20 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="h-3 w-24 bg-slate-700 rounded-md" />
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-80 space-y-4">
                  <div className="h-full bg-slate-800/20 border border-slate-800 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-5 w-24 bg-slate-700 rounded-md" />
                      <div className="h-6 w-16 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center">
                        <div className="h-2 w-8 bg-red-400 rounded-sm" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className={`w-2 h-2 mt-1.5 rounded-full ${i === 1 ? 'bg-red-400' : i === 2 ? 'bg-amber-400' : 'bg-green-400'}`} />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-3/4 bg-slate-700 rounded-md" />
                            <div className="h-2 w-full bg-slate-800 rounded-md" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
