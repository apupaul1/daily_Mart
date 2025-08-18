import { Link } from "react-router";

export default function PopularSales() {
  const products = [
    { id: 1, name: "Fresh Red Tomatoes", oldPrice: "$12.99", newPrice: "$6.99", img: "https://img.icons8.com/color/96/000000/tomato.png" },
    { id: 2, name: "Fresh Cauliflower", oldPrice: "$12.99", newPrice: "$6.99", img: "https://img.icons8.com/color/96/000000/cauliflower.png" },
    { id: 3, name: "Fresh Grapes", oldPrice: "$12.99", newPrice: "$6.99", img: "https://img.icons8.com/color/96/000000/grapes.png" },
    { id: 4, name: "Fresh Bananas", oldPrice: "$12.99", newPrice: "$6.99", img: "https://img.icons8.com/color/96/000000/banana.png" },
    { id: 5, name: "Fresh Apples", oldPrice: "$12.99", newPrice: "$6.99", img: "https://img.icons8.com/color/96/000000/apple.png" },
    { id: 6, name: "Fresh Carrots", oldPrice: "$12.99", newPrice: "$6.99", img: "https://img.icons8.com/color/96/000000/carrot.png" },
    { id: 7, name: "Fresh Potatoes", oldPrice: "$12.99", newPrice: "$6.99", img: "https://img.icons8.com/color/96/000000/potato.png" },
    { id: 8, name: "Fresh Mangoes", oldPrice: "$12.99", newPrice: "$6.99", img: "https://img.icons8.com/color/96/000000/mango.png" },
    { id: 9, name: "Fresh Oranges", oldPrice: "$12.99", newPrice: "$6.99", img: "https://img.icons8.com/color/96/000000/orange.png" },
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">Popular Sales</h2>
          <Link to={'/discount-product'} className="text-green-600 font-semibold hover:underline">
            View All
          </Link>
        </div>

        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-16 h-16 object-contain mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 line-through">{item.oldPrice}</span>
                  <span className="text-red-600 font-bold">{item.newPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
