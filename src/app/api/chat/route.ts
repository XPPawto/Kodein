import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isRequestAuthorized, verifyCsrfOrigin, getClientIp } from '@/lib/cmsAuth';
import { sanitizeText } from '@/lib/utils';
import {
  checkEnterpriseRateLimit,
  inspectPayloadForThreats,
  rateLimitErrorResponse,
  recordSecurityEvent,
  verifyEnterpriseCsrf,
} from '@/lib/enterpriseSecurity';

export interface ChatMessage {
  id: string;
  sender: 'visitor' | 'bot' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatSession {
  sessionId: string;
  visitorName: string;
  visitorContact: string;
  locale: 'id' | 'en' | 'zh';
  status: 'active' | 'human_joined' | 'resolved';
  unreadAdmin: number;
  unreadVisitor: number;
  updatedAt: string;
  createdAt: string;
  messages: ChatMessage[];
}

interface ChatDatabase {
  sessions: ChatSession[];
}

const CHAT_DB_PATH = path.join(process.cwd(), 'data', 'livechat.json');
const MAX_SESSIONS = 150;
const MAX_MESSAGES_PER_SESSION = 80;

function readChatDb(): ChatDatabase {
  try {
    if (!fs.existsSync(CHAT_DB_PATH)) {
      const initial: ChatDatabase = { sessions: [] };
      fs.mkdirSync(path.dirname(CHAT_DB_PATH), { recursive: true });
      fs.writeFileSync(CHAT_DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(CHAT_DB_PATH, 'utf8');
    const parsed = JSON.parse(raw) as ChatDatabase;
    return Array.isArray(parsed.sessions) ? parsed : { sessions: [] };
  } catch {
    return { sessions: [] };
  }
}

function writeChatDb(db: ChatDatabase) {
  try {
    fs.mkdirSync(path.dirname(CHAT_DB_PATH), { recursive: true });
    const trimmed: ChatDatabase = {
      sessions: db.sessions.slice(0, MAX_SESSIONS),
    };
    fs.writeFileSync(CHAT_DB_PATH, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch {
    // Ignore write failure on read-only fs
  }
}

function generateSmartReply(text: string, locale: 'id' | 'en' | 'zh'): string {
  const q = text.toLowerCase();

  // Pricing / Cost / Harga / Biaya
  if (/(harga|biaya|price|cost|pricing|paket|budget|tarif|berapa|报价|价格|费用)/.test(q)) {
    if (locale === 'en') {
      return 'Our project engagements follow 3 flexible models: Fixed-Price (company profile & standard web apps starting with clear milestone billing), Dedicated Squad (monthly engineering allocation), and Server/SLA Retainer. Share your project scope or contact number here and our lead engineer will send a tailored breakdown.';
    }
    if (locale === 'zh') {
      return '我们提供三种合作模式：固定总价项目制（企业官网与定制系统按里程碑付款）、专属工程团队按月配置以及长期服务器运维 SLA。您可以在此留下项目需求或联系方式，我们的主任工程师将立即为您提供报价方案。';
    }
    return 'Kodein menyediakan 3 skema kerja sama: Fixed-Price (harga pasti sesuai ruang lingkup untuk website profil, toko online, atau sistem kustom), Dedicated Team (alokasi tim bulanan), serta Maintenance & Server SLA. Silakan tulis gambaran fitur yang Anda butuhkan atau tinggalkan nomor WhatsApp Anda, tim engineer kami segera merespons di chat ini.';
  }

  // Timeline / Duration / Lama pengerjaan
  if (/(lama|waktu|berapa hari|durasi|timeline|deadline|cepat|turnaround|周期|多久|时间)/.test(q)) {
    if (locale === 'en') {
      return 'A standard company profile website with custom CMS takes ~14 days from kickoff to launch. Custom web apps, ERP/inventory systems, and mobile apps (Android/iOS) typically take 4–10 weeks depending on integrations (e.g. QRIS/Virtual Account).';
    }
    if (locale === 'zh') {
      return '标准企业官网（含自主 CMS 后台）交付周期约为 14 天；定制 Web 系统、ERP 库存平台或 Android/iOS 移动应用通常需要 4 至 10 周（视支付网关与业务复杂度而定）。';
    }
    return 'Untuk website profil perusahaan standar lengkap dengan CMS mandiri, waktu pengerjaan rata-rata 14 hari kerja. Untuk sistem informasi kustom, dashboard operasional, atau aplikasi mobile (Android & iOS + QRIS) berkisar 4–10 minggu sesuai kompleksitas fitur.';
  }

  // Mobile App / QRIS / Payment
  if (/(mobile|android|ios|aplikasi hp|qris|payment|pembayaran|toko online|ecommerce|移动|支付)/.test(q)) {
    if (locale === 'en') {
      return 'We build high-performance Android & iOS mobile applications and e-commerce platforms integrated with automated QRIS, Virtual Accounts, and real-time admin dashboards. Tell us about your business workflow and our team will assist you right here.';
    }
    if (locale === 'zh') {
      return '我们开发高性能 Android 与 iOS 移动应用及电商系统，支持 QRIS、虚拟账户自动清算与实时管理后台。请告诉我们您的业务场景，工程师将马上为您解答。';
    }
    return 'Kami mengembangkan aplikasi mobile Android & iOS serta web transaksi yang terintegrasi penuh dengan pembayaran otomatis (QRIS, Virtual Account, E-Wallet) dan dashboard admin real-time. Ada alur fitur spesifik yang sedang Anda rencanakan?';
  }

  // Custom System / ERP / AI / CMS
  if (/(sistem|erp|inventaris|sekolah|kampus|portal|ai|chatbot|cms|custom|kustom|定制|系统)/.test(q)) {
    if (locale === 'en') {
      return 'Our Custom Systems & AI unit (DIM) builds inventory/ERP platforms, academic portals, self-service CMS dashboards, and 24/7 AI customer triage workflows. Every system includes full source documentation and bug-warranty SLA.';
    }
    if (locale === 'zh') {
      return '我们的定制系统与 AI 部门专注于开发企业库存/ERP 平台、高校门户、零代码自主 CMS 以及全天候 AI 智能客服工作流，并提供完整源码文档与质保 SLA。';
    }
    return 'Unit Sistem Kustom & AI kami menangani pembuatan sistem inventaris/ERP, portal akademik, dashboard operasional, hingga integrasi AI & CMS mandiri yang mudah dikelola tim non-teknis. Seluruh proyek dilengkapi garansi purnajual & NDA.';
  }

  // Location / Office / Alamat
  if (/(lokasi|alamat|kantor|dimana|indralaya|ogan ilir|palembang|location|office|地址|位置)/.test(q)) {
    if (locale === 'en') {
      return 'Our engineering studio is located at Gang Lampung 1, Indralaya Utara, Ogan Ilir, South Sumatra. We work both onsite across South Sumatra (Ogan Ilir & Palembang) and remotely for clients in Jakarta and abroad.';
    }
    if (locale === 'zh') {
      return '我们的软件工程工作室位于印尼南苏门答腊省奥干伊利尔县北印德拉拉亚 Gang Lampung 1，同时为巨港、雅加达及海外客户提供远程与现场交付服务。';
    }
    return 'Studio utama Kodein berlokasi di Gang Lampung 1, Indralaya Utara, Kabupaten Ogan Ilir, Sumatera Selatan. Kami melayani diskusi tatap muka di area Ogan Ilir & Palembang maupun kolaborasi online untuk klien di seluruh Indonesia.';
  }

  // Default helpful response
  if (locale === 'en') {
    return 'Thank you for reaching out to Kodein. Your message has been routed to our live engineering desk. Feel free to share your project details or WhatsApp/Email contact—an engineer can reply directly in this chat window.';
  }
  if (locale === 'zh') {
    return '感谢联系 Kodein！您的消息已同步至我们的工程师工作台。请继续补充您的项目需求或留下联系方式，我们的工程师可直接在当前窗口与您实时对话。';
  }
  return 'Terima kasih telah menghubungi Kodein. Pesan Anda sudah masuk ke dashboard LiveChat tim engineer kami. Silakan ceritakan kebutuhan proyek Anda atau cantumkan kontak WhatsApp/Email—tim kami dapat membalas langsung di ruang chat ini.';
}

export async function GET(request: Request) {
  const rate = checkEnterpriseRateLimit(request, 'public_read', '/api/chat');
  if (!rate.allowed) {
    return rateLimitErrorResponse(rate);
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');
  const sessionId = searchParams.get('sessionId');

  const db = readChatDb();

  // Admin mode: return all chat sessions (requires authenticated CMS session)
  if (mode === 'admin') {
    if (!isRequestAuthorized()) {
      return NextResponse.json({ error: 'Unauthorized CMS access' }, { status: 401 });
    }
    return NextResponse.json(
      { sessions: db.sessions },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  // Visitor mode: return specific session by sessionId
  if (!sessionId || sessionId.length < 8 || sessionId.length > 80) {
    return NextResponse.json({ session: null }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const session = db.sessions.find((s) => s.sessionId === sessionId) || null;
  if (session && session.unreadVisitor > 0) {
    session.unreadVisitor = 0;
    writeChatDb(db);
  }

  return NextResponse.json({ session }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!verifyEnterpriseCsrf(request, '/api/chat')) {
    return NextResponse.json({ error: 'Invalid origin (CSRF Protection)' }, { status: 403 });
  }

  const rate = checkEnterpriseRateLimit(request, 'public_form', '/api/chat');
  if (!rate.allowed) {
    return rateLimitErrorResponse(rate);
  }

  try {
    const body = await request.json();
    const inspection = inspectPayloadForThreats(body, request, '/api/chat');
    if (!inspection.safe) {
      return NextResponse.json(
        { error: 'Payload blocked by Kodein Enterprise WAF', code: inspection.threat },
        { status: 403 }
      );
    }

    const action = String(body.action || 'visitor_message');
    const sessionId = sanitizeText(String(body.sessionId || '')).slice(0, 80);

    if (!sessionId || sessionId.length < 8) {
      return NextResponse.json({ error: 'Invalid sessionId' }, { status: 400 });
    }

    const db = readChatDb();
    const now = new Date().toISOString();

    // Admin Reply or Status Update from CMS Studio
    if (action === 'admin_reply' || action === 'admin_status') {
      if (!verifyCsrfOrigin(request) || !isRequestAuthorized()) {
        return NextResponse.json({ error: 'Unauthorized CMS access' }, { status: 401 });
      }

      const target = db.sessions.find((s) => s.sessionId === sessionId);
      if (!target) {
        return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
      }

      if (action === 'admin_status') {
        const nextStatus = body.status === 'resolved' ? 'resolved' : 'active';
        target.status = nextStatus;
        target.unreadAdmin = 0;
        target.updatedAt = now;
        writeChatDb(db);
        return NextResponse.json({ session: target, sessions: db.sessions });
      }

      const replyText = sanitizeText(String(body.text || '')).slice(0, 1500);
      const adminName = sanitizeText(String(body.senderName || 'Engineer Kodein')).slice(0, 60);
      if (!replyText) {
        return NextResponse.json({ error: 'Empty message' }, { status: 400 });
      }

      target.messages.push({
        id: `adm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender: 'admin',
        senderName: adminName,
        text: replyText,
        timestamp: now,
      });
      target.status = 'human_joined';
      target.unreadAdmin = 0;
      target.unreadVisitor += 1;
      target.updatedAt = now;

      // Sort most recently updated session to top
      db.sessions.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
      writeChatDb(db);

      recordSecurityEvent(
        'CMS_MUTATION',
        'info',
        getClientIp(),
        '/api/chat',
        `Admin replied to livechat session ${sessionId.slice(0, 12)}`
      );

      return NextResponse.json({ session: target, sessions: db.sessions });
    }

    // Visitor Profile Update
    if (action === 'update_profile') {
      const visitorName = sanitizeText(String(body.visitorName || '')).slice(0, 80);
      const visitorContact = sanitizeText(String(body.visitorContact || '')).slice(0, 120);
      let session = db.sessions.find((s) => s.sessionId === sessionId);
      if (session) {
        if (visitorName) session.visitorName = visitorName;
        if (visitorContact) session.visitorContact = visitorContact;
        session.updatedAt = now;
        writeChatDb(db);
      }
      return NextResponse.json({ session: session || null });
    }

    // Visitor Message
    const rawText = sanitizeText(String(body.text || '')).slice(0, 1500);
    if (!rawText) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const locale: 'id' | 'en' | 'zh' =
      body.locale === 'en' ? 'en' : body.locale === 'zh' ? 'zh' : 'id';
    const visitorName = sanitizeText(String(body.visitorName || 'Pengunjung')).slice(0, 80);
    const visitorContact = sanitizeText(String(body.visitorContact || '')).slice(0, 120);

    let session = db.sessions.find((s) => s.sessionId === sessionId);
    if (!session) {
      session = {
        sessionId,
        visitorName: visitorName || 'Pengunjung',
        visitorContact,
        locale,
        status: 'active',
        unreadAdmin: 0,
        unreadVisitor: 0,
        createdAt: now,
        updatedAt: now,
        messages: [],
      };
      db.sessions.unshift(session);
    } else {
      if (visitorName && visitorName !== 'Pengunjung') session.visitorName = visitorName;
      if (visitorContact) session.visitorContact = visitorContact;
      session.locale = locale;
    }

    if (session.messages.length >= MAX_MESSAGES_PER_SESSION) {
      session.messages = session.messages.slice(-MAX_MESSAGES_PER_SESSION + 2);
    }

    session.messages.push({
      id: `vis-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender: 'visitor',
      senderName: session.visitorName,
      text: rawText,
      timestamp: now,
    });
    session.unreadAdmin += 1;
    session.updatedAt = now;

    // Provide instant intelligent concierge response unless a human admin has taken over the thread
    const hasHumanAdminReplied = session.messages.some((m) => m.sender === 'admin');
    if (!hasHumanAdminReplied) {
      const botReply = generateSmartReply(rawText, locale);
      session.messages.push({
        id: `bot-${Date.now() + 1}-${Math.random().toString(36).slice(2, 6)}`,
        sender: 'bot',
        senderName: 'Kodein Concierge',
        text: botReply,
        timestamp: new Date(Date.now() + 300).toISOString(),
      });
    }

    db.sessions.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    writeChatDb(db);

    return NextResponse.json({ session });
  } catch {
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (
    !verifyCsrfOrigin(request) ||
    !verifyEnterpriseCsrf(request, '/api/chat') ||
    !isRequestAuthorized()
  ) {
    return NextResponse.json({ error: 'Unauthorized CMS access' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const db = readChatDb();
  db.sessions = db.sessions.filter((s) => s.sessionId !== sessionId);
  writeChatDb(db);

  return NextResponse.json({ sessions: db.sessions });
}
