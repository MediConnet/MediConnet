import {
  Add,
  Edit,
  Delete,
  Inventory,
  PhotoCamera,
} from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Avatar,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { getProductsMock, saveProductsMock } from "../../infrastructure/products.mock";
import type { Product } from "../../domain/Product.entity";

const categories = [
  "Movilidad",
  "Ortopedia",
  "Rehabilitación",
  "Ayudas Técnicas",
  "Otros",
];

export const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    category: "Movilidad",
    price: 0,
    stock: 0,
    isActive: true,
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProductsMock();
    setProducts(data);
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        category: product.category,
        price: product.price,
        stock: product.stock,
        isActive: product.isActive,
        image: product.image || "",
      });
      setImagePreview(product.image || "");
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        category: "Movilidad",
        price: 0,
        stock: 0,
        isActive: true,
        image: "",
      });
      setImagePreview("");
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      category: "Movilidad",
      price: 0,
      stock: 0,
      isActive: true,
      image: "",
    });
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona una imagen válida");
        return;
      }
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no debe superar los 5MB");
        return;
      }
      // Leer imagen como base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || formData.price === undefined || formData.stock === undefined) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    const now = new Date().toISOString();
    let updatedProducts: Product[];

    if (editingProduct) {
      // Editar producto existente
      updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              ...formData,
              image: formData.image || p.image,
              updatedAt: now,
            } as Product
          : p
      );
    } else {
      // Crear nuevo producto
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        name: formData.name!,
        description: formData.description,
        category: formData.category!,
        price: formData.price!,
        stock: formData.stock!,
        image: formData.image,
        isActive: formData.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };
      updatedProducts = [...products, newProduct];
    }

    await saveProductsMock(updatedProducts);
    setProducts(updatedProducts);
    handleCloseModal();
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      const updatedProducts = products.filter((p) => p.id !== productId);
      await saveProductsMock(updatedProducts);
      setProducts(updatedProducts);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Cargando productos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Productos</h3>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona tu catálogo de productos de insumos médicos
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
          className="bg-teal-600 hover:bg-teal-700"
        >
          Nuevo Producto
        </Button>
      </div>

      {products.length > 0 ? (
        <TableContainer component={Paper} elevation={0} className="border border-gray-200">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="font-semibold">Imagen</TableCell>
                <TableCell className="font-semibold">Nombre</TableCell>
                <TableCell className="font-semibold">Categoría</TableCell>
                <TableCell className="font-semibold">Precio</TableCell>
                <TableCell className="font-semibold">Stock</TableCell>
                <TableCell className="font-semibold">Estado</TableCell>
                <TableCell className="font-semibold">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover className="border-b border-gray-200">
                  <TableCell>
                    <Avatar
                      src={product.image}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                      className="bg-gray-200"
                    >
                      <Inventory />
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Typography variant="body2" className="font-medium">
                        {product.name}
                      </Typography>
                      {product.description && (
                        <Typography variant="caption" className="text-gray-500">
                          {product.description.length > 50
                            ? `${product.description.substring(0, 50)}...`
                            : product.description}
                        </Typography>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" className="text-gray-600">
                      {product.category}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" className="font-bold text-gray-800">
                      {formatCurrency(product.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      className={product.stock > 10 ? "text-gray-600" : "text-red-600 font-semibold"}
                    >
                      {product.stock} unidades
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      className={product.isActive ? "text-green-600 font-semibold" : "text-gray-400"}
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenModal(product)}
                        className="text-teal-600 hover:bg-teal-50"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Inventory className="text-gray-400 text-3xl" />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-4">
            No hay productos registrados
          </p>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Agregar Primer Producto
          </Button>
        </div>
      )}

      {/* Modal para crear/editar producto */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: "#f5f5f5",
          },
        }}
      >
        <DialogContent sx={{ p: 4, bgcolor: "white", borderRadius: 2, m: 2 }}>
          <Box>
            <Typography variant="h5" className="font-bold text-gray-800 mb-6">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </Typography>

            <Box>
              {/* Campo de imagen */}
              <Box className="mb-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                />
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-500 transition-colors"
                >
                  {imagePreview ? (
                    <Box className="flex flex-col items-center">
                      <Avatar
                        src={imagePreview}
                        variant="rounded"
                        sx={{ width: 120, height: 120, mb: 2 }}
                        className="bg-gray-200"
                      />
                      <Typography variant="body2" className="text-teal-600">
                        Click para cambiar imagen
                      </Typography>
                    </Box>
                  ) : (
                    <Box className="flex flex-col items-center">
                      <PhotoCamera className="text-gray-400 mb-2" sx={{ fontSize: 48 }} />
                      <Typography variant="body2" className="text-gray-500">
                        Click para subir imagen del producto
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box className="mb-6">
                <TextField
                  fullWidth
                  label="Nombre del Producto *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              <Box className="mb-6">
                <TextField
                  fullWidth
                  label="Descripción"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              <Box className="mb-6">
                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="Categoría"
                    required
                    sx={{
                      borderRadius: 1,
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box className="mb-6 grid grid-cols-2 gap-4">
                <Box>
                  <Typography variant="caption" className="text-gray-500 mb-1 block">
                    Precio (USD) *
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" className="text-gray-500 mb-1 block">
                    Stock *
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    required
                    inputProps={{ min: 0 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box className="mt-4">
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive ?? true}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Producto activo"
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: "white", borderRadius: 2, mx: 2, mb: 2 }}>
          <Button
            onClick={handleCloseModal}
            sx={{ color: "#14b8a6", textTransform: "none", fontWeight: 500 }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              bgcolor: "#14b8a6",
              "&:hover": { bgcolor: "#0d9488" },
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1,
              px: 3,
            }}
          >
            {editingProduct ? "GUARDAR CAMBIOS" : "CREAR PRODUCTO"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

