import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function ProfileForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "" });
  const [file, setFile] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    if (file) data.append("profilePhoto", file);

    try {
      await axios.post(`http://localhost:5000/profile/${id}`, data);
      toast.success("Profile uploaded");
      setTimeout(() => navigate(`/view/${id}`), 2000);
    } catch {
      toast.error("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Profile</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <textarea name="description" placeholder="Description" onChange={handleChange} />
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button type="submit">Save</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default ProfileForm;
