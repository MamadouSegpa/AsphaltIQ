import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { SignOut, ChartBar, EnvelopeOpen, Receipt, ArrowSquareOut } from "@phosphor-icons/react";
import { useAuth } from "../lib/auth";
import api, { formatApiErrorDetail } from "../lib/api";

const STATUS_CHOICES = ["new", "contacted", "quoted", "archived"];
const STATUS_STYLES = {
  new: "bg-yellow-400 text-black",
  contacted: "bg-blue-500 text-white",
  quoted: "bg-green-500 text-black",
  archived: "bg-zinc-700 text-zinc-300",
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("quotes"); // quotes | contacts
  const [quotes, setQuotes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    if (user === false) {
      navigate("/admin/login", { replace: true });
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, cRes] = await Promise.all([api.get("/quotes"), api.get("/contact")]);
      setQuotes(qRes.data);
      setContacts(cRes.data);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/quotes/${id}/status`, { status });
      setQuotes((prev) => prev.map((q) => (q.id === id ? data : q)));
      if (selectedQuote?.id === id) setSelectedQuote(data);
      toast.success("Status updated");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    }
  };

  const markContactRead = async (id) => {
    try {
      const { data } = await api.patch(`/contact/${id}/read`);
      setContacts((prev) => prev.map((c) => (c.id === id ? data : c)));
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  if (user === null || (user && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400" data-testid="admin-loading">
        Loading…
      </div>
    );
  }
  if (user === false) return null;

  const stats = {
    total: quotes.length,
    newQuotes: quotes.filter((q) => q.status === "new").length,
    unreadContacts: contacts.filter((c) => !c.is_read).length,
  };

  return (
    <div className="min-h-screen bg-black text-white" data-testid="admin-dashboard">
      {/* Top bar */}
      <header className="border-b border-white/10 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="brand-wordmark text-xl text-white" data-testid="admin-brand">
              ASPHALT <span className="text-yellow-400">ARMOUR</span>
            </Link>
            <span className="hidden sm:inline text-xs tracking-[0.2em] uppercase text-zinc-500">
              Admin Console
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-zinc-400" data-testid="admin-user-email">{user.email}</span>
            <Link to="/" target="_blank" className="text-zinc-400 hover:text-yellow-400" data-testid="admin-view-site">
              <ArrowSquareOut size={20} weight="bold" />
            </Link>
            <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-zinc-400 hover:text-yellow-400 inline-flex items-center gap-2" data-testid="admin-logout-btn">
              <SignOut size={16} weight="bold" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10" data-testid="admin-stats">
          <StatCard icon={Receipt} label="Total Quotes" value={stats.total} />
          <StatCard icon={ChartBar} label="New Quotes" value={stats.newQuotes} accent />
          <StatCard icon={EnvelopeOpen} label="Unread Contacts" value={stats.unreadContacts} />
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 mt-10">
        <div className="flex gap-px bg-white/10 w-fit" data-testid="admin-tabs">
          {[
            ["quotes", `Quote Requests (${quotes.length})`],
            ["contacts", `Messages (${contacts.length})`],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              data-testid={`tab-${k}`}
              className={`px-6 py-3 text-xs uppercase tracking-widest font-semibold ${
                tab === k ? "bg-yellow-400 text-black" : "bg-zinc-950 text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 mt-6 pb-24">
        {loading ? (
          <div className="text-zinc-500 py-16">Loading…</div>
        ) : tab === "quotes" ? (
          quotes.length === 0 ? (
            <EmptyState label="No quote requests yet." />
          ) : (
            <div className="border border-white/10 overflow-x-auto" data-testid="quotes-table-wrapper">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900 text-left">
                  <tr>
                    {["Submitted", "Name", "Contact", "Service", "Property", "Status", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs uppercase tracking-widest text-zinc-400 font-semibold border-b border-white/10">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q) => (
                    <tr key={q.id} className="border-b border-white/5 hover:bg-zinc-950" data-testid={`quote-row-${q.id}`}>
                      <td className="px-4 py-4 text-zinc-400 text-xs whitespace-nowrap">
                        {new Date(q.created_at).toLocaleDateString()}<br />
                        <span className="text-zinc-600">{new Date(q.created_at).toLocaleTimeString()}</span>
                      </td>
                      <td className="px-4 py-4 text-white font-semibold">{q.name}</td>
                      <td className="px-4 py-4 text-zinc-300">
                        <a href={`mailto:${q.email}`} className="hover:text-yellow-400 block">{q.email}</a>
                        <a href={`tel:${q.phone}`} className="hover:text-yellow-400 block text-zinc-400">{q.phone}</a>
                      </td>
                      <td className="px-4 py-4 text-zinc-300 capitalize">{q.service_type.replace("_", " ")}</td>
                      <td className="px-4 py-4 text-zinc-300 capitalize">{q.property_type}</td>
                      <td className="px-4 py-4">
                        <select
                          value={q.status}
                          onChange={(e) => updateStatus(q.id, e.target.value)}
                          data-testid={`quote-status-select-${q.id}`}
                          className={`text-xs uppercase tracking-wider font-bold px-3 py-2 border-0 cursor-pointer ${STATUS_STYLES[q.status] || ""}`}
                        >
                          {STATUS_CHOICES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelectedQuote(q)}
                          className="text-xs uppercase tracking-widest text-yellow-400 hover:text-white font-semibold"
                          data-testid={`quote-view-btn-${q.id}`}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : contacts.length === 0 ? (
          <EmptyState label="No contact messages yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10" data-testid="contacts-grid">
            {contacts.map((c) => (
              <article
                key={c.id}
                className={`p-6 border-l-2 ${c.is_read ? "bg-zinc-950 border-zinc-800" : "bg-zinc-950 border-yellow-400"}`}
                data-testid={`contact-card-${c.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white font-semibold">{c.name}</div>
                    <a href={`mailto:${c.email}`} className="text-xs text-zinc-400 hover:text-yellow-400 block">{c.email}</a>
                    {c.phone && <a href={`tel:${c.phone}`} className="text-xs text-zinc-400 hover:text-yellow-400 block">{c.phone}</a>}
                  </div>
                  <div className="text-xs text-zinc-500 whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString()}
                  </div>
                </div>
                <p className="mt-4 text-sm text-zinc-300 whitespace-pre-line">{c.message}</p>
                {!c.is_read && (
                  <button
                    onClick={() => markContactRead(c.id)}
                    className="mt-4 text-xs uppercase tracking-widest font-semibold text-yellow-400 hover:text-white"
                    data-testid={`contact-mark-read-${c.id}`}
                  >
                    Mark as read →
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Quote Detail Drawer */}
      {selectedQuote && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-end"
          onClick={() => setSelectedQuote(null)}
          data-testid="quote-detail-overlay"
        >
          <div
            className="w-full max-w-lg h-full bg-zinc-950 border-l border-white/10 overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="overline">Quote Detail</div>
              <button onClick={() => setSelectedQuote(null)} className="text-zinc-400 hover:text-white text-2xl" data-testid="quote-detail-close">×</button>
            </div>
            <h2 className="brand-wordmark text-4xl mt-4 text-white">{selectedQuote.name}</h2>
            <div className="mt-2 text-sm text-zinc-400">
              Submitted {new Date(selectedQuote.created_at).toLocaleString()}
            </div>

            <div className="mt-8 space-y-5">
              <DetailRow label="Email" value={<a href={`mailto:${selectedQuote.email}`} className="text-yellow-400 hover:underline">{selectedQuote.email}</a>} />
              <DetailRow label="Phone" value={<a href={`tel:${selectedQuote.phone}`} className="text-yellow-400 hover:underline">{selectedQuote.phone}</a>} />
              <DetailRow label="Address" value={selectedQuote.address} />
              <DetailRow label="Service" value={<span className="capitalize">{selectedQuote.service_type.replace("_", " ")}</span>} />
              <DetailRow label="Property" value={<span className="capitalize">{selectedQuote.property_type}</span>} />
              {selectedQuote.square_footage && <DetailRow label="Sq. Footage" value={selectedQuote.square_footage} />}
              {selectedQuote.notes && <DetailRow label="Notes" value={<span className="whitespace-pre-line">{selectedQuote.notes}</span>} />}
              <DetailRow
                label="Status"
                value={
                  <select
                    value={selectedQuote.status}
                    onChange={(e) => updateStatus(selectedQuote.id, e.target.value)}
                    data-testid="quote-detail-status-select"
                    className={`text-xs uppercase tracking-wider font-bold px-3 py-2 border-0 cursor-pointer ${STATUS_STYLES[selectedQuote.status]}`}
                  >
                    {STATUS_CHOICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className={`p-6 ${accent ? "bg-yellow-400 text-black" : "bg-zinc-950 text-white"}`} data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <Icon size={24} weight="bold" className={accent ? "text-black" : "text-yellow-400"} />
      <div className={`overline mt-4 ${accent ? "!text-black/70" : ""}`}>{label}</div>
      <div className="brand-wordmark text-5xl mt-2">{value}</div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <div className="overline mb-1">{label}</div>
      <div className="text-white">{value}</div>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="border border-dashed border-white/10 py-20 text-center text-zinc-500" data-testid="empty-state">
      {label}
    </div>
  );
}
