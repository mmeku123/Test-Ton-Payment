const { Telegraf } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf("7065719463:AAEA8Go6P3ZIF7b2KGuokbhHaAZeu3A0yUo"); // Replace with your bot token from BotFather

// Command to create an invoice link
bot.command("buy", async (ctx) => {
  const userId = ctx.from.id; // User ID of the payer
  const itemId = "item123"; // Example item ID
  const itemDescription = "Super Sword"; // Example item description

  // Create a payload with additional data
  const payload = JSON.stringify({
    userId: userId,
    itemId: itemId,
    itemDescription: itemDescription,
  });

  const invoiceData = {
    title: "Game Item Purchase",
    description: `Purchase ${itemDescription} using Telegram Stars.`,
    payload: payload, // Serialized JSON payload with additional data
    provider_token: "284685063:TEST:ZjMxOTQyOWZiNWYx", // Replace with your payment provider token from BotFather
    currency: "XTR", // Use 'XTR' for Telegram Stars currency
    prices: [{ label: "Game Item", amount: 1 }], // Example price in smallest currency unit (1 XTR = 100 units)
  };

  try {
    // Create invoice link logic here
    const response = await axios.post(
      `https://api.telegram.org/bot${bot.token}/createInvoiceLink`,
      invoiceData
    );

    if (response.data.ok) {
      const invoiceLink = response.data.result;
      ctx.reply(`Here is your payment link: ${invoiceLink}`);
    } else {
      console.error("Error creating invoice link:", response.data);
      ctx.reply("Failed to create an invoice link. Please try again.");
    }
  } catch (error) {
    console.error("Error creating invoice link:", error);
    ctx.reply(
      "An error occurred while creating the invoice link. Please try again."
    );
  }
});

// Listen for successful payment updates
bot.on("successful_payment", (ctx) => {
  const successfulPayment = ctx.message.successful_payment;
  const invoicePayload = JSON.parse(successfulPayment.invoice_payload); // Parse the payload

  console.log("Payment successful:", successfulPayment);
  console.log("Payer ID:", invoicePayload.userId);
  console.log(
    "Item Purchased:",
    invoicePayload.itemId,
    invoicePayload.itemDescription
  );

  // Take additional actions based on the payment details
  ctx.reply(
    `Thank you for purchasing ${invoicePayload.itemDescription}! Your payment was successful.`
  );
});

// Launch the bot
bot.launch();

console.log("Bot is running...");
