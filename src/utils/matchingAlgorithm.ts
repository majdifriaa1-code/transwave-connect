import { Shipment, DepartureOffer } from '@/types';

/**
 * Trouver les offres de départ compatibles avec un colis
 */
export function findMatchingOffers(
  shipment: Shipment,
  offers: DepartureOffer[]
): DepartureOffer[] {
  return offers.filter(offer => {
    // 1. VÉRIFIER ROUTE
    const originMatch =
      shipment.origin.toLowerCase().includes(offer.origin.toLowerCase()) ||
      offer.origin.toLowerCase().includes(shipment.origin.toLowerCase().split(' ')[0]);

    const destMatch =
      shipment.destination.toLowerCase().includes(offer.destination.toLowerCase()) ||
      offer.destination.toLowerCase().includes(shipment.destination.toLowerCase().split(' ')[0]);

    if (!originMatch || !destMatch) return false;

    // 2. VÉRIFIER CAPACITÉ
    if (offer.availableCapacityKg < shipment.weightKg) return false;

    // 3. VÉRIFIER DATE (préférence du client < deadline)
    const shipmentDate = new Date(shipment.preferredDate || Date.now());
    const deadline = new Date(offer.pickupDeadline);
    if (shipmentDate > deadline) return false;

    // 4. VÉRIFIER STATUT
    if (offer.status === 'full' || offer.status === 'cancelled') return false;

    return true;
  });
}

/**
 * Calculer un score de matching (pour prioriser les offres)
 */
export function calculateMatchScore(shipment: Shipment, offer: DepartureOffer): number {
  let score = 100;

  // Pénalité: date proche (plus c'est proche, moins bon)
  const daysUntilDeadline = Math.ceil(
    (new Date(offer.pickupDeadline).getTime() - new Date(shipment.preferredDate || Date.now()).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  score -= daysUntilDeadline * 5;

  // Bonus: utilisation optimale de la capacité
  const capacityUsage = (shipment.weightKg / offer.totalCapacityKg) * 100;
  if (capacityUsage > 70) score += 30; // Bon usage
  else if (capacityUsage > 50) score += 15;

  // Bonus: pickup flexible
  if (offer.pickupType === 'both') score += 25;
  else if (offer.pickupType === 'pickup') score += 15;

  return Math.max(0, score);
}

/**
 * Simuler les offres disponibles pour un colis
 */
export function simulateOffers(shipment: Shipment, allOffers: DepartureOffer[]) {
  const matching = findMatchingOffers(shipment, allOffers)
    .map(offer => ({
      offer,
      score: calculateMatchScore(shipment, offer),
    }))
    .sort((a, b) => b.score - a.score);

  // Calculer le prix moyen
  const avgPrice =
    matching.length > 0 ? matching.reduce((sum, m) => sum + m.offer.basePricePerKg, 0) / matching.length : 0;

  // Estimer la livraison (date départ la plus proche)
  const estimatedDelivery = matching.length > 0 ? new Date(matching[0].offer.departureDate) : null;

  return {
    totalMatches: matching.length,
    topMatches: matching.slice(0, 3),
    avgPrice: Math.round(avgPrice * 100) / 100,
    estimatedDelivery,
  };
}
