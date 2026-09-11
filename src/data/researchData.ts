import {
  CompanyProfile,
  EarningsEventData,
  EventStudyMetrics,
  CrossSectionalRegression,
  AblationModelRow,
  BacktestPerformance,
  RegimeAnalysisRow,
  SectorAnalysisRow,
  LeakageAuditCheck
} from '../types';

export const UNIVERSE_COMPANIES: CompanyProfile[] = [
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Information Technology',
    marketCap: 3150,
    beta: 1.68,
    description: 'Pioneer of GPU computing; dominant supplier of AI accelerators and accelerated networking architecture.',
    quarters: ['2024Q4', '2024Q3', '2024Q2', '2024Q1']
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Information Technology',
    marketCap: 3120,
    beta: 1.15,
    description: 'Enterprise cloud infrastructure, productivity suites, and generative AI platform integration.',
    quarters: ['2024Q4', '2024Q3', '2024Q2', '2024Q1']
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Information Technology',
    marketCap: 3480,
    beta: 1.04,
    description: 'Consumer electronics, Apple Silicon, Services ecosystem, and on-device machine intelligence.',
    quarters: ['2024Q4', '2024Q3', '2024Q2', '2024Q1']
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Communication Services',
    marketCap: 2180,
    beta: 1.10,
    description: 'Global search ecosystem, YouTube advertising, Google Cloud, and Gemini model infrastructure.',
    quarters: ['2024Q4', '2024Q3', '2024Q2', '2024Q1']
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer Discretionary',
    marketCap: 2040,
    beta: 1.18,
    description: 'E-commerce fulfillment, AWS cloud infrastructure, digital ads, and logistics automation.',
    quarters: ['2024Q4', '2024Q3', '2024Q2', '2024Q1']
  },
  {
    ticker: 'META',
    name: 'Meta Platforms Inc.',
    sector: 'Communication Services',
    marketCap: 1420,
    beta: 1.25,
    description: 'Family of Apps, Advantage+ ad architecture, Llama open weights, and Reality Labs investments.',
    quarters: ['2024Q4', '2024Q3', '2024Q2', '2024Q1']
  },
  {
    ticker: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Financials',
    marketCap: 620,
    beta: 0.98,
    description: 'Diversified global banking, investment banking underwriting, consumer deposits, and asset management.',
    quarters: ['2024Q4', '2024Q3', '2024Q2', '2024Q1']
  },
  {
    ticker: 'BAC',
    name: 'Bank of America Corp.',
    sector: 'Financials',
    marketCap: 310,
    beta: 1.05,
    description: 'Retail and commercial banking, wealth management, fixed income trading, and consumer lending.',
    quarters: ['2024Q4', '2024Q3', '2024Q2', '2024Q1']
  },
  {
    ticker: 'XOM',
    name: 'Exxon Mobil Corporation',
    sector: 'Energy',
    marketCap: 485,
    beta: 0.82,
    description: 'Upstream exploration, Permian basin unconventional scale, refining crack spreads, and low-carbon solutions.',
    quarters: ['2024Q4', '2024Q3', '2024Q2', '2024Q1']
  },
  {
    ticker: 'CVX',
    name: 'Chevron Corporation',
    sector: 'Energy',
    marketCap: 280,
    beta: 0.85,
    description: 'Global integrated oil and gas operations, deepwater discoveries, LNG facilities, and capital returns.',
    quarters: ['2024Q4', '2024Q3', '2024Q2', '2024Q1']
  },
  {
    ticker: 'WMT',
    name: 'Walmart Inc.',
    sector: 'Consumer Staples',
    marketCap: 660,
    beta: 0.55,
    description: 'Omnichannel retail scale, grocery market share, automated distribution, and retail media network.',
    quarters: ['2024Q4', '2024Q3', '2024Q2', '2024Q1']
  },
  {
    ticker: 'COST',
    name: 'Costco Wholesale Corp.',
    sector: 'Consumer Staples',
    marketCap: 395,
    beta: 0.72,
    description: 'Membership warehouse club model, high inventory turnover, recurring subscription fees, and private label.',
    quarters: ['2024Q4', '2024Q3', '2024Q2', '2024Q1']
  }
];

export const CORE_TOPICS_LIST = [
  'AI & Compute',
  'Demand & Booking',
  'Pricing Power',
  'Operating Margins',
  'CapEx Allocation',
  'Hiring & Labor',
  'Cloud Infrastructure',
  'Advertising Dynamics',
  'Consumer Health',
  'Inventory Turnover',
  'Supply Chain Lead-Time',
  'Regulatory Scrutiny',
  'Competitive Moats',
  'International Markets',
  'Shareholder Returns'
];

export const EARNINGS_EVENTS: EarningsEventData[] = [
  {
    ticker: 'NVDA',
    quarter: '2024Q4',
    date: '2024-11-20',
    time: '17:00 ET',
    epsActual: 0.81,
    epsEstimate: 0.75,
    epsSurprise: 8.0,
    revActual: 35.08,
    revEstimate: 33.16,
    revSurprise: 5.79,
    marketCap: 3150,

    momentum5d: 0.042,
    momentum21d: 0.125,
    momentum63d: 0.284,
    volatility21d: 0.44,
    volatility63d: 0.48,
    volumeZscore: 2.15,
    marketReturn: 0.008,
    sectorReturn: 0.019,
    beta: 1.68,

    totalWords: 9420,
    mgmtWords: 5840,
    analystWords: 3580,
    qaQuestionsCount: 18,
    avgResponseLength: 198,

    sentimentCurrent: 0.68,
    sentimentPrior: 0.52,
    sentimentDelta: 1.45,

    uncertaintyCurrent: 0.014,
    uncertaintyPrior: 0.022,
    uncertaintyDelta: -1.28,

    confidenceCurrent: 0.042,
    confidencePrior: 0.029,
    confidenceDelta: 1.62,

    semanticSimilarityPrior: 0.81,
    semanticSimilarityCentroid: 0.74,
    narrativeShock: 0.26,

    topicDistCurrent: {
      'AI & Compute': 0.38,
      'CapEx Allocation': 0.18,
      'Operating Margins': 0.12,
      'Supply Chain Lead-Time': 0.11,
      'Cloud Infrastructure': 0.09,
      'Demand & Booking': 0.06,
      'Shareholder Returns': 0.06
    },
    topicDistPrior: {
      'AI & Compute': 0.28,
      'Supply Chain Lead-Time': 0.24,
      'Operating Margins': 0.15,
      'CapEx Allocation': 0.10,
      'Cloud Infrastructure': 0.12,
      'Demand & Booking': 0.07,
      'Shareholder Returns': 0.04
    },
    topicDeltaJS: 0.245,
    newTopics: ['Blackwell Architecture Scale', 'Enterprise Sovereign AI'],
    disappearingTopics: ['Gaming Inventory Correction'],
    acceleratingTopics: ['CapEx Allocation', 'AI & Compute'],
    decliningTopics: ['Supply Chain Lead-Time'],

    preparedSentiment: 0.74,
    qaSentiment: 0.61,
    qaSentimentDivergence: 0.13,
    preparedUncertainty: 0.011,
    qaUncertainty: 0.018,
    qaUncertaintyDivergence: 0.007,

    mndsScore: 2.41,
    mndsZScore: 2.18,
    mndsPercentile: 96.5,

    carMinus1Plus1: 0.068,
    carZeroPlus1: 0.052,
    carZeroPlus5: 0.094,
    carZeroPlus20: 0.142,

    mndsSignal: 'LONG',
    sentimentSignal: 'LONG',
    mlPredictedReturn: 0.088,
    mlSignal: 'LONG',
    actual5dReturn: 0.092,

    sampleSentences: [
      {
        id: 'nvda_q4_01',
        speaker: 'Jensen Huang',
        role: 'CEO',
        section: 'PREPARED_REMARKS',
        text: 'The era of generative AI is in full steam, and Blackwell production is ramping at extraordinary velocity with demand exceeding our supply for several quarters.',
        sentiment: 0.82,
        uncertaintyCount: 0,
        confidenceCount: 3,
        topics: ['AI & Compute', 'Demand & Booking']
      },
      {
        id: 'nvda_q4_02',
        speaker: 'Colette Kress',
        role: 'CFO',
        section: 'PREPARED_REMARKS',
        text: 'Gross margins for Blackwell will initialize in the low 70s as we ramp complex packaging, quickly scaling toward our mid-70s corporate baseline within the fiscal year.',
        sentiment: 0.58,
        uncertaintyCount: 1,
        confidenceCount: 2,
        topics: ['Operating Margins', 'Supply Chain Lead-Time']
      },
      {
        id: 'nvda_q4_03',
        speaker: 'Toshiya Hari',
        role: 'Analyst',
        section: 'Q_AND_A',
        text: 'Could you address whether thermal dissipation redesigns in NVL72 racks are creating delivery bottlenecks for Tier 1 hyper-scalers into Q1?',
        sentiment: -0.15,
        uncertaintyCount: 2,
        confidenceCount: 0,
        topics: ['Supply Chain Lead-Time', 'CapEx Allocation']
      },
      {
        id: 'nvda_q4_04',
        speaker: 'Jensen Huang',
        role: 'CEO',
        section: 'Q_AND_A',
        text: 'Blackwell systems are shipping today. We have completed over a hundred engineering configurations, and every major cloud titan is racing to turn on capacity without hesitation.',
        sentiment: 0.72,
        uncertaintyCount: 0,
        confidenceCount: 4,
        topics: ['AI & Compute', 'Demand & Booking']
      }
    ]
  },
  {
    ticker: 'NVDA',
    quarter: '2024Q3',
    date: '2024-08-28',
    time: '17:00 ET',
    epsActual: 0.68,
    epsEstimate: 0.64,
    epsSurprise: 6.25,
    revActual: 30.04,
    revEstimate: 28.68,
    revSurprise: 4.74,
    marketCap: 2980,

    momentum5d: -0.015,
    momentum21d: 0.082,
    momentum63d: 0.360,
    volatility21d: 0.52,
    volatility63d: 0.49,
    volumeZscore: 1.84,
    marketReturn: -0.002,
    sectorReturn: 0.004,
    beta: 1.70,

    totalWords: 9150,
    mgmtWords: 5620,
    analystWords: 3530,
    qaQuestionsCount: 17,
    avgResponseLength: 192,

    sentimentCurrent: 0.52,
    sentimentPrior: 0.61,
    sentimentDelta: -0.68,

    uncertaintyCurrent: 0.022,
    uncertaintyPrior: 0.016,
    uncertaintyDelta: 0.85,

    confidenceCurrent: 0.029,
    confidencePrior: 0.038,
    confidenceDelta: -0.72,

    semanticSimilarityPrior: 0.86,
    semanticSimilarityCentroid: 0.82,
    narrativeShock: 0.18,

    topicDistCurrent: {
      'AI & Compute': 0.28,
      'Supply Chain Lead-Time': 0.24,
      'Operating Margins': 0.15,
      'CapEx Allocation': 0.10,
      'Cloud Infrastructure': 0.12,
      'Demand & Booking': 0.07,
      'Shareholder Returns': 0.04
    },
    topicDistPrior: {
      'AI & Compute': 0.35,
      'Operating Margins': 0.18,
      'Supply Chain Lead-Time': 0.14,
      'CapEx Allocation': 0.11,
      'Cloud Infrastructure': 0.12,
      'Demand & Booking': 0.06,
      'Shareholder Returns': 0.04
    },
    topicDeltaJS: 0.182,
    newTopics: ['Mask Layer Modification'],
    disappearingTopics: [],
    acceleratingTopics: ['Supply Chain Lead-Time'],
    decliningTopics: ['Operating Margins'],

    preparedSentiment: 0.64,
    qaSentiment: 0.44,
    qaSentimentDivergence: 0.20,
    preparedUncertainty: 0.015,
    qaUncertainty: 0.028,
    qaUncertaintyDivergence: 0.013,

    mndsScore: -0.42,
    mndsZScore: -0.58,
    mndsPercentile: 38.0,

    carMinus1Plus1: -0.045,
    carZeroPlus1: -0.038,
    carZeroPlus5: -0.052,
    carZeroPlus20: 0.018,

    mndsSignal: 'FLAT',
    sentimentSignal: 'LONG',
    mlPredictedReturn: -0.025,
    mlSignal: 'FLAT',
    actual5dReturn: -0.048,

    sampleSentences: [
      {
        id: 'nvda_q3_01',
        speaker: 'Jensen Huang',
        role: 'CEO',
        section: 'PREPARED_REMARKS',
        text: 'Hopper demand remains exceptionally strong, and we executed a mask modification for Blackwell to improve wafer yields.',
        sentiment: 0.54,
        uncertaintyCount: 1,
        confidenceCount: 2,
        topics: ['AI & Compute', 'Supply Chain Lead-Time']
      },
      {
        id: 'nvda_q3_02',
        speaker: 'Timothy Arcuri',
        role: 'Analyst',
        section: 'Q_AND_A',
        text: 'Can you clarify the exact delay timing of Blackwell customer shipments and if that pushes revenues into FY26?',
        sentiment: -0.22,
        uncertaintyCount: 2,
        confidenceCount: 0,
        topics: ['Supply Chain Lead-Time']
      }
    ]
  },
  {
    ticker: 'MSFT',
    quarter: '2024Q4',
    date: '2024-10-30',
    time: '17:30 ET',
    epsActual: 3.30,
    epsEstimate: 3.10,
    epsSurprise: 6.45,
    revActual: 65.59,
    revEstimate: 64.51,
    revSurprise: 1.67,
    marketCap: 3120,

    momentum5d: -0.008,
    momentum21d: 0.035,
    momentum63d: 0.058,
    volatility21d: 0.22,
    volatility63d: 0.24,
    volumeZscore: 1.42,
    marketReturn: -0.006,
    sectorReturn: -0.012,
    beta: 1.15,

    totalWords: 8840,
    mgmtWords: 5210,
    analystWords: 3630,
    qaQuestionsCount: 16,
    avgResponseLength: 185,

    sentimentCurrent: 0.44,
    sentimentPrior: 0.58,
    sentimentDelta: -1.12,

    uncertaintyCurrent: 0.028,
    uncertaintyPrior: 0.018,
    uncertaintyDelta: 1.34,

    confidenceCurrent: 0.024,
    confidencePrior: 0.036,
    confidenceDelta: -1.05,

    semanticSimilarityPrior: 0.79,
    semanticSimilarityCentroid: 0.76,
    narrativeShock: 0.24,

    topicDistCurrent: {
      'CapEx Allocation': 0.28,
      'Cloud Infrastructure': 0.25,
      'AI & Compute': 0.20,
      'Operating Margins': 0.12,
      'Demand & Booking': 0.08,
      'Competitive Moats': 0.07
    },
    topicDistPrior: {
      'Cloud Infrastructure': 0.32,
      'AI & Compute': 0.26,
      'Operating Margins': 0.16,
      'CapEx Allocation': 0.14,
      'Demand & Booking': 0.08,
      'Competitive Moats': 0.04
    },
    topicDeltaJS: 0.210,
    newTopics: ['Datacenter Power Interconnection Constraints'],
    disappearingTopics: [],
    acceleratingTopics: ['CapEx Allocation'],
    decliningTopics: ['Operating Margins', 'Cloud Infrastructure'],

    preparedSentiment: 0.58,
    qaSentiment: 0.32,
    qaSentimentDivergence: 0.26,
    preparedUncertainty: 0.016,
    qaUncertainty: 0.038,
    qaUncertaintyDivergence: 0.022,

    mndsScore: -1.82,
    mndsZScore: -1.74,
    mndsPercentile: 7.2,

    carMinus1Plus1: -0.058,
    carZeroPlus1: -0.042,
    carZeroPlus5: -0.065,
    carZeroPlus20: -0.084,

    mndsSignal: 'SHORT',
    sentimentSignal: 'LONG',
    mlPredictedReturn: -0.062,
    mlSignal: 'SHORT',
    actual5dReturn: -0.061,

    sampleSentences: [
      {
        id: 'msft_q4_01',
        speaker: 'Satya Nadella',
        role: 'CEO',
        section: 'PREPARED_REMARKS',
        text: 'Azure AI business is on track to surpass a $10 billion annual run rate next quarter, representing the fastest software business expansion in our company history.',
        sentiment: 0.76,
        uncertaintyCount: 0,
        confidenceCount: 3,
        topics: ['AI & Compute', 'Cloud Infrastructure']
      },
      {
        id: 'msft_q4_02',
        speaker: 'Amy Hood',
        role: 'CFO',
        section: 'PREPARED_REMARKS',
        text: 'Capital expenditures will continue to increase sequentially to satisfy external compute demand, though third-party capacity constraints will dampen Azure growth in H1.',
        sentiment: 0.12,
        uncertaintyCount: 2,
        confidenceCount: 1,
        topics: ['CapEx Allocation', 'Cloud Infrastructure', 'Operating Margins']
      },
      {
        id: 'msft_q4_03',
        speaker: 'Keith Weiss',
        role: 'Analyst',
        section: 'Q_AND_A',
        text: 'With CapEx surging to $20B quarterly and margins compressing due to AI infrastructure amortization, when will return on invested capital inflection arrive?',
        sentiment: -0.38,
        uncertaintyCount: 3,
        confidenceCount: 0,
        topics: ['CapEx Allocation', 'Operating Margins']
      },
      {
        id: 'msft_q4_04',
        speaker: 'Amy Hood',
        role: 'CFO',
        section: 'Q_AND_A',
        text: 'These long-lived assets will monetize over 15 to 20 years, but in the near term, we do face margin friction as capacity comes online ahead of immediate cloud recognition.',
        sentiment: 0.08,
        uncertaintyCount: 2,
        confidenceCount: 1,
        topics: ['CapEx Allocation', 'Operating Margins']
      }
    ]
  },
  {
    ticker: 'META',
    quarter: '2024Q4',
    date: '2024-10-30',
    time: '17:00 ET',
    epsActual: 6.03,
    epsEstimate: 5.25,
    epsSurprise: 14.86,
    revActual: 40.59,
    revEstimate: 40.29,
    revSurprise: 0.74,
    marketCap: 1420,

    momentum5d: 0.038,
    momentum21d: 0.092,
    momentum63d: 0.215,
    volatility21d: 0.31,
    volatility63d: 0.34,
    volumeZscore: 1.62,
    marketReturn: -0.006,
    sectorReturn: 0.002,
    beta: 1.25,

    totalWords: 9200,
    mgmtWords: 5750,
    analystWords: 3450,
    qaQuestionsCount: 17,
    avgResponseLength: 196,

    sentimentCurrent: 0.62,
    sentimentPrior: 0.48,
    sentimentDelta: 1.25,

    uncertaintyCurrent: 0.016,
    uncertaintyPrior: 0.024,
    uncertaintyDelta: -1.15,

    confidenceCurrent: 0.041,
    confidencePrior: 0.028,
    confidenceDelta: 1.40,

    semanticSimilarityPrior: 0.83,
    semanticSimilarityCentroid: 0.77,
    narrativeShock: 0.23,

    topicDistCurrent: {
      'AI & Compute': 0.32,
      'Advertising Dynamics': 0.26,
      'CapEx Allocation': 0.18,
      'Operating Margins': 0.12,
      'Competitive Moats': 0.08,
      'Shareholder Returns': 0.04
    },
    topicDistPrior: {
      'Advertising Dynamics': 0.34,
      'AI & Compute': 0.22,
      'CapEx Allocation': 0.15,
      'Operating Margins': 0.15,
      'Competitive Moats': 0.08,
      'Shareholder Returns': 0.06
    },
    topicDeltaJS: 0.198,
    newTopics: ['Meta AI Over 500M MAU', 'Llama 4 Frontier Training'],
    disappearingTopics: ['Year of Efficiency Redundancy'],
    acceleratingTopics: ['AI & Compute', 'CapEx Allocation'],
    decliningTopics: ['Advertising Dynamics'],

    preparedSentiment: 0.70,
    qaSentiment: 0.54,
    qaSentimentDivergence: 0.16,
    preparedUncertainty: 0.012,
    qaUncertainty: 0.021,
    qaUncertaintyDivergence: 0.009,

    mndsScore: 1.95,
    mndsZScore: 1.82,
    mndsPercentile: 92.4,

    carMinus1Plus1: 0.054,
    carZeroPlus1: 0.041,
    carZeroPlus5: 0.076,
    carZeroPlus20: 0.118,

    mndsSignal: 'LONG',
    sentimentSignal: 'LONG',
    mlPredictedReturn: 0.074,
    mlSignal: 'LONG',
    actual5dReturn: 0.079,

    sampleSentences: [
      {
        id: 'meta_q4_01',
        speaker: 'Mark Zuckerberg',
        role: 'CEO',
        section: 'PREPARED_REMARKS',
        text: 'We had a good quarter driven by AI progress across our apps and business. Meta AI now has more than 500 million monthly active users, and we expect it to become the most used generative AI assistant globally by year end.',
        sentiment: 0.84,
        uncertaintyCount: 0,
        confidenceCount: 4,
        topics: ['AI & Compute', 'Demand & Booking']
      },
      {
        id: 'meta_q4_02',
        speaker: 'Susan Li',
        role: 'CFO',
        section: 'PREPARED_REMARKS',
        text: 'We continue to anticipate significant capital expenditure growth in 2025 as we build out infrastructure to support our Llama research efforts and core product ranking.',
        sentiment: 0.42,
        uncertaintyCount: 1,
        confidenceCount: 2,
        topics: ['CapEx Allocation', 'AI & Compute']
      },
      {
        id: 'meta_q4_03',
        speaker: 'Brian Nowak',
        role: 'Analyst',
        section: 'Q_AND_A',
        text: 'Mark, can you talk about the direct monetization roadmap for Meta AI and whether commercial search intent is already showing measurable conversions?',
        sentiment: 0.10,
        uncertaintyCount: 1,
        confidenceCount: 0,
        topics: ['Advertising Dynamics', 'AI & Compute']
      },
      {
        id: 'meta_q4_04',
        speaker: 'Mark Zuckerberg',
        role: 'CEO',
        section: 'Q_AND_A',
        text: 'Our historical playbook applies here: scale consumer engagement first, introduce organic business interactions, and then turn on paid sponsored integration once engagement reaches massive saturation.',
        sentiment: 0.68,
        uncertaintyCount: 0,
        confidenceCount: 3,
        topics: ['Advertising Dynamics', 'Competitive Moats']
      }
    ]
  },
  {
    ticker: 'AAPL',
    quarter: '2024Q4',
    date: '2024-10-31',
    time: '17:00 ET',
    epsActual: 1.64,
    epsEstimate: 1.60,
    epsSurprise: 2.50,
    revActual: 94.93,
    revEstimate: 94.58,
    revSurprise: 0.37,
    marketCap: 3480,

    momentum5d: -0.012,
    momentum21d: 0.018,
    momentum63d: 0.082,
    volatility21d: 0.20,
    volatility63d: 0.22,
    volumeZscore: 0.95,
    marketReturn: -0.005,
    sectorReturn: -0.008,
    beta: 1.04,

    totalWords: 8400,
    mgmtWords: 4920,
    analystWords: 3480,
    qaQuestionsCount: 15,
    avgResponseLength: 175,

    sentimentCurrent: 0.46,
    sentimentPrior: 0.49,
    sentimentDelta: -0.25,

    uncertaintyCurrent: 0.019,
    uncertaintyPrior: 0.018,
    uncertaintyDelta: 0.15,

    confidenceCurrent: 0.030,
    confidencePrior: 0.032,
    confidenceDelta: -0.22,

    semanticSimilarityPrior: 0.88,
    semanticSimilarityCentroid: 0.85,
    narrativeShock: 0.15,

    topicDistCurrent: {
      'Consumer Health': 0.28,
      'Operating Margins': 0.22,
      'AI & Compute': 0.18,
      'Shareholder Returns': 0.14,
      'International Markets': 0.12,
      'Regulatory Scrutiny': 0.06
    },
    topicDistPrior: {
      'Consumer Health': 0.30,
      'Operating Margins': 0.22,
      'AI & Compute': 0.14,
      'Shareholder Returns': 0.14,
      'International Markets': 0.15,
      'Regulatory Scrutiny': 0.05
    },
    topicDeltaJS: 0.115,
    newTopics: ['Apple Intelligence Phased Rollout'],
    disappearingTopics: [],
    acceleratingTopics: ['AI & Compute'],
    decliningTopics: ['International Markets'],

    preparedSentiment: 0.54,
    qaSentiment: 0.38,
    qaSentimentDivergence: 0.16,
    preparedUncertainty: 0.014,
    qaUncertainty: 0.024,
    qaUncertaintyDivergence: 0.010,

    mndsScore: 0.12,
    mndsZScore: 0.08,
    mndsPercentile: 51.5,

    carMinus1Plus1: -0.015,
    carZeroPlus1: -0.012,
    carZeroPlus5: -0.008,
    carZeroPlus20: 0.022,

    mndsSignal: 'FLAT',
    sentimentSignal: 'FLAT',
    mlPredictedReturn: 0.005,
    mlSignal: 'FLAT',
    actual5dReturn: -0.011,

    sampleSentences: [
      {
        id: 'aapl_q4_01',
        speaker: 'Tim Cook',
        role: 'CEO',
        section: 'PREPARED_REMARKS',
        text: 'Today, Apple is reporting a new September quarter revenue record of $94.9 billion, up 6% from a year ago, powered by strong customer adoption of the iPhone 16 family.',
        sentiment: 0.72,
        uncertaintyCount: 0,
        confidenceCount: 3,
        topics: ['Consumer Health', 'Operating Margins']
      },
      {
        id: 'aapl_q4_02',
        speaker: 'Luca Maestri',
        role: 'CFO',
        section: 'PREPARED_REMARKS',
        text: 'Services revenue reached an all-time record of $25 billion with gross margins exceeding 74%, driving robust operating cash flows of nearly $27 billion.',
        sentiment: 0.65,
        uncertaintyCount: 0,
        confidenceCount: 2,
        topics: ['Operating Margins', 'Shareholder Returns']
      },
      {
        id: 'aapl_q4_03',
        speaker: 'Wamsi Mohan',
        role: 'Analyst',
        section: 'Q_AND_A',
        text: 'Tim, Greater China revenue declined slightly again. Could you unpack domestic smartphone competition and consumer upgrade cycles in that market?',
        sentiment: -0.28,
        uncertaintyCount: 2,
        confidenceCount: 0,
        topics: ['International Markets', 'Consumer Health']
      },
      {
        id: 'aapl_q4_04',
        speaker: 'Tim Cook',
        role: 'CEO',
        section: 'Q_AND_A',
        text: 'In Mainland China, our active installed base reached an all-time high, and iPhone upgrade rates improved year-over-year, despite tough macroeconomic comparisons.',
        sentiment: 0.45,
        uncertaintyCount: 1,
        confidenceCount: 2,
        topics: ['International Markets', 'Consumer Health']
      }
    ]
  },
  {
    ticker: 'AMZN',
    quarter: '2024Q4',
    date: '2024-10-31',
    time: '17:30 ET',
    epsActual: 1.43,
    epsEstimate: 1.14,
    epsSurprise: 25.44,
    revActual: 158.88,
    revEstimate: 157.25,
    revSurprise: 1.04,
    marketCap: 2040,

    momentum5d: 0.024,
    momentum21d: 0.045,
    momentum63d: 0.112,
    volatility21d: 0.26,
    volatility63d: 0.28,
    volumeZscore: 1.95,
    marketReturn: -0.005,
    sectorReturn: 0.015,
    beta: 1.18,

    totalWords: 9100,
    mgmtWords: 5500,
    analystWords: 3600,
    qaQuestionsCount: 16,
    avgResponseLength: 190,

    sentimentCurrent: 0.64,
    sentimentPrior: 0.47,
    sentimentDelta: 1.38,

    uncertaintyCurrent: 0.015,
    uncertaintyPrior: 0.025,
    uncertaintyDelta: -1.32,

    confidenceCurrent: 0.040,
    confidencePrior: 0.027,
    confidenceDelta: 1.48,

    semanticSimilarityPrior: 0.82,
    semanticSimilarityCentroid: 0.75,
    narrativeShock: 0.25,

    topicDistCurrent: {
      'Cloud Infrastructure': 0.30,
      'Operating Margins': 0.24,
      'AI & Compute': 0.18,
      'Advertising Dynamics': 0.14,
      'CapEx Allocation': 0.10,
      'Supply Chain Lead-Time': 0.04
    },
    topicDistPrior: {
      'Cloud Infrastructure': 0.26,
      'Operating Margins': 0.18,
      'Advertising Dynamics': 0.16,
      'Supply Chain Lead-Time': 0.14,
      'AI & Compute': 0.14,
      'CapEx Allocation': 0.12
    },
    topicDeltaJS: 0.218,
    newTopics: ['Trainium2 Silicon Adoption', 'Same-Day Regional Fulfilment Expansion'],
    disappearingTopics: ['Post-Pandemic Fulfillment Overcapacity'],
    acceleratingTopics: ['Cloud Infrastructure', 'Operating Margins'],
    decliningTopics: ['Supply Chain Lead-Time'],

    preparedSentiment: 0.72,
    qaSentiment: 0.56,
    qaSentimentDivergence: 0.16,
    preparedUncertainty: 0.012,
    qaUncertainty: 0.020,
    qaUncertaintyDivergence: 0.008,

    mndsScore: 2.15,
    mndsZScore: 2.01,
    mndsPercentile: 94.8,

    carMinus1Plus1: 0.062,
    carZeroPlus1: 0.055,
    carZeroPlus5: 0.088,
    carZeroPlus20: 0.134,

    mndsSignal: 'LONG',
    sentimentSignal: 'LONG',
    mlPredictedReturn: 0.082,
    mlSignal: 'LONG',
    actual5dReturn: 0.084,

    sampleSentences: [
      {
        id: 'amzn_q4_01',
        speaker: 'Andy Jassy',
        role: 'CEO',
        section: 'PREPARED_REMARKS',
        text: 'AWS re-accelerated to 19% growth, with our generative AI business growing at triple-digit year-over-year rates, outpacing the early trajectory of AWS itself.',
        sentiment: 0.82,
        uncertaintyCount: 0,
        confidenceCount: 3,
        topics: ['Cloud Infrastructure', 'AI & Compute']
      },
      {
        id: 'amzn_q4_02',
        speaker: 'Brian Olsavsky',
        role: 'CFO',
        section: 'PREPARED_REMARKS',
        text: 'North America operating margins expanded to 5.9%, demonstrating the structural cost benefits of regionalization across our outbound transportation network.',
        sentiment: 0.70,
        uncertaintyCount: 0,
        confidenceCount: 2,
        topics: ['Operating Margins', 'Supply Chain Lead-Time']
      }
    ]
  },
  {
    ticker: 'JPM',
    quarter: '2024Q4',
    date: '2025-01-15',
    time: '08:30 ET',
    epsActual: 4.81,
    epsEstimate: 4.12,
    epsSurprise: 16.75,
    revActual: 43.74,
    revEstimate: 41.85,
    revSurprise: 4.52,
    marketCap: 620,

    momentum5d: 0.015,
    momentum21d: 0.052,
    momentum63d: 0.145,
    volatility21d: 0.18,
    volatility63d: 0.19,
    volumeZscore: 1.35,
    marketReturn: 0.003,
    sectorReturn: 0.012,
    beta: 0.98,

    totalWords: 9600,
    mgmtWords: 5400,
    analystWords: 4200,
    qaQuestionsCount: 19,
    avgResponseLength: 172,

    sentimentCurrent: 0.55,
    sentimentPrior: 0.44,
    sentimentDelta: 0.95,

    uncertaintyCurrent: 0.018,
    uncertaintyPrior: 0.024,
    uncertaintyDelta: -0.85,

    confidenceCurrent: 0.038,
    confidencePrior: 0.029,
    confidenceDelta: 1.10,

    semanticSimilarityPrior: 0.84,
    semanticSimilarityCentroid: 0.80,
    narrativeShock: 0.20,

    topicDistCurrent: {
      'Consumer Health': 0.26,
      'Operating Margins': 0.22,
      'Pricing Power': 0.18,
      'Regulatory Scrutiny': 0.14,
      'CapEx Allocation': 0.12,
      'Shareholder Returns': 0.08
    },
    topicDistPrior: {
      'Pricing Power': 0.28,
      'Regulatory Scrutiny': 0.22,
      'Consumer Health': 0.20,
      'Operating Margins': 0.16,
      'CapEx Allocation': 0.08,
      'Shareholder Returns': 0.06
    },
    topicDeltaJS: 0.185,
    newTopics: ['Basel III Endgame Re-proposal Relief', 'Investment Banking Pipeline Rebound'],
    disappearingTopics: ['SVB Contagion Liquidity Backstop'],
    acceleratingTopics: ['Consumer Health', 'CapEx Allocation'],
    decliningTopics: ['Regulatory Scrutiny'],

    preparedSentiment: 0.62,
    qaSentiment: 0.48,
    qaSentimentDivergence: 0.14,
    preparedUncertainty: 0.014,
    qaUncertainty: 0.022,
    qaUncertaintyDivergence: 0.008,

    mndsScore: 1.48,
    mndsZScore: 1.36,
    mndsPercentile: 88.0,

    carMinus1Plus1: 0.038,
    carZeroPlus1: 0.029,
    carZeroPlus5: 0.048,
    carZeroPlus20: 0.075,

    mndsSignal: 'LONG',
    sentimentSignal: 'LONG',
    mlPredictedReturn: 0.045,
    mlSignal: 'LONG',
    actual5dReturn: 0.046,

    sampleSentences: [
      {
        id: 'jpm_q4_01',
        speaker: 'Jamie Dimon',
        role: 'CEO',
        section: 'PREPARED_REMARKS',
        text: 'The US consumer continues to spend and businesses are healthy, but geopolitical fragmentation and fiscal deficits remain persistent risks to medium-term stability.',
        sentiment: 0.35,
        uncertaintyCount: 2,
        confidenceCount: 2,
        topics: ['Consumer Health', 'Regulatory Scrutiny']
      },
      {
        id: 'jpm_q4_02',
        speaker: 'Jeremy Barnum',
        role: 'CFO',
        section: 'PREPARED_REMARKS',
        text: 'Net interest income excluding markets reached a robust $91 billion for the full year, while credit charge-offs normalized in line with our modeled expectations.',
        sentiment: 0.68,
        uncertaintyCount: 0,
        confidenceCount: 3,
        topics: ['Operating Margins', 'Pricing Power']
      }
    ]
  },
  {
    ticker: 'XOM',
    quarter: '2024Q4',
    date: '2025-01-31',
    time: '08:30 ET',
    epsActual: 1.68,
    epsEstimate: 1.74,
    epsSurprise: -3.45,
    revActual: 83.25,
    revEstimate: 85.10,
    revSurprise: -2.17,
    marketCap: 485,

    momentum5d: -0.018,
    momentum21d: -0.042,
    momentum63d: 0.015,
    volatility21d: 0.21,
    volatility63d: 0.23,
    volumeZscore: 1.10,
    marketReturn: 0.002,
    sectorReturn: -0.024,
    beta: 0.82,

    totalWords: 8700,
    mgmtWords: 5100,
    analystWords: 3600,
    qaQuestionsCount: 15,
    avgResponseLength: 178,

    sentimentCurrent: 0.35,
    sentimentPrior: 0.52,
    sentimentDelta: -1.35,

    uncertaintyCurrent: 0.026,
    uncertaintyPrior: 0.017,
    uncertaintyDelta: 1.25,

    confidenceCurrent: 0.025,
    confidencePrior: 0.035,
    confidenceDelta: -1.15,

    semanticSimilarityPrior: 0.80,
    semanticSimilarityCentroid: 0.77,
    narrativeShock: 0.23,

    topicDistCurrent: {
      'CapEx Allocation': 0.30,
      'Operating Margins': 0.24,
      'Demand & Booking': 0.18,
      'Shareholder Returns': 0.16,
      'Pricing Power': 0.12
    },
    topicDistPrior: {
      'Operating Margins': 0.32,
      'Shareholder Returns': 0.24,
      'Pricing Power': 0.20,
      'CapEx Allocation': 0.14,
      'Demand & Booking': 0.10
    },
    topicDeltaJS: 0.212,
    newTopics: ['Refining Margin Headwind / Crack Spread Compression'],
    disappearingTopics: ['European Windfall Tax Absorption'],
    acceleratingTopics: ['CapEx Allocation', 'Demand & Booking'],
    decliningTopics: ['Operating Margins', 'Shareholder Returns'],

    preparedSentiment: 0.48,
    qaSentiment: 0.22,
    qaSentimentDivergence: 0.26,
    preparedUncertainty: 0.016,
    qaUncertainty: 0.036,
    qaUncertaintyDivergence: 0.020,

    mndsScore: -1.98,
    mndsZScore: -1.88,
    mndsPercentile: 5.4,

    carMinus1Plus1: -0.042,
    carZeroPlus1: -0.034,
    carZeroPlus5: -0.058,
    carZeroPlus20: -0.072,

    mndsSignal: 'SHORT',
    sentimentSignal: 'FLAT',
    mlPredictedReturn: -0.055,
    mlSignal: 'SHORT',
    actual5dReturn: -0.054,

    sampleSentences: [
      {
        id: 'xom_q4_01',
        speaker: 'Darren Woods',
        role: 'CEO',
        section: 'PREPARED_REMARKS',
        text: 'We delivered more than $36 billion in earnings for the year while closing the Pioneer acquisition, establishing the highest quality contiguous acreage in the Midland Basin.',
        sentiment: 0.62,
        uncertaintyCount: 0,
        confidenceCount: 3,
        topics: ['CapEx Allocation', 'Operating Margins']
      },
      {
        id: 'xom_q4_02',
        speaker: 'Kathryn Mikells',
        role: 'CFO',
        section: 'PREPARED_REMARKS',
        text: 'Industry refining margins declined precipitously toward the bottom of the ten-year range, creating an earnings headwind of $1.5 billion compared to prior quarter.',
        sentiment: -0.42,
        uncertaintyCount: 1,
        confidenceCount: 1,
        topics: ['Operating Margins', 'Pricing Power']
      }
    ]
  },
  {
    ticker: 'WMT',
    quarter: '2024Q4',
    date: '2024-11-19',
    time: '08:00 ET',
    epsActual: 0.58,
    epsEstimate: 0.53,
    epsSurprise: 9.43,
    revActual: 169.59,
    revEstimate: 167.72,
    revSurprise: 1.11,
    marketCap: 660,

    momentum5d: 0.022,
    momentum21d: 0.061,
    momentum63d: 0.168,
    volatility21d: 0.15,
    volatility63d: 0.16,
    volumeZscore: 1.55,
    marketReturn: 0.004,
    sectorReturn: 0.011,
    beta: 0.55,

    totalWords: 8650,
    mgmtWords: 5200,
    analystWords: 3450,
    qaQuestionsCount: 15,
    avgResponseLength: 182,

    sentimentCurrent: 0.58,
    sentimentPrior: 0.46,
    sentimentDelta: 1.05,

    uncertaintyCurrent: 0.014,
    uncertaintyPrior: 0.021,
    uncertaintyDelta: -1.02,

    confidenceCurrent: 0.039,
    confidencePrior: 0.030,
    confidenceDelta: 1.18,

    semanticSimilarityPrior: 0.85,
    semanticSimilarityCentroid: 0.81,
    narrativeShock: 0.19,

    topicDistCurrent: {
      'Consumer Health': 0.32,
      'Operating Margins': 0.22,
      'Inventory Turnover': 0.18,
      'Advertising Dynamics': 0.14,
      'Pricing Power': 0.14
    },
    topicDistPrior: {
      'Consumer Health': 0.30,
      'Inventory Turnover': 0.24,
      'Pricing Power': 0.18,
      'Operating Margins': 0.16,
      'Advertising Dynamics': 0.12
    },
    topicDeltaJS: 0.165,
    newTopics: ['High-Income Household Market Share Gains'],
    disappearingTopics: ['Excess Inventory Markdowns'],
    acceleratingTopics: ['Operating Margins', 'Advertising Dynamics'],
    decliningTopics: ['Inventory Turnover'],

    preparedSentiment: 0.65,
    qaSentiment: 0.52,
    qaSentimentDivergence: 0.13,
    preparedUncertainty: 0.011,
    qaUncertainty: 0.018,
    qaUncertaintyDivergence: 0.007,

    mndsScore: 1.62,
    mndsZScore: 1.51,
    mndsPercentile: 90.2,

    carMinus1Plus1: 0.034,
    carZeroPlus1: 0.028,
    carZeroPlus5: 0.045,
    carZeroPlus20: 0.068,

    mndsSignal: 'LONG',
    sentimentSignal: 'LONG',
    mlPredictedReturn: 0.041,
    mlSignal: 'LONG',
    actual5dReturn: 0.043,

    sampleSentences: [
      {
        id: 'wmt_q4_01',
        speaker: 'Doug McMillon',
        role: 'CEO',
        section: 'PREPARED_REMARKS',
        text: 'We had a strong quarter with US comp sales up 5.3%, and we are seeing continued share gains led by upper-income households who appreciate our value and convenience.',
        sentiment: 0.78,
        uncertaintyCount: 0,
        confidenceCount: 3,
        topics: ['Consumer Health', 'Operating Margins']
      },
      {
        id: 'wmt_q4_02',
        speaker: 'John David Rainey',
        role: 'CFO',
        section: 'PREPARED_REMARKS',
        text: 'Our global e-commerce business grew 27%, and advertising revenue surged 28%, significantly shifting our profit mix toward higher-margin non-retail streams.',
        sentiment: 0.72,
        uncertaintyCount: 0,
        confidenceCount: 2,
        topics: ['Advertising Dynamics', 'Operating Margins']
      }
    ]
  }
];

export const EVENT_STUDY_DATA: EventStudyMetrics = {
  estimationWindow: '[-252, -30]',
  eventWindows: [
    {
      name: 'Immediate Reaction',
      window: '[-1, +1]',
      caar: 0.0184,
      tStat: 3.42,
      pValue: 0.0008,
      significance: '*** (p < 0.001)'
    },
    {
      name: 'Post-Announcement Drift',
      window: '[0, +1]',
      caar: 0.0142,
      tStat: 3.15,
      pValue: 0.0019,
      significance: '*** (p < 0.01)'
    },
    {
      name: 'Short Horizon Drift',
      window: '[0, +5]',
      caar: 0.0268,
      tStat: 4.28,
      pValue: 0.0001,
      significance: '*** (p < 0.001)'
    },
    {
      name: 'Medium Horizon CAR',
      window: '[0, +20]',
      caar: 0.0392,
      tStat: 3.86,
      pValue: 0.0003,
      significance: '*** (p < 0.001)'
    }
  ],
  quintileCAR: [
    {
      quintile: 'Q1 (Strongest Neg Narrative)',
      label: 'MNDS < -1.25',
      meanCAR0_5: -0.0482,
      meanCAR0_20: -0.0715,
      count: 24,
      winRate: 0.28
    },
    {
      quintile: 'Q2 (Moderate Neg Narrative)',
      label: '-1.25 ≤ MNDS < -0.30',
      meanCAR0_5: -0.0185,
      meanCAR0_20: -0.0242,
      count: 25,
      winRate: 0.42
    },
    {
      quintile: 'Q3 (Neutral / Baseline)',
      label: '-0.30 ≤ MNDS < +0.35',
      meanCAR0_5: 0.0028,
      meanCAR0_20: 0.0064,
      count: 26,
      winRate: 0.51
    },
    {
      quintile: 'Q4 (Moderate Pos Narrative)',
      label: '+0.35 ≤ MNDS < +1.30',
      meanCAR0_5: 0.0245,
      meanCAR0_20: 0.0382,
      count: 25,
      winRate: 0.63
    },
    {
      quintile: 'Q5 (Strongest Pos Narrative)',
      label: 'MNDS ≥ +1.30',
      meanCAR0_5: 0.0612,
      meanCAR0_20: 0.0945,
      count: 24,
      winRate: 0.74
    }
  ]
};

export const CROSS_SECTIONAL_REGRESSION_DATA: CrossSectionalRegression = {
  dependentVariable: 'CAR[0, +5] (5-day Cumulative Abnormal Return)',
  nObservations: 124,
  rSquared: 0.284,
  adjRSquared: 0.248,
  fStat: 7.82,
  fPValue: 0.00001,
  coefficients: [
    {
      variable: 'MNDS (Management Narrative Delta)',
      coef: 0.0214,
      stdErr: 0.0048,
      tStat: 4.46,
      pValue: 0.00002,
      ci95Lower: 0.0119,
      ci95Upper: 0.0309,
      significant: true
    },
    {
      variable: 'EPS Surprise (%)',
      coef: 0.0018,
      stdErr: 0.0006,
      tStat: 3.02,
      pValue: 0.0031,
      ci95Lower: 0.0006,
      ci95Upper: 0.0030,
      significant: true
    },
    {
      variable: 'Revenue Surprise (%)',
      coef: 0.0032,
      stdErr: 0.0014,
      tStat: 2.28,
      pValue: 0.0242,
      ci95Lower: 0.0004,
      ci95Upper: 0.0060,
      significant: true
    },
    {
      variable: '21D Price Momentum',
      coef: 0.0485,
      stdErr: 0.0245,
      tStat: 1.98,
      pValue: 0.0502,
      ci95Lower: -0.0002,
      ci95Upper: 0.0972,
      significant: false
    },
    {
      variable: '21D Historical Volatility',
      coef: -0.0312,
      stdErr: 0.0195,
      tStat: -1.60,
      pValue: 0.1120,
      ci95Lower: -0.0701,
      ci95Upper: 0.0077,
      significant: false
    },
    {
      variable: 'Volume Z-Score',
      coef: 0.0042,
      stdErr: 0.0028,
      tStat: 1.50,
      pValue: 0.1360,
      ci95Lower: -0.0014,
      ci95Upper: 0.0098,
      significant: false
    },
    {
      variable: 'Market Return (S&P 500)',
      coef: 0.3420,
      stdErr: 0.1580,
      tStat: 2.16,
      pValue: 0.0326,
      ci95Lower: 0.0270,
      ci95Upper: 0.6570,
      significant: true
    }
  ],
  famaMacBethAvgCoefficients: [
    {
      variable: 'MNDS Gamma',
      avgBeta: 0.0198,
      tsStdErr: 0.0052,
      tStat: 3.81,
      pValue: 0.0004
    },
    {
      variable: 'EPS Surprise Gamma',
      avgBeta: 0.0015,
      tsStdErr: 0.0005,
      tStat: 2.85,
      pValue: 0.0062
    },
    {
      variable: 'Rev Surprise Gamma',
      avgBeta: 0.0028,
      tsStdErr: 0.0012,
      tStat: 2.33,
      pValue: 0.0235
    }
  ]
};

export const ABLATION_STUDY_DATA: AblationModelRow[] = [
  {
    modelId: 'MODEL_A',
    modelName: 'Model A: Fundamentals Only',
    featuresIncluded: ['EPS Surprise', 'Revenue Surprise'],
    mae: 0.0412,
    rmse: 0.0548,
    r2: 0.082,
    auc: 0.584,
    dirAccuracy: 0.562,
    cagr: 0.078,
    sharpe: 0.74,
    maxDrawdown: -0.168
  },
  {
    modelId: 'MODEL_B',
    modelName: 'Model B: Fundamentals + Market Dynamics',
    featuresIncluded: ['EPS Surprise', 'Rev Surprise', '5D/21D/63D Momentum', '21D/63D Vol', 'Volume Z-Score', 'Market Return'],
    mae: 0.0384,
    rmse: 0.0512,
    r2: 0.134,
    auc: 0.628,
    dirAccuracy: 0.601,
    cagr: 0.114,
    sharpe: 1.08,
    maxDrawdown: -0.142
  },
  {
    modelId: 'MODEL_C',
    modelName: 'Model C: Fundamentals + Market + Absolute Sentiment',
    featuresIncluded: ['Fundamentals', 'Market Dynamics', 'LM Dictionary Sentiment', 'Transformer FinBERT Sentiment Score'],
    mae: 0.0362,
    rmse: 0.0488,
    r2: 0.176,
    auc: 0.655,
    dirAccuracy: 0.624,
    cagr: 0.142,
    sharpe: 1.32,
    maxDrawdown: -0.128
  },
  {
    modelId: 'MODEL_D',
    modelName: 'Model D: Fundamentals + Market + Narrative Delta (Self-Baseline)',
    featuresIncluded: ['Fundamentals', 'Market Dynamics', 'Delta Sentiment', 'Delta Uncertainty', 'Narrative Shock (Cosine)', 'Topic Delta (Jensen-Shannon)'],
    mae: 0.0321,
    rmse: 0.0435,
    r2: 0.245,
    auc: 0.722,
    dirAccuracy: 0.688,
    cagr: 0.198,
    sharpe: 1.84,
    maxDrawdown: -0.098
  },
  {
    modelId: 'MODEL_E',
    modelName: 'Model E: Full Architecture (MNDS + Q&A Divergence)',
    featuresIncluded: ['All Above Features', 'Prepared Remarks vs Q&A Sentiment Divergence', 'Q&A Uncertainty Spike', 'Composite MNDS Score'],
    mae: 0.0294,
    rmse: 0.0398,
    r2: 0.284,
    auc: 0.764,
    dirAccuracy: 0.726,
    cagr: 0.242,
    sharpe: 2.18,
    maxDrawdown: -0.076
  }
];

export const BACKTEST_PERFORMANCE_SUMMARY: BacktestPerformance[] = [
  {
    strategyName: 'MNDS Long-Short (Dollar Neutral, 5D Hold)',
    holdingPeriod: '5D',
    portfolioType: 'DOLLAR_NEUTRAL',
    transactionCostBps: 10,
    totalReturn: 0.442,
    cagr: 0.201,
    annualizedVol: 0.092,
    sharpeRatio: 2.18,
    sortinoRatio: 3.45,
    calmarRatio: 2.64,
    maxDrawdown: -0.076,
    winRate: 0.685,
    profitFactor: 2.42,
    avgTradeReturn: 0.024,
    medianTradeReturn: 0.021,
    bestTrade: 0.142,
    worstTrade: -0.052,
    annualTurnover: 4.85,
    var95: -0.014,
    cvar95: -0.022,
    var99: -0.028,
    cvar99: -0.039,
    beta: 0.04,
    grossExposure: 1.00,
    netExposure: 0.02,
    drawdownDurationDays: 34
  },
  {
    strategyName: 'MNDS Long-Only (5D Hold)',
    holdingPeriod: '5D',
    portfolioType: 'LONG_ONLY',
    transactionCostBps: 10,
    totalReturn: 0.584,
    cagr: 0.258,
    annualizedVol: 0.158,
    sharpeRatio: 1.63,
    sortinoRatio: 2.48,
    calmarRatio: 2.15,
    maxDrawdown: -0.120,
    winRate: 0.712,
    profitFactor: 2.18,
    avgTradeReturn: 0.032,
    medianTradeReturn: 0.028,
    bestTrade: 0.142,
    worstTrade: -0.068,
    annualTurnover: 3.20,
    var95: -0.022,
    cvar95: -0.034,
    var99: -0.042,
    cvar99: -0.058,
    beta: 0.88,
    grossExposure: 1.00,
    netExposure: 1.00,
    drawdownDurationDays: 48
  },
  {
    strategyName: 'Pure Absolute Sentiment Long-Short (Benchmark)',
    holdingPeriod: '5D',
    portfolioType: 'DOLLAR_NEUTRAL',
    transactionCostBps: 10,
    totalReturn: 0.224,
    cagr: 0.106,
    annualizedVol: 0.114,
    sharpeRatio: 0.93,
    sortinoRatio: 1.34,
    calmarRatio: 0.72,
    maxDrawdown: -0.148,
    winRate: 0.548,
    profitFactor: 1.41,
    avgTradeReturn: 0.011,
    medianTradeReturn: 0.009,
    bestTrade: 0.098,
    worstTrade: -0.084,
    annualTurnover: 5.12,
    var95: -0.020,
    cvar95: -0.031,
    var99: -0.038,
    cvar99: -0.049,
    beta: 0.06,
    grossExposure: 1.00,
    netExposure: 0.01,
    drawdownDurationDays: 82
  }
];

export const REGIME_ANALYSIS_DATA: RegimeAnalysisRow[] = [
  {
    regime: 'Low Volatility',
    vixRange: 'VIX < 15',
    eventCount: 38,
    avgMNDS: 0.32,
    longReturn: 0.038,
    shortReturn: -0.012,
    spreadReturn: 0.050,
    sharpe: 2.45,
    winRate: 0.73
  },
  {
    regime: 'Normal',
    vixRange: '15 ≤ VIX < 22',
    eventCount: 56,
    avgMNDS: 0.08,
    longReturn: 0.042,
    shortReturn: -0.024,
    spreadReturn: 0.066,
    sharpe: 2.28,
    winRate: 0.70
  },
  {
    regime: 'High Volatility',
    vixRange: '22 ≤ VIX < 32',
    eventCount: 22,
    avgMNDS: -0.24,
    longReturn: 0.055,
    shortReturn: -0.038,
    spreadReturn: 0.093,
    sharpe: 1.88,
    winRate: 0.64
  },
  {
    regime: 'Crisis',
    vixRange: 'VIX ≥ 32',
    eventCount: 8,
    avgMNDS: -0.68,
    longReturn: 0.072,
    shortReturn: -0.061,
    spreadReturn: 0.133,
    sharpe: 1.42,
    winRate: 0.58
  }
];

export const SECTOR_ANALYSIS_DATA: SectorAnalysisRow[] = [
  {
    sector: 'Information Technology',
    eventCount: 36,
    avgMNDS: 0.42,
    avgSentimentDelta: 0.38,
    avgCAR0_5: 0.036,
    strategyReturn: 0.074,
    winRate: 0.75
  },
  {
    sector: 'Communication Services',
    eventCount: 20,
    avgMNDS: 0.28,
    avgSentimentDelta: 0.24,
    avgCAR0_5: 0.029,
    strategyReturn: 0.062,
    winRate: 0.70
  },
  {
    sector: 'Consumer Discretionary',
    eventCount: 16,
    avgMNDS: 0.31,
    avgSentimentDelta: 0.29,
    avgCAR0_5: 0.031,
    strategyReturn: 0.065,
    winRate: 0.69
  },
  {
    sector: 'Consumer Staples',
    eventCount: 24,
    avgMNDS: 0.12,
    avgSentimentDelta: 0.10,
    avgCAR0_5: 0.014,
    strategyReturn: 0.038,
    winRate: 0.67
  },
  {
    sector: 'Financials',
    eventCount: 16,
    avgMNDS: 0.18,
    avgSentimentDelta: 0.15,
    avgCAR0_5: 0.021,
    strategyReturn: 0.048,
    winRate: 0.65
  },
  {
    sector: 'Energy',
    eventCount: 12,
    avgMNDS: -0.15,
    avgSentimentDelta: -0.18,
    avgCAR0_5: -0.008,
    strategyReturn: 0.041,
    winRate: 0.62
  }
];

export const LEAKAGE_AUDIT_CHECKS: LeakageAuditCheck[] = [
  {
    id: 1,
    title: 'Transcript Release Timestamp Gating',
    category: 'TIMING',
    status: 'PASS',
    rule: 'Trade execution timestamp must be strictly greater than SEC/wire official release time (T_trade > T_release).',
    implementationDetail: 'Validated against exchange market open: aftermarket calls execute at next session Open (t+1 09:30:00). Verified 0 look-ahead trades.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  },
  {
    id: 2,
    title: 'Current-Quarter Exclusion from Baseline',
    category: 'BASELINE',
    status: 'PASS',
    rule: 'Historical baseline for company i at quarter q must use strictly {q-k for k >= 1}.',
    implementationDetail: 'self.get_historical_baseline(ticker, quarter) slices df[df.quarter < quarter]. Current event features never pollute prior averages.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  },
  {
    id: 3,
    title: 'Prior-Quarter Semantic Narrative Comparison',
    category: 'TRANSFORM',
    status: 'PASS',
    rule: 'Cosine similarity calculated strictly against quarter q-1 embedding vector.',
    implementationDetail: 'Vector indexing checks lagged date strictly. Verified with assertion assert prior_quarter_date < current_quarter_date.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  },
  {
    id: 4,
    title: 'Historical Centroid Expansion Window',
    category: 'BASELINE',
    status: 'PASS',
    rule: 'Topic/Embedding centroid must be expanding window up to q-1, never full-sample.',
    implementationDetail: 'Expanding centroid implemented via cumulative mean without including current row. Zero future embeddings included.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  },
  {
    id: 5,
    title: 'Topic Modeling Temporal Isolation',
    category: 'MODEL',
    status: 'PASS',
    rule: 'NMF/BERTopic vocabulary and document frequencies must not fit on post-event documents.',
    implementationDetail: 'Topic model fitted on historical training slice. In inference mode, transform() is called on newly arrived transcripts.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  },
  {
    id: 6,
    title: 'Cross-Sectional Standardization In-Period Only',
    category: 'TRANSFORM',
    status: 'PASS',
    rule: 'Z-score standardization of MNDS sub-components must use only contemporaneous cross-section.',
    implementationDetail: 'zscore(axis=0) calculated grouping by calendar quarter date. No cross-quarter mean subtraction.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  },
  {
    id: 7,
    title: 'Walk-Forward TimeSeriesSplit ML Pipeline',
    category: 'MODEL',
    status: 'PASS',
    rule: 'Strictly zero shuffle=True. All train/test splits must be sequential time-aware splits.',
    implementationDetail: 'scikit-learn TimeSeriesSplit(n_splits=5) enforced. StandardScaler and imputers fit_transform() on train, transform() on test only.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  },
  {
    id: 8,
    title: 'Test-Set Hyperparameter Tuning Ban',
    category: 'MODEL',
    status: 'PASS',
    rule: 'MNDS default weights (w1..w6) and model hyper-parameters must be tuned exclusively on in-sample validation folds.',
    implementationDetail: 'Grid search and Bayesian tuning executed on nested inner cross-validation folds. Out-of-sample test holds frozen weights.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  },
  {
    id: 9,
    title: 'Target Return Separation',
    category: 'TIMING',
    status: 'PASS',
    rule: 'Future returns (CAR[0,+5], CAR[0,+20]) must never enter feature matrix X.',
    implementationDetail: 'Feature matrix X excludes any column with substring "future", "car", "return_t+", or target variables.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  },
  {
    id: 10,
    title: 'Event-Study Market Model Estimation Window',
    category: 'TIMING',
    status: 'PASS',
    rule: 'Market model estimation window [-252, -30] must terminate at least 30 trading days prior to event.',
    implementationDetail: 'Estimation window cutoff set to event_date - 30 trading days. Contamination buffer of 30 days strictly enforced.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  },
  {
    id: 11,
    title: 'Signal Generation Pre-Trade Timestamping',
    category: 'TIMING',
    status: 'PASS',
    rule: 'MNDS signals must be computed prior to market open of execution day.',
    implementationDetail: 'Signal generation pipeline completes at 08:45:00 ET before NYSE/Nasdaq open at 09:30:00 ET.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  },
  {
    id: 12,
    title: 'Backtest Position Lagging & Fill Price Integrity',
    category: 'BACKTEST',
    status: 'PASS',
    rule: 'Position must be entered at Open price following signal generation, never Close of signal day.',
    implementationDetail: 'Entry price is Open[t+1], slippage model accounts for volume participation. No same-bar execution.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  },
  {
    id: 13,
    title: 'Transaction Cost & Slippage Accounting',
    category: 'BACKTEST',
    status: 'PASS',
    rule: 'Two-way turnover transaction costs (0 to 50 bps) subtracted from every trade return.',
    implementationDetail: 'Net return formula: R_net = R_gross - (2 * cost_bps / 10000). Applied uniformly across all long/short legs.',
    verifiedTimestamp: '2026-09-11 07:05:00 UTC'
  }
];

export const CUMULATIVE_RETURNS_SERIES = [
  { date: '2023-01', mndsLongShort: 100.0, mndsLongOnly: 100.0, sp500: 100.0, sentimentOnly: 100.0 },
  { date: '2023-03', mndsLongShort: 104.2, mndsLongOnly: 106.5, sp500: 103.2, sentimentOnly: 102.1 },
  { date: '2023-06', mndsLongShort: 111.8, mndsLongOnly: 118.4, sp500: 109.8, sentimentOnly: 105.4 },
  { date: '2023-09', mndsLongShort: 116.5, mndsLongOnly: 115.2, sp500: 106.4, sentimentOnly: 104.8 },
  { date: '2023-12', mndsLongShort: 123.4, mndsLongOnly: 128.9, sp500: 118.2, sentimentOnly: 110.2 },
  { date: '2024-03', mndsLongShort: 130.1, mndsLongOnly: 141.2, sp500: 128.5, sentimentOnly: 114.6 },
  { date: '2024-06', mndsLongShort: 135.8, mndsLongOnly: 147.8, sp500: 132.4, sentimentOnly: 116.8 },
  { date: '2024-09', mndsLongShort: 140.2, mndsLongOnly: 153.6, sp500: 138.9, sentimentOnly: 119.5 },
  { date: '2024-12', mndsLongShort: 144.2, mndsLongOnly: 158.4, sp500: 144.1, sentimentOnly: 122.4 }
];
