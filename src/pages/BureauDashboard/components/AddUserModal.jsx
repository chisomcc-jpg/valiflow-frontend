import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { bureauService } from "@/services/bureauService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AddUserModal({ open, onOpenChange, roles, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", roleId: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.roleId) {
            toast.error("Vänligen fyll i alla fält");
            return;
        }

        setLoading(true);
        try {
            await bureauService.createTeamMember(formData);
            toast.success("Användare inbjuden!");
            onSuccess();
            onOpenChange(false);
            setFormData({ name: "", email: "", roleId: "" });
        } catch (err) {
            console.error(err);
            toast.error("Kunde inte bjuda in användare. Kontrollera att e-posten inte redan finns.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Bjud in användare</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Namn</Label>
                        <Input
                            placeholder="Förnamn Efternamn"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>E-post</Label>
                        <Input
                            type="email"
                            placeholder="namn@byran.se"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Roll</Label>
                        <Select onValueChange={val => setFormData({ ...formData, roleId: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Välj roll..." />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map(r => (
                                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Avbryt</Button>
                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Skicka inbjudan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
