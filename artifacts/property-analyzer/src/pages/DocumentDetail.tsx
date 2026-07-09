import React from "react";
import { useParams, Link } from "wouter";
import { useGetDocument, getGetDocumentQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, FileText, AlertTriangle, ShieldCheck, Clock,
  Download, RefreshCw, CheckCircle2, FileX, Lightbulb,
} from "lucide-react";
import { formatRelative } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";

const ANALYSIS_STEPS = [
  "Extracting document text",
  "Identifying key clauses",
  "Assessing risks",
  "Generating report",
];

function ProcessingCard({ filename }: { filename: string }) {
  const [stepIndex, setStepIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, ANALYSIS_STEPS.length - 1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-6">
        <div className="relative mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <RefreshCw className="h-7 w-7 text-primary animate-spin" style={{ animationDuration: "2s" }} />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-1">Analyzing Document</h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-6">
          AI is reviewing <span className="font-medium text-foreground">{filename}</span> for risks, liabilities, and key clauses.
        </p>

        <div className="w-full max-w-xs space-y-2 mb-6">
          {ANALYSIS_STEPS.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-2.5 text-sm rounded-lg px-3 py-2 transition-colors ${
                i < stepIndex
                  ? "text-emerald-600 dark:text-emerald-400"
                  : i === stepIndex
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-muted-foreground/50"
              }`}
            >
              {i < stepIndex ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              ) : i === stepIndex ? (
                <motion.div
                  className="h-4 w-4 shrink-0 rounded-full border-2 border-primary border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <div className="h-4 w-4 shrink-0 rounded-full border-2 border-muted-foreground/25" />
              )}
              {step}
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          Refreshing automatically every 3 seconds
        </div>
      </CardContent>
    </Card>
  );
}

function RiskScoreMeter({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const color = pct >= 65 ? "text-red-500" : pct >= 40 ? "text-amber-500" : "text-emerald-500";
  const barColor = pct >= 65 ? "bg-red-500" : pct >= 40 ? "bg-amber-500" : "bg-emerald-500";
  const label = pct >= 65 ? "High" : pct >= 40 ? "Medium" : "Low";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk Score</span>
        <span className={`text-3xl font-bold tabular-nums leading-none ${color}`}>{pct}<span className="text-base font-normal text-muted-foreground">/100</span></span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      <span className={`text-xs font-medium ${color}`}>{label} risk profile</span>
    </div>
  );
}

export default function DocumentDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? parseInt(params.id, 10) : 0;

  const { data: doc, isLoading, error } = useGetDocument(id, {
    query: {
      queryKey: getGetDocumentQueryKey(id),
      refetchInterval: (query) => {
        const data = query.state.data as { status?: string } | undefined;
        return data?.status === "processing" || data?.status === "pending"
          ? 2000
          : false;
      },
      refetchIntervalInBackground: false,
      staleTime: 0,
      gcTime: 0,
    },
  });

  const getRiskColor = (risk: string | null | undefined) => {
    if (risk === "high") return "text-red-500 bg-red-500/10 border-red-500/20";
    if (risk === "medium") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    if (risk === "low") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    return "text-muted-foreground bg-muted border-border";
  };

  const getRiskIcon = (risk: string | null | undefined) => {
    if (risk === "high") return <AlertTriangle className="h-4 w-4" />;
    if (risk === "medium") return <Clock className="h-4 w-4" />;
    if (risk === "low") return <ShieldCheck className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-md" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Card>
            <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
            <CardContent><Skeleton className="h-24 w-full" /></CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error || !doc) {
    return (
      <Layout>
        <div className="text-center py-20">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-medium text-foreground">Document not found</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            The document you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild><Link href="/">Return to Dashboard</Link></Button>
        </div>
      </Layout>
    );
  }

  const isProcessing = doc.status === "processing" || doc.status === "pending";

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-4xl"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1
              className="text-xl sm:text-2xl font-serif font-semibold text-foreground truncate"
              title={doc.filename}
            >
              {doc.filename}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
              Uploaded {formatRelative(doc.createdAt)}
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              {doc.status === "completed" && "Analysis Complete"}
              {isProcessing && (
                <span className="flex items-center gap-1 text-primary">
                  <motion.span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  Analyzing…
                </span>
              )}
              {doc.status === "failed" && "Analysis Failed"}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            {doc.status === "completed" && doc.overallRisk && (
              <Badge
                variant="outline"
                className={`px-3 py-1.5 hidden sm:flex items-center gap-2 text-sm font-medium ${getRiskColor(doc.overallRisk)}`}
              >
                {getRiskIcon(doc.overallRisk)}
                {doc.overallRisk.toUpperCase()} RISK
              </Badge>
            )}
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>

        {/* Mobile risk badge */}
        {doc.status === "completed" && doc.overallRisk && (
          <Badge
            variant="outline"
            className={`sm:hidden px-3 py-1.5 flex w-fit items-center gap-2 text-sm font-medium ${getRiskColor(doc.overallRisk)}`}
          >
            {getRiskIcon(doc.overallRisk)}
            {doc.overallRisk.toUpperCase()} RISK
          </Badge>
        )}

        {/* Body */}
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <ProcessingCard filename={doc.filename} />
            </motion.div>
          ) : doc.status === "failed" ? (
            <motion.div
              key="failed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
                  <h3 className="text-lg font-medium text-foreground">Analysis Failed</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-2">
                    We couldn't process this document. It might be corrupted, password protected, or an unsupported format.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Risk score + summary row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {doc.riskScore != null && (
                  <Card className="shadow-sm">
                    <CardContent className="pt-6 pb-5">
                      <RiskScoreMeter score={doc.riskScore} />
                    </CardContent>
                  </Card>
                )}
                <Card className={`shadow-sm ${doc.riskScore != null ? "sm:col-span-2" : ""}`}>
                  <CardHeader className="bg-muted/30 border-b pb-4">
                    <CardTitle className="text-base font-serif">Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed">
                      {doc.summary ? (
                        <p>{doc.summary}</p>
                      ) : (
                        <p className="italic text-muted-foreground">No summary available.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk findings */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-semibold text-foreground px-1">
                  Risk Assessment Details
                </h3>

                {doc.riskItems && doc.riskItems.length > 0 ? (
                  <div className="grid gap-4">
                    {doc.riskItems.map((risk, idx) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        key={idx}
                      >
                        <Card className="overflow-hidden">
                          <div className="flex flex-col sm:flex-row">
                            <div
                              className={`sm:w-44 p-4 border-b sm:border-b-0 sm:border-r flex flex-col justify-center gap-2 ${
                                risk.severity === "high"
                                  ? "bg-red-500/5 border-red-500/10"
                                  : risk.severity === "medium"
                                  ? "bg-amber-500/5 border-amber-500/10"
                                  : "bg-emerald-500/5 border-emerald-500/10"
                              }`}
                            >
                              <Badge
                                variant="outline"
                                className={`w-fit flex gap-1.5 ${getRiskColor(risk.severity)} border-none bg-transparent p-0`}
                              >
                                {getRiskIcon(risk.severity)}
                                {risk.severity.toUpperCase()}
                              </Badge>
                              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {risk.category}
                              </span>
                            </div>
                            <div className="p-4 sm:p-5 flex-1">
                              <h4 className="font-medium text-foreground mb-1">{risk.title}</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {risk.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No specific risk items identified.
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Missing documents */}
              {doc.missingDocuments && doc.missingDocuments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-serif font-semibold text-foreground px-1 flex items-center gap-2">
                    <FileX className="h-5 w-5 text-amber-500" />
                    Missing Documents
                  </h3>
                  <Card className="shadow-sm">
                    <CardContent className="pt-5 pb-5">
                      <p className="text-sm text-muted-foreground mb-4">
                        The following documents were not present in the vendor's bundle but are required or strongly recommended before exchange.
                      </p>
                      <ul className="space-y-2.5">
                        {doc.missingDocuments.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-amber-400/60 flex items-center justify-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            </div>
                            <span className="text-sm text-foreground/80 leading-snug">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Recommendations */}
              {doc.recommendations && doc.recommendations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-serif font-semibold text-foreground px-1 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                    Recommendations
                  </h3>
                  <Card className="shadow-sm border-blue-500/10 bg-blue-500/5">
                    <CardContent className="pt-5 pb-5">
                      <ol className="space-y-4">
                        {doc.recommendations.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.07 }}
                            className="flex items-start gap-3"
                          >
                            <span className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-foreground/80 leading-relaxed">{item}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
}
