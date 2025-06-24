# Odoo CORS Preflight Test Report

**Test Date:** Tue, 24 Jun 2025

## Test Details
- **Endpoint Tested:** `https://erp.vuna.io/web/session/authenticate`
- **Origin Sent:** `https://customk9.vercel.app`
- **Request Type:** Preflight (OPTIONS)
- **Command Used:**
  ```bash
  curl -i -X OPTIONS https://erp.vuna.io/web/session/authenticate \
    -H "Origin: https://customk9.vercel.app" \
    -H "Access-Control-Request-Method: POST"
  ```

## Response
```
HTTP/1.1 204 No Content
Server: nginx/1.24.0 (Ubuntu)
Date: Tue, 24 Jun 2025 17:42:36 GMT
Connection: keep-alive
Access-Control-Max-Age: 1728000
Content-Type: text/plain charset=UTF-8
Content-Length: 0
```

## Findings
- The response did **not** include the required CORS headers:
  - `Access-Control-Allow-Origin`
  - `Access-Control-Allow-Methods`
- This means browsers will block cross-origin requests from `https://customk9.vercel.app` to the Odoo server.

## Conclusion
> The Odoo server is **not** currently configured to allow CORS requests from the production frontend. Please review and update the CORS configuration to include the necessary headers for both preflight (OPTIONS) and actual requests. 