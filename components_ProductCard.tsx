import React from "react";
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import Link from "next/link";

export const ProductCard: React.FC<{ product: any }> = React.memo(({ product }) => {
  return (
    <Card>
      <CardMedia component="img" height="140" image={product.thumbnail || product.images?.[0]} alt={product.title} />
      <CardContent>
        <Typography variant="subtitle1">{product.title}</Typography>
        <Typography color="text.secondary">${product.price}</Typography>
        <Typography variant="caption">{product.category}</Typography>
      </CardContent>
      <CardActions>
        <Link href={`/products/${product.id}`} passHref legacyBehavior>
          <Button size="small">View</Button>
        </Link>
      </CardActions>
    </Card>
  );
});