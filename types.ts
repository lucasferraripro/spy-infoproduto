export interface TargetAudience {
  demographics: string;
  psychographics: string;
  awareness_level: string;
}

export interface CopyAnalysis {
  headline: string;
  subheadline: string;
  bullets: string[];
  cta: string;
  promises: string[];
  unique_mechanism: string;
}

export interface StrategicAnalysis {
  triggers: string[];
  biases: string[];
  emotions: string[];
  key_arguments: string[];
}

export interface AdsData {
  active_time: string;
  quantity_estimation: string;
}

export interface Product {
  name: string;
  advertiser_name: string;
  price: string;
  type: string;
  pain_point: string;
  strategic_reasoning: string;
  audience: TargetAudience;
  copy: CopyAnalysis;
  page_structure: string[];
  strategy: StrategicAnalysis;
  ads_data: AdsData;
  market_insights: {
    opportunities: string;
    improvements: string;
  };
}

export interface EnhancedVersion {
  new_name: string;
  concept: string;
  new_copy_headline: string;
  differentials: string[];
  logic: string;
}

export interface BestProduct {
  original_name: string;
  reason_selected: string;
  enhanced_version: EnhancedVersion;
}

export interface MarketResearchResult {
  niche_overview: string;
  products: Product[];
  best_product: BestProduct;
}

export interface SearchSource {
    title: string;
    uri: string;
}