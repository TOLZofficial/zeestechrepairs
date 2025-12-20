const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  body: JSON.stringify(body)
});

const handleOptions = () => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS"
  },
  body: ""
});

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return jsonResponse(500, { error: "Server configuration missing." });
  }

  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return jsonResponse(401, { error: "Unauthorized." });
  }

  const baseHeaders = {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json"
  };

  try {
    if (event.httpMethod === "GET") {
      const url = new URL(`${SUPABASE_URL}/rest/v1/requests`);
      url.searchParams.set("select", "*");
      url.searchParams.set("order", "created_at.desc");

      const response = await fetch(url.toString(), { headers: baseHeaders });
      const text = await response.text();
      if (!response.ok) {
        return jsonResponse(response.status, { error: text });
      }
      return jsonResponse(200, text ? JSON.parse(text) : []);
    }

    if (event.httpMethod === "PATCH") {
      const body = JSON.parse(event.body || "{}");
      if (!body.id || !body.status) {
        return jsonResponse(400, { error: "Missing id or status." });
      }

      const url = new URL(`${SUPABASE_URL}/rest/v1/requests`);
      url.searchParams.set("id", `eq.${body.id}`);

      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: {
          ...baseHeaders,
          Prefer: "return=representation"
        },
        body: JSON.stringify({ status: body.status })
      });

      const text = await response.text();
      if (!response.ok) {
        return jsonResponse(response.status, { error: text });
      }
      return jsonResponse(200, text ? JSON.parse(text) : []);
    }

    if (event.httpMethod === "DELETE") {
      const body = JSON.parse(event.body || "{}");
      if (!body.id) {
        return jsonResponse(400, { error: "Missing id." });
      }

      const url = new URL(`${SUPABASE_URL}/rest/v1/requests`);
      url.searchParams.set("id", `eq.${body.id}`);

      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers: {
          ...baseHeaders,
          Prefer: "return=representation"
        }
      });

      const text = await response.text();
      if (!response.ok) {
        return jsonResponse(response.status, { error: text });
      }
      return jsonResponse(200, text ? JSON.parse(text) : []);
    }

    return jsonResponse(405, { error: "Method not allowed." });
  } catch (error) {
    return jsonResponse(500, { error: error.message || "Server error." });
  }
};
