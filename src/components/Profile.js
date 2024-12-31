
import React, { useEffect, useRef, useState } from "react";
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

  const [selectedImage, setSelectedImage] = useState(""); // Selected profile image
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const fileInputRef = useRef(null); // Ref for the file input
  const [secureUrl, setSecureUrl] = useState("")

  const [profileImage, setProfileImage] = useState(
    currentUser?.user?.profile || "https://picsum.photos/id/1/200/300" // Default image
);

  

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


  //   const handleFileChange = (e) => {
  //     const file = e.target.files[0]; // Get the selected file
  //     console.log(file)
  //     if (file) {
  //         const imageUrl = URL.createObjectURL(file); // Create a local URL for the image
  //         setSelectedImage(imageUrl); // Set the selected image URL to display
  //         console.log("File selected:", file); // Log the selected file
  //         uploadImage(file);

  //     }
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
        const imageUrl = URL.createObjectURL(file); // Create a local URL for the image
        setSelectedImage(imageUrl); // Set the selected image URL to display
        console.log("File selected:", file); // Log the selected file

        // Call the function to upload the image to the backend
        uploadImage(file);
    }
};


//     try {
//         const formData = new FormData();
//         formData.append("image", file); // Append the image file to the FormData object

//         const response = await fetch("http://localhost:8000/api/user/usersurl", {
//             method: "POST",
//             body: formData,



// const handleFileChange = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//       // Simulate uploading the image and setting the secure URL
//       uploadImage(file);
//   }
// };

const uploadImage = async (file) => {
  try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:8000/api/user/usersurl", {
          method: "POST",
          body: formData,
      });

      if (response.ok) {
          const data = await response.json();
          setSecureUrl(data?.data?.secure_url); // Save secure URL to state
          setSelectedImage(data?.data?.secure_url); // Display the new image
          console.log("Image uploaded successfully:", data);
      } else {
          console.error("Failed to upload image:", response.statusText);
      }
  } catch (error) {
      console.error("Error uploading image:", error.message);
  }
};

// const handleUpdateProfile = () => {
//   const userId = currentUser?.user?._id; // Get user ID from currentUser
//   if (!userId || !secureUrl) {
//       alert("Please upload an image before updating the profile.");
//       return;
//   }
//   updateProfileImage(userId, secureUrl); // Call the function to update the profile
// };



// const handleUpdateProfile = () => {
//   // Log the secure URL to the console when update is clicked
//   console.log("Secure URL of the image:", secureUrl);
//   console.log(userID?.user?._id)
// };

// console.log(secureUrl)

const updateProfile = async () => {
  try {
      if (!secureUrl) {
          console.error("No secure URL available for updating profile.");
          return;
      }

      const response = await fetch(`http://localhost:8000/api/user/update-user-image?id=${currentUser?.user?._id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ secureUrl }),
      });



      if (response.ok) {
          const data = await response.json();
          console.log("Profile updated successfully:", data);
          alert("Profile updated successfully!");
      } else {
          console.error("Failed to update profile:", response.statusText);
      }
  } catch (error) {
      console.error("Error updating profile:", error.message);
  }
};


  // // Open the file input dialog when the button is clicked
  // const handleChooseImageClick = () => {
  //     fileInputRef.current.click(); // Trigger the file input click event
  // };


  // // Example function to send the image to the server
  // const sendImageToServer = (file) => {
  //     const formData = new FormData();
  //     formData.append("image", file);

  //     axios.post("/api/upload", formData, {
  //         headers: {
  //             "Content-Type": "multipart/form-data",
  //         },
  //     })
  //     .then((response) => {
  //         console.log("Image uploaded successfully:", response.data);
  //     })
  //     .catch((error) => {
  //         console.error("Error uploading image:", error);
  //     });
  // };

    
  console.log(userData)
  return (
    <div className="container">


<header className="jumbotron" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div>
                {/* Display the selected image or fallback to a dummy image */}
                <img
                    src={profileImage} // Fallback image
                    alt="Profile"
                    style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                />
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button>Save</button>
                {isEditing && (
                <>
                    {/* Hidden file input, triggered by the Choose Image button */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        // style={{ display: "none" }} // Hide the input field
                        onChange={handleFileChange} // Call handleFileChange when a file is selected
                    />
                    {/* <button onClick={handleChooseImageClick}>Choose Image</button> */}
                </>
            )}
            </div>
            <h3>
                <strong>{currentUser?.user?.name}</strong> Profile
            </h3>
            {/* <button>Update Profile</button> */}
            <button onClick={updateProfile}>Update Profile</button>
            
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
