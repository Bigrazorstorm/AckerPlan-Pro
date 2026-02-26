'use client';

import { useEffect, useMemo, useState } from 'react';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { useToast } from '@/hooks/use-toast';
import { CadastralParcel, CadastralParcelFormData } from '@/services/field-types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const emptyForm: CadastralParcelFormData = {
  name: '',
  county: '',
  municipality: '',
  district: '',
  parcelNumber: '',
  subParcelNumber: '',
  area: 0,
  owner: '',
  leasingStatus: 'owned',
  polygonGeoJSON: '',
};

export function CadastralParcelsClientContent() {
  const { activeCompany, loading: sessionLoading } = useSession();
  const [parcels, setParcels] = useState<CadastralParcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formData, setFormData] = useState<CadastralParcelFormData>(emptyForm);
  const [editingParcel, setEditingParcel] = useState<CadastralParcel | null>(null);
  const [parcelToDelete, setParcelToDelete] = useState<CadastralParcel | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingParcel(null);
  };

  const fetchParcels = async () => {
    if (!activeCompany) return;
    setLoading(true);
    const data = await dataService.getCadastralParcels(activeCompany.tenantId, activeCompany.id);
    setParcels(data);
    setLoading(false);
  };

  useEffect(() => {
    if (activeCompany) {
      fetchParcels();
    }
  }, [activeCompany]);

  const handleEdit = (parcel: CadastralParcel) => {
    setEditingParcel(parcel);
    setFormData({
      name: parcel.name,
      county: parcel.county,
      municipality: parcel.municipality,
      district: parcel.district,
      parcelNumber: parcel.parcelNumber,
      subParcelNumber: parcel.subParcelNumber || '',
      area: parcel.area,
      owner: parcel.owner,
      leasingStatus: parcel.leasingStatus || 'owned',
      polygonGeoJSON: parcel.polygonGeoJSON || '',
    });
    setSheetOpen(true);
  };

  const handleSave = async () => {
    if (!activeCompany) return;

    if (!formData.name || !formData.parcelNumber || !formData.district || !formData.municipality) {
      toast({
        variant: 'destructive',
        title: 'Pflichtfelder fehlen',
        description: 'Bitte Name, Flurstücksnummer, Gemarkung und Gemeinde ausfüllen.',
      });
      return;
    }

    if (!Number.isFinite(formData.area) || formData.area <= 0) {
      toast({
        variant: 'destructive',
        title: 'Fläche fehlt',
        description: 'Bitte eine gültige Fläche in ha angeben.',
      });
      return;
    }

    try {
      if (editingParcel) {
        await dataService.updateCadastralParcel(
          activeCompany.tenantId,
          activeCompany.id,
          editingParcel.id,
          formData
        );
        toast({ title: 'Flurstück aktualisiert' });
      } else {
        await dataService.addCadastralParcel(activeCompany.tenantId, activeCompany.id, formData);
        toast({ title: 'Flurstück angelegt' });
      }
      setSheetOpen(false);
      resetForm();
      fetchParcels();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Speichern fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
      });
    }
  };

  const handleDelete = async () => {
    if (!activeCompany || !parcelToDelete) return;
    try {
      await dataService.deleteCadastralParcel(
        activeCompany.tenantId,
        activeCompany.id,
        parcelToDelete.id
      );
      toast({ title: 'Flurstück gelöscht' });
      setParcelToDelete(null);
      fetchParcels();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Löschen fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
      });
    }
  };

  const leasingOptions = useMemo(
    () => [
      { value: 'owned', label: 'Eigentum' },
      { value: 'leased', label: 'Pacht' },
      { value: 'other', label: 'Sonstiges' },
    ],
    []
  );

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
            <CardTitle>Flurstücke</CardTitle>
            <CardDescription>Erfassen und verwalten der rechtlichen Parzellen.</CardDescription>
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="gap-1" onClick={() => resetForm()}>
                <PlusCircle className="h-4 w-4" />
                Neues Flurstück
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{editingParcel ? 'Flurstück bearbeiten' : 'Flurstück anlegen'}</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parcel-name">Name</Label>
                  <Input
                    id="parcel-name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parcel-number">Flurstücksnummer</Label>
                  <Input
                    id="parcel-number"
                    value={formData.parcelNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, parcelNumber: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="parcel-subnumber">Unterflurstück</Label>
                    <Input
                      id="parcel-subnumber"
                      value={formData.subParcelNumber || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subParcelNumber: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parcel-area">Fläche (ha)</Label>
                    <Input
                      id="parcel-area"
                      type="number"
                      step="0.01"
                      value={formData.area}
                      onChange={(e) => setFormData((prev) => ({ ...prev, area: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="parcel-county">Landkreis</Label>
                    <Input
                      id="parcel-county"
                      value={formData.county}
                      onChange={(e) => setFormData((prev) => ({ ...prev, county: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parcel-municipality">Gemeinde</Label>
                    <Input
                      id="parcel-municipality"
                      value={formData.municipality}
                      onChange={(e) => setFormData((prev) => ({ ...prev, municipality: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parcel-district">Gemarkung</Label>
                  <Input
                    id="parcel-district"
                    value={formData.district}
                    onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="parcel-owner">Eigentümer</Label>
                    <Input
                      id="parcel-owner"
                      value={formData.owner}
                      onChange={(e) => setFormData((prev) => ({ ...prev, owner: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bewirtschaftung</Label>
                    <Select
                      value={formData.leasingStatus || 'owned'}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          leasingStatus: value as CadastralParcelFormData['leasingStatus'],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Auswahl" />
                      </SelectTrigger>
                      <SelectContent>
                        {leasingOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parcel-geojson">GeoJSON Polygon (optional)</Label>
                  <Textarea
                    id="parcel-geojson"
                    rows={5}
                    value={formData.polygonGeoJSON || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, polygonGeoJSON: e.target.value }))}
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
                <TableHead>Flurstück</TableHead>
                <TableHead>Gemarkung</TableHead>
                <TableHead>Fläche (ha)</TableHead>
                <TableHead>Eigentümer</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parcels.map((parcel) => (
                <TableRow key={parcel.id}>
                  <TableCell className="font-medium">{parcel.name}</TableCell>
                  <TableCell>{parcel.parcelNumber}</TableCell>
                  <TableCell>{parcel.district}</TableCell>
                  <TableCell>{parcel.area.toFixed(2)}</TableCell>
                  <TableCell>{parcel.owner}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEdit(parcel)}>
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => setParcelToDelete(parcel)}>
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {parcels.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Noch keine Flurstücke vorhanden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!parcelToDelete} onOpenChange={(open) => !open && setParcelToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Flurstück löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dieses Flurstück wird dauerhaft entfernt. Falls es in Schlägen verwendet wird, schlägt der Vorgang fehl.
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
