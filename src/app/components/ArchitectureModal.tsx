import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RefreshCw, CheckCircle, Cpu, Database, Server, Zap, Layers, ArrowRight, Activity, Terminal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface ArchNode {
  id: string;
  name: string;
  type: 'input' | 'process' | 'model' | 'storage' | 'output';
  description: string;
  tech: string;
  latency?: string;
  vram?: string;
  details?: string[];
}

export interface ProjectArchitecture {
  projectId: string;
  projectTitle: string;
  pipelineDescription: string;
  nodes: ArchNode[];
  connections: { from: string; to: string; label?: string }[];
}

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  architecture?: ProjectArchitecture;
}

export function ArchitectureModal({ isOpen, onClose, architecture }: ArchitectureModalProps) {
  const { theme } = useTheme();
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(-1);

  const isLight = theme === 'light';

  useEffect(() => {
    if (architecture?.nodes && architecture.nodes.length > 0) {
      setActiveNodeId(architecture.nodes[0].id);
    }
  }, [architecture]);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Simulation execution loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating && architecture?.nodes) {
      if (simStep < architecture.nodes.length - 1) {
        timer = setTimeout(() => {
          const nextStep = simStep + 1;
          setSimStep(nextStep);
          setActiveNodeId(architecture.nodes[nextStep].id);
        }, 1100);
      } else {
        timer = setTimeout(() => {
          setIsSimulating(false);
          setSimStep(-1);
        }, 1500);
      }
    }
    return () => clearTimeout(timer);
  }, [isSimulating, simStep, architecture]);

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setSimStep(0);
    if (architecture?.nodes[0]) {
      setActiveNodeId(architecture.nodes[0].id);
    }
  };

  if (!isOpen || !architecture) return null;

  const selectedNode = architecture.nodes.find((n) => n.id === activeNodeId) || architecture.nodes[0];

  const getNodeIcon = (type: ArchNode['type']) => {
    switch (type) {
      case 'input':
        return <Terminal className="w-5 h-5 text-[#EC5B38] light:text-[#D64A28]" />;
      case 'process':
        return <Zap className="w-5 h-5 text-[#EC5B38] light:text-[#D64A28]" />;
      case 'model':
        return <Cpu className="w-5 h-5 text-[#A8A492] light:text-[#8A7B7B]" />;
      case 'storage':
        return <Database className="w-5 h-5 text-[#A8A492] light:text-[#8A7B7B]" />;
      case 'output':
        return <Server className="w-5 h-5 text-[#A8A492] light:text-[#8A7B7B]" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl bg-[#473D3D] light:bg-[#524646] text-[#FCF2E5] border border-[#EC5B38]/25 light:border-[#7A6B6B] rounded-2xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EC5B38]/15 light:border-[#5E5252] bg-[#3F3636]/80 light:bg-[#473D3D]/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#EC5B38]/10 light:bg-[#EC5B38]/10 border border-[#EC5B38]/20 text-[#EC5B38]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono tracking-wide text-[#FCF2E5]">
                  {architecture.projectTitle} <span className="text-[#EC5B38]/60 text-xs font-normal ml-2">// Architecture & Node Pipeline</span>
                </h3>
                <p className="text-xs text-[#EC5B38]/70 light:text-[#A8A492] line-clamp-1">{architecture.pipelineDescription}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleStartSimulation}
                disabled={isSimulating}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isSimulating
                    ? 'bg-[#EC5B38]/20 border border-[#EC5B38]/40 text-[#F06745] animate-pulse cursor-wait'
                    : 'bg-[#EC5B38]/15 hover:bg-[#EC5B38]/25 text-[#EC5B38] border border-[#EC5B38]/30 shadow-sm'
                }`}
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Pipeline (Step {simStep + 1}/{architecture.nodes.length})</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Simulate Pipeline</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#EC5B38]/70 hover:text-[#FCF2E5] hover:bg-white/10 transition-colors"
                aria-label="Close architecture modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Visual Node Diagram Flow */}
            <div className="bg-[#05080d] border border-[#EC5B38]/15 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(236,91,56,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(236,91,56,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

              <div className="text-xs font-mono text-[#EC5B38]/50 mb-4 flex items-center justify-between">
                <span>PIPELINE EXECUTION GRAPH</span>
                <span>Click any node to inspect telemetry</span>
              </div>

              {/* Node Cards Row */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
                {architecture.nodes.map((node, index) => {
                  const isActive = activeNodeId === node.id;
                  const isCurrentSimStep = simStep === index;
                  const isPassedSimStep = simStep > index;

                  return (
                    <div key={node.id} className="relative flex flex-col items-center">
                      {/* Node Box */}
                      <button
                        onClick={() => setActiveNodeId(node.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between h-full relative group ${
                          isActive
                            ? 'bg-[#544949] border-[#EC5B38] shadow-[0_0_20px_rgba(236,91,56,0.2)]'
                            : 'bg-[#453B3B] border-[#EC5B38]/15 hover:border-[#EC5B38]/40 hover:bg-[#4D4343]'
                        } ${isCurrentSimStep ? 'ring-2 ring-[#EC5B38] border-[#EC5B38] bg-[#524646]/30' : ''}`}
                      >
                        {/* Simulation Step Marker */}
                        {isCurrentSimStep && (
                          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#EC5B38] animate-ping" />
                        )}
                        {isPassedSimStep && (
                          <span className="absolute top-2 right-2 text-[#A8A492]">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="p-1.5 rounded-lg bg-[#EC5B38]/10 border border-[#EC5B38]/20">
                              {getNodeIcon(node.type)}
                            </div>
                            <span className="text-[10px] font-mono text-[#EC5B38]/50 uppercase tracking-widest">
                              0{index + 1}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-[#FCF2E5] group-hover:text-[#EC5B38] transition-colors line-clamp-1">
                            {node.name}
                          </h4>
                          <p className="text-[11px] text-[#EC5B38]/60 line-clamp-2 mt-1 font-sans">
                            {node.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#EC5B38]/10 flex items-center justify-between text-[10px] font-mono text-[#EC5B38]/80">
                          <span className="truncate max-w-[90px]">{node.tech}</span>
                          {node.latency && <span className="text-[#F06745]">{node.latency}</span>}
                        </div>
                      </button>

                      {/* Arrow indicator between nodes for desktop */}
                      {index < architecture.nodes.length - 1 && (
                        <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center text-[#EC5B38]/40">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Node Detailed Telemetry Box */}
            {selectedNode && (
              <div className="bg-[#433A3A] border border-[#EC5B38]/20 rounded-xl p-5 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#EC5B38]/15">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#EC5B38]/10 border border-[#EC5B38]/25">
                      {getNodeIcon(selectedNode.type)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#FCF2E5] font-mono flex items-center gap-2">
                        {selectedNode.name}
                        <span className="text-xs px-2 py-0.5 rounded bg-[#EC5B38]/15 text-[#EC5B38] font-normal uppercase">
                          {selectedNode.type}
                        </span>
                      </h4>
                      <p className="text-xs text-[#EC5B38]/70">{selectedNode.tech}</p>
                    </div>
                  </div>

                  {/* Telemetry badges */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    {selectedNode.latency && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EC5B38]/10 border border-[#EC5B38]/30 text-[#F06745]">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Latency: {selectedNode.latency}</span>
                      </div>
                    )}
                    {selectedNode.vram && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#A8A492]/10 border border-[#A8A492]/30 text-[#C4BFAF]">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>VRAM: {selectedNode.vram}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-mono text-[#EC5B38] mb-2 uppercase tracking-wider">Node Description</h5>
                    <p className="text-xs text-[#EC5B38]/80 leading-relaxed bg-[#3B3333] p-3.5 rounded-lg border border-[#EC5B38]/10">
                      {selectedNode.description}
                    </p>
                  </div>

                  {selectedNode.details && (
                    <div>
                      <h5 className="text-xs font-mono text-[#EC5B38] mb-2 uppercase tracking-wider">Internal Operations</h5>
                      <ul className="space-y-1.5 bg-[#3B3333] p-3.5 rounded-lg border border-[#EC5B38]/10 text-xs">
                        {selectedNode.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#EC5B38]/80">
                            <span className="text-[#EC5B38] mt-0.5">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
