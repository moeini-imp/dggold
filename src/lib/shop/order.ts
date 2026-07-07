/** Order creation (via our proxy, which forwards the bearer token). */

export interface AddOrderPayload {
  addressId: number;
  shippingTypeId: number;
  idempotencyKey: string;
  paymentGatewayId: number;
  callbackUrl: string;
  products: { id: number; quantity: number }[];
}

export interface AddOrderData {
  paymentIntentId: string;
  status: string;
  amount: number;
  gatewayUrl: string;
  createdAtUtc?: string;
}

export interface AddOrderResult {
  success: boolean;
  data: AddOrderData | null;
  resultMessage?: string | null;
  errorMessage?: string | null;
}

/** Create an order; returns the payment gateway URL to redirect the user to. */
export async function addOrder(
  token: string,
  payload: AddOrderPayload,
): Promise<AddOrderResult> {
  const res = await fetch("/api/order/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as AddOrderResult;
}
