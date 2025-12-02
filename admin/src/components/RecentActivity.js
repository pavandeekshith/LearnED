import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      
      // Fetch recent student registrations from trigger_logs
      const { data: triggerLogs, error: triggerError } = await supabase
        .from('trigger_logs')
        .select('*')
        .or('message.ilike.%Student record created%,message.ilike.%User signup completed%')
        .order('event_time', { ascending: false })
        .limit(10);

      if (triggerError) {
        console.error('Error fetching trigger logs:', triggerError);
      }

      // Try to fetch audit activities (handle permission errors gracefully)
      let auditLogs = null;
      try {
        const { data: auditData, error: auditError } = await supabase
          .from('audit_logs')
          .select(`
            *,
            users:user_id(first_name, last_name, email, user_type)
          `)
          .in('action_type', ['student_enrollment_created', 'classroom_teacher_assigned', 'user_created', 'payment_completed'])
          .order('created_at', { ascending: false })
          .limit(10);

        if (auditError) {
          console.error('Error fetching audit logs:', auditError);
          // If permission denied, continue without audit logs
          if (auditError.code !== '42501') {
            throw auditError;
          }
        } else {
          auditLogs = auditData;
        }
      } catch (auditError) {
        console.warn('Audit logs not accessible, continuing with trigger logs only:', auditError.message);
      }

      // Fetch recent enrollments as alternative activity source
      let recentEnrollments = null;
      try {
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('student_enrollments')
          .select(`
            *,
            students:student_id(student_id, users:user_id(first_name, last_name, email)),
            classrooms:classroom_id(name, subject, grade_level)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (!enrollmentError) {
          recentEnrollments = enrollmentData;
        }
      } catch (err) {
        console.warn('Could not fetch enrollments:', err.message);
      }

      // Fetch recent payments as alternative activity source
      let recentPayments = null;
      try {
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .select(`
            *,
            students:student_id(student_id, users:user_id(first_name, last_name, email)),
            classrooms:classroom_id(name, subject)
          `)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!paymentError) {
          recentPayments = paymentData;
        }
      } catch (err) {
        console.warn('Could not fetch payments:', err.message);
      }

      // Combine and format activities
      const combinedActivities = [];

      // Process trigger logs
      if (triggerLogs) {
        triggerLogs.forEach(log => {
          if (log.message?.includes('Student record created')) {
            const metadata = log.metadata || {};
            combinedActivities.push({
              id: `trigger_${log.id}`,
              type: 'student_registration',
              title: 'New Student Registration',
              description: `Student ${metadata.student_id || 'N/A'} created account`,
              timestamp: log.event_time,
              icon: 'user-plus',
              color: 'green',
              metadata: metadata
            });
          } else if (log.message?.includes('User signup completed')) {
            const metadata = log.metadata || {};
            combinedActivities.push({
              id: `trigger_${log.id}`,
              type: 'user_signup',
              title: 'User Account Created',
              description: `New ${metadata.user_type || 'user'} account: ${metadata.email || 'N/A'}`,
              timestamp: log.event_time,
              icon: 'user-plus',
              color: 'blue',
              metadata: metadata
            });
          }
        });
      }

      // Process audit logs
      if (auditLogs) {
        auditLogs.forEach(log => {
          let activity = {
            id: `audit_${log.id}`,
            timestamp: log.created_at,
            metadata: log.metadata || {}
          };

          switch (log.action_type) {
            case 'student_enrollment_created':
              activity = {
                ...activity,
                type: 'enrollment',
                title: 'Student Enrolled',
                description: log.description || 'Student enrolled in classroom',
                icon: 'academic-cap',
                color: 'purple'
              };
              break;
            case 'classroom_teacher_assigned':
              activity = {
                ...activity,
                type: 'teacher_assignment',
                title: 'Teacher Assigned',
                description: log.description || 'Teacher assigned to classroom',
                icon: 'user-group',
                color: 'orange'
              };
              break;
            case 'payment_completed':
              activity = {
                ...activity,
                type: 'payment',
                title: 'Payment Received',
                description: log.description || 'Payment completed successfully',
                icon: 'currency-rupee',
                color: 'green'
              };
              break;
            default:
              activity = {
                ...activity,
                type: 'system',
                title: 'System Activity',
                description: log.description || log.action_type,
                icon: 'cog',
                color: 'gray'
              };
          }

          if (log.users) {
            activity.user = {
              name: `${log.users.first_name} ${log.users.last_name}`,
              email: log.users.email,
              type: log.users.user_type
            };
          }

          combinedActivities.push(activity);
        });
      }

      // Process recent enrollments if audit logs are not available
      if (recentEnrollments) {
        recentEnrollments.forEach(enrollment => {
          const studentName = enrollment.students?.users?.first_name && enrollment.students?.users?.last_name
            ? `${enrollment.students.users.first_name} ${enrollment.students.users.last_name}`
            : enrollment.students?.student_id || 'Unknown Student';
          
          const classroomName = enrollment.classrooms?.name || 'Unknown Classroom';
          
          combinedActivities.push({
            id: `enrollment_${enrollment.id}`,
            type: 'enrollment',
            title: 'Student Enrolled',
            description: `${studentName} enrolled in ${classroomName}`,
            timestamp: enrollment.created_at,
            icon: 'academic-cap',
            color: 'purple',
            user: enrollment.students?.users ? {
              name: studentName,
              email: enrollment.students.users.email,
              type: 'student'
            } : null
          });
        });
      }

      // Process recent payments if audit logs are not available  
      if (recentPayments) {
        recentPayments.forEach(payment => {
          const studentName = payment.students?.users?.first_name && payment.students?.users?.last_name
            ? `${payment.students.users.first_name} ${payment.students.users.last_name}`
            : payment.students?.student_id || 'Unknown Student';
          
          const classroomName = payment.classrooms?.name || 'Unknown Classroom';
          
          combinedActivities.push({
            id: `payment_${payment.id}`,
            type: 'payment',
            title: 'Payment Received',
            description: `₹${payment.amount} payment from ${studentName} for ${classroomName}`,
            timestamp: payment.created_at,
            icon: 'currency-rupee',
            color: 'green',
            user: payment.students?.users ? {
              name: studentName,
              email: payment.students.users.email,
              type: 'student'
            } : null
          });
        });
      }

      // Sort by timestamp (most recent first)
      combinedActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setActivities(combinedActivities.slice(0, 15)); // Keep only latest 15 activities
      setError(null);
      
    } catch (err) {
      console.error('Error fetching recent activities:', err);
      setError('Failed to load recent activities');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const iconPaths = {
      'user-plus': "M12 6v6m0 0v6m0-6h6m-6 0H6",
      'academic-cap': "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
      'user-group': "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8.5a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z",
      'currency-rupee': "M15 8H9m6 3H9m3 8l3-8-3-8M5 12h14",
      'cog': "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    };
    
    return iconPaths[iconName] || iconPaths.cog;
  };

  const getColorClasses = (color) => {
    const colorMap = {
      'green': 'bg-green-100 text-green-600',
      'blue': 'bg-blue-100 text-blue-600',
      'purple': 'bg-purple-100 text-purple-600',
      'orange': 'bg-orange-100 text-orange-600',
      'gray': 'bg-gray-100 text-gray-600'
    };
    return colorMap[color] || colorMap.gray;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center text-gray-500 py-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
          <button 
            onClick={fetchRecentActivities}
            className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button 
          onClick={fetchRecentActivities}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p>No recent activity found</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex space-x-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(activity.color)}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(activity.icon)} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {activity.description}
                </p>
                {activity.user && (
                  <p className="text-xs text-gray-500 mt-1">
                    by {activity.user.name} ({activity.user.type})
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
