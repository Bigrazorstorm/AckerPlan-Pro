# Integration Guide: Flurstücke & Feldblöcke

## Verwendungsbeispiele

### 1. Flurstücke abrufen

```typescript
import dataService from '@/services/index';

// Alle Flurstücke für ein Unternehmen abrufen
const parcels = await dataService.getCadastralParcels('tenant-123', 'company-456');
console.log(parcels);
// Output:
// [
//   {
//     id: 'parcel-1',
//     tenantId: 'tenant-123',
//     companyId: 'company-456',
//     name: 'Flurstück 123/45',
//     county: 'Landkreis Thüringen',
//     municipality: 'Erfurt',
//     district: 'Erfurt',
//     parcelNumber: '123/45',
//     area: 8.5,
//     owner: 'Max Mustermann',
//     leasingStatus: 'owned',
//     ...
//   },
//   ...
// ]
```

### 2. Neues Flurstück erstellen

```typescript
const newParcelData = {
  name: 'Flurstück 200/1',
  county: 'Landkreis Thüringen',
  municipality: 'Erfurt',
  district: 'Erfurt',
  parcelNumber: '200/1',
  area: 12.5,
  owner: 'Max Mustermann',
  leasingStatus: 'owned' as const,
};

const newParcel = await dataService.addCadastralParcel(
  'tenant-123',
  'company-456',
  newParcelData
);
console.log(`Flurstück "${newParcel.name}" erstellt mit ID: ${newParcel.id}`);
```

### 3. Feldblock erstellen mit Schlägen

```typescript
const newBlockData = {
  name: 'Feldblock C',
  referenceNumber: 'DE-123456-003',
  dgkLwNumber: 'DE-THR-003',
  fieldIds: ['field-1', 'field-2'],  // Bestehende Schläge
  cadastralParcelIds: ['parcel-1', 'parcel-2'],  // Zugeordnete Flurstücke
  subsidyEligible: true,
  subsidyAmount: 1200,
  gapCompliant: true,
  environmentalZone: false,
  restrictions: ['5% Blühfläche'],
};

const newBlock = await dataService.addFieldBlock(
  'tenant-123',
  'company-456',
  newBlockData
);
console.log(`Feldblock "${newBlock.name}" mit ${newBlock.fieldIds.length} Schlägen erstellt`);
```

### 4. Schlag mit Flurstücken und Feldblock erstellen

```typescript
const newFieldData = {
  name: 'Neuer Schlag',
  description: 'Aus Flurstücken 123/45 und 123/46 zusammengesetzt',
  cadastralParcelIds: ['parcel-1', 'parcel-2'],  // Bildet den Schlag
  fieldBlockId: 'block-1',  // Dem Feldblock zugeordnet
  totalArea: 15.2,  // Summe der Flurstücke
  currentCrop: 'wheat' as const,
  // ... weitere Felder ...
};

// Siehe erweiterte Edit-Field-Form unten
```

## Komponenten-Beispiele

### EditFieldForm - Erweiterte Version

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Field, FieldStatus, CropType } from '@/services/types';
import { CadastralParcel, FieldBlock } from '@/services/field-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dataService from '@/services/index';

interface EditFieldFormProps {
  field: Field;
  tenantId: string;
  companyId: string;
  onSave: (updatedField: Field) => void;
  onCancel: () => void;
}

export function EditFieldFormAdvanced({ 
  field, 
  tenantId, 
  companyId,
  onSave, 
  onCancel 
}: EditFieldFormProps) {
  const t = useTranslations('EditFieldForm');
  const [formData, setFormData] = useState<Field>(field);
  const [parcels, setParcels] = useState<CadastralParcel[]>([]);
  const [blocks, setBlocks] = useState<FieldBlock[]>([]);
  const [loading, setLoading] = useState(true);

  // Laden der Flurstücke und Feldblöcke
  useEffect(() => {
    const loadData = async () => {
      try {
        const [parcelsData, blocksData] = await Promise.all([
          dataService.getCadastralParcels(tenantId, companyId),
          dataService.getFieldBlocks(tenantId, companyId),
        ]);
        setParcels(parcelsData);
        setBlocks(blocksData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [tenantId, companyId]);

  const handleParcelSelection = (selectedIds: string[]) => {
    // Automatische Flächenberechnung
    const selectedParcels = parcels.filter(p => selectedIds.includes(p.id));
    const totalArea = selectedParcels.reduce((sum, p) => sum + p.area, 0);
    
    setFormData((prev) => ({
      ...prev,
      cadastralParcelIds: selectedIds,
      totalArea: totalArea,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Grundinformationen */}
        <div className="space-y-2">
          <Label htmlFor="name">{t('nameLabel')}</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* Flurstücke auswählen */}
        <div className="space-y-2">
          <Label>{t('cadastralParcelsLabel', 'Flurstücke')}</Label>
          <MultiSelect
            options={parcels.map(p => ({value: p.id, label: `${p.name} (${p.area}ha)`}))}
            selectedValues={formData.cadastralParcelIds}
            onSelectionChange={handleParcelSelection}
            placeholder="Wählen Sie Flurstücke..."
          />
          <p className="text-sm text-gray-500">
            {t('selectedParcels', `${formData.cadastralParcelIds.length} ausgewählt`)}
          </p>
        </div>

        {/* Feldblock zuordnen */}
        <div className="space-y-2">
          <Label htmlFor="fieldBlock">{t('fieldBlockLabel', 'Feldblock')}</Label>
          <Select value={formData.fieldBlockId || ''} onValueChange={(value) => 
            setFormData({...formData, fieldBlockId: value || undefined})
          }>
            <SelectTrigger id="fieldBlock">
              <SelectValue placeholder={t('selectFieldBlock', 'Feldblock wählen...')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('none', 'Keine')}</SelectItem>
              {blocks.map(block => (
                <SelectItem key={block.id} value={block.id}>
                  {block.name} ({block.referenceNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fläche (automatisch berechnet) */}
        <div className="space-y-2">
          <Label htmlFor="area">{t('areaLabel')}</Label>
          <Input 
            id="area" 
            type="number" 
            value={formData.totalArea}
            onChange={(e) => setFormData({...formData, totalArea: parseFloat(e.target.value)})}
            disabled
            className="bg-gray-100"
          />
          <p className="text-xs text-gray-500">
            {t('areaHint', 'Automatisch berechnet aus Flurstücken')}
          </p>
        </div>

        {/* Anbau */ }
        <div className="space-y-2">
          <Label htmlFor="currentCrop">{t('cropLabel')}</Label>
          <Select value={formData.currentCrop || ''} onValueChange={(value) =>
            setFormData({...formData, currentCrop: value as CropType})
          }>
            <SelectTrigger id="currentCrop">
              <SelectValue placeholder={t('selectCrop', 'Kultur wählen...')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wheat">Winterweizen</SelectItem>
              <SelectItem value="barley">Gerste</SelectItem>
              <SelectItem value="corn">Mais</SelectItem>
              <SelectItem value="rapeseed">Raps</SelectItem>
              {/* ... weitere Kulturen ... */}
            </SelectContent>
          </Select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            {t('cancelButton')}
          </Button>
          <Button onClick={handleSave}>
            {t('saveButton')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### CadastralParcelsTable Komponente

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CadastralParcel } from '@/services/field-types';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import dataService from '@/services/index';

interface CadastralParcelsTableProps {
  tenantId: string;
  companyId: string;
  onEdit: (parcel: CadastralParcel) => void;
  onDelete: (parcelId: string) => void;
}

export function CadastralParcelsTable({
  tenantId,
  companyId,
  onEdit,
  onDelete,
}: CadastralParcelsTableProps) {
  const t = useTranslations('CadastralParcelsTable');
  const [parcels, setParcels] = useState<CadastralParcel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParcels = async () => {
      try {
        const data = await dataService.getCadastralParcels(tenantId, companyId);
        setParcels(data);
      } finally {
        setLoading(false);
      }
    };
    loadParcels();
  }, [tenantId, companyId]);

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('name')}</TableHead>
          <TableHead>{t('parcelNumber')}</TableHead>
          <TableHead>{t('area')}</TableHead>
          <TableHead>{t('owner')}</TableHead>
          <TableHead>{t('municipality')}</TableHead>
          <TableHead>{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parcels.map((parcel) => (
          <TableRow key={parcel.id}>
            <TableCell>{parcel.name}</TableCell>
            <TableCell>{parcel.parcelNumber}</TableCell>
            <TableCell>{parcel.area.toFixed(2)} ha</TableCell>
            <TableCell>{parcel.owner}</TableCell>
            <TableCell>{parcel.municipality}</TableCell>
            <TableCell className="space-x-2">
              <Button 
                variant="sm" 
                onClick={() => onEdit(parcel)}
              >
                {t('edit')}
              </Button>
              <Button 
                variant="sm" 
                variant="destructive"
                onClick={() => onDelete(parcel.id)}
              >
                {t('delete')}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## Geschäftsregeln - Implementierung

```typescript
// Validierung vor dem Speichern einer Feldblock-Änderung
async function validateFieldBlockUpdate(
  tenantId: string,
  companyId: string,
  blockData: FieldBlockFormData
): Promise<{valid: boolean, errors: string[]}> {
  const errors: string[] = [];
  
  // Alle Schläge des Blocks abrufen
  const fields = await dataService.getFields(tenantId, companyId);
  const blockFields = fields.filter(f => blockData.fieldIds.includes(f.id));
  
  // Flurstücke überprüfen
  const allParcels = new Set<string>();
  for (const field of blockFields) {
    field.cadastralParcelIds.forEach(id => allParcels.add(id));
  }
  
  // Alle Flurstücke direkt im Block sollten in den Feldern vorkommen
  const directParcels = new Set(blockData.cadastralParcelIds);
  for (const parcelId of directParcels) {
    if (!allParcels.has(parcelId)) {
      errors.push(`Flurstück ${parcelId} kommt in keinem der Felder vor`);
    }
  }
  
  // Fläche berechnen und vergleichen
  const fieldArea = blockFields.reduce((sum, f) => sum + f.totalArea, 0);
  if (Math.abs(fieldArea - blockData.totalArea) > 0.01) {
    console.warn(
      `Feldblock-Fläche (${blockData.totalArea}ha) stimmt nicht mit Schlag-Flächen (${fieldArea}ha) überein`
    );
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

## Audit-Logging

Alle Operationen werden automatisch geloggt:

```
Flurstück "Flurstück 123/45" (123/45) wurde hinzugefügt (8.5ha).
Feldblock "Feldblock A" (DE-123456-001) wurde aktualisiert.
Schlag "Acker-Nord 1" wurde aktualisiert (mit Flurstücken: parcel-1, parcel-2).
```

## Testing

```typescript
describe('CadastralParcels und FieldBlocks', () => {
  
  test('should create a cadastral parcel', async () => {
    const service = new MockDataService();
    const newParcel = await service.addCadastralParcel(
      'tenant-123',
      'company-456',
      {
        name: 'Flurstück 300/1',
        county: 'Landkreis X',
        municipality: 'Stadt Y',
        district: 'Gemarkung Z',
        parcelNumber: '300/1',
        area: 5.0,
        owner: 'Test Owner',
      }
    );
    
    expect(newParcel.id).toBeDefined();
    expect(newParcel.name).toBe('Flurstück 300/1');
    expect(newParcel.area).toBe(5.0);
  });
  
  test('should prevent deletion of parcel used in field', async () => {
    const service = new MockDataService();
    
    // Versuchen parcel-1 zu löschen (wird in field-1 verwendet)
    await expect(
      service.deleteCadastralParcel('tenant-123', 'company-456', 'parcel-1')
    ).rejects.toThrow('Cadastral Parcel cannot be deleted because it is used');
  });
  
  test('should create field with multiple parcels', async () => {
    // Feld from parcel-1 und parcel-2 zusammensetzen
    const fieldData = {
      name: 'Kombinierter Schlag',
      cadastralParcelIds: ['parcel-1', 'parcel-2'],
      fieldBlockId: 'block-1',
      totalArea: 15.2,
      // ... weitere Daten ...
    };
    
    // Test implementation
  });
});
```
