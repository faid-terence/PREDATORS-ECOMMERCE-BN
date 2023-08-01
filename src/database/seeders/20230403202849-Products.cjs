/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        "id": 2,
        "name": "iPhone 13",
        "description": "The iPhone 13 is the latest model of the Apple smartphone. It features a 6.1-inch Super Retina XDR display, A15 Bionic chip, 5G connectivity, and a dual-camera system. It comes with iOS 15 operating system and up to 1TB of storage.",
        "category_id": 1,
        "price": "1200",
        "picture_urls": [
            "https://res.cloudinary.com/dck6gpxb9/image/upload/v1690293380/testing/images/hdkqgouicyglrjkypvdg.jpg"
        ],
        "instock": 5,
        "expiryDate": "2024-12-31T00:00:00.000Z",
        "available": false,
        "vendor_id": 2,
        "createdAt": "2023-05-17T22:35:33.726Z",
        "updatedAt": "2023-07-25T13:56:26.222Z"
    },
    {
        "id": 5,
        "name": "Iphone 14",
        "description": "Introducing the iPhone 14, where innovation meets elegance. With a stunning 6.5-inch Super Retina XDR display, A16 Bionic chip, and advanced triple-camera system, it delivers an immersive experience. Stay connected with 5G capabilities, while enhanced pri",
        "category_id": 2,
        "price": "2000",
        "picture_urls": [
            "https://res.cloudinary.com/dck6gpxb9/image/upload/v1690293564/testing/images/sre3mhvmmtcfp0xirv4q.jpg"
        ],
        "instock": 17,
        "expiryDate": "2032-11-30T00:00:00.000Z",
        "available": true,
        "vendor_id": 2,
        "createdAt": "2023-05-08T14:15:42.837Z",
        "updatedAt": "2023-07-25T13:59:30.281Z"
    },
    {
        "id": 8,
        "name": "Google Pixel 5a",
        "description": "Meet the Pixel 5a: Empowering your everyday with exceptional features. Capture life's moments in brilliant detail with its advanced camera system. Enjoy smooth performance, all-day battery life, and the pure Android experience. Elevate your smartphone jou",
        "category_id": 3,
        "price": "800",
        "picture_urls": [
            "https://res.cloudinary.com/dck6gpxb9/image/upload/v1690293497/testing/images/xm2xkstwo6xnrwaapcck.jpg"
        ],
        "instock": 35,
        "expiryDate": "2023-12-31T00:00:00.000Z",
        "available": true,
        "vendor_id": 2,
        "createdAt": "2023-05-17T22:35:33.726Z",
        "updatedAt": "2023-07-25T14:00:00.994Z"
    },
    {
        "id": 6,
        "name": "iPhone 12",
        "description": "Introducing the iPhone 12, a perfect blend of power and sophistication. Featuring a brilliant 6.1-inch Super Retina XDR display, A14 Bionic chip, and a dual-camera system for stunning photos and videos. With 5G support, enjoy faster speeds and enhanced co",
        "category_id": 4,
        "price": "1200",
        "picture_urls": [
            "https://res.cloudinary.com/dck6gpxb9/image/upload/v1690293678/testing/images/nirhbol4bu2bzf4gfwmd.jpg"
        ],
        "instock": 13,
        "expiryDate": "2033-11-30T00:00:00.000Z",
        "available": true,
        "vendor_id": 2,
        "createdAt": "2023-05-08T17:00:37.911Z",
        "updatedAt": "2023-07-25T14:01:24.066Z"
    },
    {
        "id": 4,
        "name": "Logitech  Mouse",
        "description": "Logitech Mouse: Precision, comfort, and ease. Ergonomic design, smooth tracking, and plug-and-play setup. Elevate your computing now.",
        "category_id": 5,
        "price": "800",
        "picture_urls": [
            "https://res.cloudinary.com/dck6gpxb9/image/upload/v1690292845/testing/images/lawnkgjylsaiqe2zv5n7.jpg"
        ],
        "instock": 19,
        "expiryDate": "2000-11-30T00:00:00.000Z",
        "available": true,
        "vendor_id": 2,
        "createdAt": "2023-05-08T13:48:23.916Z",
        "updatedAt": "2023-07-25T13:47:27.674Z"
    },
    {
        "id": 3,
        "name": "Samsung S21",
        "description": "Introducing the Samsung S21: Unleash boundless possibilities with this cutting-edge smartphone. With a stunning display, powerful performance, and advanced camera technology, the S21 elevates your mobile experience to new heights. Experience innovation in",
        "category_id": 6,
        "price": "1000",
        "picture_urls": [
            "https://res.cloudinary.com/dck6gpxb9/image/upload/v1690293283/testing/images/lpecarv20zphgszti6xs.jpg"
        ],
        "instock": 12,
        "expiryDate": "2023-11-30T00:00:00.000Z",
        "available": true,
        "vendor_id": 2,
        "createdAt": "2023-05-08T11:26:25.927Z",
        "updatedAt": "2023-07-25T13:54:51.319Z"
    }
      // Add more product data here...
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
