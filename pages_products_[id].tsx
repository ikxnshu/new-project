import React from "react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { Typography, Paper, Grid, Button } from "@mui/material";
import Link from "next/link";
import { useStore } from "../../store/useStore";

/**
 * Product detail with images carousel (simple).
 */
export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = React.useState<any | null>(null);
  const fetchProductById = useStore((s) => s.fetchProductById);

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      const p = await fetchProductById(id as string);
      setProduct(p);
    })();
  }, [id, fetchProductById]);

  if (!product) {
    return (
      <Layout>
        <Typography>Loading...</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link href="/products" passHref legacyBehavior><Button variant="outlined" sx={{ mb: 2 }}>Back to Products</Button></Link>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {/* Simple inline image gallery */}
            {product.images?.map((img: string, idx: number) => (
              <img key={idx} src={img} alt={`${product.title} ${idx}`} style={{ width: "100%", marginBottom: 8, borderRadius: 6 }} />
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4">{product.title}</Typography>
            <Typography variant="h6">${product.price}</Typography>
            <Typography>Rating: {product.rating}</Typography>
            <Typography sx={{ mt: 2 }}>{product.description}</Typography>
            <Typography sx={{ mt: 2 }}>Category: {product.category}</Typography>
            <Typography>Stock: {product.stock}</Typography>
            <Typography>Brand: {product.brand}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
}