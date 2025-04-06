import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import illustration from "../../assets/illustration..jpg"; 
import "./style.css";

export function Login() {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex items-center justify-center bg-[#315259]">
        <div className="text-center text-white p-8">
          <img src={illustration} alt="Projeto" className="idimg" />
        </div>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center bg-gray-50">
        <div className="w-96">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">Bem-vindo!</h2>
          <p className="text-login text-gray-600 mb-6">Entre com seu e-mail e senha para acessar sua conta.</p>

          <div className="register">
            <Link to="/signup" className="text-purple-600">
              Não possui conta? <span className="font-bold">Registre-se Grátis</span>
            </Link>
          </div>

          <form>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4 relative">
              <input
                type="password"
                placeholder="Digite a sua Senha"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 btn-visibility"
              >
                <Eye size={16} />
              </button>
            </div>

            <div className="flex justify-end text-sm text-gray-600 mb-6">
              <Link to="/recuperar-senha" className="text-gray-600">
                Esqueceu sua <span className="font-bold">Senha?</span>
              </Link>
            </div>

            <button type="button" className="login-button">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
