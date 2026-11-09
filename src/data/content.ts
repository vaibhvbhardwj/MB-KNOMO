export const brand = {
  name: 'Maven Bridge', partner: 'Knomo Developers',
  email: import.meta.env.VITE_CONTACT_EMAIL || '', phone: import.meta.env.VITE_CONTACT_PHONE || '',
  url: import.meta.env.VITE_SITE_URL || '',
  eyebrow: 'BUSINESS STRATEGY × TECHNOLOGY × GROWTH',
  hero: ['Business ideas', 'deserve exceptional', 'execution.'],
  intro: 'We connect business clarity with thoughtful engineering. From your first idea to your next stage of growth, Maven Bridge and Knomo Developers help you move forward.',
  partnership: [
    { name: 'Maven Bridge', role: 'THE BUSINESS PERSPECTIVE', icon: 'compass', description: 'Strategy, discovery and a clear path forward. We translate your business challenge into a plan everyone can get behind.', items: ['Discovery & business analysis', 'Strategy & requirements', 'Client relationships & delivery governance'] },
    { name: 'Knomo Developers', role: 'THE ENGINEERING PERSPECTIVE', icon: 'code-alt', description: 'The craft behind the solution. Our technical delivery partner turns the agreed plan into useful, maintainable digital experiences.', items: ['Product design & development', 'AI workflows & integrations', 'Deployment & technical delivery'] },
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
  { question: 'What happens after I send an inquiry?', answer: 'Once inquiries are enabled, the team reviews your message and contacts you to arrange a discovery conversation. Any day or time you suggest is a request, not a confirmed appointment.' },
  { question: 'How do Maven Bridge and Knomo work together?', answer: 'Maven Bridge leads discovery, business planning and client coordination. Knomo Developers provides engineering and technical implementation against the agreed scope.' },
  { question: 'Do I need to know my budget or technical requirements?', answer: 'No. You can select “Not sure” for your budget. Discovery helps define the requirements, priorities and an appropriate scope.' },
];
export const engagementModels = [
  { title: 'Find your direction', label: 'DISCOVERY & STRATEGY', text: 'Bring a challenge. Leave the discovery process with clearer requirements and a practical path.' },
  { title: 'Build something meaningful', label: 'PROJECT DELIVERY', text: 'From a focused website to a custom workflow, agree on the scope and build in reviewable stages.' },
  { title: 'Extend your team', label: 'AGENCY PARTNERSHIPS', text: 'Add engineering and implementation support to your creative or marketing capabilities.' },
];
