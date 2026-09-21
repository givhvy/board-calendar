import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Plus,
  Trash2,
  X,
} from "lucide-react";

const seedEvents = [
  [29, "Coffee", "09:30", 0, "July 2026"],
  [31, "Payday", "", 0, "July 2026"],
  [1, "Brunch", "11:00", 0, "August 2026"],
  [2, "Stand-up", "11:30", 1, "August 2026"],
  [2, "1:1 sync", "16:30", 0, "August 2026"],
  [5, "Gym", "07:00", 1, "August 2026"],
  [8, "Game night", "19:00", 2, "August 2026"],
  [11, "Holidays", "", 3, "August 2026"],
  [11, "Birthday night …", "20:30", 2, "August 2026"],
  [14, "Retro", "15:00", 4, "August 2026"],
  [17, "Planning", "10:00", 4, "August 2026"],
  [17, "Haircut", "16:00", 3, "August 2026"],
  [20, "Stand-up", "11:30", 1, "August 2026"],
  [20, "Team lunch", "13:00", 2, "August 2026"],
  [20, "Portfolio review", "14:30", 4, "August 2026"],
  [20, "1:1 sync", "16:30", 0, "August 2026"],
  [24, "Dinner with friends", "19:15", 2, "August 2026"],
  [27, "Yoga", "07:30", 1, "August 2026"],
  [29, "Brunch", "11:00", 0, "August 2026"],
].map(([day, title, time, color, month], index) => ({
  id: `seed-${index}`,
  day,
  title,
  time,
  color,
  month,
  seeded: true,
}));

const notifications = [
  "Team lunch starts at 13:00",
  "Portfolio review is coming up",
  "Stand-up begins at 11:30",
  "Your calendar is ready",
  "Birthday night is this month",
];

function getStoredEvents() {
  try {
    return JSON.parse(localStorage.getItem("board-calendar-events") || "[]");
  } catch {
    return [];
  }
}

export default function Calendar({ query }) {
  const [date, setDate] = useState(new Date(2026, 7, 1));
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [events, setEvents] = useState(getStoredEvents);
  const [editing, setEditing] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("board-calendar-events", JSON.stringify(events));
  }, [events]);

  const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstWeekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const cells = Math.ceil((daysInMonth + firstWeekday) / 7) * 7;

  const visibleEvents = useMemo(() => {
    const deletedSeeds = new Set(events.filter((event) => event.deleted).map((event) => event.id));
    return [...seedEvents.filter((event) => !deletedSeeds.has(event.id)), ...events.filter((event) => !event.deleted)];
  }, [events]);

  function moveMonth(amount) {
    setDate((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
    setMonthPickerOpen(false);
  }

  function openEditor(event = { day: 1 }) {
    setEditing(event);
    dialogRef.current?.showModal();
  }

  function removeEvent() {
    if (!editing?.id) return;
    if (editing.seeded) {
      setEvents((current) => [...current.filter((event) => event.id !== editing.id), { id: editing.id, deleted: true }]);
    } else {
      setEvents((current) => current.filter((event) => event.id !== editing.id));
    }
    dialogRef.current?.close();
  }

  return (
    <div className="content calendar-page">
      <div className="breadcrumbs">
        <span className="mini-avatar blue">B</span><span>Board team</span>
        <ChevronRight size={13} />
        <span className="mini-avatar">M</span><span>Mertcan</span>
        <ChevronRight size={13} />
        <CalendarDays size={14} /><span>Calendar</span>
      </div>

      <header>
        <h1>{label}</h1>
        <div className="header-actions">
          <div className="popover-root">
            <button className="icon notification-button" aria-label="Notifications" onClick={() => setNotificationsOpen((open) => !open)}>
              <Bell size={19} /><b>5</b>
            </button>
            {notificationsOpen && (
              <div className="notifications" role="dialog" aria-label="Notifications">
                <div className="notifications-heading"><strong>Notifications</strong><button aria-label="Close notifications" onClick={() => setNotificationsOpen(false)}><X size={16} /></button></div>
                {notifications.map((notification) => <p key={notification}>{notification}</p>)}
              </div>
            )}
          </div>
          <button className="icon" aria-label="Inbox"><Inbox size={19} /></button>
          <div className="calendar-month control">
            <button aria-label="Previous month" onClick={() => moveMonth(-1)}><ChevronLeft size={17} /></button>
            <button onClick={() => setMonthPickerOpen((open) => !open)}>{label}</button>
            <button aria-label="Next month" onClick={() => moveMonth(1)}><ChevronRight size={17} /></button>
            {monthPickerOpen && (
              <div className="month-picker">
                {Array.from({ length: 12 }, (_, month) => (
                  <button key={month} onClick={() => { setDate(new Date(date.getFullYear(), month, 1)); setMonthPickerOpen(false); }}>
                    {new Date(2026, month, 1).toLocaleDateString("en-US", { month: "short" })}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="primary" onClick={() => openEditor({ day: 1 })}><Plus size={17} />New event</button>
        </div>
      </header>

      <section className="calendar-board" aria-label={`${label} calendar`}>
        <div className="weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="calendar-grid" key={label}>
          {Array.from({ length: cells }, (_, index) => {
            const rawDay = index - firstWeekday + 1;
            const cellDate = new Date(date.getFullYear(), date.getMonth(), rawDay);
            const outside = rawDay < 1 || rawDay > daysInMonth;
            const cellLabel = cellDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            const dayEvents = visibleEvents.filter((event) => event.month === cellLabel && event.day === cellDate.getDate() && event.title.toLowerCase().includes(query.trim().toLowerCase()));
            return (
              <div className={outside ? "calendar-day outside" : "calendar-day"} key={cellDate.toISOString()} onDoubleClick={() => !outside && openEditor({ day: rawDay })}>
                <span>{cellDate.getDate()}</span>
                <div>
                  {dayEvents.map((event) => (
                    <button className={`event-chip event-${event.color}`} key={event.id} onClick={() => openEditor(event)}>
                      <span>{event.title}</span><small>{event.time}</small>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <dialog ref={dialogRef} onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current.close(); }}>
        <button className="close-modal icon" aria-label="Close event editor" onClick={() => dialogRef.current.close()}><X size={18} /></button>
        <h2>{editing?.title ? "Edit event" : "New event"}</h2>
        <form key={editing?.id || `${editing?.day}-new`} onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const item = {
            id: editing?.seeded ? `custom-${Date.now()}` : editing?.id || `custom-${Date.now()}`,
            month: label,
            day: Number(form.get("day")),
            title: String(form.get("title")),
            time: String(form.get("time")),
            color: Number(form.get("color")),
          };
          setEvents((current) => {
            const next = current.filter((saved) => saved.id !== editing?.id);
            if (editing?.seeded) next.push({ id: editing.id, deleted: true });
            return [...next, item];
          });
          dialogRef.current.close();
        }}>
          <label>Event name<input name="title" defaultValue={editing?.title || ""} required autoFocus /></label>
          <div className="form-row">
            <label>Day<input name="day" type="number" min="1" max={daysInMonth} defaultValue={editing?.day || 1} required /></label>
            <label>Time<input name="time" type="time" defaultValue={editing?.time || "09:00"} /></label>
          </div>
          <label>Color<select name="color" defaultValue={editing?.color ?? 0}>{["Lime", "Pink", "Purple", "Mint", "Blue"].map((color, index) => <option value={index} key={color}>{color}</option>)}</select></label>
          <div className="dialog-actions">
            {editing?.title && <button type="button" className="danger" onClick={removeEvent}><Trash2 size={16} />Delete</button>}
            <button className="primary">Save event</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

