import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./register.css";
import register from "../../assets/register.jpg";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Aluno");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Fazer uma chamada para a API de registro do Backend
      const response = await fetch("http://apideRegistro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, userType }),
      });
      
      if (response.ok) {
        navigate("/verificar-email"); 
      } else {
        console.error("Erro ao registrar usuário");
      }
    } catch (error) {
      console.error("Erro de rede", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-image-section">
        <img
          src={register}
          alt="Projeto"
          className="logo"
        />
      </div>
      <div className="register-form-section">
        <div className="register-box">
          {/* Informações do projeto */}
          <div className="w-96 justificatext-center">
            <h1 className="text-Thema flex items-center justify-center space-x-4 w-full">
              <span>Codigos Caoticos</span>
              </h1>
            <h2 className="registerall">Vamos lá, Junte-se a Nós.</h2>
          </div>
          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="register-input"
              required
            />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-input"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-input"
              required
            />
            <select value={userType} onChange={(e) => setUserType(e.target.value)} className="register-input">
              <option value="Aluno">Aluno</option>
              <option value="Professor">Professor</option>
            </select>
            <button type="submit" className="register-button">
              Registrar
            </button>
          </form>
          <div className="register-links">
            <Link to="/">Já tem uma conta? Faça login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;