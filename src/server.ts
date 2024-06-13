import prisma from "./prisma.ts";

Bun.serve({
  development: process.env.NODE_ENV === "development",
  port: 8000,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname !== "/registrations") {
      return new Response("Not Found", { status: 404 });
    }

    try {
      switch (req.method) {
        case "GET": {
          const registrations = await prisma.registration.findMany();

          const body = JSON.stringify(registrations, null, 2);

          return new Response(body, {
            headers: { "content-type": "application/json" },
            status: 200,
          });
        }
        // case "POST": {
        //   // Data validation
        //   const title = await req.json().catch(() => null);
        //   if (typeof title !== "string" || title.length > 256) {
        //     return new Response("Bad Request", { status: 400 });
        //   }
        //
        //   // Insert  into the database
        //   await connection.queryObject`
        //     INSERT INTO todos (title) VALUES (${title})
        //   `;
        //
        //   // Return a 201 Created response
        //   return new Response("true", {
        //     headers: { "content-type": "application/json" },
        //     status: 201,
        //   });
        // }
        default:
          return new Response("Method Not Allowed", { status: 405 });
      }
    } catch (err) {
      console.error(err);
      return new Response(
        `Internal Server Error\n\n${err instanceof Error ? err?.message : ""}`,
        {
          status: 500,
        },
      );
    }
  },
});
