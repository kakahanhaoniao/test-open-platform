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
  name: string
  tokens: string
  price: string
  unitPrice: string
  originalPrice?: string
  popular: boolean
  features: string[]
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
    name: '体验包',
    tokens: '100万Token',
    price: '¥99',
    unitPrice: '¥0.099/千Token',
    popular: false,
    features: ['基础模型调用', '标准响应速度', '社区技术支持']
  },
  {
    id: 'pack-pro',
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
    name: '无限包',
    tokens: '无限Token',
    price: '¥4,999/月',
    unitPrice: '不限',
    popular: false,
    features: ['全模型无限调用', '最高响应速度', '专属技术团队', '高级API统计', '专属模型实例', '99.9% SLA', '私有化部署选项']
  }
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
  packBalance: number
  packTotal: number
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
  packBalance: 18500000,
  packTotal: 50000000
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

export function getModelById(id: string): Model | undefined {
  return models.find(m => m.id === id)
}

export function getAppById(id: string): App | undefined {
  return apps.find(a => a.id === id)
}

export function getActivityById(id: string): Activity | undefined {
  return activities.find(a => a.id === id)
}
