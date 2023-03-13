import './new.css';
import { useState, useEffect, useContext } from 'react';

import firebase from '../../services/firebaseConnection'
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import { AuthContext } from '../../context/auth';
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";
export default function New() {

  const { id } = useParams();
  const history = useHistory();

  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);

  const [idCostumer, setIdCostumer] = useState(false);

  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');
  
  const { user } = useContext(AuthContext);

useEffect(()=>{

  async function loadCustomers() {
    await firebase.firestore().collection('customers')
    .get()
    .then((snapshot)=>{
      let lista = [];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          nomeEmpresa: doc.data().nomeEmpresa
        });
      })
      if (!lista.length) {
        console.log("NENHUMA EMPRESA ENCONTRADA!")
        setLoadCustomers(false)
        setCustomerSelected([{ id: '1', name: 'FREELA'}]);
        return;
      }
      setCustomers(lista);
      setLoadCustomers(false)

      if (id) {
        loadId(lista);
      }
    })
    .catch((error)=>{
      toast.error('ALGO DEU ERRADO!! Motivo: ', error);
      setLoadCustomers(false)
      setCustomerSelected([{ id: '1', name: ''}]);
    })
  }

  loadCustomers();

}, [])

  async function loadId(lista) {

    await firebase.firestore().collection('chamados').doc(id)
    .get()
    .then((snapshot) => {
      setAssunto(snapshot.data().assunto);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento);

      let index = lista.findIndex( item => item.id === snapshot.data().clienteId );
      setCustomerSelected(index);
      setIdCostumer(true);
    }) 
    .catch ((err) => {
      console.log('ERRO NO ID PASSADO: ' ,err)
      setIdCostumer(false);
    })
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (idCostumer) {
      await firebase.firestore().collection('chamados').doc(id)
      .update({
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
      })
      .then(() => {
        toast.success('Chamado editado com sucesso!')
        history.push('/dashboard');
      })
      .catch(err => {
        toast.error('Houve algum erro ao editar os dados');
      })

      return;
    }

    await firebase.firestore().collection('chamados')
    .add({
      created: new Date(),
      cliente: customers[customerSelected].nomeEmpresa,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid,
    })
    .then(() => {
      toast.success('Chamado criado com sucesso.');
      setComplemento('');
      setCustomerSelected(0);
    })
    .catch((err) => {
      toast.error('Erro ao registrar, tente novamente mais tarde.');
    })
  }

  function handleChangeSelect(e){
    setAssunto(e.target.value); 
    
  }

  function handleOptionChange(e){
    setStatus(e.target.value); 
    console.log(e.target.value)
  }

  function handleChangeCustomers(e){
    setCustomerSelected(e.target.value)
  }

    return(
      <div>
        <Header/>
  
        <div className="content">
          <Title name="Novo Chamado">
            <FiPlusCircle size="25"/>
          </Title>
            <div className="container">
                <form className="form-profile" onSubmit={handleRegister}> 
                    <label>Cliente</label>
                    {loadCustomers ? (
                      <input type="text" disabled={true} value="CARREGANDO CLIENTES..."/>
                    ) : (
                    <select value={customerSelected} onChange={handleChangeCustomers}>
                     {customers.map((item, index) => {
                        return (
                          <option key={item.id} value={index}>
                            {item.nomeEmpresa}
                          </option>
                        )
                     })}
                    </select>
                    )}
                    <label>Assunto</label>
                    <select value={assunto} onChange={handleChangeSelect}>
                      <option value="Suporte">Suporte</option>
                      <option value="Visita Técnica">Visita Técnica</option>
                      <option value="Financeiro">Financeiro</option>
                    </select>
                    <label>Status</label>
                    <div className="status">
                      <input 
                        type="radio" 
                        name="radio" 
                        value="Aberto"
                        onChange={handleOptionChange}
                        checked={ status === "Aberto" }
                      />
                      <span>Em aberto</span>
                      <input 
                        type="radio" 
                        name="radio" 
                        value="Progresso"
                        onChange={handleOptionChange}
                        checked={ status === "Progresso" }
                      />
                      <span>Em progresso</span>    
                      <input 
                        type="radio" 
                        name="radio" 
                        value="Atendido"
                        onChange={handleOptionChange}
                        checked={ status === "Atendido" }
                      />
                      <span>Atendido</span>
                    </div>
                    <label>Complemento</label>
                    <textarea
                     type="text"
                     placeholder="Descreva seu problema (opcional)."
                     value={complemento}
                     onChange={ (e) => setComplemento(e.target.value)}
                    />
                    <button type="submit">Salvar</button>
                </form>
            </div>
        </div>  
      </div>
    );
}