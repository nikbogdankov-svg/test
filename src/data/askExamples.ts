export interface AskExample {
  id: string;
  question: string;
  answer: string;
  citations: {
    datasetId: string;
    datasetName: string;
    note: string;
  }[];
  permissionNote: string;
}

export const askExamples: AskExample[] = [
  {
    id: "q-citizens",
    question: "How many active citizens are registered in postal code 69002?",
    answer:
      "There are approximately 48,200 active registered residents in postal code 69002, based on the latest hourly sync of the municipal citizen registry.",
    citations: [
      {
        datasetId: "ds-citizen-registry",
        datasetName: "Citizen Registry",
        note: "Certified golden record · trust verified · freshness within 2 hours",
      },
    ],
    permissionNote:
      "Answer uses only certified datasets you are permitted to see as Executive Office.",
  },
  {
    id: "q-permits",
    question: "How many building permits are currently under review?",
    answer:
      "1,284 building permits are currently marked under_review in the municipal permit ledger, including residential and commercial cases.",
    citations: [
      {
        datasetId: "ds-building-permits",
        datasetName: "Building Permits",
        note: "Certified operational ledger · near real-time updates",
      },
      {
        datasetId: "ds-urban-planning",
        datasetName: "Urban Planning Documents",
        note: "Used for zoning context in permit decisions",
      },
    ],
    permissionNote:
      "Figures are cited from governed Urban Planning datasets. No restricted HR or healthcare data was used.",
  },
  {
    id: "q-budget",
    question: "Which FY2026 program is furthest behind its budget forecast?",
    answer:
      "School Renovation Program shows the largest negative variance in the current FY2026 budget mart (−3.2% versus forecast), with €6.1M actual spend against €12.5M voted.",
    citations: [
      {
        datasetId: "ds-finance-budget",
        datasetName: "Finance Budget",
        note: "Certified FI-CO mart · daily actuals",
      },
    ],
    permissionNote:
      "Budget figures are from certified Finance datasets available to the Executive Office.",
  },
  {
    id: "q-transit",
    question: "Are tram delays worse than usual this morning?",
    answer:
      "Average delay on route T1 over the last hour is about 180 seconds. Transit ops treats delays above 120 seconds as elevated; the Journey Assistant is already surfacing this to passengers.",
    citations: [
      {
        datasetId: "ds-public-transport",
        datasetName: "Public Transport",
        note: "Certified GTFS-RT feed · passenger information grade",
      },
      {
        datasetId: "ds-transport-sensors",
        datasetName: "Transport Sensors",
        note: "Supporting congestion context (may be stale)",
      },
    ],
    permissionNote:
      "Only mobility datasets within your access scope were used. Citations link to catalog records for verification.",
  },
];
