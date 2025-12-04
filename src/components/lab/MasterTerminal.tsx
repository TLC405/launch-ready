import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { decadePrompts, eraConfig, eraOrder, EraId } from '@/lib/decadePrompts';

interface MasterTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MasterTerminal({ isOpen, onClose }: MasterTerminalProps) {
  const [activeTab, setActiveTab] = useState<EraId>(eraOrder[0]);
  const [copied, setCopied] = useState(false);

  const copyPrompt = () => {
    navigator.clipboard.writeText(decadePrompts[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const era = eraConfig[activeTab];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div>
            <h2 className="text-2xl font-display font-bold text-gradient-retro">
              MASTER TERMINAL
            </h2>
            <p className="text-sm text-muted-foreground">
              SINGULARITY PROTOCOL Prompts
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Era Tabs */}
          <div className="w-64 border-r border-border bg-card overflow-y-auto">
            <div className="p-4 space-y-2">
              {eraOrder.map((eraKey) => {
                const eraData = eraConfig[eraKey];
                const isActive = activeTab === eraKey;

                return (
                  <button
                    key={eraKey}
                    onClick={() => setActiveTab(eraKey)}
                    className={`
                      w-full text-left p-3 rounded-lg transition-all
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                      }
                    `}
                  >
                    <div className="font-display font-bold text-sm">
                      {eraData.name}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {eraData.year} • {eraData.celebrity}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content - Prompt Display */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {/* Era Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className={`
                    inline-block px-3 py-1 rounded-full text-sm font-bold mb-2
                    bg-gradient-to-r ${era.gradient} text-white
                  `}>
                    {era.year}
                  </div>
                  <h3 className="text-3xl font-display font-bold text-foreground">
                    {era.name}
                  </h3>
                  <p className="text-muted-foreground">
                    Featuring: {era.celebrity}
                  </p>
                </div>
                <Button onClick={copyPrompt} variant="outline">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </div>

              {/* Terminal-style prompt display */}
              <div className="bg-foreground/5 rounded-xl p-6 font-mono text-sm leading-relaxed border border-border">
                <pre className="whitespace-pre-wrap text-foreground/90">
                  {decadePrompts[activeTab]}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
