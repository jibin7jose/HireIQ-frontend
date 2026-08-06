export type ApplicationStatus = 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Hired';

export interface Interview {
    id: string;
    applicationId: string;
    jobTitle: string;
    companyName: string;
    candidateName: string;
    scheduledAt: string;
    durationMinutes: number;
    meetingLink: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
}
