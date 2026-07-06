import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { serveWhatsAppMedia, webhook } from "./whatsappMessenger";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  pathPrefix: "/whatsapp/media/",
  method: "GET",
  handler: serveWhatsAppMedia,
});

http.route({
  path: "/whatsapp/webhook",
  method: "POST",
  handler: webhook,
});

http.route({
  path: "/whatsapp/webhook",
  method: "GET",
  handler: webhook,
});

export default http;
