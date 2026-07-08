export function adminConversationHref(params: {
  phone: string;
  name?: string;
  city?: string;
  message?: string;
  orderSource?: string;
  orderId?: string;
  orderRef?: string;
}) {
  const search = new URLSearchParams();
  search.set("phone", params.phone.trim());
  if (params.name?.trim()) {
    search.set("name", params.name.trim());
  }
  if (params.city?.trim()) {
    search.set("city", params.city.trim());
  }
  if (params.message?.trim()) {
    search.set("message", params.message.trim());
  }
  if (params.orderSource?.trim()) {
    search.set("orderSource", params.orderSource.trim());
  }
  if (params.orderId?.trim()) {
    search.set("orderId", params.orderId.trim());
  }
  if (params.orderRef?.trim()) {
    search.set("orderRef", params.orderRef.trim());
  }
  return `/admin/conversations?${search.toString()}`;
}
