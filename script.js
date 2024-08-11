// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyRLwk31ocPjDvuZOB-3zD1LNsRxvmbOc",
  authDomain: "pickleball-tra.firebaseapp.com",
  projectId: "pickleball-tra",
  storageBucket: "pickleball-tra.appspot.com",
  messagingSenderId: "729544699328",
  appId: "1:729544699328:web:6a9ed911f78d054acdec25",
  measurementId: "G-F7RRYDG2E8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

console.log(db);
console.log("Firebase Initialized");

document.addEventListener("DOMContentLoaded", async () => {
  const friends = [
    "Sanjay",
    "Ram",
    "Sripath & Shanmuk",
    "Sid Ravi",
    "Sid Balaji",
    "Aditiya",
    "Nirmay",
    "Shrikar",
  ];
  const statuses = ["Coming", "Arrived", "Not Interested", "Neutral"];

  const today = new Date().toDateString();
  document.getElementById("date").textContent = today;

  const tableBody = document.getElementById("statusTable");

  // Function to check and reset data for a new day
  async function checkAndResetDate() {
    const dateDocRef = doc(db, "metadata", "currentDate");
    const dateDocSnapshot = await getDoc(dateDocRef);

    if (!dateDocSnapshot.exists() || dateDocSnapshot.data().date !== today) {
      // Update the date in the database
      await setDoc(dateDocRef, { date: today });

      // Reset statuses for all friends
      for (const name of friends) {
        await setDoc(doc(db, "statuses", name), {
          name: name,
          status: "Neutral",
          date: today,
        });
      }
    }
  }

  // Function to populate the table
  async function populateTable(sortedFriends = friends) {
    tableBody.innerHTML = ""; // Clear the table

    for (const name of sortedFriends) {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = name;
      row.appendChild(nameCell);

      const statusCell = document.createElement("td");
      row.appendChild(statusCell);

      const updateCell = document.createElement("td");
      for (const status of statuses) {
        const button = document.createElement("button");
        button.textContent = status;
        button.classList.add(status.toLowerCase().replace(" ", "-"));
        button.onclick = async () => {
          await setDoc(doc(db, "statuses", name), {
            name: name,
            status: status,
            date: today,
          });
        };
        updateCell.appendChild(button);
      }
      row.appendChild(updateCell);

      tableBody.appendChild(row);

      // Fetch and update status in real-time
      const docRef = doc(db, "statuses", name);
      onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists() && docSnapshot.data().date === today) {
          statusCell.textContent = docSnapshot.data().status;
        } else {
          statusCell.textContent = "Neutral";
        }
      });
    }
  }

  async function sortByStatus() {
    const statusOrder = {
      Arrived: 0,
      Coming: 1,
      Neutral: 2,
      "Not Interested": 3,
      "No Status": 4,
    };

    const sortedFriends = [...friends]; // Clone the array

    const q = query(collection(db, "statuses"), where("date", "==", today));
    const querySnapshot = await getDocs(q);

    const statusMap = new Map();
    querySnapshot.forEach((doc) => {
      statusMap.set(doc.id, doc.data().status);
    });

    sortedFriends.sort((a, b) => {
      const statusA = statusOrder[statusMap.get(a) || "No Status"];
      const statusB = statusOrder[statusMap.get(b) || "No Status"];
      return statusA - statusB;
    });

    populateTable(sortedFriends);
  }

  // Attach the sortByStatus function to the window object
  window.sortByStatus = sortByStatus;

  // Check and reset the date before populating the table
  await checkAndResetDate();
  populateTable();
});
