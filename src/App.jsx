import { useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';

import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('loggedInUser'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === "true");

  const handleLogout = () => {
      setIsLoggedIn(false);
      setIsAdmin(false);
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('isAdmin');
  };

  return (
      <Router>
          <header className="header">
              <div className="logo">E-Learn</div>
              <nav>
    <Link to="/">Home</Link>
    <Link to="/blog">Blog</Link>
    <Link to="/courses">Courses</Link>
    {isLoggedIn && <Link to="/profile">My Courses</Link>}
    {isAdmin && <Link to="/dashboard">Dashboard</Link>}
    {!isLoggedIn ? (
        <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </>
    ) : (
        <button onClick={handleLogout}>Logout</button>
    )}
</nav>

              
          </header>
          <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/blog" element={<BlogPage />} />
    <Route path="/courses" element={<CoursesPage isLoggedIn={isLoggedIn} />} />
    <Route path="/enroll/:courseName" element={<EnrollmentForm isLoggedIn={isLoggedIn} />} />
    <Route path="/dashboard" element={isAdmin ? <AdminDashboard /> : <LandingPage />} />
    <Route path="/course/:courseName" element={<CoursePage />} />
    <Route path="/profile" element={<UserProfile />} />
    <Route path="/register" element={<RegistrationPage setIsLoggedIn={setIsLoggedIn} />} />
    <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
    <Route path="/admin-login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
</Routes>


          <footer className="footer">
              <p>&copy; 2025 E-Learn. All Rights Reserved.</p>
          </footer>
      </Router>
  );
};



const LandingPage = () => {
    const navigate = useNavigate();

    const handleJoin = () => {
        navigate('/courses');
    };

    return (
        <section className="hero">
            <h1>Welcome to E-Learn</h1>
            <p>Your gateway to knowledge and skills</p>
            <div className="info">
                <p>E-Learn provides top-notch courses on Python, React, and more. Enroll now to start your journey!</p>
                <ul>
                    <li>Expert instructors</li>
                    <li>Comprehensive content</li>
                    <li>Community support</li>
                </ul>
            </div>
            <button className="cta-button" onClick={handleJoin}>Join Now</button>
        </section>
    );
};


const BlogPage = () => {
    return (
        <section className="blog">
            <h2>Latest Blogs</h2>
            <div className="blog-posts">
                <div className="post">
                    <h3>Blog Post 1</h3>
                    <p>Exploring the impact of e-learning on modern education.</p>
                    <a href="#">Read More</a>
                </div>
                <div className="post">
                    <h3>Blog Post 2</h3>
                    <p>Top tips for staying motivated during online courses.</p>
                    <a href="#">Read More</a>
                </div>
            </div>
        </section>
    );
};

const CoursesPage = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleEnroll = (courseName) => {
      if (!isLoggedIn) {
          alert("Please login to enroll in a course.");
          navigate("/register");
      } else {
          navigate(`/enroll/${courseName}`);
      }
  };

  return (
      <section className="e-learning">
          <h2>Our Courses</h2>
          <div className="courses">
              <div className="course">
                  <h3>Beginners Guide to Python</h3>
                  <p>Learn Python from scratch.</p>
                  <button className="cta-button" onClick={() => handleEnroll("Python")}>
                      Enroll Now
                  </button>
              </div>
              <div className="course">
                  <h3>Advanced React Techniques</h3>
                  <p>Master React and build amazing apps.</p>
                  <button className="cta-button" onClick={() => handleEnroll("React")}>
                      Enroll Now
                  </button>
              </div>
          </div>
      </section>
  );
};


const AdminLogin = ({ setIsAdmin }) => {
  const [adminData, setAdminData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
      e.preventDefault();
      if (adminData.username === "admin" && adminData.password === "admin123") {
          setIsAdmin(true);
          localStorage.setItem('isAdmin', true);
          navigate('/dashboard');
      } else {
          alert("Invalid admin credentials!");
      }
  };

  return (
      <section className="admin-login">
          <h2>Admin Login</h2>
          <form onSubmit={handleAdminLogin}>
              <label>
                  Username:
                  <input
                      type="text"
                      value={adminData.username}
                      onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                      required
                  />
              </label>
              <label>
                  Password:
                  <input
                      type="password"
                      value={adminData.password}
                      onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                      required
                  />
              </label>
              <button type="submit" className="cta-button">Login</button>
          </form>
      </section>
  );
};

const LoginPage = ({ setIsLoggedIn }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = (e) => {
      e.preventDefault();

      // Fetch registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      const user = registeredUsers.find(
          (u) => u.email === loginData.email && u.password === loginData.password
      );

      if (user) {
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          setIsLoggedIn(true);
          navigate('/profile');
      } else {
          alert('Invalid email or password!');
      }
  };

  return (
      <section className="login">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
              <label>
                  Email:
                  <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                  />
              </label>
              <label>
                  Password:
                  <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                  />
              </label>
              <button type="submit" className="cta-button">Login</button>
          </form>
          <p>
              Dont have an account? <Link to="/register">Register here</Link>.
          </p>
      </section>
  );
};


const RegistrationPage = ({ setIsLoggedIn }) => {
  const [userData, setUserData] = useState({
      name: '',
      email: '',
      password: '',
      college: '',
      branch: '',
  });
  const navigate = useNavigate();

  const handleRegister = (e) => {
      e.preventDefault();

      // Save registered user data in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      localStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, userData]));

      setIsLoggedIn(true);
      navigate('/profile');
  };

  return (
      <section className="register">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
              <label>
                  Name:
                  <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      required
                  />
              </label>
              <label>
                  Email:
                  <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      required
                  />
              </label>
              <label>
                  Password:
                  <input
                      type="password"
                      value={userData.password}
                      onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                      required
                  />
              </label>
              <label>
                  College:
                  <input
                      type="text"
                      value={userData.college}
                      onChange={(e) => setUserData({ ...userData, college: e.target.value })}
                      required
                  />
              </label>
              <label>
                  Branch:
                  <input
                      type="text"
                      value={userData.branch}
                      onChange={(e) => setUserData({ ...userData, branch: e.target.value })}
                      required
                  />
              </label>
              <button type="submit" className="cta-button">Register</button>
          </form>
          <p>
              Already have an account? <Link to="/login">Login here</Link>.
          </p>
      </section>
  );
};



const EnrollmentForm = () => {
    const navigate = useNavigate();
    const { courseName } = useParams();
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const [formData, setFormData] = useState({ name: loggedInUser.name || '', email: loggedInUser.email || '', courseName });

    const handleSubmit = (e) => {
        e.preventDefault();
        const enrolledStudents = JSON.parse(localStorage.getItem('enrolledStudents')) || [];
        localStorage.setItem('enrolledStudents', JSON.stringify([...enrolledStudents, formData]));
        navigate(`/course/${courseName}`);
    };

    return (
        <section className="enrollment">
            <h2>Enrollment Form</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Course Name:
                    <input
                        type="text"
                        value={formData.courseName}
                        readOnly
                    />
                </label>
                <button type="submit" className="cta-button">Enroll</button>
            </form>
        </section>
    );
};
///////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////

const AdminDashboard = () => {
    const [registeredUsers, setRegisteredUsers] = useState(
        JSON.parse(localStorage.getItem('registeredUsers')) || []
    );
    const [enrolledStudents] = useState(
        JSON.parse(localStorage.getItem('enrolledStudents')) || []
    );

    // Function to delete a registered user
    const handleDeleteUser = (email) => {
        // Filter out the user with the given email
        const updatedUsers = registeredUsers.filter(user => user.email !== email);

        // Update localStorage and state
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        setRegisteredUsers(updatedUsers);

        // Optionally, remove any enrollments related to the deleted user
        const updatedEnrollments = enrolledStudents.filter(student => student.email !== email);
        localStorage.setItem('enrolledStudents', JSON.stringify(updatedEnrollments));
    };

    return (
        <section className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            <h3>Registered Users</h3>
            {registeredUsers.length > 0 ? (
                <ul>
                    {registeredUsers.map((user, index) => (
                        <li key={index}>
                            <p>
                                {user.name} ({user.email}){' '}
                                <button
                                    onClick={() => handleDeleteUser(user.email)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </p>
                            <h4>Enrolled Courses:</h4>
                            <ul>
                                {enrolledStudents
                                    .filter(student => student.email === user.email)
                                    .map((course, i) => (
                                        <li key={i}>{course.courseName}</li>
                                    ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No registered users found.</p>
            )}
        </section>
    );
};


//////////////////////////////////////////////////////

const UserDashboard = () => {
    const enrolledStudents = JSON.parse(localStorage.getItem('enrolledStudents')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
  
    const userCourses = enrolledStudents.filter(student => student.email === loggedInUser.email);
  
    return (
      <section className="user-dashboard">
        <h2>User Dashboard</h2>
        <h3>My Enrolled Courses</h3>
        {userCourses.length > 0 ? (
          <ul>
            {userCourses.map((course, index) => (
              <li key={index}>{course.courseName}</li>
            ))}
          </ul>
        ) : (
          <p>You have not enrolled in any courses yet.</p>
        )}
      </section>
    );
  };
///////////////////////////////////////////////////////  


const CoursePage = () => {
    const { courseName } = useParams();
    return (
        <section className="course-detail">
            <h2>{courseName} Course</h2>
            <p>Welcome to the {courseName} course. Here you will learn all the necessary skills to master {courseName}.</p>
        </section>
    );
};

const UserProfile = () => {
    const navigate = useNavigate();
    const enrolledStudents = JSON.parse(localStorage.getItem('enrolledStudents')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};

    const userCourses = enrolledStudents.filter(student => student.email === loggedInUser.email);

    return (
        <section className="user-profile">
            <h2>My Courses</h2>
            {userCourses.length > 0 ? (
                <ul>
                    {userCourses.map((course, index) => (
                        <li key={index}>
                            <button className="cta-button" onClick={() => navigate(`/course/${course.courseName}`)}>
                                {course.courseName}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have not enrolled in any courses yet.</p>
            )}
        </section>
    );
};


export default App;

  
  

 
 





