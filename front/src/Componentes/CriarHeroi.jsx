// import { z } from 'zod';
 import { useState } from "react";
 import { useMutation } from "@tanstack/react-query";
 import {apiCadastrar} from '../api/apisRotas';

                //         Array.map((key,valor) => {
                //         <option value="key">Escolha um ${valor}</option>
                // }})

function CriarHeroi () {
    const [nome, setNome] = useState('');
    const [classe, setClasse] = useState('');
    const [imagem, setImagem] = useState('');
    const [nivel , setNivel] = useState('');
    const [status, setStatus] = useState('');
    const [guilda, setGuilda] = useState('');
    const [ouro, setOuro] = useState('');
    const [xps, setXps] = useState('');
    const [descricao, setDescricao] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const mutation = use

    return(
        <div>
            
            
            <form onSubmit={handleSubmit} >
                <h1>Criar Herói</h1>
                <div>
                    <label >Nome do Heroi: *</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required/>
                    <label >Classe: </label>
                    <select value={classe} onChange={(e) => setClasse(e.target.value)}>
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
                    <label>Imagem: *</label>
                    <input type="url" value={imagem} onChange={(e) => setImagem(e.target.value)} required/>
                    <label>Nivel: *</label>
                    <input type="number" value={nivel} onChange={(e) => setNivel(e.target.value)} required/>
                    <label>Status: </label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="">Escolha um status</option>
                        <option value="online">Online</option>
                        <option value="ausente">Ausente</option>
                        <option value="offline">Offline</option>
                    </select>
                    <label >Guilda: *</label>
                    <select value={guilda} onChange={(e) => setGuilda(e.target.value)} required>
                        <option value="">Qual guilda deseja ...</option>
                    </select>
                    <label>Ouro: </label>
                    <input type="number" value={ouro} onChange={(e) =>setOuro(e.target.value)} />
                    <label>XPS: </label>
                    <input type="number" value={xps} onChange={(e) => setXps(e.target.value)} />
                    <label>Descricao: *</label>
                    <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required></textarea>
                </div>
            </form>
        </div>
    )
}
export default CriarHeroi