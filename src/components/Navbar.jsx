import React from 'react'
import styles from './Navbar.module.scss'
import AcaiLogo from '../../public/acai.png'

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.top}>
        <span>LT AÇAITERIA</span>
      </div>
      <div className={styles.end}>
        <img className={styles.logoSome} src={AcaiLogo} alt="" />
        <span>O MELHOR AÇAI DE ITAJAÍ E REGIÃO !</span>
        <i class="bi bi-heart-fill"></i>
      </div>
    </div>
  )
}

export default Navbar