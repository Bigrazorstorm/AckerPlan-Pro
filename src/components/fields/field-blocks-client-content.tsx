'use client';

import { useEffect, useMemo, useState } from 'react';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { useToast } from '@/hooks/use-toast';
import { Field } from '@/services/types';
import { CadastralParcel, FieldBlock, FieldBlockFormData } from '@/services/field-types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

const emptyForm: FieldBlockFormData = {
  name: '',
  referenceNumber: '',
  dgkLwNumber: '',
  totalArea: 0,
  fieldIds: [],
  cadastralParcelIds: [],
  subsidyEligible: true,
  subsidyAmount: 0,
  gapCompliant: true,
  environmentalZone: false,
  restrictions: [],
};

export function FieldBlocksClientContent() {
  const { activeCompany, loading: sessionLoading } = useSession();
  const [blocks, setBlocks] = useState<FieldBlock[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [parcels, setParcels] = useState<CadastralParcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formData, setFormData] = useState<FieldBlockFormData>(emptyForm);
  const [editingBlock, setEditingBlock] = useState<FieldBlock | null>(null);
  const [blockToDelete, setBlockToDelete] = useState<FieldBlock | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingBlock(null);
  };

  const fetchData = async () => {
    if (!activeCompany) return;
    setLoading(true);
    const [blockData, fieldData, parcelData] = await Promise.all([
      dataService.getFieldBlocks(activeCompany.tenantId, activeCompany.id),
      dataService.getFields(activeCompany.tenantId, activeCompany.id),
      dataService.getCadastralParcels(activeCompany.tenantId, activeCompany.id),
    ]);
    setBlocks(blockData);
    setFields(fieldData);
    setParcels(parcelData);
    setLoading(false);
  };

  useEffect(() => {
    if (activeCompany) {
      fetchData();
    }
  }, [activeCompany]);

  const selectedParcelArea = useMemo(() => {
    return formData.cadastralParcelIds.reduce((sum, parcelId) => {
      const parcel = parcels.find((p) => p.id === parcelId);
      return sum + (parcel?.area || 0);
    }, 0);
  }, [formData.cadastralParcelIds, parcels]);

  const handleEdit = (block: FieldBlock) => {
    setEditingBlock(block);
    setFormData({
      name: block.name,
      referenceNumber: block.referenceNumber,
      dgkLwNumber: block.dgkLwNumber || '',
      totalArea: block.totalArea,
      fieldIds: block.fieldIds,
      cadastralParcelIds: block.cadastralParcelIds,
      subsidyEligible: block.subsidyEligible,
      subsidyAmount: block.subsidyAmount || 0,
      gapCompliant: block.gapCompliant,
      environmentalZone: block.environmentalZone || false,
      restrictions: block.restrictions || [],
    });
    setSheetOpen(true);
  };

  const toggleId = (list: string[], id: string) => {
    if (list.includes(id)) {
      return list.filter((item) => item !== id);
    }
    return [...list, id];
  };

  const handleSave = async () => {
    if (!activeCompany) return;

    if (!formData.name || !formData.referenceNumber) {
      toast({
        variant: 'destructive',
        title: 'Pflichtfelder fehlen',
        description: 'Bitte Name und Referenznummer ausfüllen.',
      });
      return;
    }

    const totalArea = selectedParcelArea > 0 ? selectedParcelArea : formData.totalArea;
    if (!Number.isFinite(totalArea) || totalArea <= 0) {
      toast({
        variant: 'destructive',
        title: 'Fläche fehlt',
        description: 'Bitte eine gültige Gesamtfläche angeben.',
      });
      return;
    }

    const payload: FieldBlockFormData = {
      ...formData,
      totalArea,
      subsidyAmount: formData.subsidyEligible ? formData.subsidyAmount : undefined,
      restrictions: formData.restrictions?.filter((r) => r.trim().length > 0),
    };

    try {
      if (editingBlock) {
        await dataService.updateFieldBlock(
          activeCompany.tenantId,
          activeCompany.id,
          editingBlock.id,
          payload
        );
        toast({ title: 'Feldblock aktualisiert' });
      } else {
        await dataService.addFieldBlock(activeCompany.tenantId, activeCompany.id, payload);
        toast({ title: 'Feldblock angelegt' });
      }
      setSheetOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Speichern fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
      });
    }
  };

  const handleDelete = async () => {
    if (!activeCompany || !blockToDelete) return;
    try {
      await dataService.deleteFieldBlock(activeCompany.tenantId, activeCompany.id, blockToDelete.id);
      toast({ title: 'Feldblock gelöscht' });
      setBlockToDelete(null);
      fetchData();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Löschen fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
      });
    }
  };

  if (sessionLoading || loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Feldblöcke</CardTitle>
            <CardDescription>Referenzparzellen für Förderung und GAP-Compliance.</CardDescription>
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="gap-1" onClick={() => resetForm()}>
                <PlusCircle className="h-4 w-4" />
                Neuer Feldblock
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{editingBlock ? 'Feldblock bearbeiten' : 'Feldblock anlegen'}</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="block-name">Name</Label>
                  <Input
                    id="block-name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="block-reference">Referenznummer</Label>
                    <Input
                      id="block-reference"
                      value={formData.referenceNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, referenceNumber: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block-dgk">DGK-Lw Nummer</Label>
                    <Input
                      id="block-dgk"
                      value={formData.dgkLwNumber || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dgkLwNumber: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-area">Gesamtfläche (ha)</Label>
                  <Input
                    id="block-area"
                    type="number"
                    step="0.01"
                    value={selectedParcelArea > 0 ? selectedParcelArea : formData.totalArea}
                    onChange={(e) => setFormData((prev) => ({ ...prev, totalArea: Number(e.target.value) }))}
                  />
                  {selectedParcelArea > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Berechnet aus ausgewählten Flurstücken.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Flurstücke</Label>
                  <div className="grid gap-2 max-h-40 overflow-y-auto rounded-md border p-2">
                    {parcels.map((parcel) => (
                      <label key={parcel.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={formData.cadastralParcelIds.includes(parcel.id)}
                          onCheckedChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              cadastralParcelIds: toggleId(prev.cadastralParcelIds, parcel.id),
                            }))
                          }
                        />
                        <span>{parcel.name} ({parcel.area.toFixed(2)} ha)</span>
                      </label>
                    ))}
                    {parcels.length === 0 && (
                      <span className="text-xs text-muted-foreground">Keine Flurstücke vorhanden.</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Schläge</Label>
                  <div className="grid gap-2 max-h-40 overflow-y-auto rounded-md border p-2">
                    {fields.map((field) => (
                      <label key={field.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={formData.fieldIds.includes(field.id)}
                          onCheckedChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              fieldIds: toggleId(prev.fieldIds, field.id),
                            }))
                          }
                        />
                        <span>{field.name}</span>
                      </label>
                    ))}
                    {fields.length === 0 && (
                      <span className="text-xs text-muted-foreground">Keine Schläge vorhanden.</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={formData.subsidyEligible}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, subsidyEligible: Boolean(checked) }))
                      }
                    />
                    Förderfähig
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={formData.gapCompliant}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, gapCompliant: Boolean(checked) }))
                      }
                    />
                    GAP-konform
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={formData.environmentalZone}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, environmentalZone: Boolean(checked) }))
                      }
                    />
                    Umweltzone
                  </label>
                </div>
                {formData.subsidyEligible && (
                  <div className="space-y-2">
                    <Label htmlFor="block-subsidy">Förderbetrag (EUR)</Label>
                    <Input
                      id="block-subsidy"
                      type="number"
                      step="1"
                      value={formData.subsidyAmount || 0}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, subsidyAmount: Number(e.target.value) }))
                      }
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="block-restrictions">Auflagen (kommagetrennt)</Label>
                  <Textarea
                    id="block-restrictions"
                    rows={3}
                    value={(formData.restrictions || []).join(', ')}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        restrictions: e.target.value.split(',').map((val) => val.trim()),
                      }))
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSheetOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleSave}>Speichern</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Referenz</TableHead>
                <TableHead>Fläche (ha)</TableHead>
                <TableHead>Förderung</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block) => (
                <TableRow key={block.id}>
                  <TableCell className="font-medium">{block.name}</TableCell>
                  <TableCell>{block.referenceNumber}</TableCell>
                  <TableCell>{block.totalArea.toFixed(2)}</TableCell>
                  <TableCell>{block.subsidyEligible ? 'Ja' : 'Nein'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEdit(block)}>
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => setBlockToDelete(block)}>
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {blocks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Noch keine Feldblöcke vorhanden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!blockToDelete} onOpenChange={(open) => !open && setBlockToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Feldblock löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dieser Feldblock wird dauerhaft entfernt. Falls Schläge zugeordnet sind, schlägt der Vorgang fehl.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
