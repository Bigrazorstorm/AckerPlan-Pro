import { Metadata } from 'next';
import { OekoRegelungenClientContent } from '@/components/foerderwesen/oeko-regelungen-client-content';

export const metadata: Metadata = {
  title: 'Öko-Regelungen Potenzialanalyse | AckerPlan Pro',
  description: 'Automatische Analyse der Öko-Regelungen und ungenutzter Förderpotenziale',
};

export default function OekoRegelungenPage() {
  return <OekoRegelungenClientContent />;
}
