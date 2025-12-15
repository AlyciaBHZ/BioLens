import React, { useMemo, useState } from 'react';
import {
  Activity,
  Binary,
  BookOpen,
  CheckCircle2,
  Cpu,
  Database,
  FileText,
  FolderUp,
  LineChart,
  Network,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
  Zap,
} from 'lucide-react';
import type { Role } from '../types';

type LandingPageProps = {
  onSelectRole: (role: Role) => void;
  onNavigate: (path: string) => void;
  activeTab: 'home' | 'whitepaper';
};

const Section = ({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-24 py-12">
    <div className="flex items-center gap-2 mb-3">
      <span className="w-2 h-2 bg-bio-green animate-pulse rounded-full"></span>
      <span className="font-mono text-bio-green text-xs tracking-widest uppercase">{eyebrow}</span>
    </div>
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-science-100">{title}</h2>
    {subtitle ? (
      <p className="text-sm md:text-base text-science-300 mt-2 max-w-3xl leading-relaxed">{subtitle}</p>
    ) : null}
    <div className="mt-6">{children}</div>
  </section>
);

const Card = ({
  title,
  icon,
  children,
  accent = 'blue',
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}) => {
  const accentMap: Record<string, string> = {
    blue: 'border-bio-blue/30 hover:border-bio-blue',
    green: 'border-bio-green/30 hover:border-bio-green',
    red: 'border-bio-red/30 hover:border-bio-red',
    yellow: 'border-bio-yellow/30 hover:border-bio-yellow',
    purple: 'border-bio-purple/30 hover:border-bio-purple',
  };
  return (
    <div className={`bg-science-900/60 border ${accentMap[accent]} p-5 transition-colors`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="text-science-100">{icon}</div>
        <div className="font-mono text-xs uppercase tracking-widest text-science-300">{title}</div>
      </div>
      <div className="text-sm text-science-300 leading-relaxed">{children}</div>
    </div>
  );
};

const Stat = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <div className="bg-science-900 border border-science-800 p-5">
    <div className="text-[10px] text-science-500 font-mono uppercase tracking-widest">{label}</div>
    <div className="mt-2 text-3xl font-mono font-bold text-science-100">{value}</div>
    {hint ? <div className="mt-2 text-xs text-science-400">{hint}</div> : null}
  </div>
);

const Flywheel = () => (
  <div className="bg-science-900 border border-science-800 p-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
      {[
        {
          title: 'C 端上传数据',
          desc: '体检/基因/症状与可穿戴数据统一入口',
          icon: <FileText className="w-4 h-4 text-bio-blue" />,
        },
        {
          title: '模型更精准',
          desc: '多模态解析 + 结构化健康画像',
          icon: <Cpu className="w-4 h-4 text-bio-purple" />,
        },
        {
          title: '医生报告更专业',
          desc: 'RAG 引用链路，输出可追溯证据',
          icon: <BookOpen className="w-4 h-4 text-bio-green" />,
        },
        {
          title: 'B 端带动增长',
          desc: '医生推荐 → 更多 C 端转化',
          icon: <Users className="w-4 h-4 text-bio-yellow" />,
        },
      ].map((s) => (
        <div key={s.title} className="bg-science-950 border border-science-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            {s.icon}
            <div className="font-mono text-xs text-science-100">{s.title}</div>
          </div>
          <div className="text-xs text-science-400 leading-relaxed">{s.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole, onNavigate, activeTab }) => {
  const [homeSearch, setHomeSearch] = useState('');
  const [uploadedName, setUploadedName] = useState<string | null>(null);

  const dashboardPath = useMemo(() => {
    try {
      const lastRole = window.localStorage.getItem('biolens:lastRole');
      return lastRole === 'clinician' ? '/profession' : '/patient';
    } catch {
      return '/patient';
    }
  }, []);

  const recommendations = useMemo(() => {
    const q = homeSearch.trim().toLowerCase();
    if (!q) {
      return [
        { title: '从体检单开始', desc: '上传报告，生成红绿灯式解读 + 下一步行动建议。', to: '/patient' },
        { title: '基因变异与用药风险', desc: 'PGx 提示：如 CYP2C19/SLCO1B1 等常见位点。', to: '/profession' },
        { title: '疼痛/症状追踪', desc: '把症状日志与检验趋势关联，寻找相关性。', to: '/patient' },
      ];
    }
    if (q.includes('pain') || q.includes('疼') || q.includes('migraine') || q.includes('头痛')) {
      return [
        { title: 'Pain-Tracker 推荐', desc: '建立 14 天症状追踪，自动关联睡眠/压力与检验趋势。', to: '/patient' },
        { title: 'Lab-Decoder：看维生素/炎症指标', desc: '快速标记异常与复查周期建议（教育用途）。', to: '/patient' },
      ];
    }
    if (q.includes('chol') || q.includes('ldl') || q.includes('血脂')) {
      return [
        { title: '风险画像：血脂相关', desc: '结合 LDL/HDL/Triglycerides 与家族史生成风险提示。', to: '/patient' },
        { title: 'Clinician-Copilot：SOAP 草稿', desc: '把异常点与指南摘要整理成可复制的 note（示例）。', to: '/profession' },
      ];
    }
    if (q.includes('gene') || q.includes('vcf') || q.includes('变异') || q.includes('基因')) {
      return [
        { title: 'Gene-Insight 推荐', desc: '对变异做证据链对照（ClinVar/ACMG），标记不确定性。', to: '/profession' },
        { title: 'Lab-Decoder：表型补充', desc: '用症状/检验补足基因解释的上下文。', to: '/patient' },
      ];
    }
    return [
      { title: '上传体检报告', desc: '先统一结构化，再做个性化推荐。', to: '/patient' },
      { title: '搜索相关病症', desc: '用关键词触发推荐模块（当前为 Demo）。', to: '/patient' },
    ];
  }, [homeSearch]);

  return (
    <div className="min-h-screen bg-science-950 text-science-100 font-sans selection:bg-bio-blue selection:text-black overflow-y-auto overflow-x-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(23,23,23,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(23,23,23,0.5)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-science-950 pointer-events-none"></div>

      {/* Sticky Nav */}
      <div className="sticky top-0 z-20 border-b border-science-800 bg-science-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            onClick={() => onNavigate(dashboardPath)}
            title="Go to dashboard"
          >
            <div className="w-8 h-8 border border-science-700 bg-science-900 flex items-center justify-center">
              <span className="font-mono font-bold text-bio-blue">BL</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-wide">BioLens AI</div>
              <div className="text-[10px] text-science-500 font-mono uppercase">Multimodal Bio-LLM + RAG</div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                activeTab === 'home'
                  ? 'border-bio-blue/60 text-bio-blue bg-bio-blue/10'
                  : 'border-science-800 text-science-300 hover:text-science-100 hover:border-science-700'
              }`}
            >
              HOME
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/whitepaper')}
              className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                activeTab === 'whitepaper'
                  ? 'border-bio-green/60 text-bio-green bg-bio-green/10'
                  : 'border-science-800 text-science-300 hover:text-science-100 hover:border-science-700'
              }`}
            >
              VISION / WHITEPAPER
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-20">
        {activeTab === 'home' ? (
          <>
            {/* HERO */}
            <div className="text-center space-y-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 bg-bio-green animate-pulse rounded-full"></span>
                <span className="font-mono text-bio-green text-xs tracking-widest uppercase">
                  Platform Online • Wellness Tool (Non-diagnostic)
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-science-500 uppercase leading-[0.92]">
                Decoding Life,
                <br />
                One Marker at a Time.
              </h1>
              <p className="text-base md:text-xl text-science-300 max-w-4xl mx-auto font-light leading-relaxed">
                <span className="text-science-100 font-medium">BioLens AI</span> 把体检/基因/症状数据转成可理解的行动建议，
                并为医生提供可追溯证据的决策辅助（教育用途，非诊断）。
              </p>
            </div>

            {/* Primary CTAs (more obvious, in main body) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <button
                onClick={() => onSelectRole('patient')}
                className="text-left bg-science-900 border border-bio-blue/40 hover:border-bio-blue p-6 transition-colors shadow-[0_0_0_1px_rgba(0,242,255,0.05)]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 border border-science-800 bg-science-950 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-bio-blue" />
                  </div>
                  <div className="font-mono font-bold text-science-100">
                    <span className="text-bio-blue mr-2">[</span>
                    ENTER_PATIENT_PORTAL
                    <span className="text-bio-blue ml-2">]</span>
                  </div>
                </div>
                <div className="text-sm text-science-300 leading-relaxed">
                  上传体检报告/症状日志，获取红绿灯式解读与个性化下一步建议（Demo）。
                </div>
                <div className="mt-3 text-[10px] text-science-500 font-mono uppercase">PATH: /patient</div>
              </button>

              <button
                onClick={() => onSelectRole('clinician')}
                className="text-left bg-science-900 border border-bio-green/40 hover:border-bio-green p-6 transition-colors shadow-[0_0_0_1px_rgba(0,255,157,0.05)]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 border border-science-800 bg-science-950 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-bio-green" />
                  </div>
                  <div className="font-mono font-bold text-science-100">
                    <span className="text-bio-green mr-2">[</span>
                    ENTER_CLINICIAN_WORKSPACE
                    <span className="text-bio-green ml-2">]</span>
                  </div>
                </div>
                <div className="text-sm text-science-300 leading-relaxed">
                  一键生成 SOAP + 证据链引用（示例），节省检索与文书时间。
                </div>
                <div className="mt-3 text-[10px] text-science-500 font-mono uppercase">PATH: /profession</div>
              </button>
            </div>

            {/* Personalized widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-10">
              <div className="lg:col-span-7 animate-in fade-in zoom-in-95 duration-1000 delay-200">
                <div className="border border-science-800 bg-science-900/50 backdrop-blur-sm p-6 md:p-10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,rgba(0,0,0,0.3)_3px)] bg-[size:100%_4px] pointer-events-none opacity-20"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center relative z-10">
                    {/* INPUTS */}
                    <div className="space-y-5 flex flex-col md:items-end">
                      <div className="bg-science-950 border border-science-700 p-4 w-full md:w-64 flex items-center gap-4 group hover:border-bio-blue transition-colors">
                        <Binary className="text-science-500 group-hover:text-bio-blue" />
                        <div className="text-right flex-1">
                          <div className="text-xs font-mono text-science-500 uppercase">Input_Stream_01</div>
                          <div className="text-sm font-bold text-science-100">WGS/WES Data (VCF)</div>
                        </div>
                      </div>
                      <div className="bg-science-950 border border-science-700 p-4 w-full md:w-64 flex items-center gap-4 group hover:border-bio-green transition-colors">
                        <FileText className="text-science-500 group-hover:text-bio-green" />
                        <div className="text-right flex-1">
                          <div className="text-xs font-mono text-science-500 uppercase">Input_Stream_02</div>
                          <div className="text-sm font-bold text-science-100">Clinical Reports (PDF)</div>
                        </div>
                      </div>
                      <div className="bg-science-950 border border-science-700 p-4 w-full md:w-64 flex items-center gap-4 group hover:border-bio-red transition-colors">
                        <Activity className="text-science-500 group-hover:text-bio-red" />
                        <div className="text-right flex-1">
                          <div className="text-xs font-mono text-science-500 uppercase">Input_Stream_03</div>
                          <div className="text-sm font-bold text-science-100">Symptoms & Wearables</div>
                        </div>
                      </div>
                    </div>

                    {/* CORE */}
                    <div className="flex flex-col items-center justify-center relative">
                      <div className="hidden md:block absolute left-0 top-1/2 -translate-x-full w-12 h-px bg-science-700"></div>
                      <div className="w-40 h-40 rounded-full border-2 border-science-700 flex items-center justify-center relative bg-science-950 shadow-[0_0_50px_-10px_rgba(0,242,255,0.1)]">
                        <div className="absolute inset-0 rounded-full border border-bio-blue/30 animate-ping-slow"></div>
                        <div className="text-center">
                          <Cpu className="w-12 h-12 text-bio-blue mx-auto mb-2" strokeWidth={1.5} />
                          <div className="text-xs font-mono font-bold text-bio-blue tracking-widest">BIO_CORE</div>
                          <div className="text-[10px] text-science-500 font-mono mt-1">PERSONALIZED TRIAGE</div>
                        </div>
                      </div>
                      <div className="hidden md:block absolute right-0 top-1/2 translate-x-full w-12 h-px bg-science-700"></div>
                    </div>

                    {/* OUTPUTS */}
                    <div className="space-y-5">
                      <div className="bg-science-950 border border-science-700 p-4 w-full md:w-64 flex items-center gap-4 group hover:border-bio-purple transition-colors">
                        <Network className="text-science-500 group-hover:text-bio-purple" />
                        <div>
                          <div className="text-xs font-mono text-science-500 uppercase">Output_Mod_01</div>
                          <div className="text-sm font-bold text-science-100">PGx / Variant Insight</div>
                        </div>
                      </div>
                      <div className="bg-science-950 border border-science-700 p-4 w-full md:w-64 flex items-center gap-4 group hover:border-bio-yellow transition-colors">
                        <Database className="text-science-500 group-hover:text-bio-yellow" />
                        <div>
                          <div className="text-xs font-mono text-science-500 uppercase">Output_Mod_02</div>
                          <div className="text-sm font-bold text-science-100">Action Plan</div>
                        </div>
                      </div>
                      <div className="bg-science-950 border border-science-700 p-4 w-full md:w-64 flex items-center gap-4 group hover:border-bio-green transition-colors">
                        <ShieldCheck className="text-science-500 group-hover:text-bio-green" />
                        <div>
                          <div className="text-xs font-mono text-science-500 uppercase">Output_Mod_03</div>
                          <div className="text-sm font-bold text-science-100">Evidence Links</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="bg-science-900 border border-science-800 p-6">
                  <div className="text-xs font-mono text-science-500 uppercase tracking-widest mb-2">
                    Upload your checkup report
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer bg-science-950 border border-science-800 hover:border-science-700 p-3 text-xs font-mono text-science-300 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FolderUp className="w-4 h-4 text-bio-blue" />
                        {uploadedName ? uploadedName : 'CHOOSE_FILE (PDF / Image)'}
                      </span>
                      <span className="text-[10px] text-science-600">DEMO</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          setUploadedName(f ? f.name : null);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => onNavigate('/patient')}
                      className="px-4 py-3 bg-science-100 hover:bg-white text-science-950 font-mono font-bold text-xs border border-science-100 hover:shadow-glow-blue transition-all"
                    >
                      ANALYZE
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-science-400 leading-relaxed">
                    上传后将进入患者端 Dashboard（当前为 Mock 流程）。后续可接入真实解析/LLM。
                  </div>
                </div>

                <div className="bg-science-900 border border-science-800 p-6">
                  <div className="text-xs font-mono text-science-500 uppercase tracking-widest mb-2">
                    Search symptoms / conditions
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-science-500" />
                    </div>
                    <input
                      value={homeSearch}
                      onChange={(e) => setHomeSearch(e.target.value)}
                      placeholder="e.g. migraine / LDL / 基因变异 / 疼痛..."
                      className="w-full bg-science-950 border border-science-800 text-science-100 font-mono text-sm py-3 pl-10 pr-4 focus:ring-1 focus:ring-bio-blue focus:border-bio-blue"
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    {recommendations.map((r) => (
                      <button
                        key={r.title}
                        type="button"
                        onClick={() => onNavigate(r.to)}
                        className="text-left bg-science-950 border border-science-800 hover:border-science-700 p-3 transition-colors"
                      >
                        <div className="text-sm font-semibold text-science-100">{r.title}</div>
                        <div className="mt-1 text-xs text-science-400 leading-relaxed">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-science-950 border border-l-2 border-bio-yellow p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-bio-yellow mt-0.5" />
                <div className="text-xs text-science-300 leading-relaxed">
                  <span className="text-science-100 font-bold">产品承诺：</span>每条关键结论必须可追溯引用（PubMed / ClinVar / ACMG/CPIC 等）；
                  输出以“健康教育（Wellness Tool）”方式呈现，不做诊断与处方。
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* WHITEPAPER TAB CONTENT */}
        {activeTab === 'whitepaper' ? (
          <>
            {/* EXECUTIVE SUMMARY */}
            <Section
              id="executive"
              eyebrow="Executive Summary"
              title="执行摘要（Executive Summary）"
              subtitle="BioLens AI 连接复杂医学数据与可理解的行动指南，同时为医生提供节省时间、可追溯证据的决策辅助。"
            >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              title="当前阶段 (Stage)"
              icon={<CheckCircle2 className="w-4 h-4 text-bio-green" />}
              accent="green"
            >
              B2B2C 闭环验证期：C 端引流（Lab-Decoder）+ 医生端增效（Clinician-Copilot）共同推进增长飞轮。
            </Card>
            <Card title="核心优势 (Moat)" icon={<Cpu className="w-4 h-4 text-bio-blue" />} accent="blue">
              NUS 博士团队背景；多模态解析引擎（VCF/HL7/蛋白结构/表型）；RAG 引用链路降低幻觉；边际交付成本低。
            </Card>
            <Card title="融资需求 (Ask)" icon={<LineChart className="w-4 h-4 text-bio-purple" />} accent="purple">
              寻求种子轮（Seed）用于模型微调、合规认证（HSA/FDA 沙盒路径探索）与早期市场推广。
            </Card>
          </div>
            </Section>

            {/* MARKET */}
            <Section
              id="market"
              eyebrow="Market"
              title="市场分析（Market Analysis）"
              subtitle="痛点来自信息焦虑、数据孤岛与医生工作负担；市场规模覆盖数字健康与基因组学解读。"
            >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card title="C 端痛点 (Patients)" icon={<Activity className="w-4 h-4 text-bio-red" />} accent="red">
                <ul className="list-disc pl-5 space-y-1">
                  <li>信息焦虑：体检箭头、VUS 术语让人恐慌。</li>
                  <li>求医无门：解读成本高，咨询时间极短。</li>
                  <li>数据孤岛：基因/体检/手环数据割裂，无法联动解释。</li>
                </ul>
              </Card>
              <Card title="B 端痛点 (Clinicians)" icon={<Stethoscope className="w-4 h-4 text-bio-yellow" />} accent="yellow">
                <ul className="list-disc pl-5 space-y-1">
                  <li>EHR 文档负担导致职业倦怠。</li>
                  <li>文献/指南更新快，缺少“随手可用”的证据检索与总结。</li>
                </ul>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Stat label="TAM" value=">$175B" hint="全球数字健康 + 基因组学解读市场" />
              <Stat label="SAM" value=">$20B" hint="亚洲/北美高净值健康人群 + 基层诊所" />
              <Stat label="SOM" value="~$50M" hint="初期聚焦新加坡 & 中国一线城市，3 年触达" />
            </div>
          </div>
            </Section>

            {/* PRODUCT */}
            <Section
              id="product"
              eyebrow="Product"
              title="产品：BioLens OS（模块化健康操作系统）"
              subtitle="不是单点工具，而是可扩展的模块矩阵：引流、利润、留存与护城河模块协同。"
            >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card title="核心引擎：Bio-LLM Adapter" icon={<Cpu className="w-4 h-4 text-bio-blue" />} accent="blue">
                面向 VCF（基因格式）、HL7（医疗标准）与蛋白结构数据的领域适配；输出结构化结论与可执行 next steps。
              </Card>
              <Card title="核心引擎：Evidence Engine" icon={<ShieldCheck className="w-4 h-4 text-bio-green" />} accent="green">
                每一句关键结论可追溯来源（PubMed / ClinVar / ACMG / CPIC 等），减少幻觉、提升医生端可信度。
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card title="Lab-Decoder（引流款）" icon={<FileText className="w-4 h-4 text-bio-blue" />} accent="blue">
                拍照/上传 PDF 体检单，30 秒生成“红绿灯”式通俗解读与行动建议。
              </Card>
              <Card title="Gene-Insight（利润款）" icon={<Binary className="w-4 h-4 text-bio-purple" />} accent="purple">
                深度分析变异与药物基因组学（PGx）建议，覆盖 VUS 与指南对照。
              </Card>
              <Card title="Pain-Tracker（留存款）" icon={<Activity className="w-4 h-4 text-bio-red" />} accent="red">
                慢性病/疼痛日常追踪，与检验/基因联动做个性化康复打卡。
              </Card>
              <Card title="Clinician-Copilot（护城河）" icon={<Stethoscope className="w-4 h-4 text-bio-yellow" />} accent="yellow">
                一键生成 SOAP，自动检索罕见病文献与指南，并输出可复制到 EMR 的文本。
              </Card>
            </div>
          </div>
            </Section>

            {/* BUSINESS MODEL */}
            <Section
              id="business"
              eyebrow="Business Model"
              title="商业模式（B2B2C 双边网络效应）"
              subtitle="C 端数据入口 → 模型更精准 → 医生报告更专业 → B 端带动更多 C 端。"
            >
          <div className="space-y-6">
            <Flywheel />
            <div className="bg-science-900 border border-science-800 overflow-hidden">
              <div className="px-5 py-3 border-b border-science-800 flex items-center justify-between">
                <div className="font-mono text-xs uppercase tracking-widest text-science-300">Revenue Streams</div>
                <div className="text-[10px] text-science-500 font-mono">Pricing (Proposed)</div>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-science-950 text-science-500 font-mono text-xs uppercase">
                  <tr>
                    <th className="px-5 py-2 font-normal">收入流</th>
                    <th className="px-5 py-2 font-normal">客户群体</th>
                    <th className="px-5 py-2 font-normal">定价策略</th>
                    <th className="px-5 py-2 font-normal">预期占比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-science-800">
                  <tr className="hover:bg-science-800/40 transition-colors">
                    <td className="px-5 py-3 font-mono text-bio-blue">BioLens+</td>
                    <td className="px-5 py-3 text-science-100">C 端用户</td>
                    <td className="px-5 py-3 text-science-300">$9.9/月（订阅）或 $4.99/次</td>
                    <td className="px-5 py-3 text-science-300 font-mono">40%</td>
                  </tr>
                  <tr className="hover:bg-science-800/40 transition-colors">
                    <td className="px-5 py-3 font-mono text-bio-green">BioLens Pro</td>
                    <td className="px-5 py-3 text-science-100">诊所/家庭医生/遗传咨询师</td>
                    <td className="px-5 py-3 text-science-300">$49–$99/月/医生（席位）</td>
                    <td className="px-5 py-3 text-science-300 font-mono">40%</td>
                  </tr>
                  <tr className="hover:bg-science-800/40 transition-colors">
                    <td className="px-5 py-3 font-mono text-bio-purple">Enterprise API</td>
                    <td className="px-5 py-3 text-science-100">体检中心/测序公司</td>
                    <td className="px-5 py-3 text-science-300">按次计费（API 调用费）</td>
                    <td className="px-5 py-3 text-science-300 font-mono">20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
            </Section>

            {/* GO-TO-MARKET */}
            <Section
              eyebrow="Go-To-Market"
              title="市场进入策略（Go-To-Market）"
              subtitle="先用内容驱动做 C 端规模，再用“医生专用页”实现产品驱动销售，最后走生态合作。"
            >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card title="Phase 1（Month 1-6）" icon={<Users className="w-4 h-4 text-bio-blue" />} accent="blue">
              Content-Led Growth：小红书/TikTok 打“博士解读黑话”人设；免费 MVP（Lab-Decoder）建立私域。
            </Card>
            <Card title="Phase 2（Month 7-12）" icon={<Stethoscope className="w-4 h-4 text-bio-green" />} accent="green">
              Product-Led Sales：在 C 端报告植入医生专用页；LinkedIn 冷启动 + 医学会议展示。
            </Card>
            <Card title="Phase 3（Year 2+）" icon={<Network className="w-4 h-4 text-bio-purple" />} accent="purple">
              生态合作：与第三方实验室/测序公司合作作为默认“报告解读插件”，API 规模化。
            </Card>
          </div>
            </Section>

            {/* ROADMAP */}
            <Section
              id="roadmap"
              eyebrow="Roadmap"
              title="技术路线图（Roadmap）"
              subtitle="以 MVP 验证闭环 → 种子用户增长 → 医生端 Beta → 合规沙盒与融资。"
            >
          <div className="bg-science-900 border border-science-800 p-6">
            <div className="space-y-4">
              {(
                [
                  { q: 'Q1 2026', d: '完成 MVP（Lab-Decoder + 基础 Gene-Insight），上线 Web 端。', dotClass: 'bg-bio-blue' },
                  { q: 'Q2 2026', d: '获取首批 1,000 名种子用户，跑通 C 端付费转化。', dotClass: 'bg-bio-green' },
                  { q: 'Q3 2026', d: '发布 Clinician-Copilot Beta，邀请 10 家诊所试用。', dotClass: 'bg-bio-purple' },
                  { q: 'Q4 2026', d: '启动天使轮融资，申请 HSA/FDA 监管沙盒认证。', dotClass: 'bg-bio-yellow' },
                ] as const
              ).map((x, idx) => (
                <div key={x.q} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${x.dotClass}`}></div>
                    {idx < 3 ? <div className="w-px flex-1 bg-science-800 mt-2" /> : null}
                  </div>
                  <div className="pb-2">
                    <div className="font-mono text-xs text-science-500">{x.q}</div>
                    <div className="text-sm text-science-200 leading-relaxed mt-1">{x.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
            </Section>

            {/* FINANCIAL */}
            <Section
              eyebrow="Financial"
              title="财务预测（Financial Plan）"
              subtitle="用低启动资金验证 LTV/CAC，并通过 B2B 席位费与 API 形成更稳健的现金流。"
            >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card title="启动资金" icon={<Database className="w-4 h-4 text-bio-blue" />} accent="blue">
              约 $10k–$20k（GPU 算力、API 成本、服务器），以快速迭代与合规准备为主。
            </Card>
            <Card title="单位经济模型 (C 端)" icon={<LineChart className="w-4 h-4 text-bio-green" />} accent="green">
              CAC：$5 → $15；LTV：$60（平均订阅 6 个月假设）；目标 LTV/CAC &gt; 3。
            </Card>
            <Card title="增长抓手" icon={<Zap className="w-4 h-4 text-bio-yellow" />} accent="yellow">
              免费 Lab-Decoder 引流 + 医生专用页转化 + 私域内容运营，持续提升转化率与复购。
            </Card>
          </div>
            </Section>

            {/* RISK */}
            <Section
              id="risk"
              eyebrow="Risk & Compliance"
              title="风险与对策（Risks）"
              subtitle="用合规定位与引用机制降低风险：早期强调“健康教育工具”，并构建强制引用链路。"
            >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="监管风险" icon={<ShieldCheck className="w-4 h-4 text-bio-yellow" />} accent="yellow">
              医疗建议需符合 HIPAA/GDPR 等。对策：初期严格声明为 Wellness Tool（非医疗器械），仅做解释与教育，不做诊断。
            </Card>
            <Card title="大模型幻觉" icon={<BookOpen className="w-4 h-4 text-bio-red" />} accent="red">
              对策：RAG + 强制引用（每一句关键结论必须有出处）；输出区分“证据结论 / 推断 / 不确定性”。
            </Card>
          </div>

          <div className="mt-6 bg-science-950 border border-science-800 p-4 text-xs text-science-400 leading-relaxed">
            <span className="text-science-200 font-semibold">免责声明：</span>
            BioLens AI 提供健康教育与信息整理服务，不构成医疗诊断或处方建议。任何健康决策应咨询合格医护人员。
          </div>
            </Section>

            <div className="pt-10 border-t border-science-800 text-center text-[10px] text-science-600 font-mono tracking-widest uppercase">
              BioLens AI • Decoding Life, One Marker at a Time • Evidence-Linked Output • Privacy by Design
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};


