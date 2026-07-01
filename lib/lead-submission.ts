export type LeadSubmissionInput = {
  client: string;
  phone: string;
  email?: string;
  city: string;
  district?: string;
  type: string;
  item: string;
  message?: string;
  pagePath?: string;
  source?: string;
};
