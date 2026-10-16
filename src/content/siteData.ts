import { ASSETS } from './assets';
import { EntityDetailData, MilestoneItem, ScopeEntity, StatItem } from './types';

export const HOME_CONTENT = {
  aboutIntro: {
    eyebrow: { id: 'Tentang Kodein', en: 'About Kodein', zh: '关于 Kodein' },
    statement: {
      id: 'Kodein membangun website, aplikasi web, dan perangkat lunak kustom yang dirancang agar cepat diakses, mudah dipakai, dan benar-benar membantu operasional bisnis Anda.',
      en: 'Kodein builds websites, web apps, and custom software engineered to load fast, feel intuitive, and solve real operational problems for your business.',
      zh: 'Kodein 专注于打造加载迅速、交互直观且能真正解决企业实际运营痛点的网站、Web 应用与定制软件系统。',
    },
    supporting: {
      id: 'Berangkat dari studio kami di Gang Lampung 1, Indralaya Utara, Kabupaten Ogan Ilir, Sumatera Selatan, kami mengerjakan proyek digital untuk UMKM, institusi pendidikan, hingga perusahaan nasional. Kami tidak sekadar menjual tampilan—kami menulis kode yang bersih dan mudah dirawat untuk jangka panjang.',
      en: 'Operating from our studio at Gang Lampung 1, Indralaya Utara, Ogan Ilir, South Sumatra, we craft digital products for growing businesses, educational institutions, and national enterprises. We don’t just ship pretty screens—we write clean, maintainable code built for the long haul.',
      zh: '我们的技术工作室位于南苏门答腊省奥干伊利尔县 (Ogan Ilir) 北印德拉拉亚 Gang Lampung 1。我们为成长型企业、教育机构及全国性公司提供数字化开发服务，坚持编写整洁、可长期维护的高质量代码。',
    },
  },
  scopeSection: {
    eyebrow: { id: 'Layanan Kami', en: 'What We Build', zh: '核心业务领域' },
    headline: {
      id: 'Mulai dari website profil perusahaan yang rapi hingga sistem operasional internal yang kompleks, semua kami rancang dari nol sesuai kebutuhan Anda.',
      en: 'From sharp company profile websites to complex internal software systems, everything is built from scratch around how your business actually works.',
      zh: '从精致的企业官网到复杂的内部业务管理系统，所有产品均根据您的实际业务流程量身定制。',
    },
  },
  statsSection: {
    eyebrow: { id: 'Kinerja Nyata', en: 'Real Track Record', zh: '真实交付数据' },
    headline: {
      id: 'Hasil Kerja Kodein dalam Angka',
      en: 'Kodein Work in Numbers',
      zh: 'Kodein 交付成果数据',
    },
  },
  reportsSection: {
    eyebrow: { id: 'Portofolio & Panduan Harga', en: 'Portfolio & Pricing Guide', zh: '作品集与报价指南' },
    headline: {
      id: 'Unduh ringkasan portofolio, rincian paket pembuatan website, serta estimasi waktu pengerjaan di Kodein.',
      en: 'Download our portfolio booklet, website development packages, and transparent project timeline estimates.',
      zh: '下载 Kodein 官方作品集手册、网站与软件开发套餐明细以及透明的项目周期评估表。',
    },
    subtext: {
      id: 'Ingin langsung berdiskusi soal ide aplikasi atau peremajaan website lama Anda? Tim kami siap membantu menghitungkan estimasi biaya tanpa komitmen awal.',
      en: 'Want to talk directly about an app idea or revamping an outdated website? Our team is happy to map out a scope and cost estimate with zero obligation.',
      zh: '想要直接探讨您的应用创意或旧网站改版方案？我们的技术团队随时为您提供免费的架构建议与费用评估。',
    },
    reportsAvailable: true,
  },
  journeySection: {
    eyebrow: { id: 'Perjalanan Kami', en: 'Our Journey', zh: '发展历程' },
    headline: {
      id: 'Tumbuh Bersama Klien dari Ogan Ilir untuk Indonesia',
      en: 'Growing with Our Clients from Ogan Ilir to Across Indonesia',
      zh: '从奥干伊利尔走向全印尼的成长足迹',
    },
    launchLabel: {
      id: 'Awal Mula Kodein',
      en: 'Where Kodein Started',
      zh: 'Kodein 创立起点',
    },
  },
  quoteSection: {
    beforeHighlight: {
      id: '“Website dan software yang baik itu sederhana ukurannya: ',
      en: '“Good software is measured simply: ',
      zh: '“衡量优秀网站与软件的标准其实很简单：',
    },
    highlight: {
      id: 'cepat dibuka, tidak membingungkan pengguna, dan langsung mempermudah pekerjaan sehari-hari',
      en: 'it loads fast, never confuses the user, and genuinely makes daily work easier',
      zh: '打开迅速、操作不繁琐，并且能真正让日常业务工作变得更轻松',
    },
    afterHighlight: {
      id: '—bukan sekadar terlihat canggih di atas kertas.”',
      en: '—rather than just sounding impressive on paper.”',
      zh: '——而不是仅仅停留在纸面上的华丽概念。”',
    },
    author: {
      id: 'Tim Engineer Kodein',
      en: 'Kodein Engineering Team',
      zh: 'Kodein 工程研发团队',
    },
    occasion: {
      id: 'Indralaya Utara, Kabupaten Ogan Ilir — Sumatera Selatan',
      en: 'Indralaya Utara, Ogan Ilir Regency — South Sumatra',
      zh: '印尼南苏门答腊省 · 奥干伊利尔县 · 北印德拉拉亚',
    },
  },
};

export const SCOPE_ENTITIES: ScopeEntity[] = [
  {
    id: 'main',
    code: 'KODEIN',
    title: { id: 'Studio Utama Kodein', en: 'Kodein Core Studio', zh: 'Kodein 核心工作室' },
    shortDesc: {
      id: 'Konsultasi teknis, perancangan UI/UX, dan arsitektur perangkat lunak langsung dari markas kami di Indralaya Utara.',
      en: 'Technical consultation, UI/UX design, and software architecture led directly from our studio in Indralaya Utara.',
      zh: '由我们位于北印德拉拉亚的工作室直接提供技术咨询、UI/UX 设计与软件系统架构。',
    },
    href: '/about',
    image: ASSETS.scope.main,
  },
  {
    id: 'dam',
    code: 'WEB & APP',
    title: { id: 'Web & Aplikasi Mobile', en: 'Web & Mobile Apps', zh: '网站与移动应用开发' },
    shortDesc: {
      id: 'Pembuatan website profil perusahaan, toko online, landing page, hingga aplikasi Android & iOS yang ringan dan responsif.',
      en: 'Company profile websites, online stores, landing pages, and responsive Android & iOS mobile applications.',
      zh: '定制高品质企业官网、电商平台、营销落地页以及流畅的 Android 与 iOS 移动应用。',
    },
    href: '/dam',
    image: ASSETS.scope.dam,
  },
  {
    id: 'dim',
    code: 'SOFTWARE & AI',
    title: { id: 'Sistem Kustom & AI', en: 'Custom Systems & AI', zh: '定制软件与人工智能' },
    shortDesc: {
      id: 'Pembuatan aplikasi kasir/POS, sistem stok gudang, sistem akademik, dashboard laporan, dan chatbot AI pintar.',
      en: 'Custom POS systems, warehouse inventory, academic portals, executive dashboards, and smart AI chatbots.',
      zh: '开发定制收银/POS系统、仓储库存管理、教务平台、数据看板及智能 AI 客服助手。',
    },
    href: '/dim',
    image: ASSETS.scope.dim,
  },
  {
    id: 'ddmf',
    code: 'SERVER & CARE',
    title: { id: 'Server, Cloud & Maintenance', en: 'Cloud & Maintenance', zh: '云端部署与系统运维' },
    shortDesc: {
      id: 'Pengaturan domain, VPS/cloud server, pengamanan SSL, backup rutin, dan perawatan website agar tidak pernah down.',
      en: 'Domain setup, VPS/cloud hosting, SSL security, automated backups, and ongoing website care.',
      zh: '提供域名配置、云服务器部署、SSL 安全加固、定期自动备份及全天候网站维护服务。',
    },
    href: '/ddmf',
    image: ASSETS.scope.ddmf,
  },
];

export const STATISTICS_DATA: StatItem[] = [
  {
    id: 'projects-delivered',
    value: 120,
    suffix: '+',
    label: { id: 'Proyek Web & Aplikasi Selesai', en: 'Web & App Projects Shipped', zh: '已交付网站与应用项目' },
    description: {
      id: 'Website perusahaan, sistem informasi, dan aplikasi mobile yang telah berjalan aktif digunakan klien.',
      en: 'Company websites, information systems, and mobile apps actively running in production.',
      zh: '已正式上线并稳定运行的企业网站、信息管理系统与移动应用程序。',
    },
  },
  {
    id: 'system-uptime',
    value: 99,
    suffix: '.9%',
    label: { id: 'Stabilitas Server Klien', en: 'Client Server Uptime', zh: '客户服务器稳定在线率' },
    description: {
      id: 'Website dan sistem klien tetap menyala dan stabil berkat konfigurasi server yang terpantau setiap hari.',
      en: 'Client websites stay online and responsive thanks to well-configured, actively monitored servers.',
      zh: '依托严谨的服务器配置与日常监控，确保客户网站与业务系统全天候稳定访问。',
    },
  },
  {
    id: 'page-speed',
    value: 96,
    suffix: '/100',
    label: { id: 'Rata-rata Skor Kecepatan Web', en: 'Avg. Google PageSpeed Score', zh: '平均网页性能评分' },
    description: {
      id: 'Website ringan dibuka baik dari jaringan Wi-Fi kantor maupun sinyal seluler di berbagai daerah.',
      en: 'Pages load quickly on both office fiber connections and mobile networks across regions.',
      zh: '无论是在办公宽带还是移动网络环境下，网页均能实现秒级流畅加载。',
    },
  },
  {
    id: 'client-retention',
    value: 92,
    suffix: '%',
    label: { id: 'Klien Memesan Kembali', en: 'Repeat & Referral Clients', zh: '客户复购与转介绍率' },
    description: {
      id: 'Mayoritas klien kembali mempercayakan penambahan fitur baru atau merekomendasikan Kodein ke rekan bisnisnya.',
      en: 'Most clients return for phase-two features or recommend Kodein to their business partners.',
      zh: '绝大多数客户在后续功能升级时继续选择 Kodein，并向商业伙伴主动推荐。',
    },
  },
  {
    id: 'faster-delivery',
    value: 14,
    suffix: ' Hari',
    label: { id: 'Rilis Website Profil Standar', en: 'Standard Web Turnaround (Days)', zh: '标准官网交付周期（天）' },
    description: {
      id: 'Proses pengerjaan terstruktur sehingga website profil bisnis Anda bisa tayang tepat waktu tanpa molor.',
      en: 'Structured workflows ensure your company profile website launches on schedule without dragging on.',
      zh: '标准化的敏捷开发流程，确保您的企业官网按期高质量上线，绝不拖延。',
    },
  },
  {
    id: 'support-response',
    prefix: '<',
    value: 30,
    suffix: 'm',
    label: { id: 'Respons Bantuan Teknis', en: 'Tech Support Response Time', zh: '技术支持平均响应时间' },
    description: {
      id: 'Komunikasi langsung dengan tim developer via WhatsApp atau grup proyek tanpa birokrasi berbelit.',
      en: 'Direct communication with our developers via WhatsApp or project channels—no ticket runarounds.',
      zh: '通过项目群直接与开发工程师沟通，省去繁琐流程，快速解决技术问题。',
    },
  },
];

export const TIMELINE_MILESTONES: MilestoneItem[] = [
  {
    id: 'm1',
    month: { id: 'Feb', en: 'Feb', zh: '2月' },
    day: '24',
    year: '2025',
    title: {
      id: 'Kodein Berdiri di Indralaya Utara, Ogan Ilir',
      en: 'Kodein Founded in Indralaya Utara, Ogan Ilir',
      zh: 'Kodein 在南苏门答腊北印德拉拉亚正式创立',
    },
    description: {
      id: 'Memulai langkah dari Gang Lampung 1, Indralaya Utara, dengan fokus membantu bisnis dan instansi lokal memiliki website profesional.',
      en: 'Started at Gang Lampung 1, Indralaya Utara, helping local businesses and institutions build professional websites.',
      zh: '从北印德拉拉亚 Gang Lampung 1 起步，致力于帮助本地企业与机构建设专业网站。',
    },
    image: ASSETS.timeline.m1,
    isCap: true,
  },
  {
    id: 'm2',
    month: { id: 'Mei', en: 'May', zh: '5月' },
    day: '15',
    year: '2025',
    title: {
      id: 'Pengembangan Sistem Informasi & Web App Kustom',
      en: 'Expanding into Custom Web Apps & Information Systems',
      zh: '拓展定制 Web 应用与信息管理系统业务',
    },
    description: {
      id: 'Mengerjakan berbagai proyek sistem inventaris, portal pendidikan, dan dashboard operasional di Sumatera Selatan.',
      en: 'Delivering inventory platforms, educational portals, and operational dashboards across South Sumatra.',
      zh: '为南苏门答腊多家机构成功交付库存管理平台、教育门户与运营数据看板。',
    },
    image: ASSETS.timeline.m2,
  },
  {
    id: 'm3',
    month: { id: 'Agu', en: 'Aug', zh: '8月' },
    day: '28',
    year: '2025',
    title: {
      id: 'Layanan Aplikasi Mobile & Integrasi Pembayaran Digital',
      en: 'Mobile Apps & Digital Payment Gateway Integration',
      zh: '推出移动应用开发与数字支付集成服务',
    },
    description: {
      id: 'Membantu UMKM dan perusahaan ritel meluncurkan aplikasi pemesanan di Android & iOS lengkap dengan QRIS dan Virtual Account.',
      en: 'Helping retail brands launch Android & iOS ordering apps integrated with QRIS and Virtual Accounts.',
      zh: '助力零售品牌上线支持 QRIS 与虚拟账户支付的 Android 及 iOS 订购应用。',
    },
    image: ASSETS.timeline.m3,
  },
  {
    id: 'm4',
    month: { id: 'Des', en: 'Dec', zh: '12月' },
    day: '12',
    year: '2025',
    title: {
      id: 'Penerapan CMS Mandiri & Otomasi AI untuk Klien',
      en: 'Self-Service CMS & AI Automation Rollout',
      zh: '全面上线自主 CMS 后台与 AI 业务自动化方案',
    },
    description: {
      id: 'Menghadirkan CMS yang sangat mudah dioperasikan oleh tim non-teknis serta integrasi chatbot layanan pelanggan.',
      en: 'Shipping intuitive CMS dashboards for non-technical teams alongside automated AI customer support.',
      zh: '为非技术团队打造极简易用的 CMS 管理系统，并集成全天候 AI 智能客服。',
    },
    image: ASSETS.timeline.m4,
  },
  {
    id: 'm5',
    month: { id: 'Okt', en: 'Oct', zh: '10月' },
    day: '16',
    year: '2026',
    title: {
      id: 'Melayani Klien Lintas Provinsi dengan Standar Global',
      en: 'Serving Cross-Province Clients with Global Engineering Standards',
      zh: '以国际工程标准服务全印尼跨省市客户',
    },
    description: {
      id: 'Tetap berkantor di Ogan Ilir sambil melayani pembuatan website dan software untuk klien di Palembang, Jakarta, hingga luar negeri.',
      en: 'Rooted in Ogan Ilir while building websites and software for clients in Palembang, Jakarta, and abroad.',
      zh: '立足奥干伊利尔，为巨港、雅加达及海外客户提供高水准的网站与软件工程服务。',
    },
    image: ASSETS.timeline.m5,
  },
];

export const ENTITY_DETAILS: Record<'dam' | 'dim' | 'ddmf', EntityDetailData> = {
  dam: {
    slug: 'dam',
    code: 'WEB & APP',
    name: {
      id: 'Pembuatan Website & Aplikasi Mobile',
      en: 'Website & Mobile App Development',
      zh: '网站建设与移动应用开发',
    },
    tagline: {
      id: 'Website yang rapi, cepat dibuka di HP maupun laptop, serta dilengkapi halaman admin (CMS) agar Anda mudah mengubah isi konten kapan saja.',
      en: 'Clean, fast-loading websites and mobile apps equipped with an easy CMS so your team can update content anytime.',
      zh: '打造在手机与电脑端均极速加载的精美网站与移动应用，并配备易用的 CMS 后台方便您随时更新内容。',
    },
    heroImage: ASSETS.scope.dam,
    overview: {
      id: [
        'Banyak bisnis memiliki website yang lambat, tampilannya berantakan saat dibuka di HP, atau sulit diedit karena bergantung terus pada developer lama. Di Kodein, kami membereskan masalah tersebut dari akar.',
        'Setiap website dan aplikasi mobile yang kami kerjakan dirancang khusus mengikuti identitas bisnis Anda, dioptimalkan agar mudah ditemukan di Google (SEO), dan diserahkan lengkap dengan panduan penggunaannya.',
      ],
      en: [
        'Too many businesses are stuck with slow websites that break on mobile screens or require calling a developer just to fix a typo. At Kodein, we solve that from day one.',
        'Every website and mobile app we build is custom-designed for your brand, structured for Google search visibility (SEO), and handed over with a clean admin dashboard.',
      ],
      zh: [
        '许多企业的旧网站存在加载缓慢、手机端排版错乱，或修改一行文字都要找开发人员的痛点。Kodein 从底层架构出发为您彻底解决这些问题。',
        '我们开发的每一个网站与移动应用均根据您的品牌量身定制，内置搜索引擎优化 (SEO) 架构，并交付直观的管理后台。',
      ],
    },
    focusAreas: [
      {
        title: {
          id: 'Website Company Profile & Instansi',
          en: 'Company Profile & Institutional Websites',
          zh: '企业官网与机构门户网站',
        },
        description: {
          id: 'Tampilan berwibawa, mendukung multi-bahasa (Indonesia, Inggris, Mandarin), dan langsung membangun kepercayaan calon klien.',
          en: 'Authoritative design with trilingual support (ID, EN, ZH) built to earn instant trust from prospective clients.',
          zh: '大气专业的视觉设计，支持印尼语、英语、中文三语切换，快速建立客户信任。',
        },
      },
      {
        title: {
          id: 'Toko Online (E-Commerce) & Katalog Produk',
          en: 'E-Commerce & Digital Product Catalogs',
          zh: '电商平台与在线产品目录',
        },
        description: {
          id: 'Lengkap dengan keranjang belanja, hitung ongkos kirim otomatis, pembayaran QRIS/transfer, hingga tombol order ke WhatsApp.',
          en: 'Complete with shopping cart, automated shipping rates, QRIS/bank checkout, or direct WhatsApp ordering.',
          zh: '集成购物车、自动运费计算、QRIS/银行转账支付以及一键跳转 WhatsApp 下单功能。',
        },
      },
      {
        title: {
          id: 'Aplikasi Android & iOS',
          en: 'Android & iOS Mobile Applications',
          zh: 'Android 与 iOS 移动应用开发',
        },
        description: {
          id: 'Aplikasi mobile untuk layanan pelanggan, booking jasa, maupun aplikasi operasional lapangan yang ringan dan hemat kuota.',
          en: 'Lightweight, reliable mobile apps for customer booking, loyalty programs, or field team operations.',
          zh: '开发轻量稳定的客户预约、会员服务及外勤团队移动办公 App。',
        },
      },
    ],
    highlights: [
      { metric: '96+', label: { id: 'Skor Kecepatan Google', en: 'Google PageSpeed Score', zh: 'Google 网页速度评分' } },
      { metric: '3 Bahasa', label: { id: 'Dukungan ID / EN / ZH', en: 'Built-in ID / EN / ZH Support', zh: '内置印/英/中三语支持' } },
      { metric: 'CMS Aktif', label: { id: 'Mudah Diedit Sendiri', en: 'Self-Editable Admin Panel', zh: '配备自主可控 CMS 后台' } },
    ],
  },
  dim: {
    slug: 'dim',
    code: 'SOFTWARE & AI',
    name: {
      id: 'Sistem Perangkat Lunak Kustom & Otomasi AI',
      en: 'Custom Software Systems & AI Automation',
      zh: '定制软件系统与 AI 业务自动化',
    },
    tagline: {
      id: 'Ubah pencatatan manual di kertas dan ribuan file Excel yang terpisah menjadi satu sistem web terpusat yang rapi dan otomatis.',
      en: 'Replace scattered spreadsheets and manual paperwork with a single, clean web system tailored to your workflow.',
      zh: '告别繁琐的纸质单据与分散的 Excel 表格，升级为统一、高效的定制化 Web 业务管理系统。',
    },
    heroImage: ASSETS.scope.dim,
    overview: {
      id: [
        'Setiap bisnis punya cara kerja yang unik. Sering kali software jadi (off-the-shelf) yang dijual di pasaran terlalu kaku atau justru memiliki puluhan menu rumit yang tidak pernah dipakai tim Anda.',
        'Kodein merancang sistem perangkat lunak yang 100% mengikuti alur kerja nyata di tempat Anda—sehingga staf langsung paham cara memakainya tanpa perlu pelatihan berbulan-bulan.',
      ],
      en: [
        'Every business operates differently. Off-the-shelf software is often either too rigid or bloated with dozens of menus your team never touches.',
        'Kodein builds custom software around how your team actually works—so staff can use it confidently on day one without months of training.',
      ],
      zh: [
        '每家企业的业务流程都独一无二。市面上的通用软件往往过于死板，或者堆砌了大量用不到的复杂菜单。',
        'Kodein 完全围绕您的实际工作流定制开发软件，让员工无需漫长培训即可轻松上手。',
      ],
    },
    focusAreas: [
      {
        title: {
          id: 'Sistem Kasir (POS), Stok Gudang & Keuangan',
          en: 'POS, Inventory & Operational Finance Systems',
          zh: '收银 (POS)、仓储库存与财务管理系统',
        },
        description: {
          id: 'Pantau barang masuk-keluar, stok menipis, hingga laporan laba-rugi harian langsung dari HP atau laptop kapan saja.',
          en: 'Track incoming stock, low-inventory alerts, and daily profit-loss reports live from your phone or laptop.',
          zh: '随时随地通过手机或电脑实时查看出入库明细、低库存预警及每日营收报表。',
        },
      },
      {
        title: {
          id: 'Sistem Akademik, HRIS & Administrasi Instansi',
          en: 'Academic Portals, HRIS & Institutional Systems',
          zh: '教务平台、人事系统 (HRIS) 与机构政务系统',
        },
        description: {
          id: 'Pengelolaan data siswa/mahasiswa, absensi pegawai, penggajian, hingga pengarsipan surat digital yang rapi.',
          en: 'Streamlined student records, employee attendance, payroll calculation, and digital document archiving.',
          zh: '高效管理学生档案、员工考勤、薪资核算与数字化公文归档。',
        },
      },
      {
        title: {
          id: 'Chatbot AI & Asisten Layanan Pelanggan',
          en: 'Custom AI Chatbots & Smart Assistants',
          zh: '定制 AI 智能客服与业务助手',
        },
        description: {
          id: 'Asisten otomatis yang dilatih dengan data produk Anda untuk menjawab pertanyaan pelanggan 24 jam di web atau WhatsApp.',
          en: 'AI assistants trained on your product catalog and FAQs to answer customer inquiries 24/7 on web or WhatsApp.',
          zh: '基于您的产品手册与业务数据训练专属 AI 助手，全天候自动回复网站或 WhatsApp 客户咨询。',
        },
      },
    ],
    highlights: [
      { metric: '100%', label: { id: 'Sesuai Alur Bisnis Anda', en: 'Tailored to Your Workflow', zh: '100% 契合您的业务流程' } },
      { metric: 'Hak Milik', label: { id: 'Tanpa Biaya Langganan Per Akun', en: 'No Per-User License Fees', zh: '无按人头收费的订阅限制' } },
      { metric: '24/7', label: { id: 'Integrasi Asisten AI Pintar', en: 'Smart AI Assistant Ready', zh: '支持 24/7 AI 智能助手集成' } },
    ],
  },
  ddmf: {
    slug: 'ddmf',
    code: 'SERVER & CARE',
    name: {
      id: 'Layanan Server, Cloud & Perawatan Website',
      en: 'Server Setup, Cloud & Website Maintenance',
      zh: '服务器部署、云架构与网站运维服务',
    },
    tagline: {
      id: 'Anda fokus mengurus bisnis, biar tim Kodein yang memastikan website dan server Anda selalu cepat, aman, dan ter-backup rutin.',
      en: 'You focus on running your business while Kodein keeps your website and servers fast, secure, and backed up.',
      zh: '您只需专注于业务增长，Kodein 负责保障您的网站与服务器始终快速、安全并定期备份。',
    },
    heroImage: ASSETS.scope.ddmf,
    overview: {
      id: [
        'Banyak pemilik bisnis pusing ketika masa aktif domain hampir habis, sertifikat SSL mati, email perusahaan tidak bisa mengirim pesan, atau website tiba-tiba lambat saat ramai pengunjung.',
        'Tim infrastruktur Kodein menangani seluruh urusan teknis di belakang layar tersebut secara proaktif, lengkap dengan laporan berkala yang mudah dipahami.',
      ],
      en: [
        'Business owners shouldn’t have to worry about expiring domains, broken SSL certificates, email deliverability, or server crashes during traffic spikes.',
        'Kodein’s infrastructure team handles all behind-the-scenes server care proactively, complete with clear monthly health checks.',
      ],
      zh: [
        '企业主不应为域名到期、SSL 证书失效、企业邮箱收发异常或流量高峰期服务器崩溃而烦恼。',
        'Kodein 运维团队在幕后主动处理所有技术细节，并提供清晰易懂的系统健康报告。',
      ],
    },
    focusAreas: [
      {
        title: {
          id: 'Setup VPS, Cloud Server & Domain Resmi',
          en: 'VPS, Cloud Server & Domain Management',
          zh: 'VPS、云服务器与官方域名托管',
        },
        description: {
          id: 'Konfigurasi server yang optimal dan hemat biaya di AWS, Google Cloud, DigitalOcean, maupun server lokal Indonesia.',
          en: 'Cost-effective, high-speed server setup across AWS, Google Cloud, DigitalOcean, or Indonesian data centers.',
          zh: '在 AWS、Google Cloud、DigitalOcean 或印尼本地数据中心进行高性价比的服务器优化配置。',
        },
      },
      {
        title: {
          id: 'Backup Otomatis & Pemulihan Cepat',
          en: 'Automated Backups & Rapid Recovery',
          zh: '自动备份与快速灾难恢复',
        },
        description: {
          id: 'Database dan file website Anda dicadangkan secara rutin sehingga selalu aman dari risiko kehilangan data.',
          en: 'Databases and media files are backed up on schedule so your business data stays safe against any mishap.',
          zh: '定期自动备份数据库与网站文件，确保您的核心业务数据万无一失。',
        },
      },
      {
        title: {
          id: 'Perawatan Bulanan & Update Konten/Fitur',
          en: 'Monthly Care & Feature Updates',
          zh: '包月维护与功能持续更新',
        },
        description: {
          id: 'Bantuan teknis kapan pun Anda butuh mengganti banner, memperbarui informasi, atau menambah halaman baru.',
          en: 'On-call technical help whenever you need to swap banners, update pages, or roll out new features.',
          zh: '随时响应您的日常维护需求，协助更换横幅、更新页面内容或迭代新功能。',
        },
      },
    ],
    highlights: [
      { metric: '99.9%', label: { id: 'Server Stabil & Terpantau', en: 'Monitored Server Uptime', zh: '服务器稳定在线监控' } },
      { metric: 'Harian', label: { id: 'Jadwal Backup Otomatis', en: 'Automated Daily Backups', zh: '每日自动数据备份' } },
      { metric: 'SSL/WAF', label: { id: 'Perlindungan Keamanan Aktif', en: 'Active Security Protection', zh: '主动式安全防护墙' } },
    ],
  },
};

export const ABOUT_PAGE_DATA = {
  vision: {
    id: 'Menjadi studio teknologi asal Sumatera Selatan yang dipercaya secara nasional karena hasil kerja yang rapi, jujur, dan benar-benar membawa manfaat nyata bagi bisnis klien.',
    en: 'To be a South Sumatra-born technology studio trusted nationwide for honest craftsmanship, clean code, and software that genuinely helps clients grow.',
    zh: '成为源自南苏门答腊、享誉全印尼的技术工作室，以诚实的工匠精神与整洁的代码为客户创造真实商业价值。',
  },
  missions: {
    id: [
      'Membuat website dan aplikasi yang cepat, mudah digunakan oleh siapa saja, dan tidak membebani klien dengan kerumitan teknis.',
      'Menjaga komunikasi yang jelas, tepat waktu, dan transparan mengenai biaya sejak hari pertama diskusi.',
      'Mendampingi pelaku usaha dari Indralaya Utara, Ogan Ilir, Palembang, hingga seluruh Indonesia dalam membangun sistem digital yang mandiri.',
    ],
    en: [
      'Build fast, accessible websites and apps without overwhelming clients with unnecessary technical jargon.',
      'Maintain clear communication, realistic timelines, and upfront pricing from day one.',
      'Support businesses in Indralaya Utara, Ogan Ilir, Palembang, and across Indonesia in owning reliable digital platforms.',
    ],
    zh: [
      '打造快速、易用的网站与软件应用，绝不用晦涩的技术术语增加客户的沟通负担。',
      '从项目第一天起保持透明的报价、清晰的沟通与守时的交付。',
      '陪伴北印德拉拉亚、奥干伊利尔、巨港乃至全印尼的企业建立自主可控的数字化系统。',
    ],
  },
  values: [
    {
      code: '01',
      title: { id: 'Kode Rapi & Mudah Dirawat', en: 'Clean, Maintainable Code', zh: '代码整洁，易于维护' },
      desc: {
        id: 'Kami menulis kode dengan struktur yang bersih agar website atau aplikasi Anda mudah ditambah fiturnya di masa depan.',
        en: 'We write well-structured code so your website or app can easily grow with new features in the future.',
        zh: '我们坚持清晰的代码结构，确保您的网站或应用在未来能够轻松扩展新功能。',
      },
    },
    {
      code: '02',
      title: { id: 'Jujur Soal Biaya & Waktu', en: 'Honest Pricing & Timelines', zh: '报价透明，按期交付' },
      desc: {
        id: 'Tidak ada biaya tersembunyi. Kami jelaskan di awal apa saja yang Anda dapatkan dan kapan proyek selesai.',
        en: 'No hidden fees. We lay out exactly what you get and when it will be delivered before we start.',
        zh: '绝无隐形收费。在项目启动前，我们会明确列出交付清单与上线时间表。',
      },
    },
    {
      code: '03',
      title: { id: 'Desain yang Memudahkan', en: 'Practical, Clear Design', zh: '实用直观的界面设计' },
      desc: {
        id: 'Desain bagus bukan berarti rumit. Kami mengutamakan kenyamanan pengunjung saat mencari info atau bertransaksi.',
        en: 'Good design isn’t complicated. We prioritize how easily visitors can find info or complete a purchase.',
        zh: '好的设计从不故弄玄虚，我们优先确保访客能快速找到所需信息或顺畅完成交易。',
      },
    },
    {
      code: '04',
      title: { id: 'Didampingi Sampai Bisa', en: 'Full Handover & Support', zh: '全程陪跑，包教包会' },
      desc: {
        id: 'Setelah website selesai, kami ajarkan cara mengelola CMS-nya dan tetap siap membantu jika ada kendala.',
        en: 'Once launched, we walk your team through the CMS and stay available whenever you need a hand.',
        zh: '项目上线后，我们会手把手指导您的团队使用 CMS 后台，并随时提供后续技术支持。',
      },
    },
  ],
  leadership: [
    {
      name: 'Raka Pratama',
      role: { id: 'Lead Software Architect', en: 'Lead Software Architect', zh: '首席软件架构师' },
      image: ASSETS.leadership.exec1,
    },
    {
      name: 'Dimas Aditya',
      role: { id: 'Full-Stack Web Developer', en: 'Full-Stack Web Developer', zh: '全栈 Web 开发工程师' },
      image: ASSETS.leadership.exec2,
    },
    {
      name: 'Nadia Kusuma',
      role: { id: 'UI/UX & Product Designer', en: 'UI/UX & Product Designer', zh: 'UI/UX 产品设计师' },
      image: ASSETS.leadership.exec3,
    },
    {
      name: 'Bima Santoso',
      role: { id: 'Cloud & Mobile Engineer', en: 'Cloud & Mobile Engineer', zh: '云架构与移动端工程师' },
      image: ASSETS.leadership.exec4,
    },
  ],
};

export const FAQ_ITEMS = [
  {
    category: 'General',
    q: {
      id: 'Di mana lokasi kantor atau studio Kodein?',
      en: 'Where is Kodein located?',
      zh: 'Kodein 的工作室位于哪里？',
    },
    a: {
      id: 'Studio Kodein berlokasi di Gang Lampung 1, Indralaya Utara, Kabupaten Ogan Ilir, Sumatera Selatan. Kami melayani pertemuan langsung di sekitar Indralaya/Palembang maupun pengerjaan proyek secara online untuk klien di seluruh Indonesia dan luar negeri.',
      en: 'Kodein is based at Gang Lampung 1, Indralaya Utara, Ogan Ilir Regency, South Sumatra. We welcome in-person meetings around Indralaya and Palembang, and work seamlessly online with clients across Indonesia and abroad.',
      zh: 'Kodein 工作室位于印尼南苏门答腊省奥干伊利尔县 (Ogan Ilir) 北印德拉拉亚 Gang Lampung 1。我们支持印德拉拉亚及巨港地区的线下当面洽谈，同时也为全印尼及海外客户提供高效的远程项目开发服务。',
    },
  },
  {
    category: 'Services',
    q: {
      id: 'Apa saja yang bisa dibuat oleh Kodein?',
      en: 'What kind of websites and software can Kodein build?',
      zh: 'Kodein 可以开发哪些类型的网站和软件？',
    },
    a: {
      id: 'Kami melayani pembuatan website profil perusahaan/instansi, toko online (e-commerce), sistem informasi kustom (kasir/POS, gudang, akademik, HRIS), aplikasi mobile Android & iOS, hingga integrasi chatbot AI.',
      en: 'We build company profile websites, e-commerce stores, custom web systems (POS, inventory, academic portals, HRIS), Android & iOS mobile apps, and custom AI chatbots.',
      zh: '我们提供企业与机构官网建设、电商平台、定制业务系统（收银 POS、库存、教务、人事系统）、Android 与 iOS 移动应用以及 AI 智能客服集成。',
    },
  },
  {
    category: 'CMS',
    q: {
      id: 'Apakah saya bisa mengubah isi website sendiri tanpa harus paham koding?',
      en: 'Can I update the website content myself without coding knowledge?',
      zh: '不懂编程的话，我可以自己修改网站内容吗？',
    },
    a: {
      id: 'Tentu saja. Website buatan Kodein sudah dilengkapi halaman CMS (Content Management System) bawaan. Anda cukup login, lalu bisa menambah artikel berita, mengubah angka statistik, atau mengganti teks langsung dari browser.',
      en: 'Absolutely. Websites built by Kodein come with a built-in CMS dashboard. You can log in and publish articles, update statistics, or edit page copy directly from your browser.',
      zh: '完全可以。Kodein 开发的网站均内置可视化 CMS 内容管理系统，您只需登录后台即可在浏览器中直接发布文章、修改统计数据或更新页面文字。',
    },
  },
  {
    category: 'Support',
    q: {
      id: 'Bagaimana jika setelah website jadi ada error atau saya butuh bantuan?',
      en: 'What if something breaks after launch or I need help?',
      zh: '网站上线后如果遇到故障或需要技术协助怎么办？',
    },
    a: {
      id: 'Setiap proyek mendapatkan garansi perbaikan bug gratis pasca-peluncuran. Tim kami juga selalu bisa dihubungi untuk membantu perawatan bulanan maupun penambahan fitur baru.',
      en: 'Every project includes a free post-launch bug warranty. Our team also remains available for monthly maintenance or future feature additions.',
      zh: '每个交付项目均包含上线后的免费 Bug 保修期。此外，我们的团队随时为您提供包月运维或后续新功能迭代服务。',
    },
  },
];
