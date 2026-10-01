import { Link } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

import { useCart } from "../context/CartContext";
import logo from "../images/logo.png"

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const { totalItems } = useCart();


  return (

    <header className="navbar">

      <div className="navbar-inner">


        {/* MOBILE MENU */}

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >

          {menuOpen
            ? <X size={22} />
            : <Menu size={22} />
          }

        </button>


        {/* LOGO */}

        <Link
          to="/"
          className="brand-logo"
        >
      <img src={logo} alt="zanhod logo" />
        </Link>


        {/* DESKTOP NAV */}

        <nav className="desktop-nav">
  <Link to="/shop">SHOP</Link>
  <Link to="/drop-01">DROP 01</Link>
  <Link to="/about">ABOUT</Link>
  <Link to="/journal">JOURNAL</Link>
  <Link to="/track-order">TRACK ORDER</Link>
</nav>


        {/* ACTIONS */}

        <div className="navbar-actions">


          <button
            type="button"
            aria-label="Search"
          >
            <Search size={20} />
          </button>


          <Link
            to="/cart"
            className="cart-button"
            aria-label="Shopping bag"
          >

            <ShoppingBag size={20} />


            {totalItems > 0 && (

              <span className="cart-count">

                {totalItems}

              </span>

            )}

          </Link>

        </div>

      </div>


      {/* MOBILE NAV */}

      <div
  className={`mobile-nav ${
    menuOpen ? "open" : ""
  }`}
>
  <Link
    to="/shop"
    onClick={() => setMenuOpen(false)}
  >
    SHOP
  </Link>

  <Link
    to="/drop-01"
    onClick={() => setMenuOpen(false)}
  >
    DROP 01
  </Link>

  <Link
    to="/about"
    onClick={() => setMenuOpen(false)}
  >
    ABOUT
  </Link>

  <Link
    to="/journal"
    onClick={() => setMenuOpen(false)}
  >
    JOURNAL
  </Link>

  <Link
    to="/track-order"
    onClick={() => setMenuOpen(false)}
  >
    TRACK ORDER
  </Link>
</div>

    </header>

  );

}


export default Navbar;