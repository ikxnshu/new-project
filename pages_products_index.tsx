import React from "react";
import { Layout } from "../../components/Layout";
import { Grid, TextField, MenuItem, Pagination, CircularProgress } from "@mui/material";
import { useStore } from "../../store/useStore";
import { ProductCard } from "../../components/ProductCard";

/**
 * Products page:
 * - pagination, search, category filter
 * - uses Zustand fetchProducts and fetchCategories
 */
export default function ProductsPage() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const fetchProducts = useStore((s) => s.fetchProducts);
  const fetchCategories = useStore((s) => s.fetchCategories);
  const products = useStore((s) => s.products);
  const total = useStore((s) => s.productsTotal);
  const loading = useStore((s) => s.productsLoading);
  const categories = useStore((s) => s.categories);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  React.useEffect(() => {
    fetchProducts({ q: query || undefined, category: category || undefined, limit, skip });
  }, [query, category, page, fetchProducts]);

  const pageCount = Math.ceil((total || 0) / limit) || 1;

  return (
    <Layout>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth placeholder="Search products..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField select fullWidth value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((c: string) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>

      {loading ? <CircularProgress /> : (
        <Grid container spacing={2}>
          {products.map((p: any) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
      )}

      <Grid container justifyContent="center" sx={{ mt: 2 }}>
        <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} />
      </Grid>
    </Layout>
  );
}