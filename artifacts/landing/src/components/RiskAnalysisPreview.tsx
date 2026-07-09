import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Badge } from "./ui/badge";

export default function RiskAnalysisPreview() {
  return (
    <section id="sample-report" className="py-24 bg-slate-900 text-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                See exactly what matters. <br />Ignore the boilerplate.
              </h2>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                Our analysis engine reads standard clauses and skips them, pulling forward only the anomalies, risks, and critical dates. It organizes findings by severity so you know exactly where to start.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Color-coded risk severity (High, Medium, Low)",
                  "Direct page references to the source document",
                  "Plain-English explanations of complex clauses",
                  "Exportable directly to client advice letters"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-xl border border-slate-700 bg-slate-800 shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
                <div>
                  <h3 className="font-semibold text-lg text-white">Risk Analysis Report</h3>
                  <p className="text-sm text-slate-400">142-144 Smith Street, Collingwood</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">2 High</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">3 Med</Badge>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Executive Summary</h4>
                  <p className="text-sm text-slate-400 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    Standard commercial contract with several non-standard special conditions. Major concerns involve an unapproved structural alteration to the rear boundary wall and a pending special levy for roof repairs not fully disclosed in the vendor statement.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Identified Risks</h4>
                  
                  {/* Risk Item 1 */}
                  <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-700/80 flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-200">Unapproved Alterations</span>
                        <span className="text-xs text-slate-500">Page 42</span>
                      </div>
                      <p className="text-sm text-slate-400">
                        Building report indicates structural modifications to rear garage without required council permits. Purchaser may inherit liability.
                      </p>
                    </div>
                  </div>
                  
                  {/* Risk Item 2 */}
                  <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-700/80 flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-200">Pending Special Levy</span>
                        <span className="text-xs text-slate-500">Page 18</span>
                      </div>
                      <p className="text-sm text-slate-400">
                        OC minutes reference upcoming $45,000 roof repair. Special condition 4 attempts to pass this liability to the purchaser post-settlement.
                      </p>
                    </div>
                  </div>
                  
                  {/* Risk Item 3 */}
                  <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-700/80 flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <Info className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-200">Shorter Settlement Period</span>
                        <span className="text-xs text-slate-500">Page 2</span>
                      </div>
                      <p className="text-sm text-slate-400">
                        Proposed settlement is 30 days rather than standard 60 days. May compress finance approval timelines.
                      </p>
                    </div>
                  </div>
                  
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}