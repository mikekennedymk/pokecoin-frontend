import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoInicial from './assets/initial-icon-blue-pokeball.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {

  const baseUrl = "https://localhost:7262/api/usuarios";

  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);

  const [modalIncuir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);


  const abrirFecharModalIncluir = () => {

    setModalIncluir(!modalIncuir);
  }

  const abrirFecharModalEditar = () => {

    setModalEditar(!modalEditar);
  }

  const abrirFecharModalExcluir = () => {

    setModalExcluir(!modalExcluir);
  }



  const pedidoGet = async () => {

    await axios.get(baseUrl).then(response => {
      setData(response.data);
    }).catch(error => {
      console.log(error)
    })
  }

  const pedidoPost = async () => {
    delete usuarioSelecionado.id;
    await axios.post(baseUrl, usuarioSelecionado).then(response => {
      setData(data.concat(response.data));
      abrirFecharModalIncluir();
    }).catch(error => {
      console.log(error)
    })
  }

  const pedidoPut = async () => {
    await axios.put(baseUrl + "/" + usuarioSelecionado.id, usuarioSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(usuario => {
          if (usuario.id === usuarioSelecionado.id) {
            usuario.nome = resposta.nome;
            usuario.email = resposta.email;
            usuario.senha = resposta.senha;
            usuario.dataNascimento = resposta.dataNascimento;
          }
        });
        abrirFecharModalEditar();
      }).catch(
        error => {
          console.log(error);
        }
      )
  }

  const pedidoDelete = async () => {
    await axios.delete(baseUrl + "/" + usuarioSelecionado.id)
      .then(response => {
        setData(data.filter(usuario => usuario.id !== response.data));
        abrirFecharModalExcluir();
      }).catch(error => {
        console.log(error);
      })
  }

  const [usuarioSelecionado, setUsuarioSelecionado] = useState({
    id: '',
    nome: '',
    email: '',
    dataNascimento: ''
  })

  const handleChange = e => {
    const { name, value } = e.target;
    setUsuarioSelecionado({
      ...usuarioSelecionado, [name]: value
    });
    console.log(usuarioSelecionado);
  }

  const selecionarUsuario = (usuario, opcao) => {
    setUsuarioSelecionado(usuario);
    (opcao === "Editar") ?
      abrirFecharModalEditar() : abrirFecharModalExcluir();
  }

  useEffect(() => {
    if(updateData){
      pedidoGet();
      setUpdateData();
    }
  }, [updateData])

  return (
    <div className="App">
      <br />
      <h3>Cadastro de Usuários</h3>
      <header >
        <img src={logoInicial} alt='Inicial'></img>
        <button className='btn btn-success' onClick={() => abrirFecharModalIncluir()}>Adicionar Usuário</button>
      </header>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Data de Nascimento</th>
            <th>Ações</th>

          </tr>
        </thead>
        <tbody>
          {data.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.dataNascimento}</td>
              <td>
                <button className='btn btn-primary' onClick={() => selecionarUsuario(usuario, "Editar")}>Editar</button> {"  "}
                <button className='btn btn-danger' onClick={() => selecionarUsuario(usuario, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncuir}>
        <ModalHeader>Incluir Usuário</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nome:</label>
            <br />
            <input name='nome' type='text' className='form-control' onChange={handleChange}></input>
            <br />
            <label>Email:</label>
            <br />
            <input name='email' type='text' className='form-control' onChange={handleChange}></input>
            <br />
            <label>senha:</label>
            <br />
            <input name='senha' type='text' className='form-control' onChange={handleChange}></input>
            <br />
            <label>Data de Nascimento:</label>
            <br />
            <input type="date" id="data" name="dataNascimento" onChange={handleChange}></input>
            {/* <DatePicker name='dataNascimento'
              selected={startDate}
              onChange={date => handleDateChange(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione uma data"
            /> */}
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => pedidoPost()}>Adicionar</button>  {"  "}
          <button className='btn btn-danger' onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Usuário</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Código:</label>
            <br />
            <input type='text' className='form-control' disabled value={usuarioSelecionado && usuarioSelecionado.id} />
            <br />
            <label>Nome:</label>
            <br />
            <input name='nome' type='text' className='form-control' onChange={handleChange} value={usuarioSelecionado && usuarioSelecionado.nome}></input>
            <br />
            <label>Email:</label>
            <br />
            <input name='email' type='text' className='form-control' onChange={handleChange} value={usuarioSelecionado && usuarioSelecionado.email}></input>
            <br />
            <label>Data de Nascimento:</label>
            <br />
            <input type="date" id="data" name="dataNascimento" onChange={handleChange} value={usuarioSelecionado && usuarioSelecionado.dataNascimento}></input>
            {/* <DatePicker name='dataNascimento'
              selected={startDate}
              onChange={date => handleDateChange(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione uma data"
            /> */}
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => pedidoPut()}>Editar</button>  {"  "}
          <button className='btn btn-danger' onClick={() => abrirFecharModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalHeader>Excluir Usuário</ModalHeader>
        <ModalBody>
          Confirmar a exclusão do Usuário "{usuarioSelecionado && usuarioSelecionado.nome}"?
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => pedidoDelete()}>Sim</button>  {"  "}
          <button className='btn btn-danger' onClick={() => abrirFecharModalExcluir()}>Não</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
