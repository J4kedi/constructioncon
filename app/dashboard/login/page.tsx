export const dados = {
  title: "Login",
}

export default function Login() {
  return (
    <form className="bg-background rounded-lg p-6 max-w-md mx-auto mt-10">
      <div className="container mx-auto lg:px-8">
        <h2 className="text-text text-center">{dados.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="col-span-1 md:col-span-2">
            <input
              type="text"
              placeholder="Usuário"
              className="w-full p-3 border border-secondary rounded-md text-text/80 hover:text-pretty focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="col-span-1">
            <input
              type="password"
              placeholder="Senha"
              className="w-full p-3 border border-secondary rounded-md text-text/80 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 w-full p-3 bg-primary text-white rounded-md hover:bg-primary/80 transition duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2">
          Entrar
        </button>
      </div>
    </form>
  )
}
