import CardProduct from "./CardProduct";

const HomeCard = ({ product }) => {
  if (!product || product.active === false || !product.category?.name) return null;

  return <CardProduct product={product} />;
};

export default HomeCard;
