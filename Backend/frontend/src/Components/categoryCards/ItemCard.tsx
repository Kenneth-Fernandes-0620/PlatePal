import React from 'react';

interface ItemCardProps {
    name: string;
    quantity: number;
    image: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ name, quantity, image }) => {
    return (
        <div className="item-card">
            <img src={image} alt={name} />
            <h3>{name}</h3>
            <p>{quantity} items</p>
        </div>
    );
};

export default ItemCard;
