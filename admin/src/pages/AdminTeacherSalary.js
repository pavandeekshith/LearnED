import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminTeacherSalary = () => {
  const { user, logout } = useAuth();
  const { adminData } = useAdmin();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [salaryData, setSalaryData] = useState([]);
  const [loading] = useState(false);
  const [error] = useState(null);

  const teachers = useMemo(() => adminData.teachers || [], [adminData.teachers]);
  const classrooms = useMemo(() => adminData.classrooms || [], [adminData.classrooms]);
  const students = useMemo(() => adminData.studentsWithClassrooms || [], [adminData.studentsWithClassrooms]);
  
  // Use cached pricing rates from AdminContext (instant loading!)
  const pricingRates = useMemo(() => {
    const rates = adminData.pricingRates || [];
    // Build pricing map: { "grade_board": { fee_per_month, duration_per_month } }
    const ratesMap = {};
    rates.forEach(rate => {
      const key = `${rate.grade_level}_${rate.board}`;
      ratesMap[key] = {
        fee_per_month: rate.fee_per_month,
        duration_per_month: rate.duration_per_month
      };
    });
    return ratesMap;
  }, [adminData.pricingRates]);

  // Calculate teacher salary
  const calculateTeacherSalary = useCallback((teacherId) => {
    const teacherClassrooms = classrooms.filter(c => c.teacher_id === teacherId);
    
    console.log(`Teacher ${teacherId} has ${teacherClassrooms.length} classrooms:`, teacherClassrooms);
    
    let totalSalary = 0;
    const classroomDetails = [];

    teacherClassrooms.forEach(classroom => {
      // Get students in this classroom
      const classroomStudents = students.filter(
        s => s.classroom_id === classroom.id
      );
      
      const studentCount = classroomStudents.length;
      const pricingKey = `${classroom.grade_level}_${classroom.board}`;
      const pricing = pricingRates[pricingKey];
      
      console.log(`Classroom: ${classroom.name}, Grade: ${classroom.grade_level}, Board: ${classroom.board}, Pricing Key: ${pricingKey}, Students: ${studentCount}`);
      
      if (!pricing) {
        console.warn(`No pricing found for grade ${classroom.grade_level} and board ${classroom.board}`);
        return;
      }

      // Calculate salary based on student count with percentages
      let classroomSalary = 0;
      const studentPercentages = [0.75, 0.50, 0.25, 0.10, 0.05]; // For up to 5 students
      
      for (let i = 0; i < studentCount; i++) {
        const percentage = i < studentPercentages.length 
          ? studentPercentages[i] 
          : 0.05; // 5% for each student after 5th
        
        classroomSalary += (pricing.fee_per_month * percentage);
      }

      // Calculate monthly salary based on full-time (20 days/month)
      const monthlyEarnings = classroomSalary * (pricing.duration_per_month / 8); // Normalize to 8-hour base
      
      classroomDetails.push({
        classroom_name: classroom.name,
        grade: classroom.grade_level,
        subject: classroom.subject,
        student_count: studentCount,
        base_fee: pricing.fee_per_month,
        salary_contribution: classroomSalary,
        monthly_salary: monthlyEarnings
      });

      totalSalary += monthlyEarnings;
    });

    return {
      totalMonthly: totalSalary,
      classroomDetails
    };
  }, [classrooms, students, pricingRates]);

  // Compute salary data for all teachers
  React.useEffect(() => {
    const computedData = teachers.map(teacher => {
      const salaryInfo = calculateTeacherSalary(teacher.id);
      return {
        id: teacher.id,
        name: `${teacher.users?.first_name || ''} ${teacher.users?.last_name || ''}`,
        email: teacher.users?.email || '',
        classrooms: salaryInfo.classroomDetails,
        totalMonthly: salaryInfo.totalMonthly,
        totalAnnual: salaryInfo.totalMonthly * 12
      };
    });
    
    setSalaryData(computedData);
  }, [teachers, calculateTeacherSalary]);

  const filteredTeachers = useMemo(() => {
    return salaryData.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [salaryData, searchTerm]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Teacher Salary Management</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="mt-6">
            <div className="flex space-x-8">
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/classrooms')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Classrooms
              </button>
              <button
                onClick={() => navigate('/teachers')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Teachers
              </button>
              <button
                onClick={() => navigate('/students')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Students
              </button>
              <button
                onClick={() => navigate('/payment-approvals')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Payment Approvals
              </button>
              <button
                onClick={() => navigate('/teacher-salary')}
                className="border-b-2 border-blue-500 text-blue-600 px-3 py-2 font-medium text-sm"
              >
                Teacher Salary
              </button>
              <button
                onClick={() => navigate('/grade-pricing')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Grade Pricing
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Teacher
              </label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700">Total Teachers</div>
              <div className="mt-2 text-2xl font-bold text-blue-600">{filteredTeachers.length}</div>
            </div>
          </div>
        </div>

        {/* Teachers Salary Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading salary data...</div>
          ) : filteredTeachers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No teachers found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Classrooms
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Annual Salary
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {teacher.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="space-y-1">
                          {teacher.classrooms.map((classroom, idx) => (
                            <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                              <div className="font-medium">{classroom.classroom_name}</div>
                              <div className="text-gray-600">
                                Grade {classroom.grade} | {classroom.student_count} students | ₹{classroom.monthly_salary.toFixed(2)}/mo
                              </div>
                            </div>
                          ))}
                          {teacher.classrooms.length === 0 && (
                            <span className="text-gray-500">No classrooms assigned</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{teacher.totalMonthly.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          ₹{teacher.totalAnnual.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        {filteredTeachers.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-sm font-medium text-gray-700">Total Monthly Payroll</div>
              <div className="mt-2 text-3xl font-bold text-blue-600">
                ₹{filteredTeachers.reduce((sum, t) => sum + t.totalMonthly, 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-sm font-medium text-gray-700">Average Salary/Teacher</div>
              <div className="mt-2 text-3xl font-bold text-green-600">
                ₹{(filteredTeachers.reduce((sum, t) => sum + t.totalMonthly, 0) / filteredTeachers.length).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-sm font-medium text-gray-700">Total Annual Payroll</div>
              <div className="mt-2 text-3xl font-bold text-purple-600">
                ₹{filteredTeachers.reduce((sum, t) => sum + t.totalAnnual, 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminTeacherSalary;
