import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';
import { PageWrapper } from '../components/ui/PageWrapper';
import { Section } from '../components/ui/Section';
import { Zap, Code2, Smartphone, Globe, Timer, History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    { icon: <Zap className="w-5 h-5 text-primary" />, title: 'Real-time 1v1 Battles', description: 'Compete against other developers in synchronous, real-time code execution.' },
    { icon: <Code2 className="w-5 h-5 text-primary" />, title: 'Coding Challenges', description: 'Test your algorithmic prowess across multiple difficulties and curated tasks.' },
    { icon: <Smartphone className="w-5 h-5 text-primary" />, title: 'Mobile First Design', description: 'Fully responsive battle interface crafted for seamless coding on any viewport.' },
    { icon: <Globe className="w-5 h-5 text-primary" />, title: 'Multi-Language Execution', description: 'Support for Python, JavaScript, C++, Java, HTML, and CSS environments.' },
    { icon: <Timer className="w-5 h-5 text-primary" />, title: 'Authoritative Timers', description: 'Server-synchronized countdowns ensure fair, high-pressure environments.' },
    { icon: <History className="w-5 h-5 text-primary" />, title: 'Match History', description: 'Track your performance, review past rounds, and monitor your score progression.' },
  ];

  const steps = [
    { number: '01', title: 'Name Setup', desc: 'Configure your profile name.' },
    { number: '02', title: 'Lobby Creation', desc: 'Create a room or join via room code.' },
    { number: '03', title: 'Live Battle', desc: 'Execute solutions in real time.' },
    { number: '04', title: 'Results', desc: 'Review match stats and performance.' },
  ];

  return (
    <PageWrapper>
      <Container className="max-w-6xl">
        {/* Hero Section */}
        <Section className="text-center pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border bg-surface text-xs font-medium text-white mb-8 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            CodeDuel Battle Arena v1.0
          </div>
          <h1 className="max-w-3xl mx-auto mb-6 text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Prove your coding skills in real-time battles
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg mb-10 text-secondary leading-relaxed">
            The ultimate 1v1 arena for developers to compete in algorithmic speed-runs, code optimization, and syntax precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            <Link to="/create-room" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8 font-medium">
                Create Battle Room
              </Button>
            </Link>
            <Link to="/join-room" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 font-medium">
                Join Match
              </Button>
            </Link>
            <Link to="/history" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 font-medium flex items-center justify-center gap-2">
                <History size={16} /> History
              </Button>
            </Link>
          </div>
        </Section>

        {/* Features Section */}
        <Section className="py-16 border-t border-border">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Features Built for Developers</h2>
            <p className="text-secondary mt-2 max-w-xl mx-auto text-sm sm:text-base">
              A robust architecture designed to deliver low-latency real-time compilation and score tracking.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-6 border border-border bg-surface hover:border-slate-700 transition-all duration-200">
                <div className="w-10 h-10 bg-slate-900 border border-border rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* How It Works Section */}
        <Section className="py-16 border-t border-border pb-24">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">How It Works</h2>
            <p className="text-secondary mt-2 max-w-xl mx-auto text-sm sm:text-base">
              Quickly challenge coworkers, classmates, or global competitors in minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-primary font-mono font-medium text-sm mb-4 shadow-sm">
                  {step.number}
                </div>
                <h3 className="text-base font-medium text-white mb-1">{step.title}</h3>
                <p className="text-xs sm:text-sm text-secondary leading-normal">{step.desc}</p>
                
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-10 w-full h-[1px] bg-border -z-10 translate-x-5" />
                )}
              </div>
            ))}
          </div>
        </Section>
      </Container>
    </PageWrapper>
  );
}
