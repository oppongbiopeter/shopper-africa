export type OrderStatus =
  | 'pending_payment' | 'paid' | 'shopper_assigned' | 'shopping' | 'shopping_complete'
  | 'rider_assigned' | 'heading_to_store' | 'at_store' | 'heading_to_customer'
  | 'nearby' | 'delivered' | 'cancelled' | 'failed';

export type LineItemStatus = 'pending' | 'found' | 'substituted' | 'out_of_stock' | 'removed';

export type OrderLineItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
  unit?: string;
  status: LineItemStatus;
  substituteId?: string;
  substituteName?: string;
  substitutePrice?: number;
  substituteQty?: number;
  substitutionStatus?: 'proposed' | 'accepted' | 'rejected';
  note?: string;
};

export type ShopperProfile = {
  id: string;
  name: string;
  phone: string;
  rating: number;
  photoUrl?: string;
  isOnline: boolean;
  currentOrderId?: string;
  currentLat?: number;
  currentLng?: number;
};

export type SubstitutionProposal = {
  orderId: string;
  lineItemId: string;
  originalName: string;
  originalPrice: number;
  substituteId: string;
  substituteName: string;
  substitutePrice: number;
  reason?: string;
  proposedAt: number;
  status: 'proposed' | 'accepted' | 'rejected';
};
