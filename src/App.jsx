import { profile } from './data/profile.js';
import { Hero } from './components/Hero.jsx';
import { Section } from './components/Section.jsx';
import { Timeline } from './components/Timeline.jsx';
import { Stacks } from './components/Stacks.jsx';
import { Education } from './components/Education.jsx';
import { Awards } from './components/Awards.jsx';
import { Associations } from './components/Associations.jsx';
import { Footer } from './components/Footer.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Hero profile={profile} />

      <Section title="Experience" meta="High-signal work across research, hardware, and product" >
        <Timeline items={profile.experience} />
      </Section>

      <Section title="Stacks" meta="Toolchains and languages on speed-dial">
        <Stacks programming={profile.programming} languages={profile.languages} />
      </Section>

      <Section title="Education" meta="Research-driven computer science">
        <Education items={profile.education} />
      </Section>

      <Section title="Awards" meta="National-stage recognitions">
        <Awards items={profile.awards} />
      </Section>

      <Section title="Communities" meta="Hands-on builder in student orgs">
        <Associations items={profile.associations} />
      </Section>

      <Footer />
    </div>
  );
}
