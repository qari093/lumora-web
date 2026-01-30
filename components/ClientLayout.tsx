'use client';

import React from 'react';

import LumoraLaunchSplash from "@/components/splash/LumoraLaunchSplash";
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <><LumoraLaunchSplash />
        {children}</>;
}
