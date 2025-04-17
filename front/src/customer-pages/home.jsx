import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Navbar from "./navbar";

function Home() {
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/product/allproducts`, {
          params: {
            page,
            search,
          },
        });

        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getAllProducts();
  }, [page, search]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (e) => {
    e.preventDefault(); 
    const searchValue = e.target.elements.search.value.trim();
    setSearch(searchValue);
    setPage(1);
  };

  return (
    <>
        <Navbar />
        <form className="text-center mb-5" onSubmit={handleSearch}>
            <input type="search" placeholder="Search" name="search" className="w-25" />
            <button type="submit" className="btn btn-primary ms-2">Search</button>
        </form>

      <div className="d-flex justify-content-center flex-wrap">
        {products.map((product, index) => (
          <div className="card m-2" style={{ width: "18rem" }} key={index}>
            <img src={product.photo} className="card-img-top" alt={product.Name} />
            <div className="card-body">
              <h5 className="card-title text-center">{product.Name}</h5>
              <p className="card-text text-center">{product.Description}</p>
              <p className="card-text text-center">{product.Amount} {product.Currency}</p>
              <div className="text-center">
                <button className="btn btn-primary">Make Order</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center products-pagination mt-4">
        <Stack spacing={2}>
          <Pagination
            count={10}
            page={page}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
        </Stack>
      </div>
    </>
  );
}

export default Home;
