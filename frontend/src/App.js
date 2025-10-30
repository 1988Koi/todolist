import React, { useEffect, useState } from "react";
import api from "./api";
import "./App.css";

function Window({ title, children, style }) {
  return (
    <div className="xp-window" style={style}>
      <div className="xp-titlebar">
        <div className="xp-title">{title}</div>
        <div className="xp-btns">
          <button className="xp-btn close">✖</button>
        </div>
      </div>
      <div className="xp-content">{children}</div>
    </div>
  );
}

function Popup({ id, img, message, onClose }) {
  const [position] = useState({
    top: `${20 + Math.random() * 60}%`,
    left: `${20 + Math.random() * 60}%`
  });

  useEffect(() => {
    const timeout = setTimeout(() => onClose(id), 10000 + Math.random() * 5000);
    return () => clearTimeout(timeout);
  }, [id, onClose]);

  return (
    <div className="popup" style={{ zIndex: 1000 + id, ...position }}>
      <div className="popup-titlebar">
        <div className="popup-title">Spamton says:</div>
        <button onClick={() => onClose(id)} className="popup-close">X</button>
      </div>
      <div className="popup-body">
        {img ? <img src={img} alt="popup" /> : <p>{message}</p>}
      </div>
    </div>
  );
}

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");
  const [newUser, setNewUser] = useState({ username: "", password: "" });
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    if (token) fetchTasks(token);
  }, [token]);

  // Popups
  useEffect(() => {
    const imgs = [
      "https://media1.tenor.com/m/-bzHXgl29JQAAAAC/asgore-run-over.gif",
      "https://media.tenor.com/tDifeVlP6sUAAAAi/deltarune-spamton.gif",
      "https://i.redd.it/pa6v03g1glo91.gif"
    ];

    const messages = [
      "Spamton says:",
      "WIN 10 [Kromer]!!!!",
      "BE A [[BIG SHOT]]",
      "Spamton needs your liver.",
      "WIN [Big] DONATE 20 [Kromer]."
    ];

    const interval = setInterval(() => {
      if (Math.random() < 0.5) {
        const id = Date.now();
        const isImg = Math.random() < 0.5;
        const img = isImg ? imgs[Math.floor(Math.random() * imgs.length)] : null;
        const message = !isImg ? messages[Math.floor(Math.random() * messages.length)] : null;

        setPopups(prev => [...prev, { id, img, message }]);

        const timeout = 9000 + Math.floor(Math.random() * 6000);
        setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), timeout);

        const audio = new Audio("/sounds/windows.mp3");
        audio.play();
      }
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleClosePopup = (id) => setPopups(prev => prev.filter(p => p.id !== id));

  // LOGIN
  const login = async () => {
    try {
      const res = await api.post("https://spamwarelist.azurewebsites.net/auth/login", { username, password });
      console.log("Login response:", res.data);
      const tokenReceived = res.data.token;
      if (!tokenReceived) return alert("Token nao recebido :(")
      setToken(tokenReceived);
      localStorage.setItem("token", tokenReceived);
      fetchTasks(tokenReceived);
      alert("Login OK");
    } catch (err) {
      console.error(err);
      alert("Erro no login");
    }
  };

  // FETCH TASKS
  const fetchTasks = async (tokenParam) => {
  try {
    const res = await fetch("https://spamwarelist.azurewebsites.net/tasks", {
      headers: {
        Authorization: `Bearer ${tokenParam || token}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Erro HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    setTasks(data);
  } catch (err) {
    console.error("Erro ao buscar tasks:", err);
  }
};

  // ADD TASK sus
  const addTask = async () => {
  if (!newTask.trim()) return;

  try {
    const res = await fetch("https://spamwarelist.azurewebsites.net/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTask }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Erro HTTP ${res.status}: ${errText}`);
    }

    setNewTask("");
    fetchTasks();
  } catch (err) {
    console.error(err);
    alert("Erro ao criar task");
  }
};

  // autualizao de tasks insana eu nao aguento mais isso cara
    const toggle = async (t) => {
  try {
    const res = await fetch(`https://spamwarelist.azurewebsites.net/tasks/${t.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !t.completed }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Erro HTTP ${res.status}: ${errText}`);
    }

    fetchTasks();
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err);
  }
};


  //delete insano aaaaaaaaaaaaaaaaaaaaaaa
  const remove = async (id) => {
    try {
      const res = await fetch(`https://spamwarelist.azurewebsites.net/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Erro HTTP ${res.status}: ${errText}`);
      }

      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Erro ao remover task");
    }
  };

  // registro de pessoa insana

  const createUser = async () => {
  try {
   const res = await fetch("https://spamwarelist.azurewebsites.net/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: newUser.username,
        password: newUser.password,
        isAdmin: false,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Erro HTTP ${res.status}: ${errText}`);
    }

    alert("Usuário criado com sucesso");
    setNewUser({ username: "", password: "" });
  } catch (err) {
    console.error(err);
    alert("Erro ao criar usuário");
  }
};


  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  return (
    <div className="app-bg">
      <div className="desktop">
        <div className="startbar">Spamton G Spamton</div>

        <div className="windows-grid">
          {/* LOGIN */}
          <Window title="Login — Spamton XP" style={{ width: 380 }}>
            <div className="form-row">
              <label>Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={login}>Login</button>
              <button className="btn ghost" onClick={() => { setUsername("user"); setPassword("pass"); }}>Fill demo</button>
              <button className="btn" onClick={() => { setUsername("admin"); setPassword("admin123"); }}>Quick admin</button>
            </div>
          </Window>

          {/* TASKS */}
          <Window title="ToDo — Spamton XP" style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Logged token:</strong>{" "}
              {token ? token.slice(0, 40) + "..." : <em>not logged</em>}
            </div>
            <div className="add-row">
              <input
                placeholder="Nova task..."
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
              />
              <button className="btn" onClick={addTask}>Adicionar</button>
            </div>

            <ul className="task-list">
              {tasks.length > 0 ? tasks.map(t => (
                <li key={t.id} className="task-item">
                  <div>
                    <input
                      type="checkbox"
                      checked={!!t.completed}
                      onChange={() => toggle(t)}
                    />
                    <span className={t.completed ? "completed" : ""}>
                      {t.title}
                    </span>
                  </div>
                  <div>
                    <button className="btn small" onClick={() => remove(t.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              )) : (
                <li><em>Nenhuma task encontrada.</em></li>
              )}
            </ul>

            <div style={{ marginTop: 8 }}>
              <button className="btn" onClick={fetchTasks}>Refresh</button>
              <button className="btn ghost" onClick={logout}>Logout</button>
            </div>
          </Window>

          {/* ADMIN */}
          <Window title="Admin Panel" style={{ width: 360 }}>
            <div className="form-row">
              <label>Novo usuário</label>
              <input
                placeholder="username"
                value={newUser.username}
                onChange={e =>
                  setNewUser(prev => ({ ...prev, username: e.target.value }))
                }
              />
              <input
                placeholder="password"
                type="password"
                value={newUser.password}
                onChange={e =>
                  setNewUser(prev => ({ ...prev, password: e.target.value }))
                }
              />
              <button className="btn" onClick={createUser}>Criar Usuário</button>
            </div>
          </Window>
        </div>

        {popups.map(p => (
          <Popup key={p.id} id={p.id} img={p.img} message={p.message} onClose={handleClosePopup} />
        ))}
      </div>
    </div>
  );
}
