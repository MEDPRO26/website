export function adminConversationHref(params: {
  phone: string;
  name?: string;
  city?: string;
  message?: string;
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
  return `/admin/conversations?${search.toString()}`;
}
