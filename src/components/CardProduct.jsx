import React from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import "../css/cardProduct.css";

const imageDefault =
  "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=800";

const buildProductImage = (image) => {
  if (!image) return imageDefault;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${import.meta.env.VITE_API_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

export default function CardProduct({
  product,
  linkTo,
  topBadges = [],
  footerAside,
  bottomActions,
  showDescription = false,
  footerNote = "oferta",
}) {
  if (!product) return null;

  const productImage = buildProductImage(product.image || product.images?.[0]);
  const productName = product.name || "Producto sin nombre";
  const productDescription = product.description || "Sin descripcion";
  const productPrice = Number(product.price) || 0;
  const productStock = Number(product.stock) || 0;
  const productCategory = product.category?.name || "Sin categoria";
  const productLink = linkTo === undefined ? `/producto/${product._id}` : linkTo;

  const resolvedTopBadges = [
    {
      key: "stock",
      text: productStock > 0 ? "Stock disponible" : "Sin stock",
      position: "start",
      className: productStock > 0 ? "product-card-badge--success" : "product-card-badge--muted",
    },
    ...topBadges,
  ];

  const Wrapper = productLink ? Link : "div";
  const wrapperProps = productLink
    ? {
        to: productLink,
        className: "product-card-link",
      }
    : {
        className: "product-card-link",
      };

  const resolvedFooterAside =
    footerAside === undefined ? <AddToCartButton product={product} compact /> : footerAside;

  return (
    <div className="product-card-slide">
      <article className="product-card">
        <Wrapper {...wrapperProps}>
          <div className="product-card-media">
            {resolvedTopBadges.map((badge, index) => (
              <span
                key={badge.key || `${badge.text}-${index}`}
                className={`product-card-badge ${
                  badge.position === "end" ? "product-card-badge--end" : "product-card-badge--start"
                } ${badge.className || ""}`}
              >
                {badge.text}
              </span>
            ))}

            <img src={productImage} className="product-card-image" alt={productName} />
          </div>

          <div className="product-card-content">
            <h2 className="product-card-title">{productName}</h2>

            <div className="product-card-tags">
              <span className="product-card-tag">{productCategory}</span>
            </div>

            {showDescription ? (
              <p className="product-card-description">{productDescription}</p>
            ) : null}
          </div>
        </Wrapper>

        <hr className="product-card-divider" />

        <div className="product-card-footer">
          <div className="product-card-price-block">
            <p className="product-card-price">${productPrice.toLocaleString("es-AR")}</p>
            <p className="product-card-note">{footerNote}</p>
          </div>

          {resolvedFooterAside}
        </div>

        {bottomActions ? <div className="product-card-bottom-actions">{bottomActions}</div> : null}
      </article>
    </div>
  );
}
