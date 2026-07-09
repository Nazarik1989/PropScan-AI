import { Router } from "express";
import multer from "multer";
import { db } from "@workspace/db";
import { documentsTable } from "@workspace/db";
import { eq, count, sql } from "drizzle-orm";
import {
  GetDocumentParams,
  DeleteDocumentParams,
} from "@workspace/api-zod";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// GET /api/documents
router.get("/documents", async (req, res) => {
  try {
    const docs = await db
      .select({
        id: documentsTable.id,
        filename: documentsTable.filename,
        filesize: documentsTable.filesize,
        status: documentsTable.status,
        createdAt: documentsTable.createdAt,
        updatedAt: documentsTable.updatedAt,
      })
      .from(documentsTable)
      .orderBy(sql`${documentsTable.createdAt} DESC`);
    res.json(docs);
  } catch (err) {
    req.log.error({ err }, "Failed to list documents");
    res.status(500).json({ error: "Failed to list documents" });
  }
});

// GET /api/documents/stats
router.get("/documents/stats", async (req, res) => {
  try {
    const [totals] = await db
      .select({ total: count() })
      .from(documentsTable);

    const [completed] = await db
      .select({ count: count() })
      .from(documentsTable)
      .where(eq(documentsTable.status, "completed"));

    const [processing] = await db
      .select({ count: count() })
      .from(documentsTable)
      .where(eq(documentsTable.status, "processing"));

    const [highRisk] = await db
      .select({ count: count() })
      .from(documentsTable)
      .where(eq(documentsTable.overallRisk, "high"));

    const [mediumRisk] = await db
      .select({ count: count() })
      .from(documentsTable)
      .where(eq(documentsTable.overallRisk, "medium"));

    const [lowRisk] = await db
      .select({ count: count() })
      .from(documentsTable)
      .where(eq(documentsTable.overallRisk, "low"));

    res.json({
      total: totals?.total ?? 0,
      completed: completed?.count ?? 0,
      processing: processing?.count ?? 0,
      highRisk: highRisk?.count ?? 0,
      mediumRisk: mediumRisk?.count ?? 0,
      lowRisk: lowRisk?.count ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Failed to get stats" });
  }
});

// POST /api/documents/upload
router.post("/documents/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    if (req.file.mimetype !== "application/pdf") {
      res.status(400).json({ error: "Only PDF files are supported" });
      return;
    }

    const [doc] = await db
      .insert(documentsTable)
      .values({
        filename: req.file.originalname,
        filesize: req.file.size,
        status: "processing",
      })
      .returning();

    res.status(201).json({
      id: doc.id,
      filename: doc.filename,
      filesize: doc.filesize,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });

    // Async mock analysis — does not block the response
    mockAnalyzeDocument(doc.id, req.file.originalname).catch((err) => {
      req.log.error({ err, docId: doc.id }, "Failed to mock-analyze document");
    });
  } catch (err) {
    req.log.error({ err }, "Failed to upload document");
    res.status(500).json({ error: "Failed to upload document" });
  }
});

// GET /api/documents/:id
router.get("/documents/:id", async (req, res) => {
  const parsed = GetDocumentParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid document ID" });
    return;
  }

  try {
    const [doc] = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.id, parsed.data.id));

    if (!doc) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    res.json({
      id: doc.id,
      filename: doc.filename,
      filesize: doc.filesize,
      status: doc.status,
      summary: doc.summary ?? null,
      riskItems: doc.riskItems ?? null,
      overallRisk: doc.overallRisk ?? null,
      riskScore: doc.riskScore ?? null,
      missingDocuments: doc.missingDocuments ?? null,
      recommendations: doc.recommendations ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get document");
    res.status(500).json({ error: "Failed to get document" });
  }
});

// DELETE /api/documents/:id
router.delete("/documents/:id", async (req, res) => {
  const parsed = DeleteDocumentParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid document ID" });
    return;
  }

  try {
    const [deleted] = await db
      .delete(documentsTable)
      .where(eq(documentsTable.id, parsed.data.id))
      .returning({ id: documentsTable.id });

    if (!deleted) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete document");
    res.status(500).json({ error: "Failed to delete document" });
  }
});

// ---------------------------------------------------------------------------
// Mock analysis — no AI API required. Simulates a realistic 4-6 s processing
// delay, then writes plausible property-law findings to the database.
// ---------------------------------------------------------------------------

type MockProfile = {
  summary: string;
  overallRisk: "low" | "medium" | "high";
  riskScore: number;
  riskItems: Array<{
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    category: string;
  }>;
  missingDocuments: string[];
  recommendations: string[];
};

const MOCK_PROFILES: MockProfile[] = [
  {
    summary:
      "This residential property transfer agreement relates to a freehold terraced dwelling constructed circa 1962. The title is registered and free of mortgage charges, however several restrictive covenants date from the original 1962 conveyance and have not been formally discharged. The transaction involves a standard vendor and purchaser with no third-party lenders noted at the time of review.",
    overallRisk: "high",
    riskScore: 78,
    riskItems: [
      {
        title: "Undischarged Restrictive Covenant — Use Restriction",
        description:
          "A 1962 covenant prohibits use of the property for any purpose other than a single private dwelling. Any home-office, HMO conversion, or Airbnb-style letting would constitute a breach. The covenant benefits neighbouring land and could be enforced by the estate owner. Insurance indemnity should be considered prior to exchange.",
        severity: "high",
        category: "Title",
      },
      {
        title: "Shared Drainage Easement Not Formally Recorded",
        description:
          "The rear drainage run crosses an adjacent parcel under an informal arrangement established by letter in 1997. No formal easement has been registered at HMLR. If the neighbouring owner objects, the purchaser could face significant remediation costs to re-route the drain.",
        severity: "medium",
        category: "Environmental",
      },
      {
        title: "Ground Floor Extension — Planning Permission Unverified",
        description:
          "A single-storey rear extension is visible in the agent's photographs but no planning permission or building regulations completion certificate has been provided in the vendor's bundle. The extension appears to exceed permitted development limits. Retrospective regularisation may be required.",
        severity: "medium",
        category: "Structural",
      },
      {
        title: "Boundary Discrepancy — Rear Garden",
        description:
          "The filed plan at HMLR shows the rear boundary approximately 1.2 m further north than the physical fence line. The vendor has not provided a statutory declaration regarding the discrepancy. This may cause issues on future sale or with mortgage lenders.",
        severity: "low",
        category: "Legal",
      },
    ],
    missingDocuments: [
      "Building regulations completion certificate for rear extension",
      "Formal written consent or easement deed for shared drain",
      "Vendor's statutory declaration regarding boundary discrepancy",
      "Indemnity insurance policy for undischarged restrictive covenant",
    ],
    recommendations: [
      "Obtain a restrictive covenant indemnity insurance policy before exchange of contracts. Premium is typically modest for residential use and resolves lender concerns.",
      "Instruct a drainage surveyor to inspect and document the shared drain. Use findings to negotiate either a formal easement registration or a price reduction to cover re-routing costs.",
      "Request a retrospective planning/building regulations check from the local authority for the rear extension. If not regularised, obtain a local authority indemnity policy.",
      "Commission a re-survey of the rear boundary and prepare a statutory declaration from the vendor confirming long-term exclusive occupation of the disputed strip.",
      "Raise pre-contract enquiries with the vendor's solicitor specifically addressing each of the above items before exchange.",
    ],
  },
  {
    summary:
      "This document is a long-form commercial lease of ground and first floor offices within a mixed-use development, granted for a term of 10 years from the date of completion. The lease is contracted out of the Landlord and Tenant Act 1954, meaning the tenant has no statutory right of renewal. Rent is £42,500 per annum with upward-only reviews at year 5.",
    overallRisk: "medium",
    riskScore: 54,
    riskItems: [
      {
        title: "Full Repairing and Insuring Obligations on Tenant",
        description:
          "The lease imposes a full repairing and insuring covenant on the tenant for the entire demise including the roof, structure, and external elevations. Given the building's age (1988), significant latent repair obligations could be inherited. A schedule of condition should be negotiated before execution to limit dilapidations exposure at lease end.",
        severity: "high",
        category: "Financial",
      },
      {
        title: "Upward-Only Rent Review — No Market Downside Protection",
        description:
          "The year-5 rent review is upward-only to open market value. In a declining market the rent cannot fall below the passing rent of £42,500 p.a. Over a 10-year term this represents material financial exposure if market rents soften.",
        severity: "medium",
        category: "Financial",
      },
      {
        title: "Permitted Use Clause Is Narrowly Drafted",
        description:
          'The permitted use is restricted to "Class E (offices)" only. Ancillary uses such as a café, gym, or retail outlet are not included. Any deviation would require landlord consent and, potentially, planning permission.',
        severity: "low",
        category: "Legal",
      },
    ],
    missingDocuments: [
      "Schedule of condition (photographs and written survey) to be annexed to lease",
      "Landlord's title and charging order search confirmation",
      "Asbestos management survey for premises built pre-2000",
    ],
    recommendations: [
      "Negotiate a schedule of condition prepared by an independent building surveyor to cap dilapidations liability at lease end. This is standard practice for FRI leases.",
      "Seek to amend the rent review clause to include a \"collar and cap\" mechanism or ratchet-free review, limiting rent to no more than 115% of the passing rent at review.",
      "Request the landlord's title documents and confirm the property is free of charges that could affect quiet enjoyment. Lenders will require a superior title investigation.",
      "Commission an asbestos management survey before occupation and review the existing management plan if one is already in place.",
    ],
  },
  {
    summary:
      "This is a registered freehold title for a semi-detached property in a residential suburb. The title is absolute and unencumbered by mortgage charges at the date of the office copy. A right of way on foot over the passageway to the rear has been granted to the owners of the adjoining property. The property is located within a designated flood risk zone 2 area according to the Environment Agency's mapping.",
    overallRisk: "low",
    riskScore: 28,
    riskItems: [
      {
        title: "Flood Risk Zone 2 — Insurance Implications",
        description:
          "The Environment Agency's current mapping places this property within Flood Zone 2 (medium probability of flooding: 0.1%–1% annual probability). Buildings insurance may carry a flood excess or premium loading. Mortgage lenders typically require evidence of adequate flood cover before completion.",
        severity: "medium",
        category: "Environmental",
      },
      {
        title: "Right of Way — Rear Passageway",
        description:
          "A pedestrian right of way in favour of the adjoining owner (Title No. XX123456) crosses the rear passageway. The right is exercised daily according to the vendor's replies to enquiries. Purchasers should note this reduces effective privacy and exclusive use of the rear access.",
        severity: "low",
        category: "Title",
      },
      {
        title: "Flying Freehold — First Floor Bathroom",
        description:
          "A small section of the first-floor bathroom overhangs the neighbouring property. This creates a flying freehold element which some mortgage lenders will not lend against without specific indemnity insurance.",
        severity: "low",
        category: "Legal",
      },
    ],
    missingDocuments: [
      "Flood risk insurance confirmation from insurer confirming cover available",
      "Flying freehold indemnity insurance policy",
    ],
    recommendations: [
      "Obtain a flood risk insurance quotation before exchange to confirm cover is available at a premium acceptable to any lending institution involved.",
      "Obtain a flying freehold indemnity insurance policy. This is inexpensive (typically £200–£400 one-off premium) and will satisfy most high-street lenders.",
      "Confirm in writing with the neighbouring owner the precise times and frequency of exercising the right of way to manage expectations prior to completion.",
    ],
  },
];

function pickProfile(filename: string, filesize: number): MockProfile {
  const hash = [...filename].reduce((acc, ch) => acc + ch.charCodeAt(0), filesize);
  return MOCK_PROFILES[hash % MOCK_PROFILES.length];
}

async function mockAnalyzeDocument(docId: number, filename: string): Promise<void> {
  // Simulate realistic processing time: 4–6 seconds
  const delayMs = 4000 + Math.random() * 2000;
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  // Derive deterministic-but-varied mock result from filename + id
  const profile = pickProfile(filename, docId);

  await db
    .update(documentsTable)
    .set({
      status: "completed",
      summary: profile.summary,
      riskItems: profile.riskItems,
      overallRisk: profile.overallRisk,
      riskScore: profile.riskScore,
      missingDocuments: profile.missingDocuments,
      recommendations: profile.recommendations,
      updatedAt: new Date(),
    })
    .where(eq(documentsTable.id, docId));
}

export default router;
