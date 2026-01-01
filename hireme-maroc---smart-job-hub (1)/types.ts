
import React from 'react';

export interface Job {
  id: number;
  title: string;
  company: string;
  city: string;
  contract: string;
  time: string;
  isNew: boolean;
  description: string;
  requirements?: string[];
  tasks?: string[];
  salary?: string;
  email?: string;
  contactPhone?: string;
  url: string; // The original source link
  created_at?: string; // Database timestamp
}

export type SidebarKey = 'legal' | 'privacy' | null;

export interface SidebarContent {
  title: string;
  body: React.ReactNode;
}
