import React, { useContext, useRef, useState, useEffect } from 'react';
import { UserContext } from '../context/User.context';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosInstance';

const Home = () => {
  const [modal, setModal] = useState(false);
  const [projects, setProjects] = useState([]); // Initialize projects as an empty array
  const { user } = useContext(UserContext);
  const projectNameRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/project/all');
        console.log(response.data);
        setProjects(response.data.projects || []); // Ensure projects is an array
      } catch (error) {
        console.error('Error fetching projects:', error.message);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/project/create', {
        name: projectNameRef.current.value,
      });
      console.log(response.data);
      setProjects((prevProjects) => [...prevProjects, response.data.project]);
    } catch (error) {
      console.error('Error creating project:', error.message);
    }
  };

  return (
    <main className="p-4">
      <div className="projects">
        <i onClick={() => {console.log(user) ;setModal(true)}} className="ri-link cursor-pointer"></i>
      </div>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="projectName" className="block text-gray-700">
                  Project Name
                </label>
                <input
                  ref={projectNameRef}
                  type="text"
                  id="projectName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button onClick={()=>setModal(false)}
                  type="submit"
                  className={`px-4 py-2 bg-blue-400 text-white rounded  hover:bg-blue-600`}
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Changed: Added check to handle case when projects array is empty or undefined */}
      {Array.isArray(projects) && projects.length > 0 ? (
        <div className="mt-4">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() =>
                navigate('/project', { state: { project } })
              }
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mt-2"
            >
              <i className="ri-user-line mr-2"></i>
              {`${project.users.length} Users - ${project.name}`}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-gray-500">No projects available</div> // Added message for empty projects array
      )}
    </main>
  );
};

export default Home;
