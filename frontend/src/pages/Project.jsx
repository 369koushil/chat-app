import React, { useState, useContext, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosinstance from "../config/axiosInstance";
import { initiateSocket, receivemsg, send } from "../config/socketInstance";
import ReactDOM from "react-dom";
import { UserContext } from '../context/User.context.jsx';
import Markdown from 'markdown-to-jsx';

const Project = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const modalRef = useRef(null);
  const sendMessageRef = useRef(null);

  const location = useLocation();

  console.log(location.state.project);

  function incomingMsgBox(data) {
    const msgBox = document.querySelector('.message-box');
    const incomingMsg = document.createElement('div');
    incomingMsg.classList.add('incoming', 'max-w-60', 'flex-wrap', 'border-2', 'border-red-30', 'flex', 'flex-col', 'w-fit', 'px-2', 'py-1', 'bg-slate-200', 'rounded-md');
    const senderEmail = document.createElement('small');
    senderEmail.classList.add('opacity-50');
    senderEmail.textContent = data.sender === 'ai' ? 'AI' : data.sender;
    incomingMsg.appendChild(senderEmail);

    if (data.sender === 'ai') {
      console.log(data.message);
      const markdownContainer = document.createElement('div');
      markdownContainer.classList.add('markdown-container');
      incomingMsg.appendChild(markdownContainer);
      ReactDOM.render(<Markdown>{data.message}</Markdown>, markdownContainer);
    } else {
      const msg = document.createElement('p');
      msg.classList.add('text-sm');
      msg.textContent = data.message;
      incomingMsg.appendChild(msg);
    }

    msgBox.appendChild(incomingMsg);
  }

  function outgoingMsgBox(data) {
    const msgBox = document.querySelector('.message-box');
    const outgoingMsg = document.createElement('div');
    outgoingMsg.classList.add('outgoing', 'max-w-60', 'flex-wrap', 'border-2', 'border-blue-30', 'flex', 'flex-col', 'w-fit', 'px-2', 'py-1', 'bg-blue-200', 'rounded-md', 'ml-auto');
    const senderEmail = document.createElement('small');
    senderEmail.classList.add('opacity-50');
    senderEmail.textContent = data.sender;
    const msg = document.createElement('p');
    msg.classList.add('text-sm');
    msg.textContent = data.message;

    outgoingMsg.appendChild(senderEmail);
    outgoingMsg.appendChild(msg);
    msgBox.appendChild(outgoingMsg);
  }

  const handleSend = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    send("project-message-send", { message: sendMessageRef.current.value, sender: user?.email });
    outgoingMsgBox({ message: sendMessageRef.current.value, sender: user?.email });
  };

  function addCollaborators() {
    console.log(selectedUserIds);

    axiosinstance
      .put("/project/add-user", {
        projectId: location.state.project._id,
        users: selectedUserIds,
      })
      .then((res) => {
        console.log(res.data);
      });
  }

  useEffect(() => {
    initiateSocket(location.state.project._id);
    receivemsg("project-message-receive", (data) => {
      incomingMsgBox(data);
      console.log(data);
    });

    axiosinstance
      .get("/user/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isSidePanelOpen, isModalOpen]);

  useEffect(() => {
    console.log("Users state updated:", users);
  }, [users]);

  const handleUserClick = (userId) => {
    setSelectedUserIds((prevSelectedUserIds) =>
      prevSelectedUserIds.includes(userId)
        ? prevSelectedUserIds.filter((id) => id !== userId)
        : [...prevSelectedUserIds, userId]
    );
  };

  const handleAddCollaborators = () => {
    console.log("Selected User IDs:", selectedUserIds);
    addCollaborators();
    setIsModalOpen(false);
  };

  const handlesidePanel = async () => {
    setIsSidePanelOpen(!isSidePanelOpen);
    const res = await axiosinstance.get(
      `/project/get-project/${location.state.project._id}`
    );
    console.log(res.data);
    setProjectUsers(res.data.users);
  };

  return (
    <main className="h-screen w-screen flex bg-gradient-to-r from-gray-100 to-gray-200">
      <section className="left relative h-full min-w-96 bg-white shadow-2xl rounded-lg">
        <header className="flex items-center h-14 w-full bg-gradient-to-r from-purple-500 to-indigo-700 p-4 border-b border-indigo-800 justify-between text-white shadow-md">
          <button className="flex items-center" onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-circle-fill mr-1 text-xl"></i>
            <p className="font-semibold">Add Collaborator</p>
          </button>
          <button onClick={handlesidePanel} className="p-2">
            <i className="ri-group-fill text-xl"></i>
          </button>
        </header>
        <div className="conversation-area flex-grow flex flex-col h-full">
          <div className="message-box overflow-y-auto p-5 bg-gray-50 flex-grow flex flex-col gap-2 shadow-inner">
            <div className="incoming max-w-60 flex-wrap border border-gray-300 flex flex-col w-fit px-4 py-2 bg-gray-200 rounded-md shadow-sm">
              <small className="opacity-70">@gmail.com</small>
              <p className="text-sm">Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="incoming flex flex-col w-fit px-4 py-2 ml-auto bg-gray-200 rounded-md shadow-sm">
              <small className="opacity-70">@gmail.com</small>
              <p className="text-sm">Lorem ipsum dolor sit amet.</p>
            </div>
          </div>
          <div className="input-field flex w-full border-t border-gray-300">
            <input
              ref={sendMessageRef}
              className="px-4 py-2 flex-grow outline-none"
              type="text"
              placeholder="Type a message"
            />
            <button onClick={handleSend} className="p-2 rounded-md bg-gradient-to-r from-purple-500 to-indigo-700 text-white shadow-md">
              <i className="ri-send-plane-2-fill text-xl"></i>
            </button>
          </div>
        </div>
        <div
          className={`transition-transform side-panel w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 absolute top-0 ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } shadow-2xl`}
        >
          <header className="flex justify-between items-center px-6 h-16 bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md">
            <h2 className="text-lg font-semibold">Project Members</h2>
            <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
              <i className="ri-close-circle-fill text-2xl hover:text-red-400 transition duration-300"></i>
            </button>
          </header>
          <div className="users flex flex-col p-6 gap-6 overflow-y-auto">
            {projectUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white rounded-xl shadow-lg hover:scale-105 transform transition-transform duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-md">
                  <i className="ri-user-fill text-xl"></i>
                </div>
                <p className="ml-4 text-sm font-medium truncate">{user.email}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          ref={modalRef}
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded-lg shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Select a User</h2>
            <ul className="max-h-60 overflow-y-auto">
              {users.map((user) => (
                <li
                  key={user.id}
                  className={`p-2 border-b border-gray-300 flex justify-between items-center cursor-pointer ${
                    selectedUserIds.includes(user._id) ? "bg-indigo-100" : ""
                  }`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <span>{user.email}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 p-2 bg-gradient-to-r from-purple-500 to-indigo-700 text-white rounded shadow-md"
                onClick={handleAddCollaborators}
              >
                Add Collaborators
              </button>
              <button
                className="p-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded shadow-md"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;