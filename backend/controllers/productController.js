import { sql } from "../config/db.js";
export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products 
      ORDER BY created_at DEsC          
    `;
    console.log("Fetched Products", products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error Getting product", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};
export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`
    SELECT * FROM products WHERE id=${id}     
  `;
    console.log("Fetched Products", product);
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error Getting product", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};
export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, message: "All fieds are required" });
  }

  try {
    const newProduct = await sql`
      INSERT INTO products (name, price, image)
      VALUES(${name}, ${price}, ${image})
      RETURNING * 
    `;
    console.log("New Product Added:", newProduct);
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.log("Errors in CreateProduct function", error);
    res.status(500).json({ success: false, message: "Intental Server Error" });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;
  try {
    const updateProduct = await sql`
    UPDATE products
    SET name=${name}, price=${price}, image=${image}
    WHERE id=${id}
    RETURNING *
  `;
    if (updateProduct.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updateProduct[0] });
  } catch (error) {
    console.log("Error updating the product", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const delteProduct = await sql`
        DELETE FROM products WHERE id=${id} RETURNING *
    `;
    if (deleteProduct.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product Deleted Successfully" });
  } catch (error) {
    console.log("Error Deleting product", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};
