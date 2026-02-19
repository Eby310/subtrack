"use client";

import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Bell, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

interface Settings {
  emailReminders: boolean;
  reminderDays: number;
  reminderTime: string;
}

export default function SettingsPage() {
  const { user } = useUser();
  const [settings, setSettings] = useState<Settings>({
    emailReminders: true,
    reminderDays: 3,
    reminderTime: "morning",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key: keyof Settings, value: boolean | number | string) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    localStorage.setItem("subtrack_settings", JSON.stringify(settings));
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#f4f4f5]">Settings</h1>
        <p className="text-[#71717a] mt-1">
          Manage your account and notification preferences
        </p>
      </div>

      <div className="bg-[#13131a] border border-[#27272a] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#f4f4f5] mb-6">Profile</h2>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          <div>
            <p className="font-medium text-[#f4f4f5]">
              {user?.fullName || user?.username || "User"}
            </p>
            <p className="text-sm text-[#71717a]">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#13131a] border border-[#27272a] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#f4f4f5]">
              Notification Preferences
            </h2>
            <p className="text-sm text-[#71717a]">
              Configure how you receive renewal reminders
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#f4f4f5]">Email Reminders</p>
              <p className="text-sm text-[#71717a]">
                Get notified before subscriptions renew
              </p>
            </div>
            <button
              onClick={() =>
                handleSettingChange("emailReminders", !settings.emailReminders)
              }
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.emailReminders ? "bg-indigo-600" : "bg-[#27272a]"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.emailReminders ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block font-medium text-[#f4f4f5] mb-2">
              Days before renewal
            </label>
            <p className="text-sm text-[#71717a] mb-2">
              How many days in advance to send reminders
            </p>
            <select
              value={settings.reminderDays}
              onChange={(e) =>
                handleSettingChange("reminderDays", parseInt(e.target.value))
              }
              className="w-full bg-[#1a1a24] border border-[#27272a] text-[#f4f4f5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {[1, 2, 3, 5, 7].map((days) => (
                <option key={days} value={days}>
                  {days} {days === 1 ? "day" : "days"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#f4f4f5] mb-2">
              Reminder Time
            </label>
            <p className="text-sm text-[#71717a] mb-2">
              When to receive the reminder email
            </p>
            <select
              value={settings.reminderTime}
              onChange={(e) =>
                handleSettingChange("reminderTime", e.target.value)
              }
              className="w-full bg-[#1a1a24] border border-[#27272a] text-[#f4f4f5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="morning">Morning (9:00 AM)</option>
              <option value="afternoon">Afternoon (2:00 PM)</option>
              <option value="evening">Evening (6:00 PM)</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="bg-[#13131a] border border-red-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#f4f4f5]">Danger Zone</h2>
            <p className="text-sm text-[#71717a]">Irreversible actions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-xl border border-red-500/10">
            <div>
              <p className="font-medium text-[#f4f4f5]">Delete Account</p>
              <p className="text-sm text-[#71717a]">
                Permanently delete your account and all data
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
