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

function Popup({ id, img, onClose }) {
  const [position] = useState({
    top: `${20 + Math.random() * 60}%`,
    left: `${20 + Math.random() * 60}%`
  });

  const [message] = useState(() => {
    const messages = [
      "DRIVING IN MY CAR",
      "WIN 10 [Kromer]!!!!",
      "BE A [[BIG SHOT]]",
      "Spamton needs your liver.",
      "WIN [Big] DONATE 20 [Kromer]."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
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
    if (token) fetchTasks();
  }, [token]);

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

      if (Math.random() < 0.5) {
        const timeout = 9000 + Math.floor(Math.random() * 6000);
        setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), timeout);
      }

      const audio = new Audio("/sounds/windows.mp3");
    audio.play();
    }
  }, 7000);

  return () => clearInterval(interval);
}, []);


  const handleClosePopup = (id) => setPopups(prev => prev.filter(p => p.id !== id));

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { username, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      alert("Login OK");
    } catch {
      alert("Erro no login");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks", { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch {
      alert("Erro ao buscar tarefas");
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await api.post("/tasks", { title: newTask }, { headers: { Authorization: `Bearer ${token}` } });
      setNewTask("");
      fetchTasks();
    } catch {
      alert("Erro ao criar task");
    }
  };

  const toggle = async (t) => {
    try {
      await api.put(`/tasks/${t.id}`, { completed: !t.completed }, { headers: { Authorization: `Bearer ${token}` } });
      fetchTasks();
    } catch {}
  };

  const remove = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTasks();
    } catch {}
  };

  const generateAdminToken = async () => {
    try {
      const res = await api.get("/admin/get-token");
      setAdminToken(res.data.token);
      localStorage.setItem("adminToken", res.data.token);
      alert("Admin token gerado");
    } catch {
      alert("Erro ao gerar token admin");
    }
  };

  const createUser = async () => {
    try {
      if (!adminToken) return alert("Gere o token admin primeiro");
      await api.post(
        "/auth/register",
        { username: newUser.username, password: newUser.password, isAdmin: false },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      alert("Usuário criado");
      setNewUser({ username: "", password: "" });
    } catch {
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

          <Window title="ToDo — Spamton XP" style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Logged token:</strong> {token ? token.slice(0,40) + "..." : <em>not logged</em>}
            </div>
            <div className="add-row">
              <input placeholder="Nova task..." value={newTask} onChange={e => setNewTask(e.target.value)} />
              <button className="btn" onClick={addTask}>Adicionar</button>
            </div>
            <ul className="task-list">
              {tasks.map(t => (
                <li key={t.id} className="task-item">
                  <div>
                    <input type="checkbox" checked={t.completed} onChange={() => toggle(t)} />
                    <span className={t.completed ? "completed" : ""}>{t.title}</span>
                  </div>
                  <div>
                    <button className="btn small" onClick={() => remove(t.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 8 }}>
              <button className="btn" onClick={fetchTasks}>Refresh</button>
              <button className="btn ghost" onClick={logout}>Logout</button>
            </div>
          </Window>

          <Window title="Admin Panel" style={{ width: 360 }}>
            <div style={{ marginBottom: 8 }}>
              <button className="btn" onClick={generateAdminToken}>Gerar Token Admin (DEV)</button>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Admin token:</strong> {adminToken ? adminToken.slice(0,40) + "..." : <em>not generated</em>}
            </div>
            <div className="form-row">
              <label>Novo usuário</label>
              <input placeholder="username" value={newUser.username} onChange={e => setNewUser(prev => ({...prev, username: e.target.value}))} />
              <input placeholder="password" type="password" value={newUser.password} onChange={e => setNewUser(prev => ({...prev, password: e.target.value}))} />
              <button className="btn" onClick={createUser}>Criar Usuário</button>
            </div>
          </Window>
        </div>

        {popups.map(p => (
          <Popup key={p.id} id={p.id} img={p.img} onClose={handleClosePopup} />
        ))}

      </div>
    </div>
  );
}
