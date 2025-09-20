"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
interface Category {
  id: number;
  name: string;
  image: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  category: Category;
  images: string[];
}

const ProductPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  //pagination

  const [page, setPage] = useState(1);
  const pageSize = 10;

  //search

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  type ProductForm = {
    title: string;
    price: number;
  };

  useEffect(() => {
    // Redirect if not logged in
    if (typeof window !== "undefined" && !localStorage.getItem("isLoggedIn")) {
      router.push("/login");
    }

    // Fetch live products
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://api.escuelajs.co/api/v1/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  const { register, handleSubmit, reset } = useForm<ProductForm>({
    defaultValues: {
      title: "",
      price: 0,
    },
  });

  //form submission

  const OnSubmit = (data: Record<string, unknown>) => {
    // Manual validation
    const title = String(data.title || "").trim();
    const priceStr = String(data.price || "0");
    const price = parseFloat(priceStr);

    if (!title || title.length < 3) {
      alert("Title must be at least 3 characters");
      return;
    }

    if (isNaN(price) || price < 0) {
      alert("Price must be a positive number");
      return;
    }

    const newProduct: Product = {
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      title,
      price,
      category: { id: 0, name: "uncategorized", image: "" },
      images: [],
    };
    setProducts([newProduct, ...products]);
    reset();
    setModalOpen(false);
  };

  return (
    <>
      <div className="p-6 space-y-6 ">
        <div className="flex item-center gap-2">
          <label>Search</label>
          <Input
            placeholder="Search by Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=""></Input>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Products</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Products</DialogTitle>
              <DialogDescription>
                Add a new product to your inventory.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(OnSubmit)} className="grid gap-4">
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Product title"
                    {...register("title")}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("price")}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Add Product</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableCaption>A list of your products</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Image</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedProducts?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.category?.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        width={48}
                        height={48}
                        className="object-cover rounded"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* pagination */}
        <div className="flex justify-end gap-2 mt-4">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="flex items-center">{page}</span>
          <Button
            disabled={page * pageSize >= filteredProducts.length}
            onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
