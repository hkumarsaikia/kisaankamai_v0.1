const STATUS_COLORS = {
  success: 0x137333,
  warning: 0x9c6500,
  error: 0xc5221f,
  info: 0x185abc,
};

export async function sendDiscordWebhook({
  webhookUrl,
  title,
  summary,
  status = "info",
  fields = [],
  link,
  content,
  payload,
}) {
  if (!webhookUrl) {
    throw new Error("Missing Discord webhook URL.");
  }

  const requestPayload =
    payload ||
    {
      content: content || undefined,
      embeds: [
        {
          title,
          description: summary,
          url: link || undefined,
          color: STATUS_COLORS[status] || STATUS_COLORS.info,
          fields: fields.map((field) => ({
            name: field.name,
            value: field.value,
            inline: Boolean(field.inline),
          })),
          timestamp: new Date().toISOString(),
        },
      ],
    };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Discord webhook failed (${response.status}): ${text}`);
  }

  return true;
}
