
export const text = `Hi ${seller.name},

You've added ${product.name} to your wishlist!

To view your wishlist, click here: ${product.link}

Thanks,
Your Store Name`;

export const expiring_soon = ` 
Hi ${seller.name},,

Just a friendly reminder that your product "${product.name}" is expiring soon. Its expiration date is ${product.expiryDate}.

To view the product listing, click here: ${productLink}

Best regards,
Your Store Name
`;
export const expired = `
Hi ${seller.name},

We're sorry to inform you that your product "${product.name}" has expired. Its expiration date was ${product.expiryDate}.

To view the product listing, click here: ${productLink}

Best regards,
Your Store Name
`;

export const new_product = `
Hi ${users.name},

We're excited to inform you that a new product "${productName}" has been added to your store.

To view the product listing, click here: ${productLink}

Best regards,
Your Store Name
`;
export default {
    text,
    expiring_soon,
    expired,
    new_product
}