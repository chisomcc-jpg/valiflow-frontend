// src/components/CommandPalette.jsx
import * as React from "react";
import {
  Search,
  Plus,
  LifeBuoy,
  FileText,
  LayoutDashboard,
  Users,
  Building2,
  ShieldAlert,
  BarChart3,
  Settings,
  Activity,
  Inbox,
  LogOut,
  Sparkles as SparklesIcon
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./ui/command";

import { useNavigate } from "react-router-dom";

/**
 * CommandPalette — Valiflow Enterprise Edition
 */
export function CommandPalette({
  userRole,
  onLogout,
  recentInvoices = [],
}) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const role = userRole || "USER";
  const isAgency =
    role === "AGENCY_ADMIN" || role === "AGENCY_USER" || role === "BUREAU";
  const isAdmin =
    role === "SUPERADMIN" || role === "ADMIN" || role === "AGENCY_ADMIN";

  // Open with Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const run = (path) => {
    setOpen(false);
    if (path) navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    if (typeof onLogout === "function") onLogout();
  };

  return (
    <>
      {/* Trigger button */}
      <div
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-50 border rounded-md cursor-pointer hover:bg-gray-100 transition-colors w-64"
      >
        <Search className="w-4 h-4" />
        <span>Search or jump to…</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search invoices, suppliers, pages…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* QUICK ACTIONS */}
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => run("/dashboard/invoices/new")}>
              <Plus className="mr-2 h-4 w-4" />
              <span>New invoice upload</span>
              <CommandShortcut>⌘U</CommandShortcut>
            </CommandItem>

            <CommandItem
              onSelect={() => run("/dashboard/invoices?filter=flagged")}
            >
              <ShieldAlert className="mr-2 h-4 w-4" />
              <span>Review flagged invoices</span>
            </CommandItem>

            <CommandItem onSelect={() => run("/dashboard/analytics")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Open risk & insights</span>
            </CommandItem>
          </CommandGroup>

          {/* NAVIGATION — COMPANY LEVEL */}
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => run("/dashboard")}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Company overview</span>
              <CommandShortcut>⌘1</CommandShortcut>
            </CommandItem>

            <CommandItem onSelect={() => run("/dashboard/invoices")}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Invoices</span>
              <CommandShortcut>⌘2</CommandShortcut>
            </CommandItem>

            <CommandItem onSelect={() => run("/dashboard/customers")}>
              <Users className="mr-2 h-4 w-4" />
              <span>Customers / Entities</span>
            </CommandItem>

            <CommandItem onSelect={() => run("/dashboard/integrations")}>
              <Building2 className="mr-2 h-4 w-4" />
              <span>Integrations (Fortnox, Visma, M365)</span>
            </CommandItem>
          </CommandGroup>

          {/* BUREAU / AGENCY */}
          {isAgency && (
            <CommandGroup heading="Bureau Cockpit">
              <CommandItem onSelect={() => run("/bureau")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Bureau overview</span>
              </CommandItem>

              <CommandItem onSelect={() => run("/bureau/clients")}>
                <Users className="mr-2 h-4 w-4" />
                <span>Client list & risk ladder</span>
              </CommandItem>

              <CommandItem onSelect={() => run("/bureau/insights")}>
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Top risk clients / Trends</span>
              </CommandItem>
            </CommandGroup>
          )}

          {/* SUPERADMIN */}
          {isAdmin && (
            <CommandGroup heading="Admin & System">
              <CommandItem onSelect={() => run("/admin")}>
                <Activity className="mr-2 h-4 w-4" />
                <span>System health & AI jobs</span>
              </CommandItem>

              <CommandItem onSelect={() => run("/admin/support")}>
                <Inbox className="mr-2 h-4 w-4" />
                <span>Support tickets</span>
              </CommandItem>

              <CommandItem onSelect={() => run("/admin/customers")}>
                <Users className="mr-2 h-4 w-4" />
                <span>Customers & bureaus</span>
              </CommandItem>

              <CommandItem onSelect={() => run("/admin/learning")}>
                <SparklesIcon className="mr-2 h-4 w-4" /> {/* Use imported icon or generic */}
                <span>Valiflow Learns</span>
              </CommandItem>
            </CommandGroup>
          )}

          <CommandSeparator />

          {/* RECENT INVOICES */}
          {recentInvoices.length > 0 && (
            <CommandGroup heading="Recent invoices">
              {recentInvoices.slice(0, 5).map((inv) => (
                <CommandItem
                  key={inv.id}
                  onSelect={() => run(`/dashboard/invoices/${inv.id}`)}
                >
                  <FileText className="mr-2 h-4 w-4 text-slate-400" />
                  <span>
                    {inv.ref} {inv.supplier ? `(${inv.supplier})` : ""}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {/* SUPPORT & SETTINGS */}
          <CommandGroup heading="Support & Settings">
            <CommandItem onSelect={() => run("/dashboard/support")}>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support & Help Center</span>
            </CommandItem>

            <CommandItem onSelect={() => run("/dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Account & workspace settings</span>
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>

            <CommandItem onSelect={handleLogout} disabled={!onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{onLogout ? "Log out" : "Log out (wire later)"}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
