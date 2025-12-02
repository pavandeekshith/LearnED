
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { supabase } from '../lib/supabaseClient';

const ClassroomList = ({ boardFilter: externalBoardFilter, gradeFilter: externalGradeFilter }) => {
  const { adminData } = useAdmin();
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [boards, setBoards] = useState([]);
  const [grades, setGrades] = useState([]);
  const [boardFilter, setBoardFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  const classrooms = adminData.classrooms || [];

  // Update internal filters when external filters change
  useEffect(() => {
    if (externalBoardFilter !== undefined) setBoardFilter(externalBoardFilter);
    if (externalGradeFilter !== undefined) setGradeFilter(externalGradeFilter);
  }, [externalBoardFilter, externalGradeFilter]);

  // Update filter options when classrooms data changes
  useEffect(() => {
    if (classrooms.length > 0) {
      setBoards([...new Set(classrooms.map(c => c.board).filter(Boolean))]);
      setGrades([...new Set(classrooms.map(c => c.grade_level).filter(Boolean))]);
    }
  }, [classrooms]);

  // Filter classrooms client-side
  const filteredClassrooms = classrooms.filter(cls => {
    return (
      (!boardFilter || cls.board === boardFilter) &&
      (!gradeFilter || String(cls.grade_level) === String(gradeFilter))
    );
  });

  // Get pricing for different plans
  const getPrice = (classroom, planType) => {
    console.log('Getting price for classroom:', classroom.id, 'plan:', planType); // Debug log
    console.log('Classroom pricing:', classroom.classroom_pricing); // Debug log
    
    if (!classroom.classroom_pricing) return '-';
    
    // Look for pricing by billing_cycle or payment_plan_id
    const pricing = classroom.classroom_pricing.find(p => 
      p.payment_plan_id === planType || 
      p.payment_plans?.billing_cycle === planType ||
      p.payment_plans?.id === planType
    );
    
    console.log('Found pricing:', pricing); // Debug log
    return pricing?.price || '-';
  };

  const getPricingId = (classroom, planType) => {
    if (!classroom.classroom_pricing) return null;
    
    const pricing = classroom.classroom_pricing.find(p => 
      p.payment_plan_id === planType || 
      p.payment_plans?.billing_cycle === planType ||
      p.payment_plans?.id === planType
    );
    return pricing?.id;
  };

  const handleEdit = (cls) => {
    setEditId(cls.id);
    setEditData({ 
      ...cls, 
      monthly_price: getPrice(cls, 'monthly'),
      quarterly_price: getPrice(cls, 'quarterly'), 
      yearly_price: getPrice(cls, 'yearly'),
      teacher_name: cls.teachers?.users?.first_name + ' ' + cls.teachers?.users?.last_name || ''
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

    const handleSave = async () => {
    // Update classroom fields
    await supabase.from('classrooms').update({
      name: editData.name,
      board: editData.board,
      grade_level: editData.grade_level,
      subject: editData.subject
    }).eq('id', editId);
    
    // Update or insert pricing for each plan
    const plans = [ 'monthly','quarterly', 'yearly'];
    for (const plan of plans) {
      const price = editData[`${plan}_price`];
      const pricingId = getPricingId(classrooms.find(c => c.id === editId), plan);
      
      if (price && price !== '-') {
        if (pricingId) {
          // Update existing pricing
          await supabase.from('classroom_pricing').update({ price }).eq('id', pricingId);
        } else {
          // Insert new pricing
          await supabase.from('classroom_pricing').insert({
            classroom_id: editId,
            payment_plan_id: plan,
            price
          });
        }
      } else if (pricingId) {
        // Delete pricing if price is empty or '-'
        await supabase.from('classroom_pricing').delete().eq('id', pricingId);
      }
    }
    
    setEditId(null);
    fetchClassrooms();
  };

  return (
    <div>
      <h4 className="font-semibold mb-2">Existing Classrooms</h4>
      {classrooms.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No classrooms found</div>
      ) : (
        <>
          {/* Debug section - remove this after testing */}
          {/* <div className="mb-4 p-2 bg-gray-100 text-xs">
            <strong>Debug Info:</strong>
            <div>Total classrooms: {classrooms.length}</div>
            {classrooms.length > 0 && (
              <div>First classroom pricing: {JSON.stringify(classrooms[0].classroom_pricing, null, 2)}</div>
            )}
          </div> */}
          
          <div className="flex gap-2 mb-2">
            <select value={boardFilter} onChange={e => setBoardFilter(e.target.value)} className="border px-2 py-1 rounded">
              <option value="">All Boards</option>
              {boards.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)} className="border px-2 py-1 rounded">
              <option value="">All Grades</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <table className="min-w-full border text-sm">
            <thead>
              <tr>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Board</th>
                <th className="border px-2 py-1">Grade</th>
                <th className="border px-2 py-1">Subject</th>
                <th className="border px-2 py-1">Teacher</th>
                <th className="border px-2 py-1">Monthly Price</th>
                <th className="border px-2 py-1">Quarterly Price</th>
                <th className="border px-2 py-1">Yearly Price</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClassrooms.map((cls) => (
                <tr key={cls.id}>
                  {editId === cls.id ? (
                    <>
                      <td className="border px-2 py-1"><input name="name" value={editData.name} onChange={handleEditChange} className="border rounded px-1" /></td>
                      <td className="border px-2 py-1"><input name="board" value={editData.board} onChange={handleEditChange} className="border rounded px-1" /></td>
                      <td className="border px-2 py-1"><input name="grade_level" value={editData.grade_level} onChange={handleEditChange} className="border rounded px-1" /></td>
                      <td className="border px-2 py-1"><input name="subject" value={editData.subject} onChange={handleEditChange} className="border rounded px-1" /></td>
                      <td className="border px-2 py-1"><span className="text-gray-600">{editData.teacher_name}</span></td>
                      <td className="border px-2 py-1"><input name="monthly_price" value={editData.monthly_price} onChange={handleEditChange} className="border rounded px-1" /></td>
                      <td className="border px-2 py-1"><input name="quarterly_price" value={editData.quarterly_price} onChange={handleEditChange} className="border rounded px-1" /></td>
                      <td className="border px-2 py-1"><input name="yearly_price" value={editData.yearly_price} onChange={handleEditChange} className="border rounded px-1" /></td>
                      <td className="border px-2 py-1">
                        <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded mr-1">Save</button>
                        <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border px-2 py-1">{cls.name}</td>
                      <td className="border px-2 py-1">{cls.board}</td>
                      <td className="border px-2 py-1">{cls.grade_level}</td>
                      <td className="border px-2 py-1">{cls.subject}</td>
                      <td className="border px-2 py-1">{cls.teachers?.users?.first_name + ' ' + cls.teachers?.users?.last_name || 'No Teacher'}</td>
                      <td className="border px-2 py-1">{getPrice(cls, 'monthly')}</td>
                      <td className="border px-2 py-1">{getPrice(cls, 'quarterly')}</td>
                      <td className="border px-2 py-1">{getPrice(cls, 'yearly')}</td>
                      <td className="border px-2 py-1">
                        <button onClick={() => handleEdit(cls)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ClassroomList;
