/**
 * GLÖZ Compliance Checker
 * Automated compliance verification against field data
 */

import { GloezStandard, GloezCompliance, GloezIssue } from './gap-types';
import { Field, CropType, SoilType } from './field-types';
import { Operation, OperationType } from './operation-types';

interface ComplianceCheckResult {
  standard: GloezStandard;
  status: 'compliant' | 'non-compliant' | 'at-risk' | 'not-applicable';
  issues: GloezIssue[];
  recommendations: string[];
  affectedFields: Field[];
  score: number; // 0-100
}

class GloezComplianceChecker {
  /**
   * Check GLÖZ 1: Erhaltung von Dauergrünland
   */
  checkGloez1(fields: Field[], operations: Operation[]): ComplianceCheckResult {
    const grasslandFields = fields.filter(f => 
      f.currentCrop === CropType.GRASS || f.currentCrop === CropType.CLOVER
    );
    
    const permanentGrassland = grasslandFields.filter(f => {
      // Check if grassland has been maintained for 5+ years
      const creationYear = new Date(f.createdAt || Date.now()).getFullYear();
      return (2026 - creationYear) >= 5;
    });

    const totalGrasslandArea = grasslandFields.reduce((sum, f) => sum + f.totalArea, 0);
    const permanentArea = permanentGrassland.reduce((sum, f) => sum + f.totalArea, 0);

    // Check for conversion operations (Umbruch)
    const conversions = operations.filter(op => 
      op.operationType === OperationType.DISKING && 
      grasslandFields.some(f => f.id === op.fieldId)
    );

    const issues: GloezIssue[] = [];
    
    if (conversions.length > 0) {
      conversions.forEach(conv => {
        issues.push({
          id: `gloez1-${conv.id}`,
          severity: 'critical',
          description: `Dauergrünland-Umbruch auf Schlag ${conv.fieldId} dokumentiert`,
          affectedFieldIds: [conv.fieldId],
          detectedAt: new Date(),
          recommendations: [
            'Genehmigung für Umbruch nachweisen',
            'Kompensationsflächen anlegen',
            'Bei Amt melden',
          ],
        });
      });
    }

    const status = issues.length > 0 ? 'non-compliant' : 'compliant';
    const score = issues.length > 0 ? 0 : 100;

    return {
      standard: GloezStandard.GLOEZ_1,
      status,
      issues,
      recommendations: issues.length > 0 ? issues[0].recommendations : ['Weiter so!'],
      affectedFields: grasslandFields,
      score,
    };
  }

  /**
   * Check GLÖZ 4: Pufferstreifen entlang von Wasserläufen
   */
  checkGloez4(fields: Field[]): ComplianceCheckResult {
    const issues: GloezIssue[] = [];
    const affectedFields: Field[] = [];

    fields.forEach(field => {
      // Check if field has geometry data with water bodies nearby
      if (field.location?.polygonGeoJSON) {
        try {
          const geojson = JSON.parse(field.location.polygonGeoJSON);
          // Simplified check - in reality would use GIS analysis
          
          // Mock check: Fields with "Bach" or "Fluss" in description need buffers
          if (field.description?.toLowerCase().includes('bach') || 
              field.description?.toLowerCase().includes('fluss')) {
            
            // Check if buffer width is documented
            if (!field.description.toLowerCase().includes('puffer') && 
                !field.description.toLowerCase().includes('buffer')) {
              issues.push({
                id: `gloez4-${field.id}`,
                severity: 'warning',
                description: `Pufferstreifen-Breite für ${field.name} nicht dokumentiert`,
                affectedFieldIds: [field.id],
                detectedAt: new Date(),
                recommendations: [
                  'Pufferstreifen mit mindestens 3m Breite anlegen',
                  'Breite vermessen und dokumentieren',
                  'GPS-Track des Pufferstreifens aufzeichnen',
                ],
              });
              affectedFields.push(field);
            }
          }
        } catch (e) {
          // Invalid GeoJSON
        }
      }
    });

    const status = issues.length === 0 ? 'compliant' : 
                   issues.some(i => i.severity === 'critical') ? 'non-compliant' : 'at-risk';
    const score = Math.max(0, 100 - (issues.length * 20));

    return {
      standard: GloezStandard.GLOEZ_4,
      status,
      issues,
      recommendations: issues.length > 0 ? issues[0].recommendations : ['Pufferstreifen vorbildlich umgesetzt'],
      affectedFields,
      score,
    };
  }

  /**
   * Check GLÖZ 7: Fruchtwechsel
   */
  checkGloez7(fields: Field[], operations: Operation[]): ComplianceCheckResult {
    const issues: GloezIssue[] = [];
    const affectedFields: Field[] = [];

    // Arable land requires crop rotation
    const arableFields = fields.filter(f => 
      !['grassland', 'meadow', 'fallow'].includes(f.currentCrop || '')
    );

    arableFields.forEach(field => {
      // Get all planting/seeding operations for this field
      const sowingOps = operations.filter(op => 
        op.fieldId === field.id && 
        op.operationType === OperationType.SOWING
      );

      // Group by year
      const cropsByYear: Record<number, Set<string>> = {};
      
      sowingOps.forEach(op => {
        const year = new Date(op.plannedStartDate).getFullYear();
        if (!cropsByYear[year]) {
          cropsByYear[year] = new Set();
        }
        // Extract crop type from operation title or description
        const cropType = this.extractCropType(op.title + ' ' + (op.description || ''));
        if (cropType) {
          cropsByYear[year].add(cropType);
        }
      });

      // Check last 3 years for rotation
      const years = [2024, 2025, 2026];
      const missingYears = years.filter(year => !cropsByYear[year] || cropsByYear[year].size === 0);

      if (missingYears.length > 0) {
        issues.push({
          id: `gloez7-${field.id}`,
          severity: 'critical',
          description: `Fruchtwechsel für ${field.name} nicht dokumentiert (${missingYears.join(', ')})`,
          affectedFieldIds: [field.id],
          detectedAt: new Date(),
          recommendations: [
            `Anbauhistorie für ${missingYears.join(', ')} ergänzen`,
            'Mindestens 2 verschiedene Kulturen nachweisen',
            'Aussaat-Termine dokumentieren',
          ],
        });
        affectedFields.push(field);
      } else {
        // Check if same crop for multiple years
        const allCrops = Object.values(cropsByYear)
          .flatMap(crops => Array.from(crops));
        const uniqueCrops = new Set(allCrops);

        if (uniqueCrops.size < 2 && years.length >= 2) {
          issues.push({
            id: `gloez7-mono-${field.id}`,
            severity: 'warning',
            description: `Mögliche Monokultur auf ${field.name}`,
            affectedFieldIds: [field.id],
            detectedAt: new Date(),
            recommendations: [
              'Mindestens 2 verschiedene Kulturen anbauen',
              'Fruchtfolge diversifizieren',
            ],
          });
          affectedFields.push(field);
        }
      }
    });

    const status = issues.some(i => i.severity === 'critical') ? 'non-compliant' :
                   issues.length > 0 ? 'at-risk' : 'compliant';
    const score = Math.max(0, 100 - (issues.length * 25));

    return {
      standard: GloezStandard.GLOEZ_7,
      status,
      issues,
      recommendations: issues.length > 0 ? [
        'Anbauhistorie über Auftragsmodul vervollständigen',
        'Aussaat-Aufträge für fehlende Jahre erstellen',
        'Foto-Dokumentation der Kulturen',
      ] : ['Fruchtwechsel vorbildlich umgesetzt'],
      affectedFields,
      score,
    };
  }

  /**
   * Check GLÖZ 8: Mindestanteil nicht produktiver Flächen
   */
  checkGloez8(fields: Field[]): ComplianceCheckResult {
    const totalArableArea = fields
      .filter(f => !['grassland', 'meadow'].includes(f.currentCrop || ''))
      .reduce((sum, f) => sum + f.totalArea, 0);

    const nonProductiveFields = fields.filter(f => 
      f.currentCrop === CropType.OTHER ||
      f.description?.toLowerCase().includes('brache') ||
      f.description?.toLowerCase().includes('blühstreifen') ||
      f.environmentalMeasures?.some(m => m.toLowerCase().includes('stilllegung'))
    );

    const nonProductiveArea = nonProductiveFields.reduce((sum, f) => sum + f.totalArea, 0);
    const percentage = (nonProductiveArea / totalArableArea) * 100;
    const requiredPercentage = 4.0;
    const shortfall = requiredPercentage - percentage;

    const issues: GloezIssue[] = [];
    const affectedFields: Field[] = [];

    if (percentage < requiredPercentage) {
      issues.push({
        id: 'gloez8-shortfall',
        severity: shortfall > 1 ? 'critical' : 'warning',
        description: `Nur ${percentage.toFixed(1)}% nicht-produktive Flächen (Min: ${requiredPercentage}%)`,
        affectedFieldIds: [],
        detectedAt: new Date(),
        recommendations: [
          `Zusätzliche ${(shortfall * totalArableArea / 100).toFixed(1)} ha nicht-produktive Fläche anlegen`,
          'Blühstreifen oder Brachen ausweisen',
          'Öko-Regelung 1B in Betracht ziehen (650 €/ha)',
        ],
      });
    }

    const status = issues.length === 0 ? 'compliant' :
                   issues[0].severity === 'critical' ? 'non-compliant' : 'at-risk';
    const score = Math.min(100, (percentage / requiredPercentage) * 100);

    return {
      standard: GloezStandard.GLOEZ_8,
      status,
      issues,
      recommendations: issues.length > 0 ? issues[0].recommendations : ['Mindestanteil erfüllt'],
      affectedFields: nonProductiveFields,
      score,
    };
  }

  /**
   * Check GLÖZ 2: Schutz von Feuchtgebieten und Mooren
   */
  checkGloez2(fields: Field[]): ComplianceCheckResult {
    const issues: GloezIssue[] = [];
    const affectedFields: Field[] = [];

    fields.forEach(field => {
      // Check if field is designated as sensitive area
      if (field.environmentalMeasures?.some(m => 
        m.toLowerCase().includes('moor') ||
        m.toLowerCase().includes('feuchtgebiet') ||
        m.toLowerCase().includes('wetland')
      )) {
        // Check for restrictions
        if (!field.restrictions?.some(r => 
          r.toLowerCase().includes('bewirtschaftung') ||
          r.toLowerCase().includes('management')
        )) {
          issues.push({
            id: `gloez2-${field.id}`,
            severity: 'critical',
            description: `Feuchtgebiet/Moor ${field.name} ohne Bewirtschaftungsauflagen`,
            affectedFieldIds: [field.id],
            detectedAt: new Date(),
            recommendations: [
              'Bewirtschaftungsplan mit Naturschutzbehörde abstimmen',
              'Drainage-Maßnahmen überprüfen',
              'Moorbodenschutz-Maßnahmen dokumentieren',
              'Bodenfeuchte regelmäßig kontrollieren',
            ],
          });
          affectedFields.push(field);
        }
      }

      // Check for moorland (Hochmoore, Niedmoore)
      if (field.soilType === SoilType.PEAT || field.description?.toLowerCase().includes('moor')) {
        issues.push({
          id: `gloez2-peat-${field.id}`,
          severity: 'warning',
          description: `Moorboden auf ${field.name} - erhöhte Überwachung erforderlich`,
          affectedFieldIds: [field.id],
          detectedAt: new Date(),
          recommendations: [
            'Moorschutz-Vereinbarungen einhalten',
            'Entwässerung minimieren',
            'CO₂-Emissionen durch Bewirtschaftung reduzieren',
          ],
        });
        affectedFields.push(field);
      }
    });

    const status = issues.some(i => i.severity === 'critical') ? 'non-compliant' :
                   issues.length > 0 ? 'at-risk' : 'compliant';
    const score = Math.max(0, 100 - (issues.length * 20));

    return {
      standard: GloezStandard.GLOEZ_2,
      status,
      issues,
      recommendations: issues.length > 0 ? ['Moorboden-Bewirtschaftung mit Behörden koordinieren'] : ['Feuchtgebiet-Schutz eingehalten'],
      affectedFields,
      score,
    };
  }

  /**
   * Check GLÖZ 3: Verbot des Abbrennens von Stoppelfeld
   */
  checkGloez3(operations: Operation[]): ComplianceCheckResult {
    const issues: GloezIssue[] = [];
    const affectedFields: Field[] = [];

    // Check for burning operations
    const burningOps = operations.filter(op => 
      op.operationType === OperationType.OTHER &&
      (op.title.toLowerCase().includes('stubble') ||
       op.title.toLowerCase().includes('burning') ||
       op.title.toLowerCase().includes('abbrennen') ||
       op.description?.toLowerCase().includes('feuer') ||
       op.description?.toLowerCase().includes('brand'))
    );

    if (burningOps.length > 0) {
      burningOps.forEach(op => {
        issues.push({
          id: `gloez3-${op.id}`,
          severity: 'critical',
          description: `Stoppelbrand auf Schlag ${op.fieldId} dokumentiert`,
          affectedFieldIds: [op.fieldId],
          detectedAt: new Date(),
          recommendations: [
            'Stoppelbrand ist nicht gestattet',
            'Alternative Verfahren nutzen: Mulchen, Häcksel',
            'Bodenkrümelstabilität durch Rückstände verbessern',
            'Mit Behörden Ausnahmegenehmigung prüfen',
          ],
        });
      });
    }

    const status = issues.length === 0 ? 'compliant' : 'non-compliant';
    const score = issues.length === 0 ? 100 : 0;

    return {
      standard: GloezStandard.GLOEZ_3,
      status,
      issues,
      recommendations: issues.length > 0 ? issues[0].recommendations : ['Stoppelbrand untergelassen'],
      affectedFields,
      score,
    };
  }

  /**
   * Check GLÖZ 5: Bodenerosion-Schutz
   */
  checkGloez5(fields: Field[], operations: Operation[]): ComplianceCheckResult {
    const issues: GloezIssue[] = [];
    const affectedFields: Field[] = [];

    fields.forEach(field => {
      // Check if field has erosion risk
      const hasErosionRisk = 
        field.description?.toLowerCase().includes('hang') ||
        field.description?.toLowerCase().includes('erosion') ||
        (field.location?.polygonGeoJSON && 
         JSON.stringify(field.location.polygonGeoJSON).toLowerCase().includes('steigung'));

      if (hasErosionRisk) {
        // Check for erosion protection measures
        const hasProtection = field.description?.toLowerCase().includes('mulch') ||
                             field.description?.toLowerCase().includes('deckung') ||
                             field.environmentalMeasures?.some(m => 
                               m.toLowerCase().includes('hangneigung') ||
                               m.toLowerCase().includes('erosion'));

        if (!hasProtection) {
          issues.push({
            id: `gloez5-${field.id}`,
            severity: 'warning',
            description: `Erosionsgefährdeter Schlag ${field.name} ohne Schutzmaßnahmen`,
            affectedFieldIds: [field.id],
            detectedAt: new Date(),
            recommendations: [
              'Konturbearbeitung durchführen (Querbewirtschaftung)',
              'Mulchsaat oder Direktsaat prüfen',
              'Deckfrüchte oder Winterbegrünung anbauen',
              'Streifen-Bewirtschaftung (Strip Cropping)',
              'Feldränder mit Vegetation stabilisieren',
            ],
          });
          affectedFields.push(field);
        }
      }

      // Check for inappropriate management on slopes
      const steepSlope = field.description?.toLowerCase().match(/steigung|hangneigung|über\s*(\d+)/);
      if (steepSlope) {
        const intensiveOps = operations.filter(op =>
          op.fieldId === field.id && 
          (op.operationType === OperationType.DISKING ||
           op.operationType === OperationType.PLOWING)
        );

        if (intensiveOps.length > 1) {
          issues.push({
            id: `gloez5-intensive-${field.id}`,
            severity: 'warning',
            description: `Intensive Bodenbearbeitung auf Hangfläche ${field.name}`,
            affectedFieldIds: [field.id],
            detectedAt: new Date(),
            recommendations: [
              'Bewirtschaftung lockern (reduzierte Bodenbearbeitung)',
              'Pflugeinsätze minimieren',
              'Humuswirtschaft verbessern',
            ],
          });
          if (!affectedFields.includes(field)) {
            affectedFields.push(field);
          }
        }
      }
    });

    const status = issues.some(i => i.severity === 'critical') ? 'non-compliant' :
                   issues.length > 0 ? 'at-risk' : 'compliant';
    const score = Math.max(0, 100 - (issues.length * 15));

    return {
      standard: GloezStandard.GLOEZ_5,
      status,
      issues,
      recommendations: issues.length > 0 ? ['Erosionss​chutz-Maßnahmen optimieren'] : ['Bodenerosion-Schutz eingehalten'],
      affectedFields,
      score,
    };
  }

  /**
   * Check GLÖZ 6: Mindestschutz des Bodens beim Anbau von hochauflösenden Kulturen
   */
  checkGloez6(fields: Field[], operations: Operation[]): ComplianceCheckResult {
    const issues: GloezIssue[] = [];
    const affectedFields: Field[] = [];

    // Check for high-risk crops during vulnerable seasons
    const riskyCrops = [CropType.CORN, CropType.SUGAR_BEET, CropType.POTATO];
    const riskFields = fields.filter(f => riskyCrops.includes(f.currentCrop as CropType));

    riskFields.forEach(field => {
      // Check for winter soil cover/protection
      const hasCover = field.description?.toLowerCase().includes('cover') ||
                      field.description?.toLowerCase().includes('zwischenfrucht') ||
                      field.environmentalMeasures?.some(m => 
                        m.toLowerCase().includes('cover') ||
                        m.toLowerCase().includes('begrünung'));

      // Check actual field history
      const hasWinterCover = operations.some(op =>
        op.fieldId === field.id &&
        new Date(op.plannedStartDate).getMonth() >= 8 && // Sep or later
        (op.title.toLowerCase().includes('cover') ||
         op.title.toLowerCase().includes('zwischenfrucht') ||
         op.description?.toLowerCase().includes('cover'))
      );

      if (!hasCover && !hasWinterCover) {
        issues.push({
          id: `gloez6-${field.id}`,
          severity: 'warning',
          description: `Schlüsselfrucht ohne Winterbegrünung auf ${field.name}`,
          affectedFieldIds: [field.id],
          detectedAt: new Date(),
          recommendations: [
            'Winterzwischenfrüchte anbauen',
            'Catch Crop / Cover Crop Mischung ausbringen',
            'Bodenfeuchte und Stickstoff überwachen',
            'Frühjahrskultur entsprechend anpassen',
          ],
        });
        affectedFields.push(field);
      }
    });

    const status = issues.length > 0 ? 'at-risk' : 'compliant';
    const score = Math.max(0, 100 - (issues.length * 20));

    return {
      standard: GloezStandard.GLOEZ_6,
      status,
      issues,
      recommendations: issues.length > 0 ? ['Winterbegrünung mindestens 3 Monate'] : ['Bodenbedeckung angemessen'],
      affectedFields,
      score,
    };
  }

  /**
   * Check GLÖZ 9: Erhaltung der Bodenorganismen-Habitate
   */
  checkGloez9(fields: Field[]): ComplianceCheckResult {
    const issues: GloezIssue[] = [];
    const affectedFields: Field[] = [];

    fields.forEach(field => {
      // Check for Natura 2000 area designations
      const isNatura2000 = field.restrictions?.some(r => 
        r.toLowerCase().includes('natura') ||
        r.toLowerCase().includes('schutzgebiet') ||
        r.toLowerCase().includes('protected area')
      );

      if (isNatura2000) {
        // Check for protective management
        const hasProtection = field.environmentalMeasures?.length ?? 0 > 0;

        if (!hasProtection) {
          issues.push({
            id: `gloez9-${field.id}`,
            severity: 'critical',
            description: `Natura 2000 Gebiet ${field.name} ohne Schutzmaßnahmen`,
            affectedFieldIds: [field.id],
            detectedAt: new Date(),
            recommendations: [
              'Managementplan mit Behörden erstellen',
              'Ökologische Aufwertungsmaßnahmen durchführen',
              'Biodiversitäts-Maßnahmen dokumentieren',
              'Jährlich mit Naturschutzamt abstimmen',
            ],
          });
          affectedFields.push(field);
        }
      }

      // Check for habitat elements (Feldholzbestände, Hecken, etc.)
      const hasHabitatRisk = field.description?.toLowerCase().includes('hecke') ||
                            field.description?.toLowerCase().includes('baum') ||
                            field.description?.toLowerCase().includes('gebüsch');

      if (hasHabitatRisk) {
        const hasProtection = field.environmentalMeasures?.some(m =>
          m.toLowerCase().includes('hecke') ||
          m.toLowerCase().includes('habitat') ||
          m.toLowerCase().includes('biotop')
        );

        if (!hasProtection) {
          issues.push({
            id: `gloez9-habitat-${field.id}`,
            severity: 'warning',
            description: `Habitat-Elemente auf ${field.name} ohne Schutzstatus`,
            affectedFieldIds: [field.id],
            detectedAt: new Date(),
            recommendations: [
              'Hecken und Feldholzbestände erhalten',
              'Pufferzonen um Habitatelemente beachten',
              'Insektizide in Hecken-Nähe meiden',
            ],
          });
          if (!affectedFields.includes(field)) {
            affectedFields.push(field);
          }
        }
      }
    });

    const status = issues.some(i => i.severity === 'critical') ? 'non-compliant' :
                   issues.length > 0 ? 'at-risk' : 'compliant';
    const score = Math.max(0, 100 - (issues.length * 20));

    return {
      standard: GloezStandard.GLOEZ_9,
      status,
      issues,
      recommendations: issues.length > 0 ? ['Habitat-Elemente schützen und Biodiversität fördern'] : ['Bodenorganismen-Habitate geschützt'],
      affectedFields,
      score,
    };
  }

  /**
   * Run full compliance check
   */
  async checkAllStandards(
    fields: Field[],
    operations: Operation[]
  ): Promise<ComplianceCheckResult[]> {
    return [
      this.checkGloez1(fields, operations),
      this.checkGloez2(fields),
      this.checkGloez3(operations),
      this.checkGloez4(fields),
      this.checkGloez5(fields, operations),
      this.checkGloez6(fields, operations),
      this.checkGloez7(fields, operations),
      this.checkGloez8(fields),
      this.checkGloez9(fields),
    ];
  }

  /**
   * Extract crop type from operation text
   */
  private extractCropType(text: string): string | null {
    const lowerText = text.toLowerCase();
    
    const cropKeywords: Record<string, string> = {
      'weizen': 'wheat',
      'gerste': 'barley',
      'raps': 'rapeseed',
      'mais': 'corn',
      'zuckerrüben': 'sugar_beet',
      'kartoffeln': 'potato',
      'soja': 'soybean',
    };

    for (const [keyword, cropType] of Object.entries(cropKeywords)) {
      if (lowerText.includes(keyword)) {
        return cropType;
      }
    }

    return null;
  }
}

export const gloezComplianceChecker = new GloezComplianceChecker();
