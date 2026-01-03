import { Dataset, Algorithm } from './types';

export const MOCK_DATASETS: Dataset[] = [
  { id: 'ds-001', name: 'DREAM5_Ecoli', organism: 'E. coli', type: 'InSilico', geneCount: 4511, sampleCount: 805, lastUpdated: '2023-11-01', source: 'beeline' },
  { id: 'ds-002', name: 'mESC_Experimental', organism: 'Mouse', type: 'Experimental', geneCount: 1200, sampleCount: 200, lastUpdated: '2023-10-15', source: 'beeline' },
  { id: 'ds-003', name: 'DREAM4_Multifactorial', organism: 'Synthetic', type: 'InSilico', geneCount: 100, sampleCount: 100, lastUpdated: '2024-01-10', source: 'beeline' },
  { id: 'ds-004', name: 'Human_Hepatocytes', organism: 'Human', type: 'Experimental', geneCount: 8500, sampleCount: 50, lastUpdated: '2024-02-20', source: 'user' },
];

export const MOCK_ALGORITHMS: Algorithm[] = [
  { id: 'alg-001', name: 'GRNBoost2', version: '1.0.2', parameters: ['n_estimators', 'max_depth'], description: 'Gradient boosting based GRN inference.' },
  { id: 'alg-002', name: 'PIDC', version: '0.4.5', parameters: ['threshold'], description: 'Partial Information Decomposition and Co-expression.' },
  { id: 'alg-003', name: 'SCODE', version: '2.1.0', parameters: ['n_clusters', 'n_genes'], description: 'Inference based on ordinary differential equations.' },
  { id: 'alg-004', name: 'PPCOR', version: '1.1.0', parameters: ['p_value'], description: 'Partial and semi-partial correlation.' },
];
