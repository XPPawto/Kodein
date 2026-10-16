'use client';

import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FilePlus2,
  BarChart3,
  Settings,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  LogOut,
  AlertTriangle,
  MessageSquare,
  Send,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { useCmsData } from '@/lib/cmsClient';
import { ASSETS } from '@/content/assets';
import { Article, ArticleCategory } from '@/content/types';
import { Locale } from '@/i18n';
import type { ChatSession } from '@/app/api/chat/route';

export default function CmsPage() {
  const locale = useLocale() as Locale;
  const { data, refresh } = useCmsData();

  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'articles' | 'stats' | 'general' | 'livechat'>('articles');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // LiveChat Admin Inbox State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [adminSenderName, setAdminSenderName] = useState('Engineer Kodein');
  const [sendingReply, setSendingReply] = useState(false);

  // Form tambah artikel
  const [category, setCategory] = useState<ArticleCategory>('press-release');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState<string>(ASSETS.hero.slide1);
  const [titleId, setTitleId] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleZh, setTitleZh] = useState('');
  const [excerptId, setExcerptId] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [excerptZh, setExcerptZh] = useState('');
  const [bodyId, setBodyId] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [bodyZh, setBodyZh] = useState('');

  // State profil & lokasi
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [statementId, setStatementId] = useState('');
  const [statementEn, setStatementEn] = useState('');
  const [statementZh, setStatementZh] = useState('');

  useEffect(() => {
    const verifyExistingSession = async () => {
      try {
        const res = await fetch('/api/cms/auth', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) {
            setAuthenticated(true);
          }
        }
      } finally {
        setCheckingSession(false);
      }
    };
    verifyExistingSession();
  }, []);

  useEffect(() => {
    if (authenticated) {
      setAddress(data.address);
      setEmail(data.email);
      setPhone(data.phone);
      setStatementId(data.aboutStatement.id);
      setStatementEn(data.aboutStatement.en);
      setStatementZh(data.aboutStatement.zh);
    }
  }, [authenticated, data]);

  useEffect(() => {
    if (!authenticated) return;
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/chat?mode=admin', { cache: 'no-store' });
        if (res.ok) {
          const json = (await res.json()) as { sessions: ChatSession[] };
          setChatSessions(json.sessions || []);
          setSelectedSessionId((prev) => prev || json.sessions?.[0]?.sessionId || null);
        }
      } catch {
        // Ignore transient poll errors
      }
    };
    fetchChats();
    const timer = setInterval(fetchChats, 4000);
    return () => clearInterval(timer);
  }, [authenticated]);

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/cms/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const json = await res.json();

      if (res.ok && json.authenticated) {
        setAuthenticated(true);
        setPasswordInput('');
      } else {
        setAuthError(json.error || 'Autentikasi gagal.');
      }
    } catch {
      setAuthError('Gagal menghubungi server autentikasi.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/cms/auth', { method: 'DELETE' });
    setAuthenticated(false);
    setPasswordInput('');
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleId.trim()) return;
    setSaving(true);

    const slug =
      titleId
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString(36);

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      slug,
      category,
      date,
      image: image || ASSETS.hero.slide1,
      title: {
        id: titleId,
        en: titleEn || titleId,
        zh: titleZh || titleEn || titleId,
      },
      excerpt: {
        id: excerptId || titleId,
        en: excerptEn || excerptId || titleId,
        zh: excerptZh || excerptEn || excerptId || titleId,
      },
      content: {
        id: bodyId ? bodyId.split('\n').filter(Boolean) : [excerptId || titleId],
        en: bodyEn
          ? bodyEn.split('\n').filter(Boolean)
          : [excerptEn || excerptId || titleId],
        zh: bodyZh
          ? bodyZh.split('\n').filter(Boolean)
          : [excerptZh || excerptId || titleId],
      },
    };

    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article: newArticle }),
    });

    setSaving(false);
    if (res.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (res.ok) {
      setTitleId('');
      setTitleEn('');
      setTitleZh('');
      setExcerptId('');
      setExcerptEn('');
      setExcerptZh('');
      setBodyId('');
      setBodyEn('');
      setBodyZh('');
      await refresh();
      showNotice('Artikel baru berhasil diterbitkan!');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    const res = await fetch(`/api/cms?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (res.ok) {
      await refresh();
      showNotice('Artikel berhasil dihapus.');
    }
  };

  const handleStatChange = async (statId: string, newValue: number) => {
    const updatedStats = data.stats.map((s) =>
      s.id === statId ? { ...s, value: newValue } : s
    );
    const res = await fetch('/api/cms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats: updatedStats }),
    });
    if (res.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (res.ok) {
      await refresh();
      showNotice('Angka statistik berhasil diperbarui!');
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/cms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: address || data.address,
        email: email || data.email,
        phone: phone || data.phone,
        aboutStatement: {
          id: statementId || data.aboutStatement.id,
          en: statementEn || data.aboutStatement.en,
          zh: statementZh || data.aboutStatement.zh,
        },
      }),
    });
    setSaving(false);
    if (res.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (res.ok) {
      await refresh();
      showNotice('Profil & teks utama Kodein berhasil disimpan!');
    }
  };

  const handleResetDefault = async () => {
    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' }),
    });
    if (res.ok) {
      await refresh();
      showNotice('Seluruh data dikembalikan ke pengaturan awal.');
    }
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId || !adminReplyText.trim() || sendingReply) return;
    setSendingReply(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_reply',
          sessionId: selectedSessionId,
          senderName: adminSenderName.trim() || 'Engineer Kodein',
          text: adminReplyText.trim(),
        }),
      });
      if (res.ok) {
        const json = (await res.json()) as { sessions: ChatSession[] };
        setChatSessions(json.sessions || []);
        setAdminReplyText('');
        showNotice('Balasan LiveChat berhasil dikirim ke pengunjung!');
      }
    } finally {
      setSendingReply(false);
    }
  };

  const handleDeleteChatSession = async (sid: string) => {
    const res = await fetch(`/api/chat?sessionId=${encodeURIComponent(sid)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const json = (await res.json()) as { sessions: ChatSession[] };
      setChatSessions(json.sessions || []);
      if (selectedSessionId === sid) {
        setSelectedSessionId(json.sessions?.[0]?.sessionId || null);
      }
      showNotice('Sesi percakapan LiveChat dihapus.');
    }
  };

  const totalUnreadChats = chatSessions.reduce((acc, s) => acc + (s.unreadAdmin || 0), 0);
  const activeChatSession = chatSessions.find((s) => s.sessionId === selectedSessionId) || null;

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center text-zinc-400 text-sm">
        Memverifikasi sesi keamanan...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-brand-dark pt-36 pb-24 px-6 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-brand-charcoal p-8 text-white shadow-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red">
            <ShieldCheck className="h-4 w-4"/>
            <span>Restricted Internal Portal</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold">Autentikasi Admin Kodein</h1>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Halaman ini tersembunyi dari publik dan dilindungi enkripsi sesi server-side serta pembatas percobaan login (Brute-Force Protection).
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Password Administrator
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan password admin..."
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 rounded-lg border border-brand-red/40 bg-brand-red/10 px-3.5 py-2.5 text-xs text-brand-coral">
                <AlertTriangle className="h-4 w-4 shrink-0"/>
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-full bg-brand-red py-3.5 text-sm font-bold text-white hover:bg-brand-redHover transition disabled:opacity-50"
            >
              {loggingIn ? 'Memverifikasi...' : 'Masuk ke CMS Studio'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <ShieldCheck className="h-4 w-4"/>
              <span>Sesi Terenkripsi Aktif (HttpOnly + Anti-CSRF)</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold">CMS Studio Kodein (ID / EN / ZH)</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Kelola artikel studi kasus, angka statistik, LiveChat pengunjung, dan informasi kontak Kodein secara langsung.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:border-brand-red hover:text-white transition"
            >
              <RotateCcw className="h-3.5 w-3.5"/>
              <span>Reset Default</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-redHover transition"
            >
              <LogOut className="h-3.5 w-3.5"/>
              <span>Kunci & Keluar</span>
            </button>
          </div>
        </div>

        {toast && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-5 py-3.5 text-sm text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400"/>
            <span>{toast}</span>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'articles'
                ? 'bg-brand-red text-white'
                : 'bg-brand-charcoal text-zinc-400 hover:text-white'
            }`}
          >
            <FilePlus2 className="h-4 w-4"/>
            <span>Artikel & Studi Kasus ({data.articles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'stats'
                ? 'bg-brand-red text-white'
                : 'bg-brand-charcoal text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4"/>
            <span>Angka Statistik ({data.stats.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'general'
                ? 'bg-brand-red text-white'
                : 'bg-brand-charcoal text-zinc-400 hover:text-white'
            }`}
          >
            <Settings className="h-4 w-4"/>
            <span>Teks Utama & Lokasi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('livechat')}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'livechat'
                ? 'bg-brand-red text-white'
                : 'bg-brand-charcoal text-zinc-400 hover:text-white'
            }`}
          >
            <MessageSquare className="h-4 w-4"/>
            <span>LiveChat Masuk ({chatSessions.length})</span>
            {totalUnreadChats > 0 && (
              <span className="ml-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-black">
                {totalUnreadChats} baru
              </span>
            )}
          </button>
        </div>

        {activeTab === 'articles' && (
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <form
              onSubmit={handleAddArticle}
              className="lg:col-span-5 space-y-4 rounded-2xl border border-white/10 bg-brand-charcoal p-6"
            >
              <h2 className="text-lg font-bold">Tambah Artikel / Portofolio Baru</h2>
              <p className="text-xs text-zinc-400">
                Jika bahasa Inggris/Mandarin dikosongkan, sistem otomatis memakai teks bahasa Indonesia.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                  >
                    <option value="press-release">Studi Kasus (Press Release)</option>
                    <option value="announcement">Kabar Kodein (Announcement)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400">
                  URL Gambar Sampul (Unsplash)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-brand-coral">
                  Judul Bahasa Indonesia *
                </label>
                <input
                  required
                  value={titleId}
                  onChange={(e) => setTitleId(e.target.value)}
                  placeholder="Contoh: Peluncuran Website E-Commerce Batik Ogan Ilir"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400">
                    Judul English (Opsional)
                  </label>
                  <input
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="English Title..."
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400">
                    Judul Mandarin 中文 (Opsional)
                  </label>
                  <input
                    value={titleZh}
                    onChange={(e) => setTitleZh(e.target.value)}
                    placeholder="中文标题..."
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400">
                  Ringkasan Singkat (ID)
                </label>
                <input
                  value={excerptId}
                  onChange={(e) => setExcerptId(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat..."
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400">
                  Isi Artikel Lengkap (ID — Pisahkan paragraf dengan Enter)
                </label>
                <textarea
                  rows={4}
                  value={bodyId}
                  onChange={(e) => setBodyId(e.target.value)}
                  placeholder="Tulis isi artikel atau cerita studi kasus di sini..."
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 p-3 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-brand-red py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-redHover transition"
              >
                {saving ? 'Menyimpan...' : 'Terbitkan Artikel'}
              </button>
            </form>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-lg font-bold">
                Daftar Artikel Aktif (5 Teratas Tampil di Hero Beranda)
              </h2>
              {data.articles.map((art, index) => (
                <div
                  key={art.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-brand-charcoal p-5"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                      {index < 5 && (
                        <span className="rounded bg-brand-red px-2 py-0.5 text-white">
                          Hero Slide #{index + 1}
                        </span>
                      )}
                      <span className="text-zinc-400">{art.date}</span>
                    </div>
                    <h3 className="mt-2 font-bold text-white">{art.title[locale]}</h3>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                      {art.excerpt[locale]}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteArticle(art.id)}
                    aria-label="Hapus artikel"
                    className="shrink-0 rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-brand-red hover:text-brand-red transition"
                  >
                    <Trash2 className="h-4 w-4"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-2xl border border-white/10 bg-brand-charcoal p-6 space-y-4"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-brand-red">
                  {stat.label[locale]}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-zinc-400">{stat.prefix || ''}</span>
                  <input
                    key={`${stat.id}-${stat.value}`}
                    type="number"
                    defaultValue={stat.value}
                    onBlur={(e) => handleStatChange(stat.id, Number(e.target.value))}
                    className="w-32 rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xl font-extrabold text-white focus:border-brand-red focus:outline-none"
                  />
                  <span className="text-sm text-zinc-400">{stat.suffix || ''}</span>
                </div>
                <p className="text-xs text-zinc-400">{stat.description[locale]}</p>
                <p className="text-[11px] text-zinc-500">
                  *Ubah angka lalu klik di luar kotak untuk menyimpan otomatis.
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'general' && (
          <form
            onSubmit={handleSaveGeneral}
            className="mt-10 max-w-3xl space-y-6 rounded-2xl border border-white/10 bg-brand-charcoal p-8"
          >
            <h2 className="text-xl font-bold">Pengaturan Lokasi & Teks Utama Kodein</h2>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300">
                Alamat Studio Kodein
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-300">
                  Email Kontak
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-300">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-coral">
                Pernyataan Utama Tentang Kodein (Bahasa Indonesia)
              </label>
              <textarea
                rows={3}
                value={statementId}
                onChange={(e) => setStatementId(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300">
                Main Statement (English)
              </label>
              <textarea
                rows={3}
                value={statementEn}
                onChange={(e) => setStatementEn(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300">
                核心介绍 (中文 Mandarin)
              </label>
              <textarea
                rows={3}
                value={statementZh}
                onChange={(e) => setStatementZh(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-8 py-3.5 text-sm font-bold text-white hover:bg-brand-redHover transition"
            >
              <Save className="h-4 w-4"/>
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </form>
        )}

        {activeTab === 'livechat' && (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Daftar Sesi Pengunjung */}
            <div className="lg:col-span-4 space-y-3 rounded-2xl border border-white/10 bg-brand-charcoal p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Sesi Percakapan ({chatSessions.length})
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                  Auto-Sync 4s
                </span>
              </div>

              {chatSessions.length === 0 ? (
                <p className="py-12 text-center text-xs text-zinc-500">
                  Belum ada pesan masuk dari pengunjung.
                </p>
              ) : (
                <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
                  {chatSessions.map((sess) => {
                    const lastMsg = sess.messages[sess.messages.length - 1];
                    const isSelected = sess.sessionId === selectedSessionId;
                    return (
                      <div
                        key={sess.sessionId}
                        onClick={() => setSelectedSessionId(sess.sessionId)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedSessionId(sess.sessionId);
                          }
                        }}
                        className={`cursor-pointer rounded-xl border p-3.5 transition ${
                          isSelected
                            ? 'border-brand-red bg-brand-red/15'
                            : 'border-white/10 bg-black/40 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-bold text-white">
                            {sess.visitorName || 'Pengunjung'}
                          </span>
                          {sess.unreadAdmin > 0 && (
                            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-black">
                              {sess.unreadAdmin} baru
                            </span>
                          )}
                        </div>
                        {sess.visitorContact && (
                          <div className="mt-0.5 truncate font-mono text-[11px] text-brand-coral">
                            {sess.visitorContact}
                          </div>
                        )}
                        {lastMsg && (
                          <p className="mt-1.5 line-clamp-2 text-xs text-zinc-400">
                            <strong className="text-zinc-300">{lastMsg.senderName}:</strong>{' '}
                            {lastMsg.text}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Ruang Chat & Balasan Real-Time */}
            <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl border border-white/10 bg-brand-charcoal p-6">
              {!activeChatSession ? (
                <div className="flex h-[460px] items-center justify-center text-sm text-zinc-500">
                  Pilih salah satu sesi percakapan di sebelah kiri untuk membaca dan membalas.
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {activeChatSession.visitorName || 'Pengunjung'}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {activeChatSession.visitorContact
                          ? `Kontak: ${activeChatSession.visitorContact}`
                          : 'Belum menyertakan nomor WhatsApp/Email'}{' '}
                        • Bahasa: {activeChatSession.locale.toUpperCase()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteChatSession(activeChatSession.sessionId)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-zinc-400 hover:border-brand-red hover:text-brand-red transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus Sesi</span>
                    </button>
                  </div>

                  <div className="my-4 h-[360px] space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-4">
                    {activeChatSession.messages.map((m) => {
                      const isAdmin = m.sender === 'admin';
                      const isVisitor = m.sender === 'visitor';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                        >
                          <span className="mb-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                            {m.senderName} •{' '}
                            {new Date(m.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <div
                            className={`max-w-[80%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                              isAdmin
                                ? 'bg-emerald-600 text-white'
                                : isVisitor
                                  ? 'bg-brand-red text-white'
                                  : 'border border-white/10 bg-zinc-900 text-zinc-300'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendAdminReply} className="space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={adminSenderName}
                        onChange={(e) => setAdminSenderName(e.target.value)}
                        placeholder="Nama Pengirim (mis. Engineer Kodein)"
                        className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2.5 text-xs text-white sm:w-48"
                      />
                      <input
                        type="text"
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        placeholder="Ketik balasan langsung ke layar pengunjung..."
                        className="flex-1 rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-brand-red focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!adminReplyText.trim() || sendingReply}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-red px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-redHover transition disabled:opacity-40"
                      >
                        <span>{sendingReply ? 'Mengirim...' : 'Balas Live'}</span>
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
