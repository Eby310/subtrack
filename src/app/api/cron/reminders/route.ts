import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { getDaysUntilRenewal, formatCurrency, CATEGORIES } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        subscriptions: true,
      },
    });

    const today = new Date();
    let emailsSent = 0;

    for (const user of users) {
      if (!user.email) continue;

      const upcomingSubscriptions = user.subscriptions.filter((sub) => {
        const days = getDaysUntilRenewal(sub.nextBillingDate);
        return days >= 1 && days <= 7;
      });

      if (upcomingSubscriptions.length === 0) continue;

      const subscriptionsList = upcomingSubscriptions
        .map((sub) => {
          const category = CATEGORIES.find((c) => c.value === sub.category);
          const days = getDaysUntilRenewal(sub.nextBillingDate);
          return `• ${sub.name} - ${formatCurrency(sub.price, sub.currency)} (${days} day${days === 1 ? "" : "s"})`;
        })
        .join("\n");

      const totalMonthly = user.subscriptions.reduce((sum, sub) => {
        const monthly = sub.billingCycle === "yearly" 
          ? sub.price / 12 
          : sub.billingCycle === "weekly" 
            ? sub.price * 4.33 
            : sub.price;
        return sum + monthly;
      }, 0);

      try {
        await resend.emails.send({
          from: "SubTrack ifeanyindue@gmail.com",
          to: user.email,
          subject: `Subscription Renewal Reminder - ${upcomingSubscriptions.length} subscription${upcomingSubscriptions.length > 1 ? "s" : ""} renewing soon`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #f4f4f5; background-color: #0a0a0f; padding: 20px; }
                  .container { max-width: 600px; margin: 0 auto; background: #13131a; border-radius: 12px; padding: 30px; }
                  .header { text-align: center; margin-bottom: 30px; }
                  .logo { display: inline-block; background: #6366f1; padding: 10px 20px; border-radius: 8px; font-weight: bold; color: white; }
                  h1 { color: #f4f4f5; margin-bottom: 10px; }
                  p { color: #71717a; margin: 10px 0; }
                  .subscriptions { background: #1a1a24; border-radius: 8px; padding: 20px; margin: 20px 0; }
                  .subscription { padding: 10px 0; border-bottom: 1px solid #27272a; }
                  .subscription:last-child { border-bottom: none; }
                  .subscription-name { font-weight: 600; color: #f4f4f5; }
                  .subscription-days { color: #f59e0b; font-size: 14px; }
                  .total { font-size: 24px; font-weight: bold; color: #f4f4f5; margin-top: 20px; }
                  .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #27272a; }
                  .footer a { color: #6366f1; text-decoration: none; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <span class="logo">SubTrack</span>
                  </div>
                  <h1>Subscription Renewal Reminder</h1>
                  <p>Hi${user.name ? ` ${user.name}` : ""},</p>
                  <p>You have <strong>${upcomingSubscriptions.length}</strong> subscription${upcomingSubscriptions.length > 1 ? "s" : ""} renewing in the next 7 days:</p>
                  <div class="subscriptions">
                    ${upcomingSubscriptions.map(sub => {
                      const days = getDaysUntilRenewal(sub.nextBillingDate);
                      return `
                        <div class="subscription">
                          <span class="subscription-name">${sub.name}</span> - 
                          ${formatCurrency(sub.price, sub.currency)} 
                          <span class="subscription-days">(${days} day${days === 1 ? "" : "s"})</span>
                        </div>
                      `;
                    }).join("")}
                  </div>
                  <p class="total">Monthly Total: ${formatCurrency(totalMonthly)}</p>
                  <div class="footer">
                    <p>Manage your subscriptions at <a href="https://subtrack.vercel.app/subscriptions">SubTrack Dashboard</a></p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
        emailsSent++;
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError);
      }
    }

    return NextResponse.json({ success: true, emailsSent });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json({ success: false, error: "Cron job failed" }, { status: 500 });
  }
}
