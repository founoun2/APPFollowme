import { supabase } from './supabaseClient';
import { Job } from '../types';

export const jobService = {
  // Fetch all jobs from database (not older than 1 week)
  async getAllJobs(): Promise<Job[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .gte('created_at', oneWeekAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }

    return data || [];
  },

  // Save new jobs to database
  async saveJobs(jobs: Job[]): Promise<void> {
    const jobsWithTimestamp = jobs.map(job => ({
      ...job,
      created_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('jobs')
      .upsert(jobsWithTimestamp, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Error saving jobs:', error);
    }
  },

  // Delete jobs older than 1 week
  async deleteOldJobs(): Promise<void> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { error } = await supabase
      .from('jobs')
      .delete()
      .lt('created_at', oneWeekAgo.toISOString());

    if (error) {
      console.error('Error deleting old jobs:', error);
    }
  },

  // Check if job URL is still available
  async checkJobAvailability(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  },

  // Delete unavailable jobs
  async deleteUnavailableJob(jobId: number): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) {
      console.error('Error deleting unavailable job:', error);
    }
  }
};
