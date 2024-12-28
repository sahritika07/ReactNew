
import React, { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import axios from "axios";


const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  console.log(currentUser?.user);

  // Sample data structure for demonstration (you should get data from an API or server)
  const [userData, setUserData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  // const [loading, setLoading] = useState(false);
  

  // Edit state management
  const [editUser, setEditUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  
  const [itemsPerPage] = useState(5); // Items per page
  


  // const handleAddUser = async () => {
  //   try {
  //     const response = await axios.post(' http://localhost:8000/api/user/users', {
  //       name: name,       // These should be the values from your input fields
  //       email: email,
  //       roles: roles,
  //     });
  
  //     if (response.data.status === 'success') {
  //       alert('User added successfully!');
  //       handleGetUsers()
  //       // Optionally, reset the form or refresh the user list
  //     } else {
  //       alert(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('There was an error adding the user!', error);
  //     alert('Failed to add user');
  //   }
  // };

  const userID = JSON.parse(localStorage.getItem("user"));
      console.log(userID?.user?._id)

  const handleAddUser = async () => {
    try {
      // Retrieve the userID from local storage
      
  
      if (!userID?.user?._id) {
        alert("User ID not found in local storage. Please log in again.");
        return;
      }
  
      const response = await axios.post("http://localhost:8000/api/user/users", {
        name: name, // Input field values
        email: email,
        roles: roles,
        addedBy: userID?.user?._id, // Send the user ID to the backend
      });
  
      if (response.data.status === "success") {
        alert("User added successfully!");
        handleGetUsers(); // Refresh the user list
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("There was an error adding the user!", error);
      alert("Failed to add user");
    }
  };
  

// const [users, setUsers] = useState("")
console.log("id=",userID?.user?._id)
  // const handleGetUsers = async () => {
  //   console.log("id=",userID?.user?._id)
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8000/api/user/users?id=${userID?.user?._id}&page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&sort=dsc`
  //     );
  //      // Backend API URL
      
  //     if (response.data.status === 'success') {
  //       console.log('Fetched users:', response.data);
  //       setUserData(response?.data?.users);
  //       setTotalPages(response?.data?.totalPages)  // Store fetched users in the state
  //     } else {
  //       alert(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('There was an error fetching the users!', error);
  //     alert('Failed to fetch users');
  //   }
  // };

  // const handleGetUsers = async (sortOrder = "asc") => {
  //   console.log("id=", userID?.user?._id);
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8000/api/user/users`, 
  //       {
  //         params: {
  //           id: userID?.user?._id,
  //           page: currentPage,
  //           limit: itemsPerPage,
  //           search: searchQuery,
  //           sort: sortOrder, // Dynamic sort order
  //         },
  //       }
  //     );
  
  //     if (response.data.status === "success") {
  //       console.log("Fetched users:", response.data);
  //       setUserData(response?.data?.users);
  //       setTotalPages(response?.data?.totalPages); // Store fetched users in the state
  //     } else {
  //       alert(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("There was an error fetching the users!", error);
  //     alert("Failed to fetch users");
  //   }
  // };

  const handleGetUsers = async () => {
    console.log("id=", userID?.user?._id);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/user/users?id=${userID?.user?._id}&page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&sort=${sortOrder}`
      ); // Backend API URL
  
      if (response.data.status === "success") {
        console.log("Fetched users:", response.data);
        setUserData(response?.data?.users);
        setTotalPages(response?.data?.totalPages); // Store fetched users in the state
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("There was an error fetching the users!", error);
      alert("Failed to fetch users");
    }
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
  };

  useEffect(() => {
    handleGetUsers()
  }, [])
  // console.log(users)
  

  let idData;

  const [userid, setuserId] = useState("")
  // Handle Edit User
  const handleEditUser = (user) => {
    setuserId(user._id)
    setEditUser(user);
    setName(user.name);
    setEmail(user.email);
    setRoles(user.roles);
  };
  
  console.log(userid)


  // Save Edited User
  const handleSaveEdit = () => {
    const updatedUserData = userData.map((user) =>
      user.id === editUser.id
        ? { ...user, name: name, email: email, roles: roles.split(",").map((role) => role.trim()) }
        : user
    );
    setUserData(updatedUserData);
    clearForm();
    setEditUser(null);
  };

  // Handle Delete User
  // const handleDeleteUser = (userId) => {
  //   const updatedUserData = userData.filter((user) => user.id !== userId);
  //   setUserData(updatedUserData);
  // };


  // Delete user from backend and update UI
  const deleteUser = (id) => {
    console.log(id)
    axios.delete(`http://localhost:8000/api/user/deleteUsers?id=${id}`)  // DELETE request to backend
      .then(response => {
        console.log(response.data.message);  // Optionally log the success message
        // Remove the deleted user from the local state (UI)
        handleGetUsers()
      })
      .catch(err => {
        console.error('Error deleting user:', err);
      });
  };

console.log(idData)
const updateUser = (id) => {
  console.log(id);

  // Send PUT request to update user details
  axios.put(`http://localhost:8000/api/user/updateUsers?id=${userid}`,{
    name,
    email,
    roles
  })
    .then(response => {
      console.log(response.data.message);  // Log success message
      // Optionally, call a function to refresh the user data or handle the update
      handleGetUsers();
    })
    .catch(err => {
      console.error('Error updating user:', err);
    });
};


  // Clear Form Fields
  const clearForm = () => {
    setName("");
    setEmail("");
    setRoles("");
  };


    const [searchQuery, setSearchQuery] = useState(""); // For the input value
    // const [users] = useState([]); // Example user data
    const [filteredUsers, setFilteredUsers] = useState([]); // For search results
  
    // Handle input change
   
    console.log(userid)
    const handleInputChange = (e) => {
      e.preventDefault()
      console.log(searchQuery)
      if(userID?.user?._id && searchQuery?.length>0){
        axios.get(`http://localhost:8000/api/user/users?id=${userID?.user?._id}&search=${searchQuery}`)
        .then(response => {
         console.log(response.data.message); 
         setUserData(response?.data?.users); 
       })
       .catch(err => {
         console.error('Error deleting user:', err);
       });
      }
      
      // setSearchQuery(e.target.value); 
    }
  
    // Handle search button click
    // const handleSearch = () => {
    //   // const results = users.filter((user) =>
    //   //   user.name.toLowerCase().includes(searchQuery.toLowerCase())
    //   // );
    //   // setFilteredUsers(results);
    // };
    useEffect(() => {
      handleGetUsers();
    }, [currentPage, searchQuery]);


    // const handleSortByName = () => {
      
    //   const sortedData = [...userData].sort((a, b) => {
    //     if (sortOrder === "asc") {
    //       return a.name.localeCompare(b.name); // Ascending order
    //     } else {
    //       return b.name.localeCompare(a.name); // Descending order
    //     }
    //   });
    
    //   // Toggle sort order
    //   setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    //   setUserData(sortedData); // Update the userData state with sorted data
    // };

    

    // Previous Code

    // const fetchUsers = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await axios.get(`http://localhost:8000/api/user/users?id=${userID?.user?._id}&page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&sort=dsc`
    //       , {
    //       params: {
    //         sort: sortOrder, // Pass the current sort order
    //         page: 1, // Example pagination values
    //         itemsPerPage: 5,
    //       },
    //     });
    //     setUserData(response.data.users);
    //   } catch (error) {
    //     console.error("Error fetching users:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
  
    // Fetch users when the component mounts or sortOrder changes
    // useEffect(() => {
    //   fetchUsers();
    // }, [sortOrder]);
  
    // // Handle sort toggle
    // const handleSortByName = () => {
    //   setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
    // };
    

 
  console.log(userData)
  return (
    <div className="container">
      {/* <header className="jumbotron">
        <h3>
          <strong>{currentUser?.user?.name}</strong> Profile
        </h3>
      </header> */}

<header className="jumbotron" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      {/* Dummy Profile Image */}
      <img
        src="https://picsum.photos/id/1/200/300" // Replace with your desired image URL
        alt="Profile"
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      {/* User's Name */}
      <h3>
        <strong>{currentUser?.user?.name}</strong> Profile
      </h3>
    </header>

      <div>
      <h1>User Search</h1>
      <input
        type="text"
        placeholder="Search for a user..."
        // value={searchQuery}
        onChange={(e)=>{
          setSearchQuery(e.target.value)
        }}
      />
      <button onClick={handleInputChange}>Search</button>
      {/* <div>
        <h2>Results:</h2>
        {filteredUsers.length > 0 ? (
          <ul>
            {filteredUsers.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div> */}
    </div>

      {/* User Table */}



{/* <table className="table">
  <thead>
    <tr>
      <th>
        Name
        <button
          onClick={() => {
            toggleSortOrder(); // Toggle sort order
            handleGetUsers(); // Fetch users with new sort order
          }}
          className="btn btn-link btn-sm"
          style={{ marginLeft: "10px" }}
        >
          {sortOrder === "asc" ? "▲" : "▼"}
        </button>
      </th>
      <th>Email</th>
      <th>Roles</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {userData?.map((user) => (
      <tr key={user?.id}>
        <td>{user?.name}</td>
        <td>{user?.email}</td>
        <td>{user?.roles}</td>
        <td>
          <button onClick={() => handleEditUser(user)} className="btn btn-warning">
            Edit
          </button>
          <button onClick={() => deleteUser(user?._id)} className="btn btn-danger">
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table> */}

<table className="table">
  <thead>
    <tr>
      <th>Avatar</th> {/* New column for avatars */}
      <th>
        Name
        <button
          onClick={() => {
            toggleSortOrder(); // Toggle sort order
            handleGetUsers(); // Fetch users with new sort order
          }}
          className="btn btn-link btn-sm"
          style={{ marginLeft: "10px" }}
        >
          {sortOrder === "asc" ? "▲" : "▼"}
        </button>
      </th>
      <th>Email</th>
      <th>Roles</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {userData?.map((user) => (
      <tr key={user?.id}>
        <td>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&size=40&background=random`}
            alt="Avatar"
            style={{ borderRadius: "50%", width: "40px", height: "40px" }}
          />
        </td> {/* Avatar column */}
        <td>{user?.name}</td>
        <td>{user?.email}</td>
        <td>{user?.roles}</td>
        <td>
          <button onClick={() => handleEditUser(user)} className="btn btn-warning">
            Edit
          </button>
          <button onClick={() => deleteUser(user?._id)} className="btn btn-danger">
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


<div className="pagination-controls">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn btn-secondary"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="btn btn-secondary"
        >
          Next
        </button>
      </div>

      {/* Add/Edit User Form */}
      <div>
        <h4>{editUser ? "Edit User" : "Add New User"}</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editUser) {
              updateUser();
            } else {
              handleAddUser();
            }
          }}
        >
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Roles (comma separated):</label>
            <input
              type="text"
              className="form-control"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editUser ? "Save Changes" : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
