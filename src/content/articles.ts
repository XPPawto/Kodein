import { ASSETS } from './assets';
import { Article } from './types';

export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'technology-innovation-investment-forum-2026',
    category: 'announcement',
    date: '2026-10-14',
    image: ASSETS.hero.slide1,
    title: {
      id: 'Kodein Hadirkan Layanan Pembuatan Website Cepat Lengkap dengan CMS Tiga Bahasa',
      en: 'Kodein Launches Fast Custom Websites Complete with Built-in Trilingual CMS',
      zh: 'Kodein 推出极速定制网站开发服务，内置印/英/中三语 CMS 后台',
    },
    excerpt: {
      id: 'Dari Indralaya Utara, Ogan Ilir, kami membantu bisnis memiliki website berstandar modern yang mudah dikelola sendiri.',
      en: 'From Indralaya Utara, Ogan Ilir, we help businesses own modern, fast websites they can easily manage themselves.',
      zh: '立足北印德拉拉亚，助力企业拥有可自主轻松管理的现代化极速网站。',
    },
    content: {
      id: [
        'INDRALAYA UTARA — Kodein memperkenalkan paket pembuatan website perusahaan dan toko online generasi terbaru yang menggabungkan kecepatan akses tinggi dengan kemudahan pengelolaan konten melalui CMS bawaan.',
        'Banyak pelaku usaha mengeluhkan website lama mereka yang berat dibuka di ponsel dan sulit diperbarui. Dengan arsitektur berbasis Next.js yang dirancang tim Kodein di Gang Lampung 1, Indralaya Utara, halaman web kini terbuka dalam hitungan detik.',
        'Selain itu, dukungan tiga bahasa (Indonesia, Inggris, dan Mandarin) membuka peluang bagi bisnis lokal dan nasional untuk menjangkau mitra serta pelanggan internasional.',
      ],
      en: [
        'INDRALAYA UTARA — Kodein introduces its latest corporate and e-commerce web development stack, combining sub-second page loads with a straightforward built-in CMS.',
        'Many business owners struggle with sluggish websites that are painful to update. Engineered by our team at Gang Lampung 1, Indralaya Utara, Ogan Ilir, our Next.js architecture ensures instant loading on both mobile and desktop.',
        'With built-in Indonesian, English, and Chinese language support, local and national businesses can confidently reach international partners and customers.',
      ],
      zh: [
        '北印德拉拉亚 — Kodein 正式推出新一代企业官网与电商平台开发方案，将秒级页面加载速度与直观的内置 CMS 管理系统完美结合。',
        '针对许多企业旧网站在手机端打开缓慢、内容更新繁琐的痛点，位于奥干伊利尔县北印德拉拉亚 Gang Lampung 1 的 Kodein 研发团队采用 Next.js 架构，实现了移动端与桌面端的极速响应。',
        '同时，系统原生支持印尼语、英语与中文三语切换，助力本地及全国企业轻松拓展国际合作与海外客户。',
      ],
    },
    quote: {
      id: 'Website yang bagus harus menjadi aset yang bekerja 24 jam untuk bisnis Anda, bukan sekadar pajangan online.',
      en: 'A good website should be a 24/7 working asset for your business, not just an online brochure.',
      zh: '优秀的网站应当成为全天候为您创造价值的业务资产，而不仅仅是一张线上名片。',
    },
  },
  {
    id: 'art-2',
    slug: 'customer-service-excellence-award-100-state-enterprises',
    category: 'press-release',
    date: '2026-10-08',
    image: ASSETS.hero.slide2,
    title: {
      id: 'Studi Kasus: Digitalisasi Sistem Inventaris & Kasir Pangkas Waktu Rekap Bulanan Hingga 70%',
      en: 'Case Study: Custom Inventory & POS System Cuts Monthly Reporting Time by 70%',
      zh: '客户案例：定制库存与收银系统助企业缩短 70% 月度对账时间',
    },
    excerpt: {
      id: 'Menggantikan pencatatan buku manual menjadi aplikasi web real-time yang bisa dipantau pemilik toko dari mana saja.',
      en: 'Replacing manual ledger books with a real-time web app that store owners can monitor from anywhere.',
      zh: '用实时同步的 Web 管理系统取代手工账本，让店主随时随地掌握经营数据。',
    },
    content: {
      id: [
        'OGAN ILIR — Salah satu tantangan terbesar bisnis distribusi dan ritel adalah selisih stok barang di gudang dengan catatan penjualan di kasir. Kodein membantu menyelesaikan masalah ini melalui pembuatan aplikasi web POS & Inventaris kustom.',
        'Kini setiap transaksi otomatis memotong stok gudang dan menyusun laporan laba-rugi harian tanpa perlu rekap ulang di akhir bulan.',
      ],
      en: [
        'OGAN ILIR — One of the biggest headaches in retail and distribution is stock discrepancy between the warehouse and the cashier desk. Kodein solved this by building a custom web-based POS and Inventory system.',
        'Every sale now automatically deducts warehouse stock and generates daily profit reports without manual end-of-month reconciliation.',
      ],
      zh: [
        '奥干伊利尔 — 零售与分销行业最常见的痛点之一是仓库库存与前台销售数据不符。Kodein 通过定制开发 Web 端收银与库存管理系统彻底解决了这一难题。',
        '如今每一笔交易都会自动扣减库存并生成每日利润报表，无需在月底进行繁琐的人工核对。',
      ],
    },
  },
  {
    id: 'art-3',
    slug: 'strategic-partnership-cyber-security-technology',
    category: 'press-release',
    date: '2026-09-29',
    image: ASSETS.hero.slide3,
    title: {
      id: 'Mengapa Keamanan Data & Backup Rutin Wajib Ada di Setiap Pembuatan Software',
      en: 'Why Data Security & Automated Backups Are Standard in Every Kodein Build',
      zh: '为什么数据安全与自动备份是 Kodein 每个软件项目的标配',
    },
    excerpt: {
      id: 'Langkah praktis yang diterapkan Kodein untuk melindungi website dan database bisnis klien dari kehilangan data.',
      en: 'Practical measures Kodein takes to protect client websites and databases against data loss and cyber threats.',
      zh: 'Kodein 采取多重实用安全策略，全面保护客户网站与业务数据库免受数据丢失威胁。',
    },
    content: {
      id: [
        'INDRALAYA UTARA — Membangun aplikasi yang kaya fitur tidak akan ada artinya jika data di dalamnya rentan hilang atau disusupi. Di Kodein, setiap proyek dilengkapi konfigurasi keamanan berlapis sejak hari pertama.',
        'Kami menerapkan enkripsi koneksi penuh, penyaringan input untuk mencegah celah keamanan, serta penjadwalan backup otomatis ke penyimpanan terpisah.',
      ],
      en: [
        'INDRALAYA UTARA — Building feature-rich software means nothing if the underlying data is vulnerable. At Kodein, every project ships with multi-layered security configured from day one.',
        'We enforce full connection encryption, strict input sanitization, and automated off-site database backups.',
      ],
      zh: [
        '北印德拉拉亚 — 如果底层数据缺乏安全保障，再丰富的功能也毫无意义。在 Kodein，每个项目从第一天起就配置了多层安全防护。',
        '我们全面实施传输加密、严格的输入过滤以及异地自动数据库备份机制。',
      ],
    },
  },
  {
    id: 'art-4',
    slug: 'sustainable-housing-expo-achieves-idr-2-trillion-project-value',
    category: 'press-release',
    date: '2026-09-18',
    image: ASSETS.hero.slide4,
    title: {
      id: 'Website Katalog & Booking Online Bantu Pengembang Properti Lokal Tingkatkan Leads 2x Lipat',
      en: 'Custom Property Catalog & Booking Website Helps Local Developer Double Buyer Leads',
      zh: '定制房产目录与在线预约网站助力本地开发商潜在客户量翻倍',
    },
    excerpt: {
      id: 'Calon pembeli kini bisa melihat denah ketersediaan kavling secara langsung dan menjadwalkan survei lokasi lewat WhatsApp.',
      en: 'Prospective buyers can check live lot availability and schedule site visits directly via WhatsApp.',
      zh: '购房者可在线实时查看房源状态，并一键通过 WhatsApp 预约现场看房。',
    },
    content: {
      id: [
        'SUMATERA SELATAN — Kodein merampungkan pengembangan website interaktif bagi pengembang perumahan yang memungkinkan calon pembeli memeriksa status unit yang masih tersedia secara real-time.',
        'Dilengkapi simulasi cicilan otomatis dan tombol penghubung ke tim marketing, website ini meningkatkan jumlah pertanyaan calon pembeli hingga dua kali lipat.',
      ],
      en: [
        'SOUTH SUMATRA — Kodein completed an interactive web platform for a residential developer, allowing prospective buyers to check unit availability in real time.',
        'Equipped with an instant installment calculator and direct WhatsApp routing to sales agents, the platform doubled qualified buyer inquiries.',
      ],
      zh: [
        '南苏门答腊 — Kodein 为本地房地产开发商打造了交互式房源展示平台，支持客户实时查询在售房源状态。',
        '配合内置的分期付款计算器与 WhatsApp 销售直连功能，该网站的精准客户咨询量提升了两倍。',
      ],
    },
  },
  {
    id: 'art-5',
    slug: 'sovereign-green-transition-forum-announcement',
    category: 'announcement',
    date: '2026-09-05',
    image: ASSETS.hero.slide5,
    title: {
      id: 'Integrasi Chatbot AI untuk Menjawab Pertanyaan Pelanggan Otomatis 24 Jam',
      en: 'Integrating Custom AI Chatbots to Answer Customer Questions 24/7',
      zh: '集成定制 AI 智能客服，实现 24 小时全自动客户问答',
    },
    excerpt: {
      id: 'Solusi praktis bagi pemilik bisnis agar tidak kehilangan calon pembeli yang menghubungi di luar jam kerja.',
      en: 'A practical solution so businesses never miss prospective buyers messaging outside office hours.',
      zh: '帮助企业在非工作时间也能秒回客户咨询，不再错失任何潜在商机。',
    },
    content: {
      id: [
        'INDRALAYA UTARA — Calon pelanggan sering kali mencari informasi harga atau ketersediaan layanan pada malam hari. Agar bisnis Anda tetap responsif, Kodein menyediakan layanan integrasi asisten AI yang dilatih khusus menggunakan informasi produk Anda.',
        'Asisten ini mampu menjawab pertanyaan dengan bahasa yang sopan dan natural, lalu meneruskan pesanan serius ke nomor admin Anda.',
      ],
      en: [
        'INDRALAYA UTARA — Customers often browse and ask about pricing late at night. To keep your business responsive, Kodein integrates custom AI assistants trained specifically on your product knowledge.',
        'The assistant answers questions naturally and forwards qualified orders straight to your admin team.',
      ],
      zh: [
        '北印德拉拉亚 — 许多潜在客户习惯在夜间浏览并咨询价格。为了让您的业务时刻保持响应，Kodein 提供基于您企业产品知识库训练的专属 AI 助手集成服务。',
        'AI 助手能够以自然礼貌的语气解答疑问，并将高意向订单直接转交给人工管理员。',
      ],
    },
  },
  {
    id: 'art-6',
    slug: 'phase-two-soe-cluster-streamlining-completion',
    category: 'press-release',
    date: '2026-08-21',
    image: ASSETS.scope.dam,
    title: {
      id: 'Pembuatan Portal Akademik & Pendaftaran Online yang Ringan Saat Diakses Serentak',
      en: 'Building Academic & Online Registration Portals That Stay Fast Under Heavy Traffic',
      zh: '打造高并发下依然流畅稳定的教务管理与在线报名门户',
    },
    excerpt: {
      id: 'Optimasi database dan tampilan antarmuka yang ramah pengguna untuk memudahkan pendaftaran siswa/mahasiswa baru.',
      en: 'Database optimization and clean forms make new student registration smooth and crash-free.',
      zh: '通过数据库优化与清晰的表单设计，让新生在线报名流程顺畅无阻。',
    },
    content: {
      id: [
        'OGAN ILIR — Saat musim pendaftaran tiba, website sekolah atau kampus sering mengalami kendala lambat diakses. Kodein merancang portal pendaftaran online dengan arsitektur ringan yang sanggup menangani lonjakan pengunjung sekaligus.',
        'Panitia pendaftaran juga dapat mengunduh berkas dan memverifikasi data pendaftar dengan cepat dari satu dashboard.',
      ],
      en: [
        'OGAN ILIR — During admission season, school and campus websites often grind to a halt. Kodein engineers lightweight online registration portals capable of handling concurrent traffic spikes.',
        'Admission staff can review documents and verify applicants quickly from a single admin dashboard.',
      ],
      zh: [
        '奥干伊利尔 — 每逢招生季，学校与机构网站常因访问量激增而瘫痪。Kodein 采用轻量级高并发架构打造在线报名系统，轻松应对访问高峰。',
        '招生人员还可通过统一后台快速审核材料并导出录取数据。',
      ],
    },
  },
  {
    id: 'art-7',
    slug: 'global-credit-rating-affirmation-stable-outlook',
    category: 'announcement',
    date: '2026-08-04',
    image: ASSETS.scope.dim,
    title: {
      id: 'Konsultasi Pembuatan Website & Aplikasi Gratis di Studio Kodein Indralaya Utara',
      en: 'Free Website & App Consultation at Kodein Studio in Indralaya Utara',
      zh: '欢迎预约 Kodein 北印德拉拉亚工作室免费网站与应用开发咨询',
    },
    excerpt: {
      id: 'Punya ide aplikasi atau ingin memperbarui website lama? Mari ngobrol santai bersama tim teknis kami.',
      en: 'Have an app idea or want to refresh an old website? Let’s talk through your options with our tech team.',
      zh: '有新应用创意或想改版旧网站？欢迎与我们的技术团队直接交流。',
    },
    content: {
      id: [
        'INDRALAYA UTARA — Anda tidak perlu paham istilah teknis untuk mulai membuat website atau software di Kodein. Cukup ceritakan masalah atau tujuan bisnis Anda kepada kami.',
        'Kunjungi studio kami di Gang Lampung 1, Indralaya Utara, Kabupaten Ogan Ilir, atau jadwalkan diskusi online melalui halaman Diskusi Proyek.',
      ],
      en: [
        'INDRALAYA UTARA — You don’t need to speak tech jargon to build software with Kodein. Just tell us how your business works and what you want to achieve.',
        'Visit our studio at Gang Lampung 1, Indralaya Utara, Ogan Ilir Regency, or book an online call via our Start a Project page.',
      ],
      zh: [
        '北印德拉拉亚 — 与 Kodein 合作无需您精通复杂的技术术语，只需告诉我们您的业务目标与面临的痛点。',
        '欢迎莅临我们位于奥干伊利尔县北印德拉拉亚 Gang Lampung 1 的工作室，或通过“项目咨询”页面预约线上沟通。',
      ],
    },
  },
  {
    id: 'art-8',
    slug: 'critical-mineral-downstreaming-fund-first-close',
    category: 'press-release',
    date: '2026-07-19',
    image: ASSETS.scope.ddmf,
    title: {
      id: 'Tips Memilih Jasa Pembuatan Website agar Tidak Terkunci dari Source Code Sendiri',
      en: 'How to Choose a Web Developer Without Getting Locked Out of Your Own Source Code',
      zh: '如何选择网站开发商，避免失去自身源码与后台控制权',
    },
    excerpt: {
      id: 'Di Kodein, kami menjamin transparansi akses penuh dan kemudahan pengelolaan jangka panjang bagi setiap klien.',
      en: 'At Kodein, we guarantee transparent CMS access and clean handover for every client project.',
      zh: 'Kodein 承诺为每位客户提供透明的 CMS 管理权限与清晰的代码移交保障。',
    },
    content: {
      id: [
        'SUMATERA SELATAN — Pastikan Anda memilih mitra teknologi yang memberikan akses pengelolaan konten secara mandiri dan perjanjian kerja yang transparan.',
        'Kodein selalu menyertakan akses CMS dan dokumentasi yang rapi agar bisnis Anda memiliki kendali penuh atas aset digitalnya.',
      ],
      en: [
        'SOUTH SUMATRA — Always choose a technology partner that gives you independent content management access and transparent terms.',
        'Kodein includes CMS access and clear documentation so your business stays in full control of its digital assets.',
      ],
      zh: [
        '南苏门答腊 — 选择技术合作伙伴时，请务必确保您拥有独立的内容管理权限与透明的合同条款。',
        'Kodein 始终交付完整的 CMS 权限与清晰的操作文档，让您的企业真正掌握自身的数字资产。',
      ],
    },
  },
];
