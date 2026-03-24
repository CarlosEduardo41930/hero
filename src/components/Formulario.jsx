import { useState } from "react";

function Formulario(){
    const [nome, setNome] = useState ("");
    const [classe, setClasse] = useState("");
    
    function handleSumit (e){
        e.preventDefault();
    }
    return(<>
    <form onSubmit={handleSumit} className="flex-1 gap-2.5"><div>
        <label htmlFor="nome">Nome: </label>
        <input type="text" name="nome" onChange={(e) =>setNome(e.target.value)} className="bg-mauve-200"/> <br />
        <label htmlFor="classe">Classe: </label>
        <input type="text" name="classe" onChange={(e) =>setClasse(e.target.value)} className="bg-mauve-200 mt-2"/> <br />
    </div>
    <button type="submit">Enviar</button>
    </form>
    <div>
        <h3>Nome: {nome}</h3>
        <h3>Classe: {classe}</h3>
    </div>
    </>)
}

export default Formulario;