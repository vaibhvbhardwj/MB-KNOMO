export const brand = {
  name: 'Maven Bridge', partner: 'Knomo Developers',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'bharatsingh2110023@gmail.com',
  secondaryEmail: import.meta.env.VITE_SECONDARY_CONTACT_EMAIL || 'vaibhvbhardwj@gmail.com',
  phone: import.meta.env.VITE_CONTACT_PHONE || '',
  url: import.meta.env.VITE_SITE_URL || '',
  eyebrow: 'BUSINESS STRATEGY × TECHNOLOGY × GROWTH',
  hero: ['Business ideas', 'deserve exceptional', 'execution.'],
  intro: 'We connect business clarity with thoughtful engineering. From your first idea to your next stage of growth, Maven Bridge and Knomo Developers help you move forward.',
  partnership: [
    { name: 'Maven Bridge', role: 'BUSINESS, FINANCE & MANAGEMENT', icon: 'compass', logo: 'maven', description: 'Maven Bridge leads the business side of the partnership: discovery, strategy, commercial and financial coordination, management and client relationships. We turn your requirements into a clear delivery plan.', items: ['Business analysis, strategy & requirements', 'Finance, commercial coordination & management', 'Client relationships & delivery governance'] },
    { name: 'Knomo Developers', role: 'ENGINEERING & TECHNICAL DELIVERY', icon: 'code-alt', logo: 'knomo', description: 'Knomo Developers handles the technical work: engineering, development, integrations and implementation. AI agents are configured around each client’s requirements, business knowledge and workflows.', items: ['Product design, software & development', 'Custom AI agents, configuration & integrations', 'Technical implementation, deployment & support'] },
  ],
};
export const navigation = [{ label: 'Home', href: '/' }, { label: 'Services', href: '/#services' }, { label: 'Solutions', href: '/#solutions' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }];
export const process = [
  { title: 'Understand', subtitle: 'DISCOVERY & ANALYSIS', text: 'Start with your goals, your people and the work that needs to change.' },
  { title: 'Define', subtitle: 'SCOPE & SOLUTION DESIGN', text: 'Agree on requirements, a practical roadmap and a clear proposal.' },
  { title: 'Create', subtitle: 'PROTOTYPE & ENGINEERING', text: 'Make the idea tangible, review it together and build with purpose.' },
  { title: 'Launch', subtitle: 'TESTING & HANDOVER', text: 'Validate with your team, prepare for launch and hand over with clarity.' },
  { title: 'Improve', subtitle: 'LEARN & ITERATE', text: 'Use feedback to shape the next useful improvement.' },
];
export const values = [
  { title: 'Clarity before complexity.', text: 'Understand the problem and agree on the outcome before choosing the technology.' },
  { title: 'Accountability, together.', text: 'Clear responsibilities, visible next steps and a shared understanding of progress.' },
  { title: 'Craft with a purpose.', text: 'Thoughtful design and maintainable engineering in service of real business needs.' },
  { title: 'A longer view.', text: 'Build for the people who will use, manage and improve the solution after launch.' },
];
export const faqs = [
  { question: 'What kinds of projects can we discuss?', answer: 'Websites, web apps, AI-assisted workflows, business analysis, integrations and agency delivery partnerships. Tell us the challenge, even if you do not yet have a technical brief.' },
  { question: 'What happens after I send an inquiry?', answer: 'Once delivery is configured, your inquiry is sent to the team and an acknowledgement is requested for your email address. The team reviews the requirements and arranges a discovery conversation manually. A preferred day or time is a request, not a confirmed appointment.' },
  { question: 'How do Maven Bridge and Knomo work together?', answer: 'Maven Bridge handles business strategy, financial and commercial coordination, management and client relationships. Knomo Developers handles engineering, development and technical implementation against the agreed requirements.' },
  { question: 'Can I use the AI call agent immediately?', answer: 'We have a call AI agent demo to explore. A client implementation needs discovery and configuration for your requirements, business knowledge, call flows and integrations. We build AI agents on demand; the demo is not a ready-to-use deployment for every business.' },
  { question: 'Do I need to know my budget or technical requirements?', answer: 'No. You can select “Not sure” for your budget. Discovery helps define the requirements, priorities and an appropriate scope.' },
];
export const engagementModels = [
  { title: 'Find your direction', label: 'DISCOVERY & STRATEGY', text: 'Bring a challenge. Leave the discovery process with clearer requirements and a practical path.' },
  { title: 'Build something meaningful', label: 'PROJECT DELIVERY', text: 'From a focused website to a custom workflow, agree on the scope and build in reviewable stages.' },
  { title: 'Extend your team', label: 'AGENCY PARTNERSHIPS', text: 'Add engineering and implementation support to your creative or marketing capabilities.' },
];
