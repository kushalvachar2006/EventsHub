// Helper function to get initials for logos
const getInitials = (name) => {
  try {
    const words = name.split(' ');
    // Get first letter of first word and last word
    if (words.length > 1) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    // Or first two letters of a single word
    return name.substring(0, 2).toUpperCase();
  } catch (e) {
    return 'CL'; // Fallback
  }
};

// College list now includes a logoUrl
export const COLLEGE_LIST = [
  'Acharya Institute of Technology',
  'Alliance University',
  'Bangalore College of Engineering and Technology',
  'Bangalore Institute of Technology (BIT)',
  'BMS College of Engineering',
  'BMS Institute of Technology (BMSIT)',
  'Christ University',
  'CMR Institute of Technology',
  'CMR University',
  'Dayananda Sagar University',
  'Garden City University',
  'GITAM University',
  'Indian Institute of Management Bangalore (IIMB)',
  'Indian Institute of Science (IISc)',
  'International Institute of Information Technology (IIIT-Bangalore)',
  'Jain University',
  'Jyothi Nivas College',
  'JSS Science and Technology University',
  'KLE Technological University',
  'Kristu Jayanti College',
  'Mount Carmel College',
  'Mount Carmel College of Commerce',
  'Mount Carmel College of Nursing',
  'MS Ramaiah College of Arts, Science and Commerce',
  'MS Ramaiah Institute of Technology (MSRIT)',
  'National Institute of Fashion Technology (NIFT)',
  'New Horizon College of Engineering',
  'PES Institute of Technology',
  'PES University',
  'Presidency University',
  'Reva University',
  'Ramaiah University of Applied Sciences',
  'RNS Institute of Technology',
  'RV College of Engineering (RVCE)',
  'Sapthagiri College of Engineering',
  'Sir M Visvesvaraya Institute of Technology (SMVIT)',
  'SJB Institute of Technology',
  'Sree Krishna College of Engineering and Technology',
  'Sri Venkateswara College of Engineering',
  "St. Joseph's College of Engineering",
  'The National Academy of Agricultural Sciences (NAAS)',
  'The Oxford College of Engineering',
  'Vidyavardhaka College of Engineering',
  'Visvesvaraya Technological University (VTU)',
  'VIT University',
  'VIT-AP University',
  'R V University',
  'Shree Sankaracharya University',
  'Acharya & B M Reddy College of Engineering',
  'BNM Institute of Technology',
].map((name, index) => {
  const initials = getInitials(name);
  return {
    id: index + 1,
    name: name,
    // Using a placeholder service to generate a unique logo
    logoUrl: `https://placehold.co/24x24/6366f1/ffffff?text=${initials}`,
  };
});