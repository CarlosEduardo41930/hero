// import { z } from 'zod';
// import { useState } from "react";

                //         Array.map((key,valor) => {
                //         <option value="key">Escolha um ${valor}</option>
                // }})

function CriarHeroi () {

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return(
        <div>
            
            
            <form onSubmit={handleSubmit} >
                <h1>Criar Herói</h1>
                <div>
                    <label >Nome do Heroi: </label>
                    <label >Classe: </label>
                    <select>


                        <option value="">Escolha uma classe</option>
                        <option value="guerreiro">Guerreiro</option>
                        <option value="mago">Mago</option>
                        <option value="ladino">Ladino</option>
                        <option value="clérigo">Clérigo</option>
                        <option value="paladino">Paladino</option>
                        <option value="bárbaro">Bárbaro</option>
                        <option value="ranger">Ranger(Patrulheiro)</option>
                        <option value="bardo">Bardo</option>
                        <option value="feiticeiro">Feiticeiro</option>
                        <option value="monge">Monge</option>
                    </select>
                    <label>Imagem: </label>
                    <label>Nivel: </label>
                    <label>Status: </label>
                    <select>
                        <option value="">Escolha um status</option>
                        <option value="online">Online</option>
                        <option value="ausente">Ausente</option>
                        <option value="offline">Offline</option>
                    </select>
                    <label>Ouro: </label>
                    <label>XPS: </label>
                </div>
            </form>
        </div>
    )
}
export default CriarHeroi