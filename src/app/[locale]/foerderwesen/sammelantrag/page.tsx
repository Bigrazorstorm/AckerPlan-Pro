import { Metadata } from 'next';
import { SammelantragWizardClient } from '@/components/foerderwesen/sammelantrag-wizard-client';

export const metadata: Metadata = {
  title: 'Sammelantrag - Förderantrag stellen | AckerPlan Pro',
  description: 'GAP-Förderantrag mit automatischer Compliance-Prüfung',
};

export default function SammelantragPage() {
  return <SammelantragWizardClient />;
}
