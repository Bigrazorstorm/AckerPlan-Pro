import { Metadata } from 'next';
import { FristenClientContent } from '@/components/foerderwesen/fristen-client-content';

export const metadata: Metadata = {
  title: 'Fristenkalender | AckerPlan Pro',
  description: 'Alle landwirtschaftlichen Fristen für Thüringen im Überblick',
};

export default function FristenPage() {
  return <FristenClientContent />;
}
