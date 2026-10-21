export type Address = {
  address: string;
  postcode: string;
  city: string;
  street: string;
};

export type ScenarioKOLog = {
  scenario: string;
  timestamp: string;
  data: any;
};

export type StepScanResult = {
  step: string;
  passed: boolean;
};
