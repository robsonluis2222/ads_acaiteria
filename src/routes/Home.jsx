import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.scss'
import "bootstrap-icons/font/bootstrap-icons.css"

const Home = () => {
  const navigate = useNavigate()

  const [reciveMode, setReciveMode] = useState('ENTREGA')
  const [produtos, setProdutos] = useState([])
  const [popupMessage, setPopupMessage] = useState('')
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false)
  const [itensCarrinho, setItensCarrinho] = useState([])

  useEffect(() => {
    fetch('/produtos.json')
      .then(response => response.json())
      .then(data => setProdutos(data))
      .catch(error => console.error('Erro ao carregar produtos:', error))

    const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho')) || []
    setItensCarrinho(carrinhoLocal)
  }, [])

  const formatarPreco = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const adicionarAoCarrinho = (produto, tamanho) => {
    const carrinhoAtual = JSON.parse(localStorage.getItem('carrinho')) || []

    const item = {
      nome: produto.nome,
      tamanho,
      preco: produto.precos[tamanho],
      quantidade: 1
    }

    carrinhoAtual.push(item)
    localStorage.setItem('carrinho', JSON.stringify(carrinhoAtual))
    setItensCarrinho(carrinhoAtual)
    setMostrarCarrinho(true) // Abre o carrinho automaticamente

    const mensagem = `Você adicionou ${produto.nome} (${tamanho}) ao carrinho!`
    setPopupMessage(mensagem)

    setTimeout(() => {
      setPopupMessage('')
    }, 3000)
  }

  const removerDoCarrinho = (indexParaRemover) => {
    const novoCarrinho = itensCarrinho.filter((_, index) => index !== indexParaRemover)
    setItensCarrinho(novoCarrinho)
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho))
  }

  const totalCarrinho = itensCarrinho.reduce((acc, item) => acc + item.preco, 0)

  const finalizarPedido = () => {
    navigate('/finish')
  }

  return (
    <div className={styles.home}>
      {/* Popup */}
      {popupMessage && (
        <div className={styles.popup}>
          {popupMessage}
        </div>
      )}

      {/* Botão "Meu Carrinho" */}
      <span
        className={styles.meuCarrinho}
        onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
      >
        🛒 <span className={styles.textoCarrinho}>Meu carrinho</span>
      </span>

      {/* Carrinho Lateral */}
      {mostrarCarrinho && (
        <div className={styles.carrinhoLateral}>
          <i
            style={{ color: 'red', cursor: 'pointer', float: 'right' }}
            className="bi bi-x-lg"
            onClick={() => setMostrarCarrinho(false)}
          ></i>

          <h2>Seu Carrinho</h2>

          {itensCarrinho.length === 0 ? (
            <p>O carrinho está vazio.</p>
          ) : (
            <>
              <ul>
                {itensCarrinho.map((item, index) => (
                  <li key={index} className={styles.itemCarrinho}>
                    <div>
                      <strong>{item.nome}</strong> ({item.tamanho}) - {formatarPreco(item.preco)}
                    </div>
                    <i
                      className="bi bi-trash3-fill"
                      onClick={() => removerDoCarrinho(index)}
                      style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }}
                    ></i>
                  </li>
                ))}
              </ul>

              <div className={styles.totalCarrinho}>
                <p>Total: <strong>{formatarPreco(totalCarrinho)}</strong></p>
                <button className={styles.btnFinalizar} onClick={finalizarPedido}>
                  Finalizar Pedido
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Seleção de modo de recebimento */}
      <div className={styles.reciveMode}>
        <select
          value={reciveMode}
          onChange={(e) => setReciveMode(e.target.value)}
        >
          <option value="ENTREGA">ENTREGA</option>
          <option value="RETIRADA">RETIRADA</option>
        </select>
      </div>

      {/* Lista de Produtos */}
      <div className={styles.products}>
        {produtos.map((produto, index) => (
          <div key={index} className={styles.produtoCard}>
            <div className={styles.info}>
              <h3>{produto.nome}</h3>
              <p>{produto.ingredientes}</p>
            </div>

            <div className={styles.copos}>
              {["300ml", "500ml", "700ml"].map((tamanho, idx) => (
                <div
                  key={tamanho}
                  className={styles.copo}
                  onClick={() => adicionarAoCarrinho(produto, tamanho)}
                >
                  <i className="bi bi-cup-straw" style={{ fontSize: `${25 + idx * 5}px` }}></i>
                  <span>{tamanho.toUpperCase()}</span>
                  <span>{formatarPreco(produto.precos[tamanho])}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
