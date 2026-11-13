import { useState } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContactService } from '@/services/contact-service';
import { toast } from 'sonner';
import { getErrorMessage, getFieldError } from '@/lib/api/client';
import { Loader2, User, Phone } from 'lucide-react';

interface AddContactFormProps {
  initialPhone?: string;
  initialName?: string;
  contactId?: number;    // Jika ada, mode edit
  onSuccess?: () => void;
  onCancel?: () => void;
  categoryType?: string;
}

export function AddContactForm({ 
  initialPhone = '', 
  initialName = '',
  contactId,
  onSuccess, 
  onCancel,
  categoryType = 'General'
}: AddContactFormProps) {
  const [key, setKey] = useState(initialName);        // Nama pelanggan (field: key)
  const [value, setValue] = useState(initialPhone);   // Nomor/ID pelanggan (field: value)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ key?: string; value?: string }>({});
  
  const isEditMode = !!contactId;

  const validate = () => {
    const newErrors: { key?: string; value?: string } = {};
    if (!key.trim()) newErrors.key = 'Nama wajib diisi';
    if (!value.trim()) newErrors.value = 'Nomor/ID wajib diisi';
    // Input bisa angka dan huruf (alphanumeric) untuk berbagai jenis produk PPOB
    else if (!/^[a-zA-Z0-9\-\s]*$/.test(value)) newErrors.value = 'Nomor/ID hanya boleh huruf dan angka';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode && contactId) {
        // Mode Edit
        await ContactService.updateContact(contactId, { 
          key: key.trim(), 
          value: value.trim(),
          tag: categoryType
        });
        toast.success('Pelanggan berhasil diperbarui');
      } else {
        // Mode Tambah
        await ContactService.createContact({ 
          key: key.trim(), 
          value: value.trim(),
          tag: categoryType
        });
        toast.success('Pelanggan berhasil ditambahkan');
        setKey('');
        setValue('');
      }
      onSuccess?.();
    } catch (error) {
      // APK: Error message dari response API field errors atau message
      const fieldError = getFieldError(error, 'key') || getFieldError(error, 'value');
      if (fieldError) {
        toast.error(fieldError);
      } else {
        const message = getErrorMessage(error, isEditMode ? 'Gagal memperbarui pelanggan' : 'Gagal menambahkan pelanggan');
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input - Field: key */}
        <div className="space-y-2">
          <Input
            id="key"
            label="Nama Pelanggan"
            labelIcon={<User />}
            placeholder="Contoh: Budi, Kantor, Toko"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={errors.key ? 'border-destructive' : ''}
            disabled={isSubmitting}
            autoFocus
          />
          {errors.key && (
            <p className="text-caption text-destructive">{errors.key}</p>
          )}
        </div>

        {/* Number/ID Input - Field: value - Alphanumeric untuk berbagai produk PPOB */}
        <div className="space-y-2">
          <Input
            id="value"
            label="Nomor / ID Pelanggan"
            labelIcon={<Phone />}
            type="text"
            inputMode="text"
            placeholder="Contoh: 08123456789, PLN12345, TOKENABC"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
            className={errors.value ? 'border-destructive' : ''}
            disabled={isSubmitting}
          />
          {errors.value && (
            <p className="text-caption text-destructive">{errors.value}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onCancel && (
            <Button 
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Batal
            </Button>
          )}
          <Button 
            type="submit"
            className="flex-1 h-12 rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
            {isEditMode ? 'Perbarui' : 'Simpan'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
