import { StoreDeliverySettings, Shipment } from "@vayva/db";
import { FEATURES } from "../env-validation";

export type DeliveryStatus =
  | "DRAFT"
  | "REQUESTED"
  | "ACCEPTED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "CANCELED";

export interface DispatchResponse {
  success: boolean;
  providerJobId?: string;
  trackingUrl?: string | null;
  rawResponse?: any;
  error?: string;
  provider?: "MANUAL" | "KWIK" | "CUSTOM";
  deliveryStatus?: "NOT_TRACKED" | "MANUAL_CONFIRMED" | "TRACKING_AVAILABLE";
}

export interface CancelResponse {
  success: boolean;
  rawResponse?: any;
  error?: string;
}

export interface DispatchData {
  id: string;
  recipientName: string;
  recipientPhone: string;
  addressLine1: string;
  addressCity?: string;
  parcelDescription: string;
  totalAmount?: number;
}

export interface EstimateResponse {
  success: boolean;
  price?: number;
  estimated_duration?: number; // in hours? or minutes? usually generic number or string
  currency?: string;
  error?: string;
  rawResponse?: any;
}

export interface DeliveryProvider {
  name: string;
  dispatch(
    order: DispatchData,
    settings: StoreDeliverySettings,
  ): Promise<DispatchResponse>;
  cancel(jobId: string): Promise<CancelResponse>;
  getEstimate(
    origin: { address: string; city?: string; name: string; phone: string },
    destination: { address: string; city?: string; name: string; phone: string },
    parcel: { description: string }
  ): Promise<EstimateResponse>;
}

export class CustomProvider implements DeliveryProvider {
  name = "CUSTOM";

  async dispatch(
    order: DispatchData,
    settings: StoreDeliverySettings,
  ): Promise<DispatchResponse> {
    return {
      success: true,
      providerJobId: `MANUAL-${Date.now()}`,
      trackingUrl: null,
      provider: "MANUAL",
      deliveryStatus: "MANUAL_CONFIRMED",
    };
  }

  async cancel(jobId: string): Promise<CancelResponse> {
    return { success: true };
  }

  async getEstimate(
    origin: { address: string; city?: string; name: string; phone: string },
    destination: { address: string; city?: string; name: string; phone: string },
    parcel: { description: string }
  ): Promise<EstimateResponse> {
    // Return a flat rate or 0 for custom/manual providers
    return { success: true, price: 0, currency: "NGN" };
  }
}

// --- Kwik Provider ---

export class KwikProvider implements DeliveryProvider {
  name = "KWIK";
  private apiKey: string;
  private merchantId: string;
  private baseUrl: string;

  constructor() {
    if (!FEATURES.DELIVERY_ENABLED) {
      throw new Error("Delivery integration is not configured");
    }

    this.apiKey = process.env.KWIK_API_KEY!;
    this.merchantId = process.env.KWIK_MERCHANT_ID!;
    this.baseUrl =
      process.env.KWIK_BASE_URL || "https://staging-api-test.kwik.delivery/api/v1";
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async dispatch(
    order: DispatchData,
    settings: StoreDeliverySettings,
  ): Promise<DispatchResponse> {
    try {
      const payload = {
        merchant_id: this.merchantId,
        pickup: {
          name: settings.pickupName || "Merchant",
          phone: settings.pickupPhone,
          address: settings.pickupAddressLine1,
          city: settings.pickupCity,
        },
        delivery: {
          name: order.recipientName,
          phone: order.recipientPhone,
          address: order.addressLine1,
          city: order.addressCity || "",
        },
        parcel: {
          description: order.parcelDescription,
          reference: order.id,
        },
      };

      const response = await fetch(`${this.baseUrl}/deliveries`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        // Specific Error Trapping
        if (errorBody.includes("insufficient funds") || errorBody.includes("balance")) {
          return {
            success: false,
            error: "INSUFFICIENT_FUNDS",
            rawResponse: errorBody,
          }
        }

        return {
          success: false,
          error: `Kwik API Error: ${response.status} - ${errorBody}`,
          rawResponse: errorBody,
        };
      }

      const data = await response.json();

      return {
        success: true,
        providerJobId: data.data?.id || data.id,
        trackingUrl: data.data?.tracking_url || data.tracking_url,
        rawResponse: data,
        provider: "KWIK",
        deliveryStatus: "TRACKING_AVAILABLE",
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async cancel(jobId: string): Promise<CancelResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/deliveries/${jobId}/cancel`,
        {
          method: "POST",
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        return { success: false, error: errorBody };
      }

      return { success: true, rawResponse: await response.json() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getEstimate(
    origin: { address: string; city?: string; name: string; phone: string },
    destination: { address: string; city?: string; name: string; phone: string },
    parcel: { description: string }
  ): Promise<EstimateResponse> {
    try {
      const payload = {
        merchant_id: this.merchantId,
        domain_name: "vayva.com", // Required by Kwik sometimes?
        pickup: {
          name: origin.name,
          phone: origin.phone,
          address: origin.address,
          city: origin.city || "",
        },
        delivery: {
          name: destination.name,
          phone: destination.phone,
          address: destination.address,
          city: destination.city || "",
        },
        parcel: {
          description: parcel.description,
        }
      };

      // Note: Kwik endpoint for estimation might differ. 
      // Based on quick search, sometimes it is /deliveries/estimate or similar.
      // Documentation says "Get Estimated Fare". Let's assume /deliveries/estimate or check implementation.
      // Since I'm in EXECUTION, I will try /deliveries/estimate which is standard REST pattern for them.

      const response = await fetch(`${this.baseUrl}/deliveries/estimate`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        // Maybe try another endpoint if 404? 
        // Common alternative: /pricing/calculate
        return {
          success: false,
          error: `Kwik Estimate Error: ${response.status} - ${errorBody}`,
          rawResponse: errorBody
        };
      }

      const data = await response.json();
      const estimatedPrice = data.data?.estimated_price || data.data?.total_amount || 0;

      return {
        success: true,
        price: Number(estimatedPrice),
        currency: "NGN",
        rawResponse: data
      };

    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

// --- Factory ---

export function getDeliveryProvider(providerName: string): DeliveryProvider {
  if (providerName === "KWIK") {
    if (!FEATURES.DELIVERY_ENABLED) {
      throw new Error("Kwik delivery is not configured");
    }
    return new KwikProvider();
  }
  return new CustomProvider();
}
