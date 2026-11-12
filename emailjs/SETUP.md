# EmailJS connection

The owner supplied these nonsecret identifiers:

- Service: `service_iim5qoe`
- Team notification: `template_t2evd56`
- Visitor acknowledgement: `template_1qxf57q`

The API keys are intentionally absent from source. Set `EMAILJS_PUBLIC_KEY` on the server. If your EmailJS account requires private-key authorization, rotate the private key exposed in chat and store the replacement as `EMAILJS_PRIVATE_KEY` directly in the hosting environment. Never put it in a `VITE_*` variable.

## Dashboard settings

1. In EmailJS, verify that service `service_iim5qoe` is connected to the authorized sending account.
2. Under Account → Security, enable API requests from non-browser applications, as required by EmailJS for server-side usage. Private-key authorization is optional in the provider API; if required in your account, configure its server-only variable.
3. For notification template `template_t2evd56`, set:
   - **To Email:** `kafakaaaa@gmail.com` as a fixed address.
   - **From Name:** `Maven Bridge website`.
   - **From Email:** the connected service's default authorized email.
   - **Reply-To:** `{{from_email}}`.
   - **Subject:** `New project inquiry — {{service_interest}}`.
   - **Body:** paste `notification.html` into the HTML editor.
4. For acknowledgement template `template_1qxf57q`, set:
   - **To Email:** `{{to_email}}`.
   - **From Name:** `Maven Bridge × Knomo Developers`.
   - **From Email:** the connected service's default authorized email.
   - **Reply-To:** `{{reply_to}}` (configured as `bharatsingh2110023@gmail.com`).
   - **Subject:** `We received your inquiry — Maven Bridge × Knomo Developers`.
   - **Body:** paste `acknowledgement.html` into the HTML editor.
5. Leave EmailJS's automatic linked auto-reply feature **off on the notification template**. This application sends the acknowledgement template separately; enabling both would cause duplicate acknowledgements.
6. Use double-brace escaped variables, not triple-brace unescaped HTML. The acknowledgement deliberately contains a fixed receipt message rather than relaying the visitor's project text to an arbitrary recipient.

## Runtime variables

```dotenv
EMAILJS_SERVICE_ID=service_iim5qoe
EMAILJS_NOTIFICATION_TEMPLATE_ID=template_t2evd56
EMAILJS_ACK_TEMPLATE_ID=template_1qxf57q
EMAILJS_PUBLIC_KEY=<configure directly in hosting settings>
EMAILJS_PRIVATE_KEY=<only if required; configure a rotated key directly in hosting settings>
CONTACT_TO_EMAIL=kafakaaaa@gmail.com
CONTACT_REPLY_TO_EMAIL=bharatsingh2110023@gmail.com
SITE_URL=<exact primary website origin>
```

Do not paste placeholder values literally into production. There is no Gmail SMTP app password in this implementation. EmailJS uses the email service connected in its dashboard; that may still be Gmail as the sending provider.

## Verification

`GET /api/contact` reports whether settings are present, not whether provider permissions and templates are correct. Submit one authorized test inquiry. The notification should reach `kafakaaaa@gmail.com`, with all details and the visitor's address as Reply-To. The visitor should receive one acknowledgement. Check inboxes and spam folders. Two separately triggered templates mean two EmailJS send requests per inquiry; check your account's actual quota.

If notification delivery fails, the endpoint returns an error. If the team notification is accepted but the acknowledgement fails, the endpoint returns `accepted: true, acknowledgementSent: false`; the page explains that resubmission is unnecessary. Provider error details, private keys and inquiry text are never logged. Each request waits at least 1.1 seconds between provider calls to respect EmailJS's documented request rate; account-wide traffic from other apps can still cause provider throttling.

Official references: https://www.emailjs.com/docs/rest-api/send/ and https://github.com/emailjs-com/emailjs-nodejs .
