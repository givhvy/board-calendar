import { useEffect, useState } from "react";
import {
  Asterisk,
  CalendarDays,
  ChevronDown,
  ChevronsUpDown,
  Headphones,
  House,
  Image,
  Landmark,
  Menu,
  MessageCircle,
  Megaphone,
  Moon,
  PanelLeft,
  Search,
  Settings,
  Smile,
  Sun,
} from "lucide-react";
import Calendar from "./Calendar";

const destinations = [
  [House, "Home"],
  [Megaphone, "Project board"],
  [Megaphone, "Marketing"],
  [CalendarDays, "Calendar"],
  [Landmark, "Finance"],
  [Asterisk, "Medical Report"],
  [MessageCircle, "AI Chat"],
  [Image, "AI Image Generation"],
  [Smile, "Profile"],
];

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("board-calendar-theme") || "light");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("board-calendar-theme", theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <aside className={drawerOpen ? "sidebar open" : "sidebar"}>
        <div className="account">
          <span className="avatar">M</span>
          <strong>Mertcan Esmergul</strong>
          <ChevronsUpDown size={13} aria-hidden="true" />
          <button aria-label="Close navigation" onClick={() => setDrawerOpen(false)}>
            <PanelLeft size={18} />
          </button>
        </div>

        <label className="quick-search">
          <Search size={18} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Quick Search"
            aria-label="Search events"
          />
          <span>⌘L</span>
        </label>

        <nav aria-label="Primary navigation">
          {destinations.map(([Icon, label]) => (
            <button
              type="button"
              className={label === "Calendar" ? "active" : ""}
              key={label}
              aria-current={label === "Calendar" ? "page" : undefined}
              disabled={label !== "Calendar"}
              title={label !== "Calendar" ? `${label} is not part of this standalone project` : undefined}
            >
              <Icon size={19} />
              {label}
              {label === "Home" && <small>152</small>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="theme-switch" aria-label="Color theme">
            <button className={theme === "light" ? "active" : ""} aria-label="Use light theme" onClick={() => setTheme("light")}>
              <Sun size={16} />
            </button>
            <button className={theme === "dark" ? "active" : ""} aria-label="Use dark theme" onClick={() => setTheme("dark")}>
              <Moon size={16} />
            </button>
          </div>
          <button className="sidebar-link" disabled><Headphones size={19} />Support</button>
          <button className="sidebar-link" disabled><Settings size={19} />Settings</button>
          <button className="team" disabled>
            <span className="team-logo">▣</span>
            <span>Board team<small>hi@boardui.com</small></span>
            <ChevronDown size={14} />
          </button>
        </div>
      </aside>

      {drawerOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setDrawerOpen(false)} />}
      <main>
        <button className="mobile-menu" aria-label="Open navigation" onClick={() => setDrawerOpen(true)}>
          <Menu size={19} />
        </button>
        <Calendar query={query} />
      </main>
    </div>
  );
}

