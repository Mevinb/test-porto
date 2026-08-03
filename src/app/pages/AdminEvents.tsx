import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Lock,
  Calendar,
  MapPin,
  Image,
  Tag,
  Award,
  Users,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { supabase, type Event } from '../../lib/supabase';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;

const ROLE_OPTIONS = ['Participant', 'Speaker', 'Organizer', 'Winner', 'Volunteer', 'Mentor', 'Judge'];

type FormData = Omit<Event, 'id' | 'created_at'>;

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  event_date: '',
  location: '',
  role: 'Participant',
  image_url: null,
  tags: [],
  certificate_url: null,
};

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl border shadow-2xl text-sm font-medium ${
        type === 'success'
          ? 'bg-[#A8A492]/15 border-[#A8A492]/40 text-[#C4BFAF]'
          : 'bg-[#EC5B38]/15 border-[#EC5B38]/40 text-[#F06745]'
      }`}
    >
      {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
    </motion.div>
  );
}

// ── Event Form Modal ───────────────────────────────────────────────────────────
function EventFormModal({
  initial,
  onSave,
  onClose,
}: {
  initial: FormData & { id?: string };
  onSave: (data: FormData & { id?: string }) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormData & { id?: string }>(initial);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(initial.id);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const inputClass =
    'w-full px-4 py-3 bg-[#524646]/80 border border-[#EC5B38]/20 focus:border-[#EC5B38] focus:ring-1 focus:ring-[#EC5B38]/30 rounded-xl text-[#FCF2E5] placeholder-[#A8A492]/40 text-sm outline-none transition-all';
  const labelClass = 'block text-[10px] uppercase font-bold tracking-wider text-[#A8A492] mb-1.5';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#473D3D]/80 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-[#524646] border border-[#5E5252] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#5E5252]">
          <h2 className="text-lg font-bold text-[#FCF2E5]">
            {isEditing ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#5E5252] text-[#A8A492] hover:text-[#FCF2E5] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className={labelClass}>Event Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="IEEE International Conference 2024"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief summary of the event and your experience..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Date & Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                <Calendar size={10} className="inline mr-1" />
                Event Date *
              </label>
              <input
                type="date"
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                <MapPin size={10} className="inline mr-1" />
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Thrissur, Kerala / Online"
                className={inputClass}
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className={labelClass}>
              <Users size={10} className="inline mr-1" />
              Your Role *
            </label>
            <div className="relative">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8A492] pointer-events-none" />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className={labelClass}>
              <Image size={10} className="inline mr-1" />
              Image URL
            </label>
            <input
              name="image_url"
              value={form.image_url ?? ''}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, image_url: e.target.value || null }))
              }
              placeholder="https://i.imgur.com/event-photo.jpg"
              className={inputClass}
            />
            <p className="text-[10px] text-[#8A7B7B] mt-1">
              Use a direct image link (Imgur, Cloudinary, Supabase Storage, etc.)
            </p>
          </div>

          {/* Certificate URL */}
          <div>
            <label className={labelClass}>
              <Award size={10} className="inline mr-1" />
              Certificate URL
            </label>
            <input
              name="certificate_url"
              value={form.certificate_url ?? ''}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, certificate_url: e.target.value || null }))
              }
              placeholder="https://drive.google.com/file/..."
              className={inputClass}
            />
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>
              <Tag size={10} className="inline mr-1" />
              Tags
            </label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Hackathon, AI, Cloud..."
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-[#EC5B38] hover:bg-[#F06745] text-[#524646] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[#EC5B38]/10 border border-[#EC5B38]/20 text-[#EC5B38]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-[#EC5B38] cursor-pointer transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#7A6B6B] text-[#A8A492] hover:text-[#FCF2E5] hover:border-[#A8A492] text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={saving}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-[#EC5B38] hover:bg-[#F06745] text-[#524646] font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#EC5B38]/20 cursor-pointer disabled:opacity-60 transition-all"
            >
              {saving ? (
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
                </span>
              ) : (
                <>
                  <Save size={14} />
                  {isEditing ? 'Save Changes' : 'Add Event'}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Event Row ──────────────────────────────────────────────────────────────────
function EventRow({
  event,
  onEdit,
  onDelete,
}: {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-[#524646]/40 border border-[#5E5252]/80 rounded-xl sm:rounded-2xl hover:border-[#7A6B6B]/50 transition-all group"
    >
      {event.image_url ? (
        <img
          src={event.image_url}
          alt={event.title}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-[#5E5252] shrink-0"
        />
      ) : (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#EC5B38]/10 border border-[#EC5B38]/20 flex items-center justify-center shrink-0">
          <Calendar size={16} className="text-[#EC5B38] sm:w-[18px] sm:h-[18px]" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs sm:text-sm font-semibold text-[#FCF2E5] truncate">{event.title}</p>
          <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-[#EC5B38]/10 border border-[#EC5B38]/20 text-[#EC5B38] shrink-0">
            {event.role}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-[#A8A492]">
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {new Date(event.event_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin size={10} />
              {event.location}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(event)}
          className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-[#5E5252] text-[#A8A492] hover:text-[#EC5B38] transition-all cursor-pointer"
        >
          <Edit3 size={15} />
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-[#EC5B38]/20 text-[#A8A492] hover:text-[#EC5B38] transition-all cursor-pointer"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Login Screen ───────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1');
      onLogin();
    } else {
      setError('Incorrect password.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#473D3D] text-[#FCF2E5] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#EC5B38] text-[#524646] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#EC5B38]/20">
            <Lock size={22} className="text-[#524646]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#FCF2E5]">Admin Access</h1>
          <p className="text-[#A8A492] text-sm mt-1">Events CMS — Mevin's Portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Enter admin password"
            className="w-full px-4 py-3.5 bg-[#5E5252] border border-[#EC5B38]/20 focus:border-[#EC5B38] rounded-2xl text-[#FCF2E5] placeholder-[#A8A492] outline-none transition-all text-center text-base tracking-widest"
            autoFocus
          />
          {error && (
            <p className="text-[#EC5B38] text-xs text-center flex items-center justify-center gap-1">
              <AlertCircle size={12} />
              {error}
            </p>
          )}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-[#EC5B38] hover:bg-[#F06745] text-[#524646] font-bold rounded-2xl shadow-lg shadow-[#EC5B38]/20 cursor-pointer transition-all"
          >
            Unlock Dashboard
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────────
export default function AdminEvents() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('admin_auth') === '1');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{
    open: boolean;
    data: FormData & { id?: string };
  }>({ open: false, data: { ...EMPTY_FORM } });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) showToast('Failed to load events', 'error');
    else setEvents(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) void fetchEvents();
  }, [authed]);

  const openAdd = () => setModalState({ open: true, data: { ...EMPTY_FORM } });
  const openEdit = (event: Event) =>
    setModalState({
      open: true,
      data: {
        id: event.id,
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        location: event.location,
        role: event.role,
        image_url: event.image_url,
        tags: event.tags ?? [],
        certificate_url: event.certificate_url,
      },
    });
  const closeModal = () => setModalState({ open: false, data: { ...EMPTY_FORM } });

  const handleSave = async (formData: FormData & { id?: string }) => {
    const { id, ...payload } = formData;
    if (id) {
      const { error } = await supabase.from('events').update(payload).eq('id', id);
      if (error) { showToast('Failed to update event', 'error'); return; }
      showToast('Event updated successfully!');
    } else {
      const { error } = await supabase.from('events').insert([payload]);
      if (error) { showToast('Failed to add event', 'error'); return; }
      showToast('Event added successfully!');
    }
    closeModal();
    void fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) { showToast('Failed to delete event', 'error'); return; }
    showToast('Event deleted');
    void fetchEvents();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#473D3D] text-[#FCF2E5]">
      {/* Header */}
      <div className="border-b border-[#524646] bg-[#473D3D]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-[#FCF2E5]">Events CMS</h1>
            <p className="text-[11px] text-[#A8A492]">Manage your portfolio events</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={openAdd}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-[#EC5B38] hover:bg-[#F06745] text-[#524646] text-xs font-bold rounded-xl shadow-lg shadow-[#EC5B38]/20 cursor-pointer transition-all"
            >
              <Plus size={14} />
              Add Event
            </motion.button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#5E5252] text-[#A8A492] hover:text-[#FCF2E5] hover:border-[#7A6B6B] text-xs transition-all cursor-pointer"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-[#524646]/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EC5B38]/10 border border-[#EC5B38]/20 flex items-center justify-center mb-4">
              <Calendar size={24} className="text-[#EC5B38]" />
            </div>
            <p className="text-[#D9CEBB] font-semibold mb-1">No events yet</p>
            <p className="text-[#A8A492] text-sm mb-6">Add your first event to get started</p>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#EC5B38] hover:bg-[#F06745] text-[#524646] rounded-xl text-sm font-semibold cursor-pointer transition-colors"
            >
              <Plus size={15} />
              Add First Event
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-[#A8A492]">
                {events.length} event{events.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <AnimatePresence>
              {events.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalState.open && (
          <EventFormModal
            initial={modalState.data}
            onSave={handleSave}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
}
