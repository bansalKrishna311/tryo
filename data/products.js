const products =[
    {
      "id": "1",
      "name": "Denim Jacket",
      "category": "Men",
      "price": "₹1,899",
      "image": "https://tse3.mm.bing.net/th/id/OIP.amW7fIDHnpjxxIkoxQNqJAHaJ4?pid=Api",
      "description": "A classic stonewashed denim jacket featuring a button closure, flap pockets, and full sleeves."
    },
    {
      "id": "2",
      "name": "Leather Jacket",
      "category": "Men",
      "price": "₹2,999",
      "image": "https://tse2.mm.bing.net/th?id=OIP.JlheGL2g3DSTU50QfZMHgwHaLW&pid=Api",
      "description": "Stylish black leather jacket with a slim fit design, perfect for a rugged look."
    },
    {
      "id": "3",
      "name": "Floral Maxi Dress",
      "category": "Women",
      "price": "₹1,499",
      "image": "https://tse1.mm.bing.net/th?id=OIP.yjqaUbf3WZOLCuXjwZY56QHaLH&pid=Api",
      "description": "Elegant V-neck floral maxi dress with pockets, suitable for casual outings."
    },
    {
      "id": "4",
      "name": "Faux Leather Handbag",
      "category": "Women",
      "price": "₹1,200",
      "image": "https://tse1.mm.bing.net/th?id=OIP.qLQo_DIMqXI9-yNI7_q2pgHaHa&pid=Api",
      "description": "Chic faux leather handbag with tassel details, offering ample space for essentials."
    },
    {
      "id": "5",
      "name": "Running Shoes",
      "category": "Men",
      "price": "₹3,500",
      "image": "https://tse3.mm.bing.net/th?id=OIP.p71Ly38Uy3eG0n9uL05q4AHaHa&pid=Api",
      "description": "Comfortable and durable running shoes designed for optimal performance."
    },
    {
      "id": "6",
      "name": "Aviator Sunglasses",
      "category": "Unisex",
      "price": "₹5,000",
      "image": "https://tse4.mm.bing.net/th?id=OIP.q5fFlRsTXWib5DLXoQTzHAHaLW&pid=Api",
      "description": "Classic aviator sunglasses with polarized lenses for enhanced clarity."
    },
    {
      "id": "7",
      "name": "Bohemian Maxi Skirt",
      "category": "Women",
      "price": "₹1,800",
      "image": "https://tse1.mm.bing.net/th?id=OIP.8a9e1b7f5b2e3e8f8b9a1c5e1d6e7f8b-1234567890&pid=Api",
      "description": "Flowy bohemian maxi skirt with vibrant patterns, perfect for summer festivals."
    },
    {
      "id": "8",
      "name": "Classic White Sneakers",
      "category": "Unisex",
      "price": "₹2,200",
      "image": "https://tse1.mm.bing.net/th?id=OIP.7b8e1c6f4a2e3d9f8b9a1c5e1d6e7f8b-1234567890&pid=Api",
      "description": "Timeless white sneakers that pair well with any casual outfit."
    },
    {
      "id": "9",
      "name": "Striped Polo Shirt",
      "category": "Men",
      "price": "₹1,000",
      "image": "https://tse1.mm.bing.net/th?id=OIP.6c7e1d5f3a2e3d9f8b9a1c5e1d6e7f8b-1234567890&pid=Api",
      "description": "Comfortable cotton polo shirt with classic striped design."
    },
    {
      "id": "10",
      "name": "Ankle Strap Heels",
      "category": "Women",
      "price": "₹2,500",
      "image": "https://tse1.mm.bing.net/th?id=OIP.5d6e1c4f2a2e3d9f8b9a1c5e1d6e7f8b-1234567890&pid=Api",
      "description": "Elegant ankle strap heels suitable for formal occasions."
    },
    {
      "id": "11",
      "name": "Canvas Backpack",
      "category": "Unisex",
      "price": "₹1,700",
      "image": "https://tse1.mm.bing.net/th?id=OIP.4e5e1c3f1a2e3d9f8b9a1c5e1d6e7f8b-1234567890&pid=Api",
      "description": "Durable canvas backpack with multiple compartments for organization."
    },
    {
      "id": "12",
      "name": "Slim Fit Chinos",
      "category": "Men",
      "price": "₹1,600",
      "image": "https://tse1.mm.bing.net/th?id=OIP.3f4e1c2f0a2e3d9f8b9a1c5e1d6e7f8b-1234567890&pid=Api",
      "description": "Versatile slim fit chinos suitable for both casual and semi-formal wear."
    },
    {
      "id": "13",
      "name": "Off-Shoulder Blouse",
      "category": "Women",
      "price": "₹1,200",
      "image": "https://tse1.mm.bing.net/th?id=OIP.2g3e1c1f9a2e3d9f8b9a1c5e1d6e7f8b-1234567890&pid=Api",
      "description": "Chic off-shoulder blouse with ruffle details, perfect for summer outings."
    },
    {
      "id": "14",
      "name": "Sports Watch",
      "category": "Unisex",
      "price": "₹3,000",
      "image": "https://tse1.mm.bing.net/th?id=OIP.1h2e1c0f8a2e3d9f8b9a1c5e1d6e7f8b-1234567890&pid=Api",
      "description": "Stylish sports watch with multiple features including a heart rate monitor."
    }, {
        "id": "15",
        "name": "Cable Knit Sweater",
        "category": "Women",
        "price": "₹1,800",
        "image": "https://example.com/images/cable-knit-sweater.jpg",
        "description": "Cozy cable knit sweater perfect for chilly days, offering both warmth and style."
      },
      {
        "id": "16",
        "name": "Crossbody Bag",
        "category": "Women",
        "price": "₹2,000",
        "image": "https://example.com/images/crossbody-bag.jpg",
        "description": "Compact and stylish crossbody bag with adjustable strap, ideal for daily essentials."
      },
      {
        "id": "17",
        "name": "Athleisure Tracksuit",
        "category": "Unisex",
        "price": "₹3,200",
        "image": "https://example.com/images/athleisure-tracksuit.jpg",
        "description": "Comfortable and trendy athleisure tracksuit suitable for workouts and casual wear."
      },
      {
        "id": "18",
        "name": "Lightweight Jacket",
        "category": "Women",
        "price": "₹2,500",
        "image": "https://example.com/images/lightweight-jacket.jpg",
        "description": "Versatile lightweight jacket perfect for layering during transitional weather."
      },
      {
        "id": "19",
        "name": "Wide-Leg Jeans",
        "category": "Women",
        "price": "₹1,700",
        "image": "https://example.com/images/wide-leg-jeans.jpg",
        "description": "High-waisted wide-leg jeans offering a flattering fit and retro style."
      },
      {
        "id": "20",
        "name": "Rectangular Sunglasses",
        "category": "Unisex",
        "price": "₹1,200",
        "image": "https://example.com/images/rectangular-sunglasses.jpg",
        "description": "Modern rectangular sunglasses with UV protection, adding a chic touch to any outfit."
      }
    ]

   
    export default products;    