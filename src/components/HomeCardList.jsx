import { useEffect, useState } from 'react';
import HomeCard from './HomeCard';
import ProductCardShelf from './ProductCardShelf';
import { getProducts, isVisibleProduct } from '../helpers/product';

const HomeCardList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const items = await getProducts(5);
            const visibleProducts = Array.isArray(items)
                ? items.filter((item) => isVisibleProduct(item) && item?.category?.name)
                : [];
            setProducts(visibleProducts);
            setLoading(false);
        } catch (error) {
            console.error("Error cargando productos:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <p>Cargando productos...</p>;

    return (
        <ProductCardShelf mobileCarousel>
            {products.map(prod => (
                <HomeCard key={prod._id} product={prod} />
            ))}
        </ProductCardShelf>
    );
};

export default HomeCardList;
