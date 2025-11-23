// import {
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Button, Paper, Box,
//   IconButton, TextField, Dialog, DialogActions,
//   DialogContent, DialogTitle
// } from '@mui/material';
// import React, { useState, useEffect } from 'react';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

// const StudentTable = () => {
//   const [students, setStudents] = useState([]);
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [newStudent, setNewStudent] = useState({ name: '', class: '', marks: '', phone: '', city: '' });
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const token = localStorage.getItem("token"); // admin token

//   // Check login
//   useEffect(() => {
//     if (token) setIsLoggedIn(true);
//   }, [token]);

//   // Handle form input changes
//   const handleChange = (e) => {
//     setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
//   };

//   // Add student via backend API
//   const handleAddStudent = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/students/add", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(newStudent)
//       });

//       if (!res.ok) throw new Error('Failed to add student');

//       setShowAddDialog(false);
//       setNewStudent({ name: '', class: '', marks: '', phone: '', city: '' });
//       alert('Student added successfully!');
//     } catch (error) {
//       console.error('Error adding student:', error);
//       alert('Failed to add student');
//     }
//   };

//   // Display students added by this admin
//   const handleDisplayStudents = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/students/display", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (!res.ok) throw new Error('Failed to fetch students');
//       const data = await res.json();
//       setStudents(data); // update table
//     } catch (error) {
//       console.error('Error fetching students:', error);
//       alert('Failed to fetch students');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//     setStudents([]);
//   };

//   if (!isLoggedIn) {
//     return (
//       <Box sx={{ p: 2 }}>
//         <h3>Please login to access student management.</h3>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 2 }}>
//       {/* Buttons */}
//       <Box mb={2} display="flex" gap={2}>
//         <Button variant="contained" onClick={handleDisplayStudents}>Display Students</Button>
//         <Button variant="outlined" onClick={() => setShowAddDialog(true)}>Add Student</Button>
//         <Button variant="text" color="error" onClick={handleLogout}>Logout</Button>
//       </Box>

//       {/* Add Student Dialog */}
//       <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
//         <DialogTitle>Add New Student</DialogTitle>
//         <DialogContent>
//           <TextField name="name" label="Name" fullWidth sx={{ mt: 1 }} value={newStudent.name} onChange={handleChange} />
//           <TextField name="class" label="Class" fullWidth sx={{ mt: 1 }} value={newStudent.class} onChange={handleChange} />
//           <TextField name="marks" label="Marks" fullWidth sx={{ mt: 1 }} value={newStudent.marks} onChange={handleChange} />
//           <TextField name="phone" label="Phone" fullWidth sx={{ mt: 1 }} value={newStudent.phone} onChange={handleChange} />
//           <TextField name="city" label="City" fullWidth sx={{ mt: 1 }} value={newStudent.city} onChange={handleChange} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleAddStudent}>Add</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Students Table */}
//       {students.length > 0 && (
//         <TableContainer component={Paper} sx={{ mt: 2 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Class</TableCell>
//                 <TableCell>Marks</TableCell>
//                 <TableCell>Phone</TableCell>
//                 <TableCell>City</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student) => (
//                 <TableRow key={student._id || student.id}>
//                   <TableCell>{student.name}</TableCell>
//                   <TableCell>{student.class}</TableCell>
//                   <TableCell>{student.marks}</TableCell>
//                   <TableCell>{student.phone}</TableCell>
//                   <TableCell>{student.city}</TableCell>
//                   <TableCell>
//                     <IconButton><EditIcon /></IconButton>
//                     <IconButton><DeleteIcon /></IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// };

// export default StudentTable;


import React, { useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Typography,
  TablePagination
} from "@mui/material";
import axios from "axios"; // Directly use Axios




const StudentPage = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "", class: "", marks: "", phone: "", city: ""
  });
  const [errors,setErrors]=useState([])
  const [page,setPage]=useState(0)
  const rowsperpage=10

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const res = await axios.get("http://localhost:5000/students/display", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (error) {
      console.error('error',error)
      alert("Failed to fetch students: " ,error);
    }
  };

  const handleChange=(e)=>{
    
    setNewStudent({...newStudent, [e.target.name]:e.target.value})
    setErrors([])
  }

  const handleAddStudent = async () => {
    try {
      setErrors([])
      const token = localStorage.getItem("token");
        await axios.post("http://localhost:5000/students/add", newStudent, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOpen(false);
      setNewStudent({ name: "", class: "", marks: "", phone: "", city: "" });
      fetchStudents(); // refresh the list
    } catch (err) {
      console.error(err.response);
      if(err.response?.status ===429){
       alert(err.response.data.message)
      }
      else if (err.response?.data?.errors) {
        setErrors(err.response.data.errors); // show Joi validation errors
      } else if (err.response?.data?.message) {
        alert([err.response.data.message]);
      } else {
        alert(["Something went wrong"]);
      }
    }
  };
  

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

      <Button variant="contained" sx={{ mr: 2 }} onClick={fetchStudents}>
        Display Students
      </Button>
      <Button variant="contained" color="success" sx={{ mr: 2 }} onClick={() => setOpen(true)}  >
        Add Student
      </Button>
      <Button variant="contained" color="error" onClick={onLogout}>
        Logout
      </Button>

      {/* Add Student Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} close={open}>
        <DialogTitle>Add Student</DialogTitle>
        <DialogContent> 

          {errors.length > 0 && (
            <Box sx={{mb:2}}>
              {errors.map((err,index)=>(
                <Typography key={index} color='error' variant='body2'>
                  {err}
                </Typography>
              ))}
            </Box>
          )} 
          {/* {["name", "class", "marks", "phone", "city"].map((field) => (
            <TextField
              key={field} fullWidth sx={{ my: 1 }}
              // label={field.charAt(0).toUpperCase() + field.slice(1)}
              label={name}
              name="name"value={newStudent[field]}
              onChange={(e) =>
                setNewStudent({ ...newStudent, [field]: e.target.value })
              }
            />
          ))} */}


          <TextField fullWidth sx={{my:1}} label="student name" name="name"  value={newStudent.name} onChange={handleChange}/>

          <TextField fullWidth sx={{my:1}} label="class" name="class"  value={newStudent.class} onChange={handleChange}/>

          <TextField fullWidth sx={{my:1}} label="marks" name="marks"  value={newStudent.marks} onChange={handleChange}/>

          <TextField fullWidth sx={{my:1}} label="phone" name="phone"  value={newStudent.phone} onChange={handleChange}/>

          <TextField fullWidth sx={{my:1}} label="city" name="city"  value={newStudent.city} onChange={handleChange}/>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddStudent}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Student Table */}
      {students.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>City</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
             
              {students
               .slice(page * rowsperpage, page * rowsperpage + rowsperpage)
               .map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.class}</TableCell>
                  <TableCell>{s.marks}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                  <TableCell>{s.city}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           <TablePagination 
           component='div'
           count={students.length}
           page={page}
           rowsPerPageOptions={[]}
           rowsPerPage={rowsperpage}
           onPageChange={(_,newPage)=>setPage(newPage)}
           />
        </TableContainer>
       
      )}
    </Box>
  );
};

export default StudentPage;

