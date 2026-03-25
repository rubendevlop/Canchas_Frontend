import "../css/productCardShelf.css";

export default function ProductCardShelf({
  children,
  className = "",
  mobileCarousel = false,
}) {
  const classes = [
    "product-card-shelf",
    mobileCarousel ? "product-card-shelf--carousel" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
