import React, { useState, useEffect } from 'react';

function Registration() {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [registeredStudent, setRegisteredStudent] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleStudentRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/register-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: studentName, email: studentEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setRegisteredStudent(data);
        setMessage('Student registered successfully!');
      } else {
        setMessage(data.error || 'Error registering student');
      }
    } catch (error) {
      console.error('Error registering student:', error);
      setMessage('Error registering student');
    }
  };

  const handleCourseRegistration = async (e) => {
    e.preventDefault();
    if (!registeredStudent || !selectedCourse) {
      setMessage('Please register as a student first and select a course');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/register-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: registeredStudent.id, courseId: selectedCourse }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Successfully registered for the course!');
      } else {
        setMessage(data.error || 'Error registering for course');
      }
    } catch (error) {
      console.error('Error registering for course:', error);
      setMessage('Error registering for course');
    }
  };

  return (
    <section id="registration" className="p-10 bg-gray-50">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Student Course Registration</h2>

        {message && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            {message}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Register as Student</h3>
          <form onSubmit={handleStudentRegistration}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Register Student
            </button>
          </form>
        </div>

        {registeredStudent && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Register for Course</h3>
            <form onSubmit={handleCourseRegistration}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Choose a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} - {course.description}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Register for Course
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default Registration;
