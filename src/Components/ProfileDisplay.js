import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProfileDisplay() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/profile/${id}`).then(res => setUser(res.data));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <img
        src={`http://localhost:5000${user.profilePhoto}`}
        alt="profile"
        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
      />
      <h2>{user.name}</h2>
      <p>{user.description}</p>
    </div>
  );
}

export default ProfileDisplay;
