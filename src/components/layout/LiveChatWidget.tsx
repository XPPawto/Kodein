'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send, ArrowUpRight, UserCheck } from 'lucide-react';
import { KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { useCmsData } from '@/lib/cmsClient';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n';
import type { ChatMessage, ChatSession } from '@/app/api/chat/route';

const STORAGE_SESSION_KEY = 'kodein_livechat_session_v1';
const STORAGE_PROFILE_KEY = 'kodein_livechat_profile_v1';

const COPY: Record<
  Locale,
  {
    launcherLabel: string;
    headerTitle: string;
    headerStatus: string;
    humanJoinedStatus: string;
    welcomeMessage: string;
    placeholder: string;
    send: string;
    whatsappBtn: string;
    profileTitle: string;
    namePlaceholder: string;
    contactPlaceholder: string;
    saveProfile: string;
    quickPrompts: string[];
  }
> = {
  id: {
    launcherLabel: 'LiveChat',
    headerTitle: 'KODEIN LIVE DESK',
    headerStatus: 'Online • Respons Cepat & Engineer Langsung',
    humanJoinedStatus: 'Terhubung dengan Engineer Kodein',
    welcomeMessage:
      'Halo! Selamat datang di Studio Kodein. Tanyakan estimasi biaya, waktu pengerjaan, atau konsultasikan sistem yang ingin Anda bangun.',
    placeholder: 'Tulis pesan Anda...',
    send: 'Kirim',
    whatsappBtn: 'WhatsApp',
    profileTitle: 'Info Kontak Anda (Opsional)',
    namePlaceholder: 'Nama Anda',
    contactPlaceholder: 'No. WhatsApp / Email',
    saveProfile: 'Simpan',
    quickPrompts: [
      'Berapa estimasi biaya pembuatan website?',
      'Berapa lama waktu pengerjaan proyek?',
      'Bisa buat aplikasi Android/iOS + QRIS?',
      'Konsultasi Sistem Kustom / ERP / AI',
    ],
  },
  en: {
    launcherLabel: 'LiveChat',
    headerTitle: 'KODEIN LIVE DESK',
    headerStatus: 'Online • Instant Triage & Live Engineers',
    humanJoinedStatus: 'Connected with Kodein Engineer',
    welcomeMessage:
      'Welcome to Kodein Studio. Ask about project pricing, turnaround timelines, or discuss the custom system you want to build.',
    placeholder: 'Type your message...',
    send: 'Send',
    whatsappBtn: 'WhatsApp',
    profileTitle: 'Your Contact Info (Optional)',
    namePlaceholder: 'Your Name',
    contactPlaceholder: 'WhatsApp / Email',
    saveProfile: 'Save',
    quickPrompts: [
      'What are your project pricing models?',
      'How long does a website or app take?',
      'Do you build Android/iOS apps with QRIS?',
      'Custom ERP / Information System inquiry',
    ],
  },
  zh: {
    launcherLabel: '在线客服',
    headerTitle: 'KODEIN 在线工程台',
    headerStatus: '在线 • 即时响应与工程师直连',
    humanJoinedStatus: '已连接 Kodein 工程师',
    welcomeMessage:
      '您好！欢迎来到 Kodein 软件工作室。您可以咨询项目报价、交付周期，或直接描述您需要定制的系统需求。',
    placeholder: '输入您的消息...',
    send: '发送',
    whatsappBtn: 'WhatsApp',
    profileTitle: '您的联系方式（可选）',
    namePlaceholder: '您的姓名',
    contactPlaceholder: 'WhatsApp 或邮箱',
    saveProfile: '保存',
    quickPrompts: [
      '网站与系统开发的报价模式是怎样的？',
      '标准官网或定制系统需要多久交付？',
      '支持开发集成 QRIS 支付的移动应用吗？',
      '咨询企业定制 ERP / AI 自动化系统',
    ],
  },
};

export function LiveChatWidget() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const { data } = useCmsData();
  const copy = COPY[locale] || COPY.id;

  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionStatus, setSessionStatus] = useState<'active' | 'human_joined' | 'resolved'>('active');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [showProfileForm, setShowProfileForm] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorContact, setVisitorContact] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef<number>(0);

  // Initialize persistent visitor session ID & profile from localStorage
  useEffect(() => {
    try {
      let sid = localStorage.getItem(STORAGE_SESSION_KEY);
      if (!sid || sid.length < 10) {
        sid = `kdn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem(STORAGE_SESSION_KEY, sid);
      }
      setSessionId(sid);

      const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setVisitorName(parsed.name);
        if (parsed.contact) setVisitorContact(parsed.contact);
        if (parsed.name || parsed.contact) setProfileSaved(true);
      }
    } catch {
      setSessionId(`kdn-${Date.now().toString(36)}-fallback`);
    }
  }, []);

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/chat?sessionId=${encodeURIComponent(sessionId)}`, {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const json = (await res.json()) as { session: ChatSession | null };
      if (json.session) {
        const incoming = json.session.messages || [];
        if (incoming.length > lastMessageCountRef.current) {
          const newest = incoming[incoming.length - 1];
          if (!open && newest && newest.sender === 'admin') {
            setUnreadCount((c) => c + 1);
          }
          lastMessageCountRef.current = incoming.length;
        }
        setMessages(incoming);
        setSessionStatus(json.session.status);
      }
    } catch {
      // Ignore transient network errors
    }
  }, [sessionId, open]);

  // Initial fetch & live polling for admin replies from CMS Studio
  useEffect(() => {
    if (!sessionId) return;
    fetchSession();
    const interval = setInterval(fetchSession, open ? 3500 : 10000);
    return () => clearInterval(interval);
  }, [sessionId, open, fetchSession]);

  // Auto-scroll to bottom when messages change or widget opens
  useEffect(() => {
    if (open && scrollBodyRef.current) {
      scrollBodyRef.current.scrollTop = scrollBodyRef.current.scrollHeight;
      setUnreadCount(0);
    }
  }, [messages, open]);

  // Hide floating visitor widget on the internal CMS admin page
  if (pathname?.includes('/cms')) {
    return null;
  }

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || !sessionId || sending) return;

    setSending(true);
    setInputText('');

    // Optimistic append
    const optimisticMsg: ChatMessage = {
      id: `opt-${Date.now()}`,
      sender: 'visitor',
      senderName: visitorName || 'Anda',
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'visitor_message',
          sessionId,
          locale,
          visitorName: visitorName.trim() || undefined,
          visitorContact: visitorContact.trim() || undefined,
          text: trimmed,
        }),
      });
      if (res.ok) {
        const json = (await res.json()) as { session: ChatSession };
        if (json.session?.messages) {
          setMessages(json.session.messages);
          lastMessageCountRef.current = json.session.messages.length;
          setSessionStatus(json.session.status);
        }
      }
    } finally {
      setSending(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        STORAGE_PROFILE_KEY,
        JSON.stringify({ name: visitorName.trim(), contact: visitorContact.trim() })
      );
      setProfileSaved(true);
      setShowProfileForm(false);
      if (sessionId) {
        await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_profile',
            sessionId,
            visitorName: visitorName.trim(),
            visitorContact: visitorContact.trim(),
          }),
        });
      }
    } catch {
      setShowProfileForm(false);
    }
  };

  const cleanPhone = (data.phone || '+6281270008900').replace(/[^0-9]/g, '');
  const lastVisitorMsg =
    [...messages].reverse().find((m) => m.sender === 'visitor')?.text ||
    'Halo Kodein, saya ingin berdiskusi mengenai pembuatan website/sistem.';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lastVisitorMsg)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* ARCHITECTURAL CHAT PANEL */}
      {open && (
        <div
          role="dialog"
          aria-label="Kodein LiveChat"
          className="mb-3 flex h-[500px] max-h-[calc(100dvh-6.5rem)] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden border border-white/20 bg-[#0A0A0E] text-white shadow-[0_30px_90px_rgba(0,0,0,0.92)] sm:w-[380px]"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#111116] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center border border-white/15 bg-black">
                <KodeinMarkSvg variant="gradient" className="h-4 w-4" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#111116]" />
              </div>
              <div>
                <div className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  {copy.headerTitle}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <span>
                    {sessionStatus === 'human_joined'
                      ? copy.humanJoinedStatus
                      : copy.headerStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20"
              >
                <span>{copy.whatsappBtn}</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close LiveChat"
                className="flex h-7 w-7 items-center justify-center border border-white/10 text-zinc-400 transition hover:border-white/30 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Visitor Identity Bar (Collapsible) */}
          <div className="border-b border-white/10 bg-[#0D0D12] px-4 py-2">
            {!showProfileForm ? (
              <div className="flex items-center justify-between text-[11px]">
                <span className="truncate text-zinc-400">
                  {profileSaved && (visitorName || visitorContact) ? (
                    <span className="inline-flex items-center gap-1.5 text-zinc-200">
                      <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <strong className="font-semibold">{visitorName || 'Tamu'}</strong>
                      {visitorContact ? ` • ${visitorContact}` : ''}
                    </span>
                  ) : (
                    copy.profileTitle
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setShowProfileForm(true)}
                  className="ml-2 shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-red hover:underline"
                >
                  {profileSaved ? 'Ubah' : '+ Isi Kontak'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-2 py-1">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder={copy.namePlaceholder}
                    className="w-full border border-white/15 bg-black px-2.5 py-1.5 text-xs text-white focus:border-brand-red focus:outline-none"
                  />
                  <input
                    type="text"
                    value={visitorContact}
                    onChange={(e) => setVisitorContact(e.target.value)}
                    placeholder={copy.contactPlaceholder}
                    className="w-full border border-white/15 bg-black px-2.5 py-1.5 text-xs text-white focus:border-brand-red focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProfileForm(false)}
                    className="px-2 py-1 font-mono text-[10px] uppercase text-zinc-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-red px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white hover:bg-brand-redHover"
                  >
                    {copy.saveProfile}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Chat Message Stream */}
          <div
            ref={scrollBodyRef}
            className="flex-1 space-y-3.5 overflow-y-auto p-4"
          >
            {/* Initial Greeting Card */}
            <div className="border-l-2 border-brand-red bg-white/[0.03] p-3.5">
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                <span className="font-bold text-brand-red">KODEIN CONCIERGE</span>
                <span>STUDIO DESK</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-200">
                {copy.welcomeMessage}
              </p>
            </div>

            {/* Quick Prompt Buttons when conversation is empty */}
            {messages.length === 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                  TOPIK CEPAT
                </span>
                <div className="flex flex-col gap-1.5">
                  {copy.quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="border border-white/10 bg-white/[0.02] px-3 py-2 text-left text-xs text-zinc-300 transition hover:border-brand-red/60 hover:bg-brand-red/10 hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation History */}
            {messages.map((msg) => {
              const isVisitor = msg.sender === 'visitor';
              const isAdmin = msg.sender === 'admin';
              const timeStr = new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col',
                    isVisitor ? 'items-end' : 'items-start'
                  )}
                >
                  <div className="mb-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">
                    <span
                      className={cn(
                        'font-bold',
                        isAdmin
                          ? 'text-emerald-400'
                          : isVisitor
                            ? 'text-zinc-400'
                            : 'text-brand-red'
                      )}
                    >
                      {isVisitor ? msg.senderName || 'Anda' : msg.senderName}
                    </span>
                    <span>{timeStr}</span>
                  </div>
                  <div
                    className={cn(
                      'max-w-[86%] px-3.5 py-2.5 text-xs leading-relaxed',
                      isVisitor
                        ? 'bg-brand-red text-white'
                        : isAdmin
                          ? 'border border-emerald-500/40 bg-emerald-950/30 text-zinc-100'
                          : 'border border-white/10 bg-[#14141B] text-zinc-200'
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputText);
            }}
            className="flex items-center border-t border-white/15 bg-[#0E0E14] p-2.5"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={copy.placeholder}
              maxLength={1200}
              className="flex-1 bg-transparent px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              aria-label={copy.send}
              className="inline-flex h-8 items-center gap-1.5 bg-brand-red px-3.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-brand-redHover disabled:opacity-35"
            >
              <span>{copy.send}</span>
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>
      )}

      {/* FLOATING LIVECHAT LAUNCHER BUTTON */}
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          setUnreadCount(0);
        }}
        aria-expanded={open}
        aria-label="Open LiveChat"
        className={cn(
          'group relative flex h-12 items-center gap-2.5 border px-4 shadow-[0_14px_35px_rgba(0,0,0,0.75)] transition-all',
          open
            ? 'border-white/25 bg-[#121218] text-white'
            : 'border-brand-red bg-brand-red text-white hover:bg-brand-redHover'
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <MessageSquare className="h-4 w-4" />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
          {copy.launcherLabel}
        </span>

        {unreadCount > 0 && !open && (
          <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center bg-black px-1.5 font-mono text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
