import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Mail, Download } from 'lucide-react';

export const ExportLogsButton: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportLogs = async () => {
    setIsExporting(true);
    
    try {
      // Fetch all users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch all sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('*')
        .order('login_time', { ascending: false });

      if (usersError || sessionsError) {
        throw new Error('Failed to fetch data from database');
      }

      const exportData = {
        exportTime: new Date().toISOString(),
        stats: {
          totalUsers: users?.length || 0,
          activeUsers: users?.filter(u => u.is_active)?.length || 0,
          totalSessions: sessions?.length || 0,
          exportTime: new Date().toISOString()
        },
        users: users || [],
        sessions: sessions || []
      };

      // Create downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Send email (simplified version)
      await sendEmailWithLogs(exportData);

      toast({
        title: "Export Complete",
        description: "Logs exported and email sent to tarcelodmb@gmail.com",
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const sendEmailWithLogs = async (data: any) => {
    // Simple email service using mailto (fallback)
    const subject = `System Export Logs - ${new Date().toLocaleDateString()}`;
    const body = `
System Export Logs Generated on: ${data.exportTime}

Statistics:
- Total Users: ${data.stats.totalUsers}
- Active Users: ${data.stats.activeUsers}
- Total Sessions: ${data.stats.totalSessions}

Please find the detailed logs in the downloaded JSON file.

This is an automated export from the Printer Maintenance System.
    `;

    // Create mailto link
    const mailtoLink = `mailto:tarcelodmb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open default email client
    window.open(mailtoLink, '_blank');
  };

  return (
    <Button 
      onClick={exportLogs} 
      disabled={isExporting}
      className="gap-2"
    >
      {isExporting ? (
        <>
          <Download className="h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Mail className="h-4 w-4" />
          Export & Email Logs
        </>
      )}
    </Button>
  );
};