export const products = [
  { id: 'ai-call-picker', name: 'AI Call Picker', icon: 'phone-call', headline: 'Every call deserves an answer.', description: 'Explore a tailored call-handling concept that captures inquiries, answers common questions and brings your team into the conversation when it matters.', features: ['Business-specific knowledge', 'Structured lead capture', 'Human callback requests'], cta: 'Request an AI Call Demo', steps: ['Incoming inquiry', 'Understand & capture', 'Team follow-up'] },
  { id: 'virtual-ai-hr', name: 'Virtual AI HR', icon: 'user-voice', headline: 'Let HR focus on people.', description: 'Explore AI-assisted candidate FAQs, interview coordination and HR knowledge support, with people in charge of consequential decisions.', features: ['Candidate FAQs', 'Interview requests', 'Human review by design'], cta: 'Explore Virtual AI HR', steps: ['Candidate question', 'Coordinate a request', 'HR review'] },
];
export const callScenarios = [
  { name: 'Hotel reservation inquiry', question: 'Hi, I’m looking for a room for two next Friday. Can someone help?', response: 'I can capture your request for the reservations team. What is the best way for them to reach you?', summary: 'Room inquiry · 2 guests · next Friday', action: 'Callback requested · awaiting team confirmation' },
  { name: 'Real-estate site visit', question: 'Could I arrange a visit to the waterfront property this weekend?', response: 'I can pass a viewing request to the property team. Which day would you prefer?', summary: 'Property viewing · weekend preference', action: 'Visit request captured · agent follow-up required' },
  { name: 'Service booking', question: 'I’d like to talk with someone about a website for my business.', response: 'I can help organize a callback request. Could you share a little about the project?', summary: 'Website project · discovery conversation', action: 'Inquiry qualified · team callback requested' },
];
export const hrSteps = [
  { question: 'What does the interview process look like?', response: 'In this example, the process starts with a conversation with the hiring team. Your recruiter confirms the details.', summary: 'Role FAQ answered using example information' },
  { question: 'Could I speak with the team on Thursday afternoon?', response: 'I can record that preference. The HR team will review it and confirm a suitable time with you.', summary: 'Thursday afternoon · interview preference requested' },
  { question: 'Will a person review my application?', response: 'Yes. This concept routes requests to a human reviewer. It does not score, rank or reject candidates.', summary: 'New coordination request · human review pending' },
];
