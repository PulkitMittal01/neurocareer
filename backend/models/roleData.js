// backend/models/roleData.js
const roleDatabase = {
    'UX/UI Designer': {
      companies: ['Google', 'Apple', 'Microsoft', 'Figma', 'Adobe', 'Shopify'],
      accommodations: ['Quiet focus spaces', 'Flexible hours', 'Async meetings', 'Work from home option', 'Visual communication tools'],
      industry: 'Tech'
    },
    'Software Tester': {
      companies: ['Microsoft', 'IBM', 'Apple', 'Google', 'Amazon'],
      accommodations: ['Detailed documentation', 'Clear test cases', 'Independent work', 'Remote flexibility', 'No surprise meetings'],
      industry: 'Tech'
    },
    'Data Analyst': {
      companies: ['Google', 'Microsoft', 'Amazon', 'Salesforce', 'IBM'],
      accommodations: ['Independent projects', 'Async communication', 'Quiet workspace', 'Structured tasks', 'Clear metrics'],
      industry: 'Tech'
    },
    'Web Developer': {
      companies: ['Google', 'Facebook', 'GitHub', 'Stripe', 'Shopify', 'Slack'],
      accommodations: ['Flexible schedule', 'Focus time blocks', 'Code reviews instead of meetings', 'Remote work', 'Async standups'],
      industry: 'Tech'
    },
    'Quality Assurance Engineer': {
      companies: ['Apple', 'Microsoft', 'Amazon', 'Google', 'Tesla'],
      accommodations: ['Systematic checklists', 'Detailed procedures', 'Independent testing', 'Pattern recognition valued', 'Remote option'],
      industry: 'Tech'
    },
    'Content Writer': {
      companies: ['Medium', 'HubSpot', 'Substack', 'Buffer', 'Zapier'],
      accommodations: ['Remote work', 'Flexible deadlines', 'Written feedback', 'Hyper-focus time', 'Async collaboration'],
      industry: 'Writing'
    },
    'Graphic Designer': {
      companies: ['Adobe', 'Canva', 'Figma', 'InVision', 'Sketch'],
      accommodations: ['Visual workspace', 'Clear design briefs', 'Feedback in writing', 'Focus periods', 'Creative freedom'],
      industry: 'Design'
    },
    'Project Coordinator': {
      companies: ['Google', 'Microsoft', 'Asana', 'Monday.com', 'Jira'],
      accommodations: ['Detailed project plans', 'Clear checklists', 'Systematic organization', 'Structured communication', 'Documentation valued'],
      industry: 'Operations'
    },
    'Research Analyst': {
      companies: ['Google', 'Microsoft', 'Stanford Research', 'MIT', 'McKinsey'],
      accommodations: ['Independent research', 'Deep focus time', 'Detailed specifications', 'Written communication', 'Pattern analysis'],
      industry: 'Research'
    },
    'Video Editor': {
      companies: ['YouTube', 'Netflix', 'Adobe', 'DaVinci Resolve', 'Adobe Premiere'],
      accommodations: ['Hyperfocus-friendly work', 'Detailed edit notes', 'Creative control', 'Remote work', 'Asynchronous feedback'],
      industry: 'Media'
    },
    'Database Administrator': {
      companies: ['Google', 'Amazon', 'Microsoft', 'Oracle', 'IBM'],
      accommodations: ['Structured systems', 'Clear documentation', 'Logical problem-solving', 'Independent troubleshooting', 'Pattern recognition valued'],
      industry: 'Tech'
    },
    'Technical Writer': {
      companies: ['Google', 'Microsoft', 'GitHub', 'AWS', 'HashiCorp'],
      accommodations: ['Structured documentation', 'Clear requirements', 'Written communication', 'Detailed specifications', 'Remote work'],
      industry: 'Writing'
    },
    'Accessibility Specialist': {
      companies: ['Google', 'Microsoft', 'Apple', 'Adobe', 'Accessibility focused startups'],
      accommodations: ['Mission-driven work', 'Community support', 'Flexible roles', 'Neurodiversity appreciated', 'Impact-focused'],
      industry: 'Tech'
    },
    'Machine Learning Specialist': {
      companies: ['Google', 'DeepMind', 'OpenAI', 'Facebook AI Research', 'Microsoft Research'],
      accommodations: ['Focused research', 'Pattern recognition', 'Deep dives valued', 'Independent work', 'Remote friendly'],
      industry: 'Tech'
    },
    'Sound/Audio Engineer': {
      companies: ['Adobe', 'Audacity', 'Splice', 'BeatMaker', 'Logic Pro'],
      accommodations: ['Hyper-focus valued', 'Detailed audio analysis', 'Sensory expertise', 'Independent work', 'Creative freedom'],
      industry: 'Media'
    },
    'Librarian/Information Specialist': {
      companies: ['Library systems', 'Google Books', 'Internet Archive', 'University libraries'],
      accommodations: ['Organized systems', 'Detailed cataloging', 'Pattern recognition', 'Structured environment', 'Independent research'],
      industry: 'Education'
    },
    'Accountant': {
      companies: ['Big 4 (Deloitte, PwC, etc.)', 'Intuit', 'Quickbooks', 'Amazon'],
      accommodations: ['Detailed numbers', 'Structured processes', 'Systematic thinking', 'Independent work', 'Clear metrics'],
      industry: 'Finance'
    },
    'Environmental Scientist': {
      companies: ['EPA', 'National Geographic', 'Google Earth', 'Climate tech startups'],
      accommodations: ['Pattern recognition', 'Research focus', 'Independent projects', 'Detailed data analysis', 'Mission-driven'],
      industry: 'Science'
    },
    'Cybersecurity Analyst': {
      companies: ['Google', 'Microsoft', 'Apple', 'Facebook', 'Government agencies'],
      accommodations: ['Pattern detection', 'Detail-oriented', 'Logical problem-solving', 'Independent analysis', 'Remote flexibility'],
      industry: 'Tech'
    },
    'Game Developer': {
      companies: ['Unity', 'Unreal', 'Riot Games', 'Indie game studios'],
      accommodations: ['Hyper-focus on projects', 'Creative freedom', 'Problem-solving valued', 'Flexible schedules', 'Passion-driven'],
      industry: 'Tech'
    }
  };
  
  module.exports = roleDatabase;