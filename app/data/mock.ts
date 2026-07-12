export interface Model {
  id: string
  name: string
  provider: string
  type: 'security' | 'threat' | 'vulnerability' | 'compliance' | 'general' | 'code' | 'data' | 'network' | 'malware' | 'incident' | 'phishing' | 'log'
  typeName: string
  typeColor: string
  parameters: string
  description: string
  tags: string[]
  pricing: { input: string; output: string }
  pricingLevel: number
  hot: boolean
  new: boolean
  rating: number
  callCount: string
  features: string[]
  intro: string
  apiEndpoint: string
  icon: string
}

export interface App {
  id: string
  name: string
  type: 'external-link' | 'chat' | 'tool' | 'showcase'
  typeName: string
  typeIcon: string
  typeColor: string
  description: string
  detail: string
  tags: string[]
  icon: string
  hot: boolean
  new: boolean
  useCount: string
  rating: number
  features: string[]
  link?: string
}

export interface Activity {
  id: string
  title: string
  subtitle: string
  description: string
  discount: string
  discountText: string
  gradient: string
  startDate: string
  endDate: string
  tags: string[]
  hot: boolean
  new: boolean
  ctaText: string
  rules: string[]
  benefits: string[]
  icon: string
}

export interface ChargingPack {
  id: string
  type: 'pack'
  name: string
  tokens: string
  price: string
  unitPrice: string
  originalPrice?: string
  popular: boolean
  features: string[]
}

export interface Plan {
  id: string
  type: 'pack' | 'model-plan' | 'app-plan'
  targetId?: string
  name: string
  description: string
  billingCycle: 'one-time' | 'monthly' | 'annual'
  price: number
  originalPrice?: number
  includedTokens?: number
  includedCalls?: number
  features: string[]
  popular: boolean
  icon: string
  gradient?: string
  badge?: string
}

export type ModuleType = 'banner' | 'hero' | 'intro' | 'features' | 'advantages' |
  'scenarios' | 'tabs' | 'carousel' | 'cards' | 'steps' |
  'pricing' | 'integration' | 'related'

export interface TemplateModule {
  id: string
  type: ModuleType
  title?: string
  props: Record<string, any>
  visible: boolean
  order: number
  spacing: { top: 'xs' | 'sm' | 'md' | 'lg'; bottom: 'xs' | 'sm' | 'md' | 'lg' }
  background: 'white' | 'gray' | 'primary-light'
  children?: TemplateModule[]
}

export interface PageTemplate {
  id: string
  targetType: 'model' | 'app'
  targetId: string
  theme: { primaryColor?: string; bgStyle?: 'light' | 'dark' | 'gradient' }
  modules: TemplateModule[]
}

export const models: Model[] = [
  {
    id: 'qax-security-llm',
    name: '奇安信安全大模型',
    provider: '奇安信',
    type: 'security',
    typeName: '安全大模型',
    typeColor: '#7C3AED',
    parameters: '100B',
    description: '基于千亿参数的安全领域大语言模型，深度融合奇安信20年安全知识库，支持威胁分析、安全问答、报告生成等多种安全场景',
    tags: ['大语言模型', '安全分析', '威胁检测', '报告生成'],
    pricing: { input: '¥0.06/千Token', output: '¥0.12/千Token' },
    pricingLevel: 3,
    hot: true,
    new: false,
    rating: 4.9,
    callCount: '1280万+',
    features: ['千亿参数规模', '安全知识增强', '多轮对话', '代码分析', '报告生成'],
    intro: '奇安信安全大模型是面向网络安全领域的旗舰级大语言模型，基于千亿参数规模，在安全领域数据上进行了深度训练。模型具备强大的安全知识理解与推理能力，可广泛应用于安全运营中心(SOC)、威胁情报分析、漏洞评估、合规审计等核心安全场景。深度融合奇安信20年安全知识库，覆盖百万级安全事件、漏洞库与威胁情报数据。',
    apiEndpoint: '/v1/chat/completions',
    icon: 'i-lucide-brain'
  },
  {
    id: 'threat-detect-v3',
    name: '威胁检测模型 V3',
    provider: '奇安信',
    type: 'threat',
    typeName: '威胁检测',
    typeColor: '#EF4444',
    parameters: '7B',
    description: '专注高级威胁识别，支持APT攻击链分析、恶意流量检测与IOC自动提取，检测率达99.2%',
    tags: ['APT检测', '流量分析', 'IOC提取', '威胁狩猎'],
    pricing: { input: '¥0.03/千Token', output: '¥0.06/千Token' },
    pricingLevel: 2,
    hot: true,
    new: true,
    rating: 4.8,
    callCount: '860万+',
    features: ['APT攻击链还原', '恶意流量实时检测', 'IOC自动提取与关联', '威胁狩猎建议'],
    intro: '威胁检测模型V3是专为高级持续性威胁(APT)检测设计的专业模型，采用7B参数架构，在百万级威胁样本上训练。模型能够深度分析攻击链路，识别0day攻击特征，自动提取IOC指标，为安全团队提供精准的威胁情报支持。检测率达99.2%，误报率低于0.5%。',
    apiEndpoint: '/v1/threat/detect',
    icon: 'i-lucide-shield-alert'
  },
  {
    id: 'vuln-analyzer-pro',
    name: '漏洞分析专家',
    provider: '奇安信',
    type: 'vulnerability',
    typeName: '漏洞分析',
    typeColor: '#F59E0B',
    parameters: '13B',
    description: '深度漏洞分析模型，支持CVE解读、PoC生成、修复方案推荐与风险评估，覆盖OWASP Top 10全类别',
    tags: ['CVE分析', 'PoC生成', '风险评估', '修复建议'],
    pricing: { input: '¥0.02/千Token', output: '¥0.04/千Token' },
    pricingLevel: 1,
    hot: false,
    new: true,
    rating: 4.7,
    callCount: '520万+',
    features: ['CVE深度解读', 'PoC代码生成', 'CVSS评分评估', '修复方案推荐'],
    intro: '漏洞分析专家是专注于漏洞研究的专业模型，能够对CVE漏洞进行深度解读，自动生成PoC验证代码，评估漏洞风险等级，并提供针对性的修复方案。模型覆盖Web安全、系统安全、协议安全等多个漏洞领域，支持OWASP Top 10全类别漏洞分析。',
    apiEndpoint: '/v1/vuln/analyze',
    icon: 'i-lucide-bug'
  },
  {
    id: 'compliance-guard',
    name: '合规卫士',
    provider: '奇安信',
    type: 'compliance',
    typeName: '合规检查',
    typeColor: '#10B981',
    parameters: '7B',
    description: '智能合规检查模型，覆盖等保2.0、GDPR、ISO27001等主流合规框架，自动生成合规报告与整改建议',
    tags: ['等保2.0', 'GDPR', 'ISO27001', '合规审计'],
    pricing: { input: '¥0.02/千Token', output: '¥0.04/千Token' },
    pricingLevel: 1,
    hot: false,
    new: false,
    rating: 4.6,
    callCount: '380万+',
    features: ['多框架合规映射', '差距分析报告', '整改建议生成', '合规状态追踪'],
    intro: '合规卫士是面向信息安全合规领域的专业模型，内置等保2.0、GDPR、ISO27001、网络安全法等主流合规框架知识。模型能够自动进行合规差距分析，生成整改建议，并持续追踪合规状态变化。',
    apiEndpoint: '/v1/compliance/check',
    icon: 'i-lucide-clipboard-check'
  },
  {
    id: 'code-security-scan',
    name: '代码安全扫描模型',
    provider: '奇安信',
    type: 'code',
    typeName: '代码安全',
    typeColor: '#3B82F6',
    parameters: '13B',
    description: '源代码安全审计模型，支持SAST/DAST分析、安全编码建议与漏洞模式识别',
    tags: ['SAST', '代码审计', '安全编码', '漏洞模式'],
    pricing: { input: '¥0.03/千Token', output: '¥0.06/千Token' },
    pricingLevel: 2,
    hot: true,
    new: false,
    rating: 4.8,
    callCount: '720万+',
    features: ['多语言代码审计', '漏洞模式识别', '安全编码建议', '依赖风险分析'],
    intro: '代码安全扫描模型是专为源代码安全审计设计的专业模型，支持Java、Python、Go、C/C++等主流编程语言。模型能够识别SQL注入、XSS、反序列化等常见漏洞模式，并提供安全编码最佳实践建议。',
    apiEndpoint: '/v1/code/scan',
    icon: 'i-lucide-code-2'
  },
  {
    id: 'data-guard-llm',
    name: '数据安全卫士',
    provider: '奇安信',
    type: 'data',
    typeName: '数据安全',
    typeColor: '#8B5CF6',
    parameters: '3B',
    description: '数据安全治理模型，支持数据分类分级、敏感数据识别与DLP策略生成',
    tags: ['数据分类', '敏感识别', 'DLP', '隐私保护'],
    pricing: { input: '¥0.02/千Token', output: '¥0.04/千Token' },
    pricingLevel: 1,
    hot: false,
    new: false,
    rating: 4.5,
    callCount: '290万+',
    features: ['数据自动分类分级', '敏感数据识别', 'DLP策略生成', '数据流转追踪'],
    intro: '数据安全卫士是面向数据安全治理领域的专业模型，能够自动完成数据分类分级，识别个人隐私信息与商业敏感数据，生成DLP防护策略，并追踪数据流转路径，助力企业构建全面的数据安全防护体系。',
    apiEndpoint: '/v1/data/guard',
    icon: 'i-lucide-lock'
  },
  {
    id: 'malware-analyzer',
    name: '恶意软件分析模型',
    provider: '奇安信',
    type: 'malware',
    typeName: '恶意软件',
    typeColor: '#DC2626',
    parameters: '5B',
    description: '深度恶意软件分析模型，支持静态/动态分析、家族分类、行为提取，覆盖500万+恶意样本知识库',
    tags: ['恶意软件', '沙箱分析', '家族分类', 'IOC生成'],
    pricing: { input: '¥0.03/千Token', output: '¥0.06/千Token' },
    pricingLevel: 2,
    hot: false,
    new: true,
    rating: 4.8,
    callCount: '670万+',
    features: ['静态分析', '动态沙箱', '家族分类', '行为提取', 'IOC生成'],
    intro: '恶意软件分析模型是专注于恶意样本分析的专业模型，支持静态特征提取与动态沙箱行为分析，能够精准判定恶意软件家族归属，提取关键行为指标与IOC，覆盖500万+恶意样本知识库。',
    apiEndpoint: '/v1/malware/analyze',
    icon: 'i-lucide-virus'
  },
  {
    id: 'incident-response',
    name: '应急响应模型',
    provider: '奇安信',
    type: 'incident',
    typeName: '应急响应',
    typeColor: '#F97316',
    parameters: '13B',
    description: '安全事件应急响应智能辅助模型，提供事件分级、处置建议、溯源分析、恢复方案等全流程支持',
    tags: ['应急响应', '事件处置', '溯源分析', '复盘报告'],
    pricing: { input: '¥0.04/千Token', output: '¥0.08/千Token' },
    pricingLevel: 2,
    hot: false,
    new: false,
    rating: 4.7,
    callCount: '280万+',
    features: ['事件分级', '处置建议', '溯源分析', '恢复方案', '复盘报告'],
    intro: '应急响应模型是面向安全事件应急响应的专业辅助模型，提供从事件发现、分析研判、遏制处置到恢复加固的全流程智能支持。模型能够快速进行事件分级，推荐处置方案，辅助攻击溯源，并自动生成复盘报告。',
    apiEndpoint: '/v1/incident/respond',
    icon: 'i-lucide-siren'
  },
  {
    id: 'phishing-detect',
    name: '钓鱼识别模型',
    provider: '奇安信',
    type: 'phishing',
    typeName: '钓鱼检测',
    typeColor: '#EC4899',
    parameters: '1.5B',
    description: '基于多模态的钓鱼攻击识别模型，支持邮件、短信、网页等多渠道钓鱼检测，准确率99.5%',
    tags: ['钓鱼检测', '多模态', '反欺诈', 'URL检测'],
    pricing: { input: '¥0.01/千Token', output: '¥0.02/千Token' },
    pricingLevel: 1,
    hot: false,
    new: false,
    rating: 4.5,
    callCount: '340万+',
    features: ['多模态识别', 'URL检测', '内容分析', '发件人验证', '实时拦截'],
    intro: '钓鱼识别模型是基于多模态技术的钓鱼攻击识别模型，支持邮件、短信、网页等多渠道钓鱼检测。模型结合URL分析、内容语义理解与发件人验证，实现99.5%的检测准确率，可实时拦截钓鱼攻击。',
    apiEndpoint: '/v1/phishing/detect',
    icon: 'i-lucide-fish'
  },
  {
    id: 'log-analyzer',
    name: '日志智能分析模型',
    provider: '奇安信',
    type: 'log',
    typeName: '日志分析',
    typeColor: '#6366F1',
    parameters: '3B',
    description: '面向海量安全日志的智能分析模型，支持多源日志关联、异常模式识别、安全事件还原，日均处理10亿+日志',
    tags: ['日志分析', 'SIEM', '事件关联', '智能降噪'],
    pricing: { input: '¥0.02/千Token', output: '¥0.03/千Token' },
    pricingLevel: 1,
    hot: false,
    new: false,
    rating: 4.6,
    callCount: '2100万+',
    features: ['多源关联', '异常检测', '事件还原', '智能降噪', '趋势分析'],
    intro: '日志智能分析模型是面向海量安全日志的专业分析模型，支持多源日志关联分析、异常模式识别与安全事件还原。模型日均处理10亿+日志，能够有效降低告警噪音，提升安全事件发现效率。',
    apiEndpoint: '/v1/log/analyze',
    icon: 'i-lucide-file-search'
  }
]

export const apps: App[] = [
  {
    id: 'smart-soc',
    name: '智能安全运营中心',
    type: 'chat',
    typeName: '对话应用',
    typeIcon: 'i-lucide-message-square',
    typeColor: '#7C3AED',
    description: 'AI驱动的安全运营中心，集成告警聚合、威胁研判、自动化响应，将MTTR从小时级缩短至分钟级',
    detail: '智能安全运营中心将大模型能力深度融入SOC工作流，通过自然语言交互实现告警自动研判、安全事件关联分析、响应策略推荐与自动化编排。支持与主流SIEM/SOAR平台对接，大幅提升安全运营效率。将平均响应时间(MTTR)从小时级缩短至分钟级。',
    tags: ['SOC', '告警研判', '事件关联', '响应编排'],
    icon: 'i-lucide-monitor-dot',
    hot: true,
    new: false,
    useCount: '56万+',
    rating: 4.9,
    features: ['告警智能聚合', '威胁自动研判', 'SOAR自动化', '态势大屏', '协同处置']
  },
  {
    id: 'threat-intel-assistant',
    name: '威胁情报助手',
    type: 'chat',
    typeName: '对话应用',
    typeIcon: 'i-lucide-message-square',
    typeColor: '#7C3AED',
    description: '基于安全大模型的威胁情报对话助手，支持IOC查询、威胁画像、情报关联分析',
    detail: '威胁情报助手整合全球威胁情报源，通过AI对话方式提供IOC指标查询、攻击者画像分析、威胁情报关联与趋势预测。支持STIX/TAXII标准，可与威胁情报平台(TIP)无缝集成。自然语言交互即可获取专业情报分析。',
    tags: ['威胁情报', '对话', 'IOC', '攻击者画像'],
    icon: 'i-lucide-message-circle-warning',
    hot: true,
    new: true,
    useCount: '38万+',
    rating: 4.8,
    features: ['自然语言查询', 'IOC关联', '威胁画像', '情报订阅', '报告解读']
  },
  {
    id: 'vuln-scanner-tool',
    name: '漏洞扫描工具',
    type: 'tool',
    typeName: '工具应用',
    typeIcon: 'i-lucide-wrench',
    typeColor: '#F59E0B',
    description: '一键式漏洞扫描工具，支持Web应用、主机、数据库等多目标扫描，自动生成修复建议与合规报告',
    detail: '漏洞扫描工具提供一键式安全检测能力，覆盖Web应用漏洞、主机配置基线、数据库安全检查等多个维度。内置2000+漏洞检测插件，支持自定义扫描策略，自动生成专业评估报告与合规映射。',
    tags: ['漏洞扫描', '自动化', '合规', '报告生成'],
    icon: 'i-lucide-search',
    hot: false,
    new: false,
    useCount: '92万+',
    rating: 4.7,
    features: ['多目标扫描', '自动发现', '风险评级', '修复建议', '合规映射']
  },
  {
    id: 'security-knowledge-base',
    name: '安全态势感知大屏',
    type: 'showcase',
    typeName: '展示应用',
    typeIcon: 'i-lucide-layout-dashboard',
    typeColor: '#10B981',
    description: '实时安全态势可视化大屏，全球威胁地图、攻击链路追踪、资产风险热力图，一屏掌控全局安全态势',
    detail: '安全态势感知大屏提供实时安全态势可视化展示，包含全球威胁地图、攻击链路追踪、资产风险热力图、实时告警流与趋势预测。适用于安全指挥中心、攻防演练展示与安全汇报场景。',
    tags: ['态势感知', '可视化', '大屏', '实时监控'],
    icon: 'i-lucide-globe',
    hot: true,
    new: false,
    useCount: '28万+',
    rating: 4.9,
    features: ['全球威胁地图', '攻击链路追踪', '资产热力图', '实时告警', '趋势预测']
  },
  {
    id: 'code-audit-assistant',
    name: 'AI代码审计助手',
    type: 'chat',
    typeName: '对话应用',
    typeIcon: 'i-lucide-message-square',
    typeColor: '#7C3AED',
    description: '智能代码安全审计对话助手，上传代码即可获得安全分析，支持多种编程语言，精准定位安全漏洞',
    detail: 'AI代码审计助手是面向开发者的代码安全审计工具，支持Java、Python、Go、C/C++等多种编程语言。上传代码即可获得安全分析报告，精准定位SQL注入、XSS、反序列化等安全漏洞，并提供修复代码建议。',
    tags: ['代码审计', '对话', 'SAST', '安全编码'],
    icon: 'i-lucide-code-2',
    hot: false,
    new: true,
    useCount: '63万+',
    rating: 4.7,
    features: ['多语言支持', '漏洞精准定位', '修复代码生成', '安全编码建议', '合规检查']
  },
  {
    id: 'incident-playbook',
    name: '应急响应剧本',
    type: 'tool',
    typeName: '工具应用',
    typeIcon: 'i-lucide-wrench',
    typeColor: '#F59E0B',
    description: '预置50+应急响应剧本，覆盖勒索软件、数据泄露、DDoS等常见场景，一键启动标准化处置流程',
    detail: '应急响应剧本工具预置50+标准化应急响应剧本，覆盖勒索软件、数据泄露、DDoS攻击、内部威胁等常见安全场景。一键启动处置流程，步骤引导操作，自动取证保全，并生成事件复盘报告。',
    tags: ['应急响应', '剧本', '自动化', '标准化'],
    icon: 'i-lucide-book-open',
    hot: false,
    new: false,
    useCount: '47万+',
    rating: 4.5,
    features: ['50+预置剧本', '一键启动', '步骤引导', '自动取证', '报告生成']
  },
  {
    id: 'zero-trust-gateway',
    name: '零信任网关',
    type: 'external-link',
    typeName: '链接应用',
    typeIcon: 'i-lucide-external-link',
    typeColor: '#3B82F6',
    description: 'AI增强的零信任安全网关，持续身份验证、微隔离、动态访问控制，保护混合办公环境',
    detail: '零信任安全网关结合AI行为分析能力，实现持续身份验证、微隔离策略与动态访问控制。支持混合办公环境下的安全访问，保护企业核心资产。提供SaaS与私有化部署两种模式。',
    tags: ['零信任', '访问控制', '微隔离', '行为分析'],
    icon: 'i-lucide-fingerprint',
    hot: false,
    new: false,
    useCount: '32万+',
    rating: 4.6,
    features: ['持续认证', '微隔离', '动态授权', '行为分析', '风险自适应'],
    link: 'https://zerotrust.qianxin.com'
  },
  {
    id: 'cti-platform',
    name: '威胁情报平台',
    type: 'external-link',
    typeName: '链接应用',
    typeIcon: 'i-lucide-external-link',
    typeColor: '#3B82F6',
    description: '企业级威胁情报管理平台，多源情报聚合、自动化关联分析、情报共享与协同，构建主动防御体系',
    detail: '威胁情报平台是企业级威胁情报管理平台整合全球多源威胁情报，提供自动化关联分析、情报共享与协同能力。支持STIX/TAXII标准，内置威胁评分引擎，助力企业构建主动防御体系。',
    tags: ['威胁情报', '平台', '协同', 'STIX/TAXII'],
    icon: 'i-lucide-radar',
    hot: true,
    new: false,
    useCount: '28万+',
    rating: 4.8,
    features: ['多源聚合', '自动关联', '情报共享', 'STIX/TAXII', '威胁评分'],
    link: 'https://tip.qianxin.com'
  }
]

export const activities: Activity[] = [
  {
    id: 'summer-security-carnival',
    title: '夏季安全嘉年华',
    subtitle: 'AI安全能力全面升级',
    description: '夏季安全嘉年华重磅来袭！奇安信AI开放平台推出限时优惠活动，安全大模型、威胁检测模型等核心能力全面降价，更有新用户专享礼包等你来领。',
    discount: '5折',
    discountText: '限时5折',
    gradient: 'from-primary-700 via-primary-600 to-accent-500',
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    tags: ['限时优惠', '新用户专享', '模型降价'],
    hot: true,
    new: true,
    ctaText: '立即参与',
    rules: ['活动时间：2026年7月1日-8月31日', '新用户注册即送1000万Token体验额度', '安全大模型调用5折优惠', '活动期间充值满赠额外Token'],
    benefits: ['安全大模型5折优惠', '新用户1000万Token免费额度', '充值满1000元赠200万Token', '推荐好友双方各得500万Token'],
    icon: 'i-lucide-gift'
  },
  {
    id: 'enterprise-launch-promo',
    title: '企业版首发优惠',
    subtitle: '企业级AI安全能力一站式接入',
    description: '奇安信AI开放平台企业版正式发布！提供专属模型实例、SLA保障、私有化部署灵活、合规无忧。首发期间享受8折优惠，更有专属技术支持团队1对1服务。',
    discount: '8折',
    discountText: '首发8折',
    gradient: 'from-deep-800 via-primary-800 to-primary-600',
    startDate: '2026-06-15',
    endDate: '2026-09-15',
    tags: ['企业版', '首发优惠', '专属支持'],
    hot: true,
    new: false,
    ctaText: '了解详情',
    rules: ['企业版首发优惠期：2026年6月15日-9月15日', '首发期间企业版套餐8折优惠', '签约即送专属技术支持', '年付方案额外赠送2个月'],
    benefits: ['专属模型实例', '99.9% SLA保障', '私有化部署选项', '1对1技术支持', '年付赠2个月', '合规审计报告'],
    icon: 'i-lucide-building-2'
  },
  {
    id: 'threat-model-free-trial',
    title: '威胁检测模型免费体验',
    subtitle: '零成本体验APT检测能力',
    description: '限时开放威胁检测模型V3免费体验！无需充值即可使用APT攻击链分析、恶意流量检测等核心能力，每日赠送1000次免费调用额度。',
    discount: '免费',
    discountText: '限时免费',
    gradient: 'from-red-700 via-red-600 to-primary-500',
    startDate: '2026-07-10',
    endDate: '2026-07-31',
    tags: ['免费体验', '威胁检测', '每日赠送'],
    hot: true,
    new: true,
    ctaText: '立即体验',
    rules: ['活动时间：2026年7月10日-7月31日', '每日赠送1000次免费调用', '单次调用Token上限4096', '活动期间不累计未使用额度'],
    benefits: ['每日1000次免费调用', 'APT攻击链分析', '恶意流量检测', 'IOC自动提取', '零成本体验', '即开即用'],
    icon: 'i-lucide-shield-check'
  },
  {
    id: 'api-integration-challenge',
    title: 'API集成挑战赛',
    subtitle: '用AI安全API构建创新应用',
    description: '参与奇安信AI开放平台API集成挑战赛，使用平台API构建创新安全应用，赢取丰厚奖金与Token奖励！优秀作品将获得平台推荐与商业化支持。',
    discount: '¥10万',
    discountText: '奖金池',
    gradient: 'from-accent-700 via-accent-600 to-primary-500',
    startDate: '2026-07-15',
    endDate: '2026-10-15',
    tags: ['开发者大赛', '奖金', 'API创新'],
    hot: false,
    new: true,
    ctaText: '报名参赛',
    rules: ['报名截止：2026年8月15日', '作品提交截止：2026年9月30日', '评审期：2026年10月1日-15日', '需使用奇安信AI开放平台至少1个API'],
    benefits: ['一等奖5万元', '二等奖3万元', '三等奖2万元', '优秀作品平台推荐', '商业化支持', '技术导师指导'],
    icon: 'i-lucide-trophy'
  }
]

export const chargingPacks: ChargingPack[] = [
  {
    id: 'pack-starter',
    type: 'pack' as const,
    name: '体验包',
    tokens: '100万Token',
    price: '¥99',
    unitPrice: '¥0.099/千Token',
    popular: false,
    features: ['基础模型调用', '标准响应速度', '社区技术支持']
  },
  {
    id: 'pack-pro',
    type: 'pack' as const,
    name: '专业包',
    tokens: '500万Token',
    price: '¥399',
    unitPrice: '¥0.080/千Token',
    originalPrice: '¥495',
    popular: true,
    features: ['全模型调用', '优先响应速度', '工单技术支持', 'API调用统计']
  },
  {
    id: 'pack-enterprise',
    type: 'pack' as const,
    name: '企业包',
    tokens: '2000万Token',
    price: '¥1,499',
    unitPrice: '¥0.075/千Token',
    originalPrice: '¥1,980',
    popular: false,
    features: ['全模型调用', '最高响应速度', '1对1技术支持', 'API调用统计', '专属模型实例', 'SLA保障']
  },
  {
    id: 'pack-unlimited',
    type: 'pack' as const,
    name: '无限包',
    tokens: '无限Token',
    price: '¥4,999/月',
    unitPrice: '不限',
    popular: false,
    features: ['全模型无限调用', '最高响应速度', '专属技术团队', '高级API统计', '专属模型实例', '99.9% SLA', '私有化部署选项']
  }
]

export const modelPlans: Plan[] = [
  { id: 'mp-security-pro', type: 'model-plan', targetId: 'qax-security-llm', name: '安全大模型专业版', description: '包含200万Token/月，优先响应速度', billingCycle: 'monthly', price: 999, includedTokens: 2000000, features: ['200万Token/月', '优先响应速度', '1对1技术支持'], popular: true, icon: 'i-lucide-brain', gradient: 'from-primary-600 to-primary-400' },
  { id: 'mp-security-annual', type: 'model-plan', targetId: 'qax-security-llm', name: '安全大模型年度版', description: '年付享8折优惠', billingCycle: 'annual', price: 9590, originalPrice: 11988, includedTokens: 24000000, features: ['200万Token/月', '优先响应速度', '1对1技术支持', '专属模型实例'], popular: false, icon: 'i-lucide-brain' },
  { id: 'mp-threat-pro', type: 'model-plan', targetId: 'threat-detect-v3', name: '威胁检测专业版', description: '100万Token/月+实时威胁推送', billingCycle: 'monthly', price: 599, includedTokens: 1000000, features: ['100万Token/月', '实时威胁推送', '优先响应'], popular: false, icon: 'i-lucide-shield-alert' },
  { id: 'mp-code-pro', type: 'model-plan', targetId: 'code-security-scan', name: '代码安全扫描专业版', description: '150万Token/月+CI/CD集成', billingCycle: 'monthly', price: 399, includedTokens: 1500000, features: ['150万Token/月', 'CI/CD集成', '漏洞报告导出'], popular: false, icon: 'i-lucide-code-2' }
]

export const appPlans: Plan[] = [
  { id: 'ap-threat-assistant', type: 'app-plan', targetId: 'app-threat-assistant', name: '威胁检测助手专业版', description: '5000次调用/月+7天数据留存', billingCycle: 'monthly', price: 299, includedCalls: 5000, features: ['5000次调用/月', '7天数据留存', '实时告警'], popular: true, icon: 'i-lucide-radar', gradient: 'from-red-500 to-amber-500' },
  { id: 'ap-code-scan', type: 'app-plan', targetId: 'app-code-scan', name: '代码安全扫描专业版', description: '3000次扫描/月+CI/CD集成', billingCycle: 'monthly', price: 199, includedCalls: 3000, features: ['3000次扫描/月', 'CI/CD集成', '漏洞报告导出'], popular: false, icon: 'i-lucide-code-2' },
  { id: 'ap-compliance', type: 'app-plan', targetId: 'app-compliance', name: '合规审计助手专业版', description: '2000次审计/月+合规报告', billingCycle: 'monthly', price: 249, includedCalls: 2000, features: ['2000次审计/月', '合规报告生成', '多标准支持'], popular: false, icon: 'i-lucide-scale' }
]

export const modelTypes = [
  { value: 'all', label: '全部模型' },
  { value: 'security', label: '安全大模型' },
  { value: 'threat', label: '威胁检测' },
  { value: 'vulnerability', label: '漏洞分析' },
  { value: 'compliance', label: '合规检查' },
  { value: 'code', label: '代码安全' },
  { value: 'data', label: '数据安全' },
  { value: 'malware', label: '恶意软件' },
  { value: 'incident', label: '应急响应' },
  { value: 'phishing', label: '钓鱼检测' },
  { value: 'log', label: '日志分析' },
  { value: 'network', label: '网络安全' },
  { value: 'general', label: '通用模型' }
]

export const appTypes = [
  { value: 'all', label: '全部应用' },
  { value: 'chat', label: '对话应用' },
  { value: 'tool', label: '工具应用' },
  { value: 'external-link', label: '链接应用' },
  { value: 'showcase', label: '展示应用' }
]

export interface Organization {
  id: string
  name: string
  industry: string
  scale: string
  verified: boolean
  createdAt: string
  memberCount: number
  activeKeyCount: number
  monthlyCost: number
  monthlyCalls: number
  packBalance: number
  packTotal: number
  contactName: string
  contactEmail: string
}

export interface Member {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'developer' | 'finance' | 'readonly'
  roleLabel: string
  keyCount: number
  monthlyTokens: number
  monthlyCost: number
  status: 'active' | 'pending' | 'disabled'
  joinedAt: string
}

export interface BillingRecord {
  id: string
  month: string
  amount: number
  tokens: number
  status: 'paid' | 'pending'
  items: { name: string; amount: number; tokens: number }[]
}

export interface CallLog {
  id: string
  timestamp: string
  memberName: string
  memberId: string
  model: string
  modelName: string
  apiKey: string
  status: number
  latency: number
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  errorMessage?: string
  requestId: string
}

export interface MonitorMetrics {
  todayCalls: number
  realtimeQPS: number
  errorRate: number
  avgLatency: number
  realtimeSeries: { time: string; calls: number; errors: number }[]
  modelDistribution: { name: string; calls: number; color: string }[]
  memberRanking: { name: string; calls: number; tokens: number }[]
}

export interface AdminEnterprise {
  id: string
  name: string
  industry: string
  scale: string
  memberCount: number
  monthlyCost: number
  monthlyCalls: number
  monthlyTokens: number
  packBalance: number
  verified: boolean
  createdAt: string
  contactName: string
  contactEmail: string
  status: 'active' | 'pending' | 'disabled'
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  avatar: string
  isEnterprise: boolean
  organizationId: string | null
  role: 'admin' | 'developer' | 'finance' | 'readonly' | null
}

export const currentUser: CurrentUser = {
  id: 'user-zhangming',
  name: '张明',
  email: 'zhangming@qianxin.com',
  avatar: '',
  isEnterprise: true,
  organizationId: 'org-qianxin-security',
  role: 'admin'
}

export const organization: Organization = {
  id: 'org-qianxin-security',
  name: '奇安信安全团队',
  industry: '网络安全',
  scale: '200-500人',
  verified: true,
  createdAt: '2025-08-15',
  memberCount: 6,
  activeKeyCount: 12,
  monthlyCost: 12860,
  monthlyCalls: 47200,
  packBalance: 18500000,
  packTotal: 50000000,
  contactName: '张明',
  contactEmail: 'zhangming@qianxin.com'
}

export const members: Member[] = [
  { id: 'm1', name: '张明', email: 'zhangming@qianxin.com', avatar: '', role: 'admin', roleLabel: '管理员', keyCount: 3, monthlyTokens: 5200000, monthlyCost: 4780, status: 'active', joinedAt: '2025-08-15' },
  { id: 'm2', name: '李芳', email: 'lifang@qianxin.com', avatar: '', role: 'developer', roleLabel: '开发者', keyCount: 2, monthlyTokens: 3800000, monthlyCost: 3240, status: 'active', joinedAt: '2025-09-01' },
  { id: 'm3', name: '王磊', email: 'wanglei@qianxin.com', avatar: '', role: 'developer', roleLabel: '开发者', keyCount: 2, monthlyTokens: 2900000, monthlyCost: 2580, status: 'active', joinedAt: '2025-10-12' },
  { id: 'm4', name: '陈静', email: 'chenjing@qianxin.com', avatar: '', role: 'finance', roleLabel: '财务', keyCount: 0, monthlyTokens: 0, monthlyCost: 0, status: 'active', joinedAt: '2025-11-03' },
  { id: 'm5', name: '赵伟', email: 'zhaowei@qianxin.com', avatar: '', role: 'readonly', roleLabel: '只读', keyCount: 1, monthlyTokens: 420000, monthlyCost: 380, status: 'active', joinedAt: '2026-01-20' },
  { id: 'm6', name: '孙丽', email: 'sunli@qianxin.com', avatar: '', role: 'developer', roleLabel: '开发者', keyCount: 1, monthlyTokens: 1680000, monthlyCost: 1880, status: 'pending', joinedAt: '2026-07-05' }
]

export const billingRecords: BillingRecord[] = [
  { id: 'bill-202607', month: '2026年7月', amount: 12860, tokens: 18500000, status: 'pending', items: [{ name: '安全大模型', amount: 5780, tokens: 8200000 }, { name: '威胁检测模型', amount: 3240, tokens: 4800000 }, { name: '代码安全扫描', amount: 2580, tokens: 3500000 }, { name: '其他模型', amount: 1260, tokens: 2000000 }] },
  { id: 'bill-202606', month: '2026年6月', amount: 11240, tokens: 16200000, status: 'paid', items: [{ name: '安全大模型', amount: 5120, tokens: 7200000 }, { name: '威胁检测模型', amount: 2860, tokens: 4200000 }, { name: '漏洞分析专家', amount: 1980, tokens: 2800000 }, { name: '其他模型', amount: 1280, tokens: 2000000 }] },
  { id: 'bill-202605', month: '2026年5月', amount: 9860, tokens: 14200000, status: 'paid', items: [{ name: '安全大模型', amount: 4560, tokens: 6400000 }, { name: '威胁检测模型', amount: 2480, tokens: 3600000 }, { name: '代码安全扫描', amount: 1860, tokens: 2600000 }, { name: '其他模型', amount: 960, tokens: 1600000 }] },
  { id: 'bill-202604', month: '2026年4月', amount: 8520, tokens: 12300000, status: 'paid', items: [{ name: '安全大模型', amount: 3980, tokens: 5600000 }, { name: '威胁检测模型', amount: 2240, tokens: 3200000 }, { name: '其他模型', amount: 2300, tokens: 3500000 }] },
  { id: 'bill-202603', month: '2026年3月', amount: 7680, tokens: 11000000, status: 'paid', items: [{ name: '安全大模型', amount: 3560, tokens: 5000000 }, { name: '威胁检测模型', amount: 2120, tokens: 3000000 }, { name: '其他模型', amount: 2000, tokens: 3000000 }] },
  { id: 'bill-202602', month: '2026年2月', amount: 6240, tokens: 9000000, status: 'paid', items: [{ name: '安全大模型', amount: 2980, tokens: 4200000 }, { name: '其他模型', amount: 3260, tokens: 4800000 }] }
]

export const callLogs: CallLog[] = [
  { id: 'cl-001', timestamp: '2026-07-12 14:32:15', memberName: '张明', memberId: 'm1', model: 'qax-security-llm', modelName: '奇安信安全大模型', apiKey: 'sk-qax-***3a7f', status: 200, latency: 156, promptTokens: 2450, completionTokens: 1820, totalTokens: 4270, cost: 0.3624, requestId: 'req-a1b2c3d4e5' },
  { id: 'cl-002', timestamp: '2026-07-12 14:30:42', memberName: '李芳', memberId: 'm2', model: 'threat-detect-v3', modelName: '威胁检测模型 V3', apiKey: 'sk-qax-***8b2c', status: 200, latency: 89, promptTokens: 1200, completionTokens: 680, totalTokens: 1880, cost: 0.0744, requestId: 'req-f6g7h8i9j0' },
  { id: 'cl-003', timestamp: '2026-07-12 14:28:17', memberName: '王磊', memberId: 'm3', model: 'code-security-scan', modelName: '代码安全扫描模型', apiKey: 'sk-qax-***5d1e', status: 200, latency: 203, promptTokens: 3800, completionTokens: 2400, totalTokens: 6200, cost: 0.258, requestId: 'req-k1l2m3n4o5' },
  { id: 'cl-004', timestamp: '2026-07-12 14:25:33', memberName: '陈静', memberId: 'm4', model: 'vuln-analyzer-pro', modelName: '漏洞分析专家', apiKey: 'sk-qax-***9f3a', status: 200, latency: 134, promptTokens: 1800, completionTokens: 1200, totalTokens: 3000, cost: 0.084, requestId: 'req-p6q7r8s9t0' },
  { id: 'cl-005', timestamp: '2026-07-12 14:22:08', memberName: '赵伟', memberId: 'm5', model: 'compliance-guard', modelName: '合规卫士', apiKey: 'sk-qax-***2c8b', status: 200, latency: 98, promptTokens: 950, completionTokens: 620, totalTokens: 1570, cost: 0.0438, requestId: 'req-u1v2w3x4y5' },
  { id: 'cl-006', timestamp: '2026-07-12 14:18:45', memberName: '孙丽', memberId: 'm6', model: 'log-analyzer', modelName: '日志智能分析模型', apiKey: 'sk-qax-***7e4d', status: 200, latency: 112, promptTokens: 3200, completionTokens: 1800, totalTokens: 5000, cost: 0.118, requestId: 'req-z6a7b8c9d0' },
  { id: 'cl-007', timestamp: '2026-07-12 14:15:22', memberName: '张明', memberId: 'm1', model: 'threat-detect-v3', modelName: '威胁检测模型 V3', apiKey: 'sk-qax-***3a7f', status: 200, latency: 76, promptTokens: 800, completionTokens: 450, totalTokens: 1250, cost: 0.051, requestId: 'req-e1f2g3h4i5' },
  { id: 'cl-008', timestamp: '2026-07-12 14:12:37', memberName: '李芳', memberId: 'm2', model: 'qax-security-llm', modelName: '奇安信安全大模型', apiKey: 'sk-qax-***8b2c', status: 200, latency: 189, promptTokens: 3100, completionTokens: 2200, totalTokens: 5300, cost: 0.438, requestId: 'req-j6k7l8m9n0' },
  { id: 'cl-009', timestamp: '2026-07-12 14:09:15', memberName: '王磊', memberId: 'm3', model: 'malware-analyzer', modelName: '恶意软件分析模型', apiKey: 'sk-qax-***5d1e', status: 200, latency: 145, promptTokens: 2100, completionTokens: 1500, totalTokens: 3600, cost: 0.153, requestId: 'req-o1p2q3r4s5' },
  { id: 'cl-010', timestamp: '2026-07-12 14:05:48', memberName: '陈静', memberId: 'm4', model: 'incident-response', modelName: '应急响应模型', apiKey: 'sk-qax-***9f3a', status: 200, latency: 167, promptTokens: 2800, completionTokens: 1900, totalTokens: 4700, cost: 0.26, requestId: 'req-t6u7v8w9x0' },
  { id: 'cl-011', timestamp: '2026-07-12 14:02:33', memberName: '赵伟', memberId: 'm5', model: 'phishing-detect', modelName: '钓鱼识别模型', apiKey: 'sk-qax-***2c8b', status: 200, latency: 54, promptTokens: 600, completionTokens: 320, totalTokens: 920, cost: 0.0124, requestId: 'req-y1z2a3b4c5' },
  { id: 'cl-012', timestamp: '2026-07-12 13:58:19', memberName: '孙丽', memberId: 'm6', model: 'data-guard-llm', modelName: '数据安全卫士', apiKey: 'sk-qax-***7e4d', status: 200, latency: 88, promptTokens: 1400, completionTokens: 780, totalTokens: 2180, cost: 0.0604, requestId: 'req-d6e7f8g9h0' },
  { id: 'cl-013', timestamp: '2026-07-12 13:55:02', memberName: '张明', memberId: 'm1', model: 'code-security-scan', modelName: '代码安全扫描模型', apiKey: 'sk-qax-***3a7f', status: 200, latency: 234, promptTokens: 4500, completionTokens: 3100, totalTokens: 7600, cost: 0.321, requestId: 'req-i1j2k3l4m5' },
  { id: 'cl-014', timestamp: '2026-07-12 13:51:47', memberName: '李芳', memberId: 'm2', model: 'vuln-analyzer-pro', modelName: '漏洞分析专家', apiKey: 'sk-qax-***8b2c', status: 200, latency: 121, promptTokens: 1600, completionTokens: 980, totalTokens: 2580, cost: 0.0724, requestId: 'req-n6o7p8q9r0' },
  { id: 'cl-015', timestamp: '2026-07-12 13:48:22', memberName: '王磊', memberId: 'm3', model: 'qax-security-llm', modelName: '奇安信安全大模型', apiKey: 'sk-qax-***5d1e', status: 200, latency: 178, promptTokens: 2900, completionTokens: 2100, totalTokens: 5000, cost: 0.414, requestId: 'req-s1t2u3v4w5' },
  { id: 'cl-016', timestamp: '2026-07-12 13:44:58', memberName: '陈静', memberId: 'm4', model: 'log-analyzer', modelName: '日志智能分析模型', apiKey: 'sk-qax-***9f3a', status: 200, latency: 95, promptTokens: 1800, completionTokens: 960, totalTokens: 2760, cost: 0.0648, requestId: 'req-x6y7z8a9b0' },
  { id: 'cl-017', timestamp: '2026-07-12 13:41:33', memberName: '赵伟', memberId: 'm5', model: 'threat-detect-v3', modelName: '威胁检测模型 V3', apiKey: 'sk-qax-***2c8b', status: 200, latency: 82, promptTokens: 1100, completionTokens: 580, totalTokens: 1680, cost: 0.0666, requestId: 'req-c1d2e3f4g5' },
  { id: 'cl-018', timestamp: '2026-07-12 13:38:15', memberName: '孙丽', memberId: 'm6', model: 'compliance-guard', modelName: '合规卫士', apiKey: 'sk-qax-***7e4d', status: 200, latency: 103, promptTokens: 1300, completionTokens: 720, totalTokens: 2020, cost: 0.0564, requestId: 'req-h6i7j8k9l0' },
  { id: 'cl-019', timestamp: '2026-07-12 13:34:42', memberName: '张明', memberId: 'm1', model: 'incident-response', modelName: '应急响应模型', apiKey: 'sk-qax-***3a7f', status: 200, latency: 192, promptTokens: 3400, completionTokens: 2300, totalTokens: 5700, cost: 0.316, requestId: 'req-m1n2o3p4q5' },
  { id: 'cl-020', timestamp: '2026-07-12 13:31:18', memberName: '李芳', memberId: 'm2', model: 'malware-analyzer', modelName: '恶意软件分析模型', apiKey: 'sk-qax-***8b2c', status: 200, latency: 138, promptTokens: 2000, completionTokens: 1400, totalTokens: 3400, cost: 0.144, requestId: 'req-r6s7t8u9v0' },
  { id: 'cl-021', timestamp: '2026-07-12 13:27:55', memberName: '王磊', memberId: 'm3', model: 'phishing-detect', modelName: '钓鱼识别模型', apiKey: 'sk-qax-***5d1e', status: 200, latency: 62, promptTokens: 700, completionTokens: 380, totalTokens: 1080, cost: 0.0146, requestId: 'req-w1x2y3z4a5' },
  { id: 'cl-022', timestamp: '2026-07-12 13:24:30', memberName: '陈静', memberId: 'm4', model: 'data-guard-llm', modelName: '数据安全卫士', apiKey: 'sk-qax-***9f3a', status: 200, latency: 91, promptTokens: 1500, completionTokens: 840, totalTokens: 2340, cost: 0.0648, requestId: 'req-b6c7d8e9f0' },
  { id: 'cl-023', timestamp: '2026-07-12 13:21:07', memberName: '赵伟', memberId: 'm5', model: 'qax-security-llm', modelName: '奇安信安全大模型', apiKey: 'sk-qax-***2c8b', status: 200, latency: 165, promptTokens: 2600, completionTokens: 1800, totalTokens: 4400, cost: 0.372, requestId: 'req-g1h2i3j4k5' },
  { id: 'cl-024', timestamp: '2026-07-12 13:17:44', memberName: '孙丽', memberId: 'm6', model: 'code-security-scan', modelName: '代码安全扫描模型', apiKey: 'sk-qax-***7e4d', status: 200, latency: 218, promptTokens: 4200, completionTokens: 2800, totalTokens: 7000, cost: 0.294, requestId: 'req-l6m7n8o9p0' },
  { id: 'cl-025', timestamp: '2026-07-12 13:14:22', memberName: '张明', memberId: 'm1', model: 'log-analyzer', modelName: '日志智能分析模型', apiKey: 'sk-qax-***3a7f', status: 200, latency: 108, promptTokens: 2800, completionTokens: 1600, totalTokens: 4400, cost: 0.104, requestId: 'req-q1r2s3t4u5' },
  { id: 'cl-026', timestamp: '2026-07-12 13:10:58', memberName: '李芳', memberId: 'm2', model: 'incident-response', modelName: '应急响应模型', apiKey: 'sk-qax-***8b2c', status: 200, latency: 175, promptTokens: 3000, completionTokens: 2000, totalTokens: 5000, cost: 0.28, requestId: 'req-v6w7x8y9z0' },
  { id: 'cl-027', timestamp: '2026-07-12 13:07:33', memberName: '王磊', memberId: 'm3', model: 'compliance-guard', modelName: '合规卫士', apiKey: 'sk-qax-***5d1e', status: 200, latency: 94, promptTokens: 1100, completionTokens: 640, totalTokens: 1740, cost: 0.0486, requestId: 'req-a1b2c3d4e6' },
  { id: 'cl-028', timestamp: '2026-07-12 13:04:10', memberName: '陈静', memberId: 'm4', model: 'qax-security-llm', modelName: '奇安信安全大模型', apiKey: 'sk-qax-***9f3a', status: 200, latency: 152, promptTokens: 2300, completionTokens: 1600, totalTokens: 3900, cost: 0.33, requestId: 'req-f7g8h9i0j1' },
  { id: 'cl-029', timestamp: '2026-07-12 13:00:47', memberName: '赵伟', memberId: 'm5', model: 'data-guard-llm', modelName: '数据安全卫士', apiKey: 'sk-qax-***2c8b', status: 200, latency: 86, promptTokens: 1200, completionTokens: 680, totalTokens: 1880, cost: 0.052, requestId: 'req-k2l3m4n5o6' },
  { id: 'cl-030', timestamp: '2026-07-12 12:57:22', memberName: '孙丽', memberId: 'm6', model: 'vuln-analyzer-pro', modelName: '漏洞分析专家', apiKey: 'sk-qax-***7e4d', status: 200, latency: 128, promptTokens: 1700, completionTokens: 1100, totalTokens: 2800, cost: 0.078, requestId: 'req-p7q8r9s0t1' },
  { id: 'cl-031', timestamp: '2026-07-12 12:53:58', memberName: '张明', memberId: 'm1', model: 'malware-analyzer', modelName: '恶意软件分析模型', apiKey: 'sk-qax-***3a7f', status: 200, latency: 142, promptTokens: 2200, completionTokens: 1500, totalTokens: 3700, cost: 0.156, requestId: 'req-u2v3w4x5y6' },
  { id: 'cl-032', timestamp: '2026-07-12 12:50:33', memberName: '李芳', memberId: 'm2', model: 'phishing-detect', modelName: '钓鱼识别模型', apiKey: 'sk-qax-***8b2c', status: 200, latency: 58, promptTokens: 650, completionTokens: 340, totalTokens: 990, cost: 0.0133, requestId: 'req-z7a8b9c0d1' },
  { id: 'cl-033', timestamp: '2026-07-12 12:47:10', memberName: '王磊', memberId: 'm3', model: 'threat-detect-v3', modelName: '威胁检测模型 V3', apiKey: 'sk-qax-***5d1e', status: 200, latency: 79, promptTokens: 900, completionTokens: 520, totalTokens: 1420, cost: 0.0564, requestId: 'req-e2f3g4h5i6' },
  { id: 'cl-034', timestamp: '2026-07-12 12:43:45', memberName: '陈静', memberId: 'm4', model: 'code-security-scan', modelName: '代码安全扫描模型', apiKey: 'sk-qax-***9f3a', status: 200, latency: 196, promptTokens: 3600, completionTokens: 2400, totalTokens: 6000, cost: 0.252, requestId: 'req-j7k8l9m0n1' },
  { id: 'cl-035', timestamp: '2026-07-12 12:40:20', memberName: '赵伟', memberId: 'm5', model: 'incident-response', modelName: '应急响应模型', apiKey: 'sk-qax-***2c8b', status: 200, latency: 183, promptTokens: 3200, completionTokens: 2100, totalTokens: 5300, cost: 0.296, requestId: 'req-o2p3q4r5s6' },
  { id: 'cl-036', timestamp: '2026-07-12 12:36:55', memberName: '孙丽', memberId: 'm6', model: 'qax-security-llm', modelName: '奇安信安全大模型', apiKey: 'sk-qax-***7e4d', status: 200, latency: 171, promptTokens: 2700, completionTokens: 1900, totalTokens: 4600, cost: 0.39, requestId: 'req-t7u8v9w0x1' },
  { id: 'cl-037', timestamp: '2026-07-12 12:33:30', memberName: '张明', memberId: 'm1', model: 'vuln-analyzer-pro', modelName: '漏洞分析专家', apiKey: 'sk-qax-***3a7f', status: 200, latency: 115, promptTokens: 1500, completionTokens: 920, totalTokens: 2420, cost: 0.0668, requestId: 'req-y2z3a4b5c6' },
  { id: 'cl-038', timestamp: '2026-07-12 12:30:05', memberName: '李芳', memberId: 'm2', model: 'log-analyzer', modelName: '日志智能分析模型', apiKey: 'sk-qax-***8b2c', status: 200, latency: 101, promptTokens: 2400, completionTokens: 1300, totalTokens: 3700, cost: 0.087, requestId: 'req-d7e8f9g0h1' },
  { id: 'cl-039', timestamp: '2026-07-12 12:26:42', memberName: '王磊', memberId: 'm3', model: 'data-guard-llm', modelName: '数据安全卫士', apiKey: 'sk-qax-***5d1e', status: 200, latency: 93, promptTokens: 1300, completionTokens: 740, totalTokens: 2040, cost: 0.0564, requestId: 'req-i2j3k4l5m6' },
  { id: 'cl-040', timestamp: '2026-07-12 12:23:18', memberName: '陈静', memberId: 'm4', model: 'malware-analyzer', modelName: '恶意软件分析模型', apiKey: 'sk-qax-***9f3a', status: 200, latency: 149, promptTokens: 2300, completionTokens: 1600, totalTokens: 3900, cost: 0.165, requestId: 'req-n7o8p9q0r1' },
  { id: 'cl-041', timestamp: '2026-07-12 12:19:55', memberName: '赵伟', memberId: 'm5', model: 'compliance-guard', modelName: '合规卫士', apiKey: 'sk-qax-***2c8b', status: 200, latency: 97, promptTokens: 1050, completionTokens: 600, totalTokens: 1650, cost: 0.046, requestId: 'req-s2t3u4v5w6' },
  { id: 'cl-042', timestamp: '2026-07-12 12:16:30', memberName: '孙丽', memberId: 'm6', model: 'phishing-detect', modelName: '钓鱼识别模型', apiKey: 'sk-qax-***7e4d', status: 200, latency: 61, promptTokens: 720, completionTokens: 360, totalTokens: 1080, cost: 0.0144, requestId: 'req-x7y8z9a0b1' },
  { id: 'cl-043', timestamp: '2026-07-12 12:13:07', memberName: '张明', memberId: 'm1', model: 'qax-security-llm', modelName: '奇安信安全大模型', apiKey: 'sk-qax-***3a7f', status: 500, latency: 5200, promptTokens: 2800, completionTokens: 0, totalTokens: 2800, cost: 0.168, errorMessage: '内部服务错误：模型推理超时，请稍后重试', requestId: 'req-c2d3e4f5g6' },
  { id: 'cl-044', timestamp: '2026-07-12 11:58:33', memberName: '李芳', memberId: 'm2', model: 'threat-detect-v3', modelName: '威胁检测模型 V3', apiKey: 'sk-qax-***8b2c', status: 429, latency: 45, promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0, errorMessage: '请求频率超限：当前QPS已达上限，请降低调用频率', requestId: 'req-h7i8j9k0l1' },
  { id: 'cl-045', timestamp: '2026-07-12 11:42:18', memberName: '王磊', memberId: 'm3', model: 'code-security-scan', modelName: '代码安全扫描模型', apiKey: 'sk-qax-***5d1e', status: 500, latency: 4800, promptTokens: 3500, completionTokens: 0, totalTokens: 3500, cost: 0.105, errorMessage: '内部服务错误：GPU资源分配失败，请联系管理员', requestId: 'req-m2n3o4p5q6' },
  { id: 'cl-046', timestamp: '2026-07-12 11:25:44', memberName: '陈静', memberId: 'm4', model: 'vuln-analyzer-pro', modelName: '漏洞分析专家', apiKey: 'sk-qax-***9f3a', status: 429, latency: 38, promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0, errorMessage: '请求频率超限：API Key调用配额已耗尽，请升级套餐', requestId: 'req-r7s8t9u0v1' },
  { id: 'cl-047', timestamp: '2026-07-12 11:08:22', memberName: '赵伟', memberId: 'm5', model: 'compliance-guard', modelName: '合规卫士', apiKey: 'sk-qax-***2c8b', status: 400, latency: 22, promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0, errorMessage: '请求参数错误：prompt字段不能为空，请检查请求体格式', requestId: 'req-w2x3y4z5a6' },
  { id: 'cl-048', timestamp: '2026-07-12 10:52:15', memberName: '孙丽', memberId: 'm6', model: 'log-analyzer', modelName: '日志智能分析模型', apiKey: 'sk-qax-***7e4d', status: 200, latency: 116, promptTokens: 2600, completionTokens: 1400, totalTokens: 4000, cost: 0.094, requestId: 'req-b7c8d9e0f1' },
  { id: 'cl-049', timestamp: '2026-07-12 10:35:48', memberName: '张明', memberId: 'm1', model: 'incident-response', modelName: '应急响应模型', apiKey: 'sk-qax-***3a7f', status: 200, latency: 185, promptTokens: 3100, completionTokens: 2200, totalTokens: 5300, cost: 0.296, requestId: 'req-g2h3i4j5k6' },
  { id: 'cl-050', timestamp: '2026-07-12 10:18:33', memberName: '李芳', memberId: 'm2', model: 'data-guard-llm', modelName: '数据安全卫士', apiKey: 'sk-qax-***8b2c', status: 200, latency: 84, promptTokens: 1100, completionTokens: 620, totalTokens: 1720, cost: 0.0476, requestId: 'req-l7m8n9o0p1' }
]

export const monitorMetrics: MonitorMetrics = {
  todayCalls: 47236,
  realtimeQPS: 347,
  errorRate: 0.3,
  avgLatency: 128,
  realtimeSeries: [
    { time: '13:00', calls: 680, errors: 2 },
    { time: '13:01', calls: 712, errors: 1 },
    { time: '13:02', calls: 695, errors: 3 },
    { time: '13:03', calls: 734, errors: 1 },
    { time: '13:04', calls: 708, errors: 2 },
    { time: '13:05', calls: 756, errors: 1 },
    { time: '13:06', calls: 723, errors: 4 },
    { time: '13:07', calls: 689, errors: 2 },
    { time: '13:08', calls: 745, errors: 1 },
    { time: '13:09', calls: 767, errors: 3 },
    { time: '13:10', calls: 712, errors: 1 },
    { time: '13:11', calls: 698, errors: 2 },
    { time: '13:12', calls: 734, errors: 1 },
    { time: '13:13', calls: 756, errors: 3 },
    { time: '13:14', calls: 723, errors: 2 },
    { time: '13:15', calls: 689, errors: 1 },
    { time: '13:16', calls: 745, errors: 2 },
    { time: '13:17', calls: 778, errors: 1 },
    { time: '13:18', calls: 734, errors: 3 },
    { time: '13:19', calls: 712, errors: 2 },
    { time: '13:20', calls: 756, errors: 1 },
    { time: '13:21', calls: 723, errors: 2 },
    { time: '13:22', calls: 689, errors: 1 },
    { time: '13:23', calls: 745, errors: 3 },
    { time: '13:24', calls: 767, errors: 2 },
    { time: '13:25', calls: 734, errors: 1 },
    { time: '13:26', calls: 712, errors: 2 },
    { time: '13:27', calls: 756, errors: 1 },
    { time: '13:28', calls: 723, errors: 3 },
    { time: '13:29', calls: 689, errors: 2 },
    { time: '13:30', calls: 745, errors: 1 },
    { time: '13:31', calls: 778, errors: 2 },
    { time: '13:32', calls: 734, errors: 1 },
    { time: '13:33', calls: 712, errors: 3 },
    { time: '13:34', calls: 756, errors: 2 },
    { time: '13:35', calls: 723, errors: 1 },
    { time: '13:36', calls: 689, errors: 2 },
    { time: '13:37', calls: 745, errors: 1 },
    { time: '13:38', calls: 767, errors: 3 },
    { time: '13:39', calls: 734, errors: 2 },
    { time: '13:40', calls: 712, errors: 1 },
    { time: '13:41', calls: 756, errors: 2 },
    { time: '13:42', calls: 723, errors: 1 },
    { time: '13:43', calls: 689, errors: 3 },
    { time: '13:44', calls: 745, errors: 2 },
    { time: '13:45', calls: 778, errors: 1 },
    { time: '13:46', calls: 734, errors: 2 },
    { time: '13:47', calls: 712, errors: 1 },
    { time: '13:48', calls: 756, errors: 3 },
    { time: '13:49', calls: 723, errors: 2 },
    { time: '13:50', calls: 689, errors: 1 },
    { time: '13:51', calls: 745, errors: 2 },
    { time: '13:52', calls: 767, errors: 1 },
    { time: '13:53', calls: 734, errors: 3 },
    { time: '13:54', calls: 712, errors: 2 },
    { time: '13:55', calls: 756, errors: 1 },
    { time: '13:56', calls: 723, errors: 2 },
    { time: '13:57', calls: 689, errors: 1 },
    { time: '13:58', calls: 745, errors: 3 },
    { time: '13:59', calls: 734, errors: 2 }
  ],
  modelDistribution: [
    { name: '奇安信安全大模型', calls: 18500, color: '#7C3AED' },
    { name: '威胁检测模型 V3', calls: 9800, color: '#EF4444' },
    { name: '代码安全扫描模型', calls: 7200, color: '#3B82F6' },
    { name: '日志智能分析模型', calls: 6100, color: '#6366F1' },
    { name: '其他模型', calls: 5636, color: '#10B981' }
  ],
  memberRanking: [
    { name: '张明', calls: 12800, tokens: 5200000 },
    { name: '李芳', calls: 9600, tokens: 3800000 },
    { name: '王磊', calls: 8200, tokens: 2900000 },
    { name: '孙丽', calls: 6400, tokens: 1680000 },
    { name: '赵伟', calls: 5800, tokens: 420000 },
    { name: '陈静', calls: 4436, tokens: 0 }
  ]
}

export const adminEnterprises: AdminEnterprise[] = [
  {
    id: 'ent-qianxin',
    name: '奇安信安全团队',
    industry: '网络安全',
    scale: '200-500人',
    memberCount: 6,
    monthlyCost: 12860,
    monthlyCalls: 47200,
    monthlyTokens: 18500000,
    packBalance: 18500000,
    verified: true,
    createdAt: '2025-08-15',
    contactName: '张明',
    contactEmail: 'zhangming@qianxin.com',
    status: 'active'
  },
  {
    id: 'ent-icbc',
    name: '工商银行安全中心',
    industry: '金融',
    scale: '500-1000人',
    memberCount: 28,
    monthlyCost: 86500,
    monthlyCalls: 312000,
    monthlyTokens: 128000000,
    packBalance: 95000000,
    verified: true,
    createdAt: '2025-06-20',
    contactName: '周建国',
    contactEmail: 'zhoujianguo@icbc.com.cn',
    status: 'active'
  },
  {
    id: 'ent-sinopec',
    name: '中石化网络安全部',
    industry: '能源',
    scale: '100-200人',
    memberCount: 15,
    monthlyCost: 42300,
    monthlyCalls: 156000,
    monthlyTokens: 62000000,
    packBalance: 38000000,
    verified: true,
    createdAt: '2025-09-10',
    contactName: '李伟',
    contactEmail: 'liwei@sinopec.com',
    status: 'active'
  },
  {
    id: 'ent-gov-cyber',
    name: '某市网信办',
    industry: '政府',
    scale: '50-100人',
    memberCount: 12,
    monthlyCost: 28900,
    monthlyCalls: 98000,
    monthlyTokens: 42000000,
    packBalance: 22000000,
    verified: true,
    createdAt: '2025-11-05',
    contactName: '王志强',
    contactEmail: 'wangzhiqiang@gov.cn',
    status: 'active'
  },
  {
    id: 'ent-haier',
    name: '海尔集团信息安全部',
    industry: '制造',
    scale: '200-500人',
    memberCount: 22,
    monthlyCost: 56700,
    monthlyCalls: 203000,
    monthlyTokens: 86000000,
    packBalance: 64000000,
    verified: true,
    createdAt: '2026-01-18',
    contactName: '赵鹏飞',
    contactEmail: 'zhaopengfei@haier.com',
    status: 'active'
  },
  {
    id: 'ent-chinamobile',
    name: '中国移动安全运营中心',
    industry: '通信',
    scale: '1000人以上',
    memberCount: 45,
    monthlyCost: 156000,
    monthlyCalls: 580000,
    monthlyTokens: 240000000,
    packBalance: 180000000,
    verified: true,
    createdAt: '2025-07-22',
    contactName: '陈晓东',
    contactEmail: 'chenxiaodong@chinamobile.com',
    status: 'active'
  },
  {
    id: 'ent-hospital',
    name: '协和医院信息科',
    industry: '医疗',
    scale: '50-100人',
    memberCount: 8,
    monthlyCost: 15600,
    monthlyCalls: 52000,
    monthlyTokens: 21000000,
    packBalance: 12000000,
    verified: false,
    createdAt: '2026-06-28',
    contactName: '刘美华',
    contactEmail: 'liumeihua@pumch.cn',
    status: 'pending'
  },
  {
    id: 'ent-tsinghua',
    name: '清华大学网络研究院',
    industry: '教育',
    scale: '50人以下',
    memberCount: 5,
    monthlyCost: 8900,
    monthlyCalls: 28000,
    monthlyTokens: 11000000,
    packBalance: 6000000,
    verified: false,
    createdAt: '2026-07-03',
    contactName: '孙立',
    contactEmail: 'sunli@tsinghua.edu.cn',
    status: 'pending'
  }
]

export function getModelById(id: string): Model | undefined {
  return models.find(m => m.id === id)
}

export function getAppById(id: string): App | undefined {
  return apps.find(a => a.id === id)
}

export function getActivityById(id: string): Activity | undefined {
  return activities.find(a => a.id === id)
}

export function getOrganization(): Organization | undefined {
  return organization
}

export function getMembers(): Member[] {
  return members
}

export function getCallLogs(): CallLog[] {
  return callLogs
}

export function getMonitorMetrics(): MonitorMetrics {
  return monitorMetrics
}

export function getAdminEnterprises(): AdminEnterprise[] {
  return adminEnterprises
}

export function parsePrice(priceStr: string): number {
  // Remove ¥, commas, and trailing /月 or similar suffixes
  const cleaned = priceStr.replace(/[¥,]/g, '').replace(/\/月$/, '')
  const num = Number(cleaned)
  return isNaN(num) ? 0 : num
}

export function parseTokens(tokensStr: string): number {
  if (tokensStr.includes('无限')) return -1
  // Handle 亿 (100 million)
  const yiMatch = tokensStr.match(/([\d.]+)亿/)
  if (yiMatch) return Math.round(Number(yiMatch[1]) * 100000000)
  // Handle 万 (10 thousand)
  const wanMatch = tokensStr.match(/([\d.]+)万/)
  if (wanMatch) return Math.round(Number(wanMatch[1]) * 10000)
  return 0
}

export function getPlansForCapability(capabilityId: string): { packs: Plan[]; modelPlans: Plan[]; appPlans: Plan[] } {
  const packs: Plan[] = chargingPacks.map(pack => ({
    id: pack.id,
    type: 'pack' as const,
    name: pack.name,
    description: '',
    billingCycle: 'one-time' as const,
    price: parsePrice(pack.price),
    originalPrice: pack.originalPrice ? parsePrice(pack.originalPrice) : undefined,
    includedTokens: parseTokens(pack.tokens),
    features: pack.features,
    popular: pack.popular,
    icon: 'i-lucide-coins',
    badge: pack.originalPrice ? '限时优惠' : undefined
  }))
  return {
    packs,
    modelPlans: modelPlans.filter(p => p.targetId === capabilityId),
    appPlans: appPlans.filter(p => p.targetId === capabilityId)
  }
}

export function getDefaultTemplate(targetType: 'model' | 'app', targetId: string, appType?: string): PageTemplate {
  const base: PageTemplate = {
    id: `tpl-${targetId}`,
    targetType,
    targetId,
    theme: { bgStyle: 'light' },
    modules: []
  }

  const mkModule = (type: ModuleType, order: number, props: Record<string, any> = {}): TemplateModule => ({
    id: `mod-${type}-${order}`,
    type,
    visible: true,
    order,
    props,
    spacing: { top: 'md', bottom: 'md' },
    background: 'white'
  })

  if (targetType === 'model') {
    base.modules = [
      mkModule('banner', 1, { gradient: 'from-primary-600 to-primary-400' }),
      mkModule('intro', 2),
      mkModule('features', 3, { layout: 'grid' }),
      mkModule('scenarios', 4, { layout: 'cards' }),
      mkModule('pricing', 5, { useDefault: true }),
      mkModule('integration', 6, { useDefault: true }),
      mkModule('related', 7, { maxCount: 4 })
    ]
  } else {
    switch (appType) {
      case 'chat':
        base.modules = [
          mkModule('banner', 1),
          mkModule('intro', 2),
          mkModule('features', 3, { layout: 'grid' }),
          mkModule('integration', 4, { useDefault: true }),
          mkModule('pricing', 5, { useDefault: true })
        ]
        break
      case 'tool':
        base.modules = [
          mkModule('banner', 1),
          mkModule('intro', 2),
          mkModule('steps', 3, { direction: 'vertical' }),
          mkModule('pricing', 4, { useDefault: true }),
          mkModule('integration', 5, { useDefault: true })
        ]
        break
      case 'showcase':
        base.modules = [
          mkModule('banner', 1),
          mkModule('carousel', 2, { autoplay: true }),
          mkModule('advantages', 3),
          mkModule('cards', 4, { columns: 3 }),
          mkModule('integration', 5, { useDefault: true })
        ]
        break
      default: // external-link
        base.modules = [
          mkModule('banner', 1),
          mkModule('intro', 2),
          mkModule('cards', 3, { columns: 3 }),
        ]
    }
  }
  return base
}

export const defaultTemplates: PageTemplate[] = [
  getDefaultTemplate('model', 'qax-security-llm'),
  getDefaultTemplate('model', 'threat-detect-v3'),
  getDefaultTemplate('model', 'vuln-analyzer-pro'),
  getDefaultTemplate('app', 'smart-soc', 'chat'),
  getDefaultTemplate('app', 'threat-intel-assistant', 'chat')
]
