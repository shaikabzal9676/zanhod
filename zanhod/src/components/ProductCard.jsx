import React from 'react'
import { Link } from "react-router-dom";
import { ArrowUpRight } from 'lucide-react'
const ProductCard = ({product}) => {
  return (
    <article className="product-card">
              <Link
        to={`/product/${product.id}`}
        className="product-image-wrapper"
      >

            <img src={product.image} alt={`${product.name} ZANHOD hoodie`} className='product-image' />

            <div className="product-number">
                {product.id}
            </div>

            <button className="product-arrow">
                <ArrowUpRight size={18}/>
            </button>
        </Link>

       <Link
        to={`/product/${product.id}`}
        className="product-info"
      >
            <div>
                <p className="product-id">
                    ZANHOD/{product.id}
                </p>
                <h3>
                    {product.name}
                </h3>

                <p className="product-desription">
                    {product.description}
                </p>
            </div>

            <p className="product-price">
                ₹{product.price.toLocaleString("en-IN")}
            </p>

        </Link>
    </article>
  )
}

export default ProductCard