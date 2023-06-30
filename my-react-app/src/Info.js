import React, { useEffect, useState } from 'react';

export default function Info() {
  // const [userData, setUserData] = useState({});
 const userData  = JSON.parse(localStorage["currentUser"]);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:3001/users/${userId}`);
  //       if (response.ok) {
  //         const user = await response.json();
  //         setUserData(user);
  //       } else {
  //         console.error(`Request failed with status code ${response.status}`);
  //         // Gérer l'erreur si la requête n'est pas réussie
  //       }
  //     } catch (error) {
  //       console.error('An error occurred:', error);
  //       // Gérer l'erreur si une exception se produit lors de la requête
  //     }
  //   };

  //   fetchUserData();
  // }, [userId]);

  // Afficher les données utilisateur récupérées
     const showUserData = (<div>
        <div>
            <strong>ID:</strong>{userData.id}
        </div>
        <div>
            <strong>Name:</strong>{userData.name}
        </div>
        <div>
            <strong>Username:</strong>{userData.username}
        </div>
        <div>
            <strong>Email:</strong>{userData.email}
        </div>
        <div>
            <strong>Address:</strong> {userData.address}
        </div>
        <div>
          <strong>Phone:</strong> {userData.phone}
        </div>
        <div>
          <strong>Website:</strong> {userData.website}
        </div>
        <div>
          <strong>Company:</strong> {userData.company}
        </div>
      </div>)

    return (
        <section className="content">
            <h2>Your Details</h2>
            <div>
                {
                    userData !== {}? (
                        <section>
                               {showUserData}
                        </section>

                    ) : (
                            <h2>Loading...</h2>
                        )
                }
            </div>
        </section>
    )
}
