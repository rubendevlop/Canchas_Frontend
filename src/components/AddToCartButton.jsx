import React, { useContext } from "react";
import { useCartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/addToCartButton.css";

function AddToCartButton({ product, compact = false, label }) {
  const { addToCart, loadingCart } = useCartContext();
  const { user, loadUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = async () => {
    if (!product || !product._id) return;

    const currentUser = user?._id ? user : await loadUserData();

    if (!currentUser?._id) {
      alert("Debes iniciar sesión para agregar productos al carrito");
      navigate("/login", { state: { from: location } });
      return;
    }

    await addToCart(product);
  };

  return (
    <button
      className={`btn btn-success custom-add-btn ${compact ? "custom-add-btn--compact" : "w-100"}`}
      onClick={handleAddToCart}
      disabled={!product || product.stock <= 0 || loadingCart}
    >
      {compact ? (
        product?.stock > 0 ? (label || "Agregar") : "Sin stock"
      ) : (
        <>
          <i className="bi bi-cart-plus me-2"></i>
          {product?.stock > 0 ? (label || "Agregar al carrito") : "Sin stock"}
        </>
      )}
    </button>
  );
}

export default AddToCartButton;
