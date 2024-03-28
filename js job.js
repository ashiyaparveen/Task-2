// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAIAtp6jJ978jy-LATWWvgc8o98dBucoWg '
  authDomain: 'task-24dda'
  projectId: 'task-24dda'
  storageBucket: 'task-24dda.appspot.com'
  messagingSenderId: '937774495622'
  appId: '1:937774495622:android:c1f315638620576ad69e07'
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    displayTasks();
  } else {
    currentUser = null;
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('app-container').style.display = 'none';
  }
});

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
      alert('Resgistration successful!');
    })
    .catch((error) => {
      console.error(error.message);
      alert(error.message);
        });
}

function logout() {
  auth.signOut();
}

function createTask() {
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const status = document.getElementById('task-status').value;

  db.collection('tasks')
    .add({
      title: title,
      description: description,
      status: status,
      userId: currentUser.uid,
    })
    .then(() => {
      document.getElementById('task-title').value = '';
      document.getElementById('task-description').value = '';
      displayTasks();
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function displayTasks() {
  const filterStatus = document.getElementById('filter-status').value;
  let query = db.collection('tasks').where('userId', '==', currentUser.uid);

  if (filterStatus) {
    query = query.where('status', '==', filterStatus);
  }

  query
    .get()
    .then((snapshot) => {
      const taskList = document.getElementById('task-list');
      taskList.innerHTML = '';
      snapshot.forEach((doc) => {
        const task = doc.data();
        const li = document.createElement('li');
        li.textContent = `${task.title} - ${task.description} - ${task.status}`;
        taskList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error(error.message);
    });
}
