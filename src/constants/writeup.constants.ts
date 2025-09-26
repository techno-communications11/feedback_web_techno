// Centralized constants
 export const WARNING_TYPES = [
  'Verbal Warning',
  'Written Warning',
  'Final Warning',
  'Suspension',
  'Termination',
];

 export const VIOLATIONS = [
  'Violation of work policy and Procedures',
  'Insubordination',
  'Under the influence of and/or possession of drugs or alcohol',
  'Clocking out early/Clock in Late',
  'Disobedience and Dishonesty',
  'Failure to follow Instruction',
  'Failure to observe proper safety procedures',
  'Rudeness to Customers',
  'Failure to complete work assignment',
  'Discourtesy or verbal abuse of guest or other employee',
  'Tardiness, absenteeism, failure to report for work',
  'Damage or misuse of company property',
  'Unauthorized removal of company property (cell phones) or etc.',
  'Physical or verbal assault and/or fighting',
  'Others (If Any):',
];

 export const FORM_STYLES = {
  container: { minHeight: '100vh', width: '210mm', margin: '0 auto', padding: '10mm', boxSizing: 'border-box' },
  input: { borderColor: '#E10174', fontSize: '0.9rem' },
  textarea: { borderColor: '#E10174', fontSize: '0.9rem', height: '40mm' },
  button: { backgroundColor: '#E10174', borderColor: '#E10174', color: 'white', fontSize: '0.9rem' },
};

 export interface User {
  actionName: string;
  applicant_uuid: string;
  ntid: string;
  first_name: string;
  last_name: string;
}

 export interface SelectedUserProps {
  selectedUser: User;
}