import React from "react";
import { Layout } from "@/components/Layout";
import { UploadArea } from "@/components/UploadArea";
import { StatCards } from "@/components/StatCards";
import { DocumentList } from "@/components/DocumentList";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h2 className="text-2xl font-serif font-semibold text-foreground tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-1">Upload and analyze property documents for risk assessment.</p>
        </div>

        <StatCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">New Analysis</h3>
              <UploadArea />
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Recent Documents</h3>
              <DocumentList />
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
