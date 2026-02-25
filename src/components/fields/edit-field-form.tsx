'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Field } from '@/services/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditFieldFormProps {
  field: Field;
  onSave: (updatedField: Field) => void;
  onCancel: () => void;
}

export function EditFieldForm({ field, onSave, onCancel }: EditFieldFormProps) {
  const t = useTranslations('EditFieldForm');
  const [formData, setFormData] = useState<Field>(field);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('nameLabel')}</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="crop">{t('cropLabel')}</Label>
          <Input id="crop" name="crop" value={formData.crop} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">{t('areaLabel')}</Label>
          <Input id="area" name="area" type="number" value={formData.area} onChange={handleChange} />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            {t('cancelButton')}
          </Button>
          <Button onClick={handleSave}>{t('saveButton')}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
