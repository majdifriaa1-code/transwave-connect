import { Vehicle } from '@/types';

/**
 * Valider un IBAN/RIB français, marocain, algérien, tunisien, belge ou suisse
 */
export function validateIBAN(iban: string): boolean {
  const ibanRegex: Record<string, RegExp> = {
    FR: /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/,
    MA: /^MA\d{2}\d{3}\d{1}\d{14}$/,
    DZ: /^DZ\d{2}\d{3}\d{17}$/,
    TN: /^TN\d{2}\d{3}\d{3}\d{13}\d{2}$/,
    BE: /^BE\d{2}\d{3}\d{7}\d{2}$/,
    CH: /^CH\d{2}\d{5}[\dA-Z]{12}$/,
  };

  const country = iban.substring(0, 2);
  const regex = ibanRegex[country];

  return regex ? regex.test(iban.toUpperCase()) : false;
}

/**
 * Valider un document d'identité (format et expiration)
 */
export function validateIDDocument(
  type: 'passport' | 'national_id' | 'driver_license',
  number: string,
  expiryDate: string
): boolean {
  // 1. Vérifier expiration
  if (new Date(expiryDate) < new Date()) return false;

  // 2. Vérifier format numéro
  const formats: Record<string, RegExp> = {
    passport: /^[A-Z]{2}\d{7}$/,
    national_id: /^\d{9,13}$/,
    driver_license: /^[A-Z]\d{8}$/,
  };

  const format = formats[type];
  return format ? format.test(number.toUpperCase()) : false;
}

/**
 * Calculer la capacité totale à partir d'une liste de véhicules
 */
export function calculateVehicleCapacity(
  vehicleIds: string[],
  vehicles: Vehicle[]
): { totalKg: number; totalCbm: number } {
  return vehicleIds.reduce(
    (acc, id) => {
      const vehicle = vehicles.find(v => v.id === id);
      return {
        totalKg: acc.totalKg + (vehicle?.maxCapacityKg || 0),
        totalCbm: acc.totalCbm + (vehicle?.maxVolumeCbm || 0),
      };
    },
    { totalKg: 0, totalCbm: 0 }
  );
}

/**
 * Convertir un fichier en base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
/**
 * Valider une adresse email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valider un mot de passe (min 8 caractères, au moins 1 majuscule, 1 minuscule, 1 chiffre)
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}