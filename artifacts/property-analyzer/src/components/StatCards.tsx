import React from "react";
import { useGetDocumentStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function StatCards() {
  const { data: stats, isLoading } = useGetDocumentStats();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Total Documents",
      value: stats.total,
      icon: FileText,
      description: "Processed & pending",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "High Risk Found",
      value: stats.highRisk,
      icon: AlertTriangle,
      description: "Requires immediate attention",
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      title: "Medium Risk",
      value: stats.mediumRisk,
      icon: Clock,
      description: "Review recommended",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    {
      title: "Low Risk",
      value: stats.lowRisk,
      icon: ShieldCheck,
      description: "Standard terms",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="overflow-hidden relative group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110 ${item.color}`}>
              <item.icon className="h-16 w-16 -mr-4 -mt-4" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${item.bgColor} ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold tracking-tight text-foreground">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
