import { type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROXY_COOKIE_NAME =
  "jeryung_session";

const PROXY_COOKIE_PATH =
  "/api/backend";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function getBackendUrl() {
  const baseUrl =
    process.env.BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error(
      "BACKEND_API_URL is not configured.",
    );
  }

  return baseUrl.replace(/\/+$/, "");
}

function createUpstreamHeaders(
  request: NextRequest,
) {
  const headers = new Headers();

  const excludedHeaders = new Set([
    "host",
    "origin",
    "referer",
    "cookie",
    "content-length",
    "connection",
    "accept-encoding",
  ]);

  request.headers.forEach(
    (value, key) => {
      if (
        !excludedHeaders.has(
          key.toLowerCase(),
        )
      ) {
        headers.set(key, value);
      }
    },
  );

  const session =
    request.cookies.get(
      PROXY_COOKIE_NAME,
    )?.value;

  if (session) {
    headers.set(
      "cookie",
      `jwt=${session}`,
    );
  }

  return headers;
}

function getSetCookieValues(
  headers: Headers,
) {
  const enhancedHeaders =
    headers as Headers & {
      getSetCookie?: () => string[];
    };

  const values =
    enhancedHeaders.getSetCookie?.();

  if (values?.length) {
    return values;
  }

  const single =
    headers.get("set-cookie");

  return single ? [single] : [];
}

function rewriteBackendCookie(
  value: string,
) {
  let cookie = value;

  if (/^jwt=/i.test(cookie)) {
    cookie = cookie.replace(
      /^jwt=/i,
      `${PROXY_COOKIE_NAME}=`,
    );
  }

  cookie = cookie.replace(
    /;\s*Domain=[^;]+/gi,
    "",
  );

  if (/;\s*Path=/i.test(cookie)) {
    cookie = cookie.replace(
      /;\s*Path=[^;]*/i,
      `; Path=${PROXY_COOKIE_PATH}`,
    );
  } else {
    cookie +=
      `; Path=${PROXY_COOKIE_PATH}`;
  }

  return cookie;
}

function createResponseHeaders(
  upstream: Response,
) {
  const headers = new Headers();

  const excludedHeaders = new Set([
    "set-cookie",
    "content-length",
    "content-encoding",
    "transfer-encoding",
    "connection",
  ]);

  upstream.headers.forEach(
    (value, key) => {
      const normalized =
        key.toLowerCase();

      if (
        excludedHeaders.has(
          normalized,
        ) ||
        normalized.startsWith(
          "access-control-",
        )
      ) {
        return;
      }

      headers.set(key, value);
    },
  );

  for (
    const cookie of
      getSetCookieValues(
        upstream.headers,
      )
  ) {
    if (/^jwt=/i.test(cookie)) {
      headers.append(
        "set-cookie",
        rewriteBackendCookie(
          cookie,
        ),
      );
    }
  }

  return headers;
}

async function proxyRequest(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { path } =
      await context.params;

    const encodedPath = path
      .map((segment) =>
        encodeURIComponent(segment),
      )
      .join("/");

    const upstreamUrl =
      new URL(
        `${getBackendUrl()}/${encodedPath}`,
      );

    upstreamUrl.search =
      request.nextUrl.search;

    const method =
      request.method.toUpperCase();

    const hasBody =
      method !== "GET" &&
      method !== "HEAD";

    const body = hasBody
      ? await request.arrayBuffer()
      : undefined;

    const upstream =
      await fetch(upstreamUrl, {
        method,
        headers:
          createUpstreamHeaders(
            request,
          ),
        body:
          body && body.byteLength > 0
            ? body
            : undefined,
        cache: "no-store",
      });

    const noBody =
      method === "HEAD" ||
      upstream.status === 204 ||
      upstream.status === 304;

    return new Response(
      noBody
        ? null
        : upstream.body,
      {
        status: upstream.status,
        statusText:
          upstream.statusText,
        headers:
          createResponseHeaders(
            upstream,
          ),
      },
    );
  } catch {
    return Response.json(
      {
        content: null,
        error:
          "ไม่สามารถเชื่อมต่อ Backend ผ่าน Proxy ได้",
        status: 502,
      },
      {
        status: 502,
      },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
export const HEAD = proxyRequest;
