import React, { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  ShieldCheck as ShieldCheckIcon,
  Key as KeyIcon,
  Clock as ClockIcon,
  Plus as PlusIcon,
  Search as MagnifyingGlassIcon,
  RefreshCw as ArrowPathIcon,
  MoreHorizontal,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { bureauService } from "@/services/bureauService";
import { useBureauSSE } from "@/hooks/useBureauSSE";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

// Sub-components
import { AddUserModal } from "./components/AddUserModal";
import { UserDetailSheet } from "./components/UserDetailSheet";
import { RoleDetailSheet } from "./components/RoleDetailSheet";
import { AccessManagementSheet } from "./components/AccessManagementSheet";

import { BureauDemoTeam } from "./BureauDemoTeam";

export default function BureauTeam({ demoMode = false, demoOverrideData }) {
  if (demoMode) {
    return <BureauDemoTeam />;
  }

  const [activeTab, setActiveTab] = useState("team");

  // Data
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [accessMap, setAccessMap] = useState([]);
  const [logs, setLogs] = useState([]);

  // Modals & Sheets State
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Triggers UserDetailSheet
  const [selectedRole, setSelectedRole] = useState(null); // Triggers RoleDetailSheet (edit)
  const [showAddRole, setShowAddRole] = useState(false);  // Triggers RoleDetailSheet (create)
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Triggers AccessManagementSheet

  // SSE Hook
  // Pass null in demo mode to disable connection
  const { bureauEvents } = useBureauSSE(demoMode ? null : 1);

  // --- Real-time updates ---
  useEffect(() => {
    if (demoMode) return;
    if (demoOverrideData) return;
    if (!bureauEvents) return;
    if (bureauEvents.type === "team_update") loadUsers();
    if (bureauEvents.type === "role_update") loadRoles();
    if (bureauEvents.type === "access_update" || bureauEvents.type === "team_update") loadAccess();
    if (bureauEvents.type === "audit_new") loadLogs();
  }, [bureauEvents, demoMode, demoOverrideData]);

  // --- Initial Load ---
  useEffect(() => {
    loadAll();
  }, [demoMode, demoOverrideData]);

  async function loadAll() {
    setLoading(true);
    // DEMO OVERRIDE
    if (demoMode) {
      if (demoOverrideData) {
        setUsers(demoOverrideData.users || []);
        setRoles(demoOverrideData.roles || []);
        setAccessMap(demoOverrideData.accessMap || []);
        setLogs(demoOverrideData.logs || []);
      }
      setLoading(false);
      return;
    }

    await Promise.all([loadUsers(), loadRoles(), loadAccess(), loadLogs()]);
    setLoading(false);
  }

  async function loadUsers() {
    const data = await bureauService.getTeamMembers().catch(() => []);
    setUsers(data);
  }
  async function loadRoles() {
    const data = await bureauService.getRoles().catch(() => []);
    setRoles(data);
  }
  async function loadAccess() {
    const data = await bureauService.getAccessMap().catch(() => []);
    setAccessMap(data);
  }
  async function loadLogs() {
    const data = await bureauService.getAuditLog().catch(() => []);
    setLogs(data);
  }

  // --- Helpers ---
  const getRoleName = (id) => roles.find(r => r.id === id)?.name || "Okänd";

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <UsersIcon className="w-7 h-7 text-indigo-600" />
              Team & Roller
            </h1>
            <p className="text-slate-500 mt-1">Hantera byråns användare, roller och kundtillgångar.</p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Input
                placeholder="Sök..."
                className="pl-9 w-64 bg-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <Button variant="outline" size="icon" onClick={() => loadAll()}>
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            {activeTab === "team" && (
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" onClick={() => setShowAddUser(true)}>
                <PlusIcon className="w-4 h-4" /> Bjud in
              </Button>
            )}
            {activeTab === "roles" && (
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" onClick={() => setShowAddRole(true)}>
                <PlusIcon className="w-4 h-4" /> Skapa roll
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* TABS */}
      <Tabs defaultValue="team" value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="bg-transparent space-x-6 border-b border-transparent w-full justify-start p-0 h-auto">
          <TabsTrigger value="team" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none px-2 pb-4 text-slate-500 font-medium bg-transparent">
            <UsersIcon className="w-4 h-4 mr-2" /> Team
          </TabsTrigger>
          <TabsTrigger value="roles" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none px-2 pb-4 text-slate-500 font-medium bg-transparent">
            <ShieldCheckIcon className="w-4 h-4 mr-2" /> Roller & Behörigheter
          </TabsTrigger>
          <TabsTrigger value="access" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none px-2 pb-4 text-slate-500 font-medium bg-transparent">
            <KeyIcon className="w-4 h-4 mr-2" /> Kundtillgångar
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none px-2 pb-4 text-slate-500 font-medium bg-transparent">
            <ClockIcon className="w-4 h-4 mr-2" /> Aktivitetslogg
          </TabsTrigger>
        </TabsList>

        {/* -------------------- TAB 1: TEAM -------------------- */}
        <TabsContent value="team" className="mt-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <TableRow>
                  <TableHead>Användare</TableHead>
                  <TableHead>Roll</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Senast Aktiv</TableHead>
                  <TableHead className="text-right">Åtgärd</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">Inga användare hittades.</TableCell>
                  </TableRow>
                ) : filteredUsers.map(u => (
                  <TableRow key={u.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedUser(u)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                        {getRoleName(u.roleId)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={u.status} />
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {u.lastActive ? format(new Date(u.lastActive), "d MMM HH:mm", { locale: sv }) : "-"}
                    </TableCell>
                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hantera</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedUser(u)}>Visa detaljer</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Ta bort</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* -------------------- TAB 2: ROLES -------------------- */}
        <TabsContent value="roles" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 font-medium text-slate-700">
                Tillgängliga Roller
              </div>
              <div className="divide-y divide-slate-100">
                {roles.map(r => (
                  <div key={r.id} className="p-4 hover:bg-slate-50 flex justify-between items-center cursor-pointer group" onClick={() => setSelectedRole(r)}>
                    <div>
                      <h4 className="font-medium text-slate-900">{r.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{r.description || "Ingen beskrivning"}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition">Redigera</Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-indigo-500" />
                Behörighetsmatris (Global)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                  <span className="text-slate-600">Full Access (Byråadmin)</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                  <span className="text-slate-600">Endast Läsa (Gäst)</span>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xs text-slate-400 mt-4">Klicka på en roll till vänster för att redigera specifika rättigheter.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* -------------------- TAB 3: ACCESS -------------------- */}
        <TabsContent value="access" className="mt-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <TableRow>
                  <TableHead>Kundbolag</TableHead>
                  <TableHead>Antal Användare</TableHead>
                  <TableHead>Ansvarig</TableHead>
                  <TableHead>Behöriga</TableHead>
                  <TableHead className="text-right">Åtgärd</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessMap.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-slate-900">{c.name}</TableCell>
                    <TableCell>{(c.users || []).length}</TableCell>
                    <TableCell className="text-slate-500">-</TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {(c.users || []).slice(0, 4).map((u, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] text-indigo-700 font-bold" title={u.name}>
                            {u.name.charAt(0)}
                          </div>
                        ))}
                        {(c.users || []).length > 4 && <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] text-slate-600">+{c.users.length - 4}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(c)}>Hantera</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* -------------------- TAB 4: AUDIT -------------------- */}
        <TabsContent value="audit" className="mt-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <TableRow>
                  <TableHead>Händelse</TableHead>
                  <TableHead>Användare</TableHead>
                  <TableHead>Enhet</TableHead>
                  <TableHead>Resultat</TableHead>
                  <TableHead>Tid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium text-slate-700">{l.event}</TableCell>
                    <TableCell className="text-slate-500">{l.userId}</TableCell>
                    <TableCell className="text-slate-500">{l.entity}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${l.result === 'SUCCESS' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {l.result}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs">
                      {format(new Date(l.createdAt), "d MMM HH:mm:ss", { locale: sv })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <AddUserModal open={showAddUser} onOpenChange={setShowAddUser} roles={roles} onSuccess={loadUsers} />
      <UserDetailSheet user={selectedUser} open={!!selectedUser} onOpenChange={(o) => !o && setSelectedUser(null)} roles={roles} onSuccess={loadUsers} />

      <RoleDetailSheet
        role={selectedRole}
        open={!!selectedRole || showAddRole}
        onOpenChange={(o) => {
          if (!o) { setSelectedRole(null); setShowAddRole(false); }
        }}
        onSuccess={loadRoles}
      />

      <AccessManagementSheet
        customer={selectedCustomer}
        open={!!selectedCustomer}
        onOpenChange={(o) => { if (!o) setSelectedCustomer(null); }}
        users={users}
        onSuccess={loadAccess}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: "bg-green-100 text-green-700",
    INVITED: "bg-amber-100 text-amber-700",
    BLOCKED: "bg-red-100 text-red-700"
  };
  const labels = {
    ACTIVE: "Aktiv",
    INVITED: "Inbjuden",
    BLOCKED: "Inaktiverad"
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {labels[status] || status}
    </span>
  );
}
