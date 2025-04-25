import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Finish.module.scss'
import "bootstrap-icons/font/bootstrap-icons.css"

const Finish = () => {
  const navigate = useNavigate()

  const [cidade, setCidade] = useState('')
  const [bairro, setBairro] = useState('')
  const [rua, setRua] = useState('')
  const [pagamento, setPagamento] = useState('')
  const [itensCarrinho, setItensCarrinho] = useState([])

  useEffect(() => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || []
    setItensCarrinho(carrinho)
  }, [])

  const formatarPreco = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const total = itensCarrinho.reduce((acc, item) => acc + item.preco, 0)

  const handleFinalizar = () => {
    if (!cidade || !bairro || !rua || !pagamento || itensCarrinho.length === 0) {
      alert("Preencha todos os campos e verifique se o carrinho não está vazio.")
      return
    }

    const endereco = `Cidade: ${cidade}\nBairro: ${bairro}\nRua: ${rua}`
    const listaProdutos = itensCarrinho
      .map(item => `• ${item.nome} (${item.tamanho}) - ${formatarPreco(item.preco)}`)
      .join('\n')

    const mensagem = `Olá! Quero finalizar meu pedido:\n\n${listaProdutos}\n\nTotal: ${formatarPreco(total)}\n\nEndereço:\n${endereco}\n\nForma de pagamento: ${pagamento}`

    const urlWhatsApp = `https://wa.me/47996561461?text=${encodeURIComponent(mensagem)}`

    // Limpa o carrinho antes de redirecionar
    localStorage.removeItem('carrinho')

    // Redireciona para o WhatsApp
    window.location.href = urlWhatsApp
  }

  return (
    <div className={styles.finishContainer}>
      <button className={styles.voltar} onClick={() => navigate('/')}>
        <i className="bi bi-arrow-left"></i> Voltar
      </button>

      <h1 className={styles.titulo}>Finalizar compra</h1>

      {/* Endereço */}
      <div className={styles.formEndereco}>
        <label>
          Cidade:
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Digite a cidade"
          />
        </label>
        <label>
          Bairro:
          <input
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Digite o bairro"
          />
        </label>
        <label>
          Rua (com número):
          <input
            type="text"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            placeholder="Ex: Rua das Flores, 123"
          />
        </label>
      </div>

      {/* Pagamento */}
      <div className={styles.pagamento}>
        <h3>Forma de pagamento</h3>
        <div className={styles.botoesPagamento}>
          {['PIX', 'CARTÃO', 'DINHEIRO'].map((opcao) => (
            <button
              key={opcao}
              className={`${styles.btnPagamento} ${pagamento === opcao ? styles.selecionado : ''}`}
              onClick={() => setPagamento(opcao)}
            >
              {opcao}
            </button>
          ))}
        </div>
      </div>

      {/* Botão Finalizar */}
      <button className={styles.btnFinalizarCompra} onClick={handleFinalizar}>
        Finalizar Compra
      </button>
    </div>
  )
}

export default Finish
