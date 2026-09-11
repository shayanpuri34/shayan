export interface CompanyProfile {
  ticker: string;
  name: string;
  sector: string;
  marketCap: number; // in billions
  beta: number;
  description: string;
  quarters: string[];
}

export interface TranscriptSentence {
  id: string;
  speaker: string;
  role: 'CEO' | 'CFO' | 'COO' | 'President' | 'Executive' | 'Analyst' | 'Operator' | 'UNKNOWN';
  section: 'PREPARED_REMARKS' | 'Q_AND_A' | 'UNKNOWN';
  text: string;
  sentiment: number; // -1.0 to 1.0
  uncertaintyCount: number;
  confidenceCount: number;
  topics: string[];
}

export interface TopicDistribution {
  [topicName: string]: number; // probability 0 to 1, sums to 1
}

export interface EarningsEventData {
  ticker: string;
  quarter: string;
  date: string;
  time: string; // "17:00 ET"
  epsActual: number;
  epsEstimate: number;
  epsSurprise: number; // in %
  revActual: number; // in billions
  revEstimate: number;
  revSurprise: number; // in %
  marketCap: number;
  
  // Market & Control variables
  momentum5d: number;
  momentum21d: number;
  momentum63d: number;
  volatility21d: number;
  volatility63d: number;
  volumeZscore: number;
  marketReturn: number;
  sectorReturn: number;
  beta: number;

  // Transcript stats
  totalWords: number;
  mgmtWords: number;
  analystWords: number;
  qaQuestionsCount: number;
  avgResponseLength: number;

  // NLP Sentiment & Linguistics (Current vs Prior)
  sentimentCurrent: number;
  sentimentPrior: number;
  sentimentDelta: number; // normalized delta
  
  uncertaintyCurrent: number;
  uncertaintyPrior: number;
  uncertaintyDelta: number;

  confidenceCurrent: number;
  confidencePrior: number;
  confidenceDelta: number;

  // Semantic & Topic
  semanticSimilarityPrior: number;
  semanticSimilarityCentroid: number;
  narrativeShock: number; // 1 - similarity

  topicDistCurrent: TopicDistribution;
  topicDistPrior: TopicDistribution;
  topicDeltaJS: number; // Jensen-Shannon divergence
  newTopics: string[];
  disappearingTopics: string[];
  acceleratingTopics: string[];
  decliningTopics: string[];

  // Q&A Divergence
  preparedSentiment: number;
  qaSentiment: number;
  qaSentimentDivergence: number; // prepared - QA
  preparedUncertainty: number;
  qaUncertainty: number;
  qaUncertaintyDivergence: number; // QA - prepared

  // Proprietary Composite
  mndsScore: number;
  mndsZScore: number;
  mndsPercentile: number; // 0 to 100

  // Event Study Abnormal Returns
  carMinus1Plus1: number;
  carZeroPlus1: number;
  carZeroPlus5: number;
  carZeroPlus20: number;

  // Transcript Sentences Sample
  sampleSentences: TranscriptSentence[];

  // Signals
  mndsSignal: 'LONG' | 'SHORT' | 'FLAT';
  sentimentSignal: 'LONG' | 'SHORT' | 'FLAT';
  mlPredictedReturn: number;
  mlSignal: 'LONG' | 'SHORT' | 'FLAT';
  actual5dReturn: number;
}

export interface EventStudyMetrics {
  estimationWindow: string; // "[-252, -30]"
  eventWindows: {
    name: string;
    window: string;
    caar: number;
    tStat: number;
    pValue: number;
    significance: string;
  }[];
  quintileCAR: {
    quintile: string;
    label: string;
    meanCAR0_5: number;
    meanCAR0_20: number;
    count: number;
    winRate: number;
  }[];
}

export interface CrossSectionalRegression {
  dependentVariable: string;
  nObservations: number;
  rSquared: number;
  adjRSquared: number;
  fStat: number;
  fPValue: number;
  coefficients: {
    variable: string;
    coef: number;
    stdErr: number;
    tStat: number;
    pValue: number;
    ci95Lower: number;
    ci95Upper: number;
    significant: boolean;
  }[];
  famaMacBethAvgCoefficients?: {
    variable: string;
    avgBeta: number;
    tsStdErr: number;
    tStat: number;
    pValue: number;
  }[];
}

export interface AblationModelRow {
  modelId: string;
  modelName: string;
  featuresIncluded: string[];
  mae: number;
  rmse: number;
  r2: number;
  auc: number;
  dirAccuracy: number;
  cagr: number;
  sharpe: number;
  maxDrawdown: number;
}

export interface BacktestPerformance {
  strategyName: string;
  holdingPeriod: '1D' | '5D' | '10D' | '20D';
  portfolioType: 'LONG_ONLY' | 'DOLLAR_NEUTRAL';
  transactionCostBps: number;
  totalReturn: number;
  cagr: number;
  annualizedVol: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  avgTradeReturn: number;
  medianTradeReturn: number;
  bestTrade: number;
  worstTrade: number;
  annualTurnover: number;
  var95: number;
  cvar95: number;
  var99: number;
  cvar99: number;
  beta: number;
  grossExposure: number;
  netExposure: number;
  drawdownDurationDays: number;
}

export interface RegimeAnalysisRow {
  regime: 'Low Volatility' | 'Normal' | 'High Volatility' | 'Crisis';
  vixRange: string;
  eventCount: number;
  avgMNDS: number;
  longReturn: number;
  shortReturn: number;
  spreadReturn: number;
  sharpe: number;
  winRate: number;
}

export interface SectorAnalysisRow {
  sector: string;
  eventCount: number;
  avgMNDS: number;
  avgSentimentDelta: number;
  avgCAR0_5: number;
  strategyReturn: number;
  winRate: number;
}

export interface LeakageAuditCheck {
  id: number;
  title: string;
  category: 'TIMING' | 'BASELINE' | 'TRANSFORM' | 'MODEL' | 'BACKTEST';
  status: 'PASS' | 'WARNING' | 'FAIL';
  rule: string;
  implementationDetail: string;
  verifiedTimestamp: string;
}
