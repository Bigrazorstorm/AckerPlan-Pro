/**
 * Mock Field Data Service
 * Simuliert Daten bis zur echten DB-Integration (Firebase/Supabase)
 */

import { 
  Field, 
  FieldListItem, 
  FieldFormData, 
  FieldFilters,
  FieldStatus,
  CropType,
  SoilType,
} from './field-types';

// Mock-Daten
const MOCK_FIELDS: Field[] = [
  {
    id: '1',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    name: 'Mühlfeld Ost',
    description: 'Östlicher Feldteil, leichte Hanglage',
    status: FieldStatus.ACTIVE,
    totalArea: 12.5,
    usableArea: 12.3,
    soilType: SoilType.LOAMY,
    soilQuality: 72,
    currentCrop: CropType.WHEAT,
    cropVariety: 'Sommerweizen RGT Planet',
    sowingDate: new Date('2026-03-15'),
    expectedHarvestDate: new Date('2026-08-20'),
    phValue: 6.8,
    isEnvironmentalZone: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2026-02-20'),
  },
  {
    id: '2',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    name: 'Bachwiese',
    description: 'Wiese in Bachnähe, feuchter Boden',
    status: FieldStatus.ACTIVE,
    totalArea: 8.7,
    usableArea: 8.5,
    soilType: SoilType.SILT,
    soilQuality: 68,
    currentCrop: CropType.GRASS,
    sowingDate: new Date('2025-09-01'),
    expectedHarvestDate: new Date('2026-05-15'),
    phValue: 6.5,
    isEnvironmentalZone: true,
    environmentalMeasures: ['Blühstreifen', 'Grünlandschutz'],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2026-02-18'),
  },
  {
    id: '3',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    name: 'Südfeld',
    description: 'Sonniger Hangplatz',
    status: FieldStatus.ACTIVE,
    totalArea: 15.2,
    usableArea: 14.8,
    soilType: SoilType.SANDY,
    soilQuality: 58,
    currentCrop: CropType.CORN,
    cropVariety: 'Silomais Pioneer',
    sowingDate: new Date('2026-04-20'),
    expectedHarvestDate: new Date('2026-10-15'),
    phValue: 7.1,
    isEnvironmentalZone: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2026-02-22'),
  },
  {
    id: '4',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    name: 'Brache Nord',
    description: 'Ruhefeld für Bodenregeneration',
    status: FieldStatus.FALLOW,
    totalArea: 6.3,
    usableArea: 0,
    soilType: SoilType.LOAMY,
    soilQuality: 70,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2026-02-20'),
  },
];

class MockFieldService {
  /**
   * Liste aller Felder mit optionalen Filtern
   */
  async getFields(
    tenantId: string,
    companyId: string,
    filters?: FieldFilters
  ): Promise<FieldListItem[]> {
    let fields = MOCK_FIELDS.filter(
      f => f.tenantId === tenantId && f.companyId === companyId
    );

    // Filter anwenden
    if (filters?.status) {
      fields = fields.filter(f => f.status === filters.status);
    }
    if (filters?.cropType) {
      fields = fields.filter(f => f.currentCrop === filters.cropType);
    }
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      fields = fields.filter(
        f => 
          f.name.toLowerCase().includes(term) ||
          f.description?.toLowerCase().includes(term)
      );
    }

    // Sortierung
    if (filters?.sortBy === 'area') {
      fields.sort((a, b) => b.totalArea - a.totalArea);
    } else if (filters?.sortBy === 'lastActivity') {
      fields.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } else {
      fields.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Zu FieldListItem konvertieren
    return fields.map(f => ({
      id: f.id,
      name: f.name,
      totalArea: f.totalArea,
      currentCrop: f.currentCrop,
      status: f.status,
      lastActivity: f.updatedAt,
    }));
  }

  /**
   * Einzelnes Feld abrufen
   */
  async getField(tenantId: string, fieldId: string): Promise<Field | null> {
    return (
      MOCK_FIELDS.find(f => f.id === fieldId && f.tenantId === tenantId) ||
      null
    );
  }

  /**
   * Feld erstellen
   */
  async createField(
    tenantId: string,
    companyId: string,
    data: FieldFormData,
    userId?: string
  ): Promise<Field> {
    const newField: Field = {
      id: `field-${Date.now()}`,
      tenantId,
      companyId,
      name: data.name,
      description: data.description,
      status: FieldStatus.ACTIVE,
      totalArea: data.totalArea,
      usableArea: data.usableArea || data.totalArea,
      soilType: data.soilType,
      soilQuality: data.soilQuality,
      currentCrop: data.currentCrop,
      cropVariety: data.cropVariety,
      sowingDate: data.sowingDate,
      expectedHarvestDate: data.expectedHarvestDate,
      phValue: data.phValue,
      isEnvironmentalZone: data.isEnvironmentalZone || false,
      environmentalMeasures: data.environmentalMeasures,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
    };

    MOCK_FIELDS.push(newField);
    return newField;
  }

  /**
   * Feld aktualisieren
   */
  async updateField(
    tenantId: string,
    fieldId: string,
    data: Partial<FieldFormData>
  ): Promise<Field | null> {
    const field = MOCK_FIELDS.find(
      f => f.id === fieldId && f.tenantId === tenantId
    );

    if (!field) return null;

    Object.assign(field, data, { updatedAt: new Date() });
    return field;
  }

  /**
   * Feld löschen
   */
  async deleteField(tenantId: string, fieldId: string): Promise<boolean> {
    const index = MOCK_FIELDS.findIndex(
      f => f.id === fieldId && f.tenantId === tenantId
    );

    if (index === -1) return false;

    MOCK_FIELDS.splice(index, 1);
    return true;
  }

  /**
   * Feld Status updaten
   */
  async updateFieldStatus(
    tenantId: string,
    fieldId: string,
    status: FieldStatus
  ): Promise<Field | null> {
    const field = MOCK_FIELDS.find(
      f => f.id === fieldId && f.tenantId === tenantId
    );

    if (!field) return null;

    field.status = status;
    field.updatedAt = new Date();
    return field;
  }

  /**
   * Statistiken für Tenant
   */
  async getFieldStatistics(tenantId: string, companyId: string) {
    const fields = MOCK_FIELDS.filter(
      f => f.tenantId === tenantId && f.companyId === companyId
    );

    const totalArea = fields.reduce((sum, f) => sum + f.totalArea, 0);
    const activeFields = fields.filter(f => f.status === FieldStatus.ACTIVE)
      .length;
    const cropDistribution = {} as Record<string, number>;

    fields.forEach(f => {
      if (f.currentCrop) {
        cropDistribution[f.currentCrop] =
          (cropDistribution[f.currentCrop] || 0) + f.totalArea;
      }
    });

    return {
      totalArea,
      totalFields: fields.length,
      activeFields,
      fallowFields: fields.filter(f => f.status === FieldStatus.FALLOW)
        .length,
      cropDistribution,
      averageSoilQuality:
        fields.reduce((sum, f) => sum + (f.soilQuality || 0), 0) / fields.length,
    };
  }
}

export const mockFieldService = new MockFieldService();
