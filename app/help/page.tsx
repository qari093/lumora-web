"use client";

import * as React from "react";

export default function HelpPage() {
  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Help Center</h1>
      
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
          How to Cancel GitHub Subscription
        </h2>
        
        <div style={{ lineHeight: 1.6 }}>
          <p style={{ marginBottom: 16 }}>
            If you have a GitHub subscription (such as GitHub Pro, Team, or Enterprise) and want to cancel it, 
            follow these steps:
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
            For GitHub Personal Subscriptions (Pro, Copilot, etc.)
          </h3>
          <ol style={{ paddingLeft: 24, marginBottom: 16 }}>
            <li style={{ marginBottom: 8 }}>
              Go to <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5e9" }}>github.com</a> and log in to your account
            </li>
            <li style={{ marginBottom: 8 }}>
              Click on your profile picture in the top-right corner
            </li>
            <li style={{ marginBottom: 8 }}>
              Select <strong>Settings</strong> from the dropdown menu
            </li>
            <li style={{ marginBottom: 8 }}>
              In the left sidebar, click on <strong>Billing and plans</strong>
            </li>
            <li style={{ marginBottom: 8 }}>
              Find the subscription you want to cancel
            </li>
            <li style={{ marginBottom: 8 }}>
              Click <strong>Edit</strong> next to the subscription
            </li>
            <li style={{ marginBottom: 8 }}>
              Click <strong>Cancel plan</strong> or <strong>Downgrade</strong>
            </li>
            <li style={{ marginBottom: 8 }}>
              Follow the prompts to confirm cancellation
            </li>
          </ol>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
            For GitHub Sponsors
          </h3>
          <ol style={{ paddingLeft: 24, marginBottom: 16 }}>
            <li style={{ marginBottom: 8 }}>
              Go to your <a href="https://github.com/sponsors" target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5e9" }}>GitHub Sponsors</a> dashboard
            </li>
            <li style={{ marginBottom: 8 }}>
              Click on the <strong>Your sponsorships</strong> tab
            </li>
            <li style={{ marginBottom: 8 }}>
              Find the sponsorship you want to cancel
            </li>
            <li style={{ marginBottom: 8 }}>
              Click on the sponsored account
            </li>
            <li style={{ marginBottom: 8 }}>
              Click <strong>Cancel sponsorship</strong>
            </li>
            <li style={{ marginBottom: 8 }}>
              Confirm the cancellation
            </li>
          </ol>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
            For Organization Subscriptions
          </h3>
          <ol style={{ paddingLeft: 24, marginBottom: 16 }}>
            <li style={{ marginBottom: 8 }}>
              Go to the organization's main page on GitHub
            </li>
            <li style={{ marginBottom: 8 }}>
              Click on <strong>Settings</strong> (you must be an organization owner)
            </li>
            <li style={{ marginBottom: 8 }}>
              In the left sidebar, click on <strong>Billing and plans</strong>
            </li>
            <li style={{ marginBottom: 8 }}>
              Click <strong>Edit</strong> next to your current plan
            </li>
            <li style={{ marginBottom: 8 }}>
              Select <strong>Downgrade to Free</strong> or cancel the subscription
            </li>
            <li style={{ marginBottom: 8 }}>
              Follow the prompts to confirm
            </li>
          </ol>

          <div style={{ 
            background: "#f3f4f6", 
            border: "1px solid #d1d5db", 
            borderRadius: 8, 
            padding: 16, 
            marginTop: 24,
            color: "#111"
          }}>
            <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Important Notes:</h4>
            <ul style={{ paddingLeft: 24 }}>
              <li style={{ marginBottom: 6 }}>
                When you cancel, your subscription will remain active until the end of your current billing period
              </li>
              <li style={{ marginBottom: 6 }}>
                You won't be charged for the next billing cycle
              </li>
              <li style={{ marginBottom: 6 }}>
                After cancellation, you'll lose access to premium features at the end of your billing period
              </li>
              <li style={{ marginBottom: 6 }}>
                You can reactivate your subscription at any time
              </li>
            </ul>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>
            Need More Help?
          </h3>
          <p style={{ marginBottom: 8 }}>
            For additional assistance, visit:
          </p>
          <ul style={{ paddingLeft: 24 }}>
            <li style={{ marginBottom: 6 }}>
              <a href="https://docs.github.com/en/billing" target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5e9" }}>
                GitHub Billing Documentation
              </a>
            </li>
            <li style={{ marginBottom: 6 }}>
              <a href="https://support.github.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5e9" }}>
                GitHub Support
              </a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
